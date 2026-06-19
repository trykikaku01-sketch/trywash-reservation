const securityHeaders = {
  "X-Content-Type-Options": "nosniff",
  "Referrer-Policy": "strict-origin-when-cross-origin",
};

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".csv": "text/csv; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

let dbReady = false;

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders(request) });
    }

    if (url.pathname.startsWith("/api/")) {
      return handleApi(request, env);
    }

    return serveAsset(request, env);
  },
};

async function handleApi(request, env) {
  if (!env.DB) {
    return json({ message: "D1 binding DB is not configured" }, 503);
  }

  await ensureSchema(env.DB);

  const url = new URL(request.url);
  const path = url.pathname.replace(/^\/api/, "");

  try {
    if (request.method === "GET" && path === "/reservations") {
      const storeId = url.searchParams.get("storeId") || "yokosuka";
      const rows = await env.DB.prepare(
        "SELECT booking_json FROM reservations WHERE store_id = ? AND COALESCE(json_extract(booking_json, '$.admin.status'), '') != 'deleted' ORDER BY start_at ASC",
      )
        .bind(storeId)
        .all();
      return json({ reservations: rows.results.map((row) => JSON.parse(row.booking_json)) });
    }

    if (request.method === "POST" && path === "/reservations") {
      const payload = await readJson(request);
      const storeId = payload.storeId || "yokosuka";
      const booking = normalizeReservationPayload(payload);
      const existingBooking = await readReservation(env.DB, storeId, booking.id);
      const syncedBooking = await syncAppsScriptCalendarEvent(env, mergeCalendarFields(booking, existingBooking));
      const calendarErrorResponse = getCalendarErrorResponse(syncedBooking);
      if (calendarErrorResponse) return calendarErrorResponse;
      await upsertReservation(env.DB, storeId, syncedBooking);
      return json({ ok: true, reservation: syncedBooking }, 201);
    }

    const reservationMatch = path.match(/^\/reservations\/([^/]+)$/);
    if (reservationMatch && request.method === "PUT") {
      const payload = await readJson(request);
      const storeId = payload.storeId || "yokosuka";
      const booking = normalizeReservationPayload(payload, decodeURIComponent(reservationMatch[1]));
      const existingBooking = await readReservation(env.DB, storeId, booking.id);
      const syncedBooking = await syncAppsScriptCalendarEvent(env, mergeCalendarFields(booking, existingBooking));
      const calendarErrorResponse = getCalendarErrorResponse(syncedBooking);
      if (calendarErrorResponse) return calendarErrorResponse;
      await upsertReservation(env.DB, storeId, syncedBooking);
      return json({ ok: true, reservation: syncedBooking });
    }

    if (reservationMatch && request.method === "DELETE") {
      const payload = await readJson(request);
      const storeId = payload.storeId || "yokosuka";
      await env.DB.prepare("DELETE FROM reservations WHERE store_id = ? AND local_id = ?")
        .bind(storeId, decodeURIComponent(reservationMatch[1]))
        .run();
      return json({ ok: true });
    }

    if (request.method === "POST" && path === "/messages/queue") {
      const payload = await readJson(request);
      const storeId = payload.storeId || "yokosuka";
      const messages = Array.isArray(payload.messages) ? payload.messages : [];
      await upsertMessages(env.DB, storeId, messages);
      return json({ ok: true, count: messages.length }, 201);
    }

    if (request.method === "POST" && path === "/line/users") {
      const payload = await readJson(request);
      await upsertLineUser(env.DB, payload.storeId || "yokosuka", payload.lineUser || {});
      return json({ ok: true }, 201);
    }

    if (request.method === "PUT" && path === "/staff/evaluations/snapshot") {
      const payload = await readJson(request);
      await env.DB.prepare(
        "INSERT INTO staff_evaluation_snapshots (store_id, snapshot_json, updated_at) VALUES (?, ?, ?) ON CONFLICT(store_id) DO UPDATE SET snapshot_json = excluded.snapshot_json, updated_at = excluded.updated_at",
      )
        .bind(payload.storeId || "yokosuka", JSON.stringify(payload.state || {}), payload.updatedAt || new Date().toISOString())
        .run();
      return json({ ok: true });
    }

    return json({ message: "Not found" }, 404);
  } catch (error) {
    return json({ message: error.message || "API error" }, 500);
  }
}

function getCalendarErrorResponse(booking) {
  if (booking.googleCalendarStatus === "not_configured") {
    return json({
      message: "Google Apps Script webhook is not configured",
      error: "GOOGLE_APPS_SCRIPT_WEBHOOK_URL と GOOGLE_APPS_SCRIPT_SECRET をサーバー環境変数に設定してください。",
    }, 503);
  }

  if (booking.googleCalendarStatus === "error") {
    return json({
      message: "Google Calendar registration failed",
      error: booking.googleCalendarError || "Google Calendar registration failed",
    }, 502);
  }

  return null;
}

async function ensureSchema(db) {
  if (dbReady) return;

  await db.batch([
    db.prepare("CREATE TABLE IF NOT EXISTS reservations (store_id TEXT NOT NULL, local_id TEXT NOT NULL, start_at TEXT NOT NULL, end_at TEXT NOT NULL, booking_json TEXT NOT NULL, updated_at TEXT NOT NULL, PRIMARY KEY (store_id, local_id))"),
    db.prepare("CREATE INDEX IF NOT EXISTS idx_reservations_store_start ON reservations (store_id, start_at)"),
    db.prepare("CREATE TABLE IF NOT EXISTS messages (store_id TEXT NOT NULL, id TEXT NOT NULL, reservation_id TEXT, message_json TEXT NOT NULL, send_at TEXT, status TEXT NOT NULL DEFAULT 'pending', updated_at TEXT NOT NULL, PRIMARY KEY (store_id, id))"),
    db.prepare("CREATE INDEX IF NOT EXISTS idx_messages_store_send ON messages (store_id, status, send_at)"),
    db.prepare("CREATE TABLE IF NOT EXISTS line_users (store_id TEXT NOT NULL, line_user_id TEXT NOT NULL, line_user_json TEXT NOT NULL, updated_at TEXT NOT NULL, PRIMARY KEY (store_id, line_user_id))"),
    db.prepare("CREATE TABLE IF NOT EXISTS staff_evaluation_snapshots (store_id TEXT PRIMARY KEY, snapshot_json TEXT NOT NULL, updated_at TEXT NOT NULL)"),
  ]);

  dbReady = true;
}

function normalizeReservationPayload(payload, fallbackId = "") {
  const reservation = payload.reservation || payload.booking || payload;
  const customer = payload.customer || reservation.customer || {};
  const vehicle = payload.vehicle || {};
  const id = reservation.localId || reservation.id || fallbackId || crypto.randomUUID();
  const startDate = reservation.startDate || reservation.date || "";
  const endDate = reservation.endDate || startDate;
  const start = reservation.startTime || reservation.start || "";
  const end = reservation.endTime || reservation.end || "";

  return {
    id,
    remoteId: reservation.id || id,
    storeId: payload.storeId || reservation.storeId || "yokosuka",
    storeName: reservation.storeName || "",
    googleCalendarLabel: reservation.googleCalendarLabel || "",
    source: reservation.source || "user",
    category: reservation.category || "booking",
    menuId: reservation.menuId || "",
    menuName: reservation.menuName || "",
    vehicleId: reservation.vehicleSizeId || reservation.vehicleId || vehicle.sizeId || "",
    vehicleName: reservation.vehicleSizeName || reservation.vehicleName || vehicle.sizeName || "",
    startDate,
    start,
    endDate,
    end,
    loanerRequired: Boolean(reservation.loanerRequired),
    price: Number(reservation.price || reservation.totalPrice || 0),
    options: reservation.options || {},
    optionsSummary: reservation.optionsSummary || "",
    sameDayChangeNote: reservation.sameDayChangeNote || "",
    admin: reservation.admin || {},
    changeHistory: reservation.changeHistory || [],
    createdAt: reservation.createdAt || new Date().toISOString(),
    updatedAt: reservation.updatedAt || new Date().toISOString(),
    customer: {
      ...customer,
      lineProfile: customer.lineProfile || (payload.lineUser?.lineUserId
        ? {
            userId: payload.lineUser.lineUserId,
            displayName: payload.lineUser.displayName || "",
            pictureUrl: payload.lineUser.pictureUrl || "",
          }
        : null),
      carModel: customer.carModel || vehicle.modelName || "",
      vehicleNumber: customer.vehicleNumber || vehicle.vehicleNumber || "",
      bodyColor: customer.bodyColor || vehicle.bodyColor || "",
    },
  };
}

async function upsertReservation(db, storeId, booking) {
  const updatedAt = new Date().toISOString();
  const startAt = `${booking.startDate || "9999-12-31"}T${booking.start || "00:00"}:00`;
  const endAt = `${booking.endDate || booking.startDate || "9999-12-31"}T${booking.end || booking.start || "00:00"}:00`;

  await db.prepare(
    "INSERT INTO reservations (store_id, local_id, start_at, end_at, booking_json, updated_at) VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT(store_id, local_id) DO UPDATE SET start_at = excluded.start_at, end_at = excluded.end_at, booking_json = excluded.booking_json, updated_at = excluded.updated_at",
  )
    .bind(storeId, booking.id, startAt, endAt, JSON.stringify({ ...booking, updatedAt }), updatedAt)
    .run();
}

async function readReservation(db, storeId, localId) {
  if (!localId) return null;

  const row = await db.prepare("SELECT booking_json FROM reservations WHERE store_id = ? AND local_id = ?")
    .bind(storeId, localId)
    .first();

  if (!row?.booking_json) return null;

  try {
    return JSON.parse(row.booking_json);
  } catch {
    return null;
  }
}

function mergeCalendarFields(booking, existingBooking) {
  if (!existingBooking) return booking;

  return {
    ...booking,
    googleCalendarEventId: existingBooking.googleCalendarEventId || booking.googleCalendarEventId || "",
    googleCalendarHtmlLink: existingBooking.googleCalendarHtmlLink || booking.googleCalendarHtmlLink || "",
    googleCalendarProvider: existingBooking.googleCalendarProvider || booking.googleCalendarProvider || "",
  };
}

async function syncAppsScriptCalendarEvent(env, booking) {
  if (!isAppsScriptCalendarConfigured(env)) {
    console.warn("Google Apps Script calendar sync skipped: webhook URL or secret is not configured", {
      reservationId: booking.id,
      storeId: booking.storeId,
    });
    return {
      ...booking,
      googleCalendarStatus: "not_configured",
      googleCalendarError: "",
      googleCalendarProvider: "apps_script",
    };
  }

  if (!shouldCreateCalendarEvent(booking)) {
    return {
      ...booking,
      googleCalendarStatus: "skipped",
      googleCalendarError: "",
      googleCalendarProvider: "apps_script",
    };
  }

  if (booking.googleCalendarEventId) {
    return {
      ...booking,
      googleCalendarStatus: "already_created",
      googleCalendarError: "",
      googleCalendarProvider: booking.googleCalendarProvider || "apps_script",
    };
  }

  try {
    const event = await postAppsScriptCalendarWebhook(env, booking);
    console.log("Google Apps Script calendar sync succeeded", {
      reservationId: booking.id,
      storeId: booking.storeId,
      eventId: event.eventId || event.id || "",
    });
    return {
      ...booking,
      googleCalendarEventId: event.eventId || event.id || "",
      googleCalendarHtmlLink: event.htmlLink || "",
      googleCalendarStatus: "created",
      googleCalendarError: "",
      googleCalendarProvider: "apps_script",
      googleCalendarSyncedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.warn("Google Apps Script calendar sync failed", {
      reservationId: booking.id,
      storeId: booking.storeId,
      message: error.message || "Google Apps Script calendar sync failed",
    });
    return {
      ...booking,
      googleCalendarStatus: "error",
      googleCalendarError: error.message || "Google Apps Script calendar sync failed",
      googleCalendarProvider: "apps_script",
      googleCalendarSyncedAt: new Date().toISOString(),
    };
  }
}

function isAppsScriptCalendarConfigured(env) {
  return Boolean(env.GOOGLE_APPS_SCRIPT_WEBHOOK_URL && env.GOOGLE_APPS_SCRIPT_SECRET);
}

function shouldCreateCalendarEvent(booking) {
  const status = String(booking.admin?.status || "").toLowerCase();
  return Boolean(booking.startDate && booking.start && !["canceled", "cancelled", "deleted"].includes(status));
}

async function postAppsScriptCalendarWebhook(env, booking) {
  const response = await fetch(env.GOOGLE_APPS_SCRIPT_WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(buildAppsScriptCalendarPayload(env, booking)),
  });

  const responseText = await response.text();
  const result = responseText ? JSON.parse(responseText) : {};

  if (!response.ok || result.ok === false) {
    throw new Error(result.message || result.error || `Google Apps Script webhook error: ${response.status}`);
  }

  return result;
}

function buildAppsScriptCalendarPayload(env, booking) {
  const customerName = booking.customer?.name || "お客様";
  const menuName = booking.menuName || "予約";
  return {
    secret: env.GOOGLE_APPS_SCRIPT_SECRET,
    customerName,
    phone: booking.customer?.phone || "",
    menu: menuName,
    carModel: booking.customer?.carModel || "",
    note: booking.customer?.request || booking.customer?.memo || booking.sameDayChangeNote || "",
    lineUserId: booking.customer?.lineProfile?.userId || "",
    startDateTime: toGoogleDateTime(booking.startDate, booking.start),
    endDateTime: toGoogleDateTime(booking.endDate || booking.startDate, booking.end || booking.start),
  };
}

function toGoogleDateTime(date, time) {
  const normalizedDate = date || "9999-12-31";
  const normalizedTime = String(time || "00:00").slice(0, 5);
  return `${normalizedDate}T${normalizedTime}:00+09:00`;
}

async function upsertMessages(db, storeId, messages) {
  const statements = messages
    .filter((message) => message?.id)
    .map((message) =>
      db
        .prepare("INSERT INTO messages (store_id, id, reservation_id, message_json, send_at, status, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?) ON CONFLICT(store_id, id) DO UPDATE SET reservation_id = excluded.reservation_id, message_json = excluded.message_json, send_at = excluded.send_at, status = excluded.status, updated_at = excluded.updated_at")
        .bind(storeId, message.id, message.reservationId || "", JSON.stringify(message), message.sendAt || new Date().toISOString(), message.status || "pending", new Date().toISOString()),
    );

  if (statements.length) await db.batch(statements);
}

async function upsertLineUser(db, storeId, lineUser) {
  if (!lineUser.lineUserId) return;

  await db.prepare(
    "INSERT INTO line_users (store_id, line_user_id, line_user_json, updated_at) VALUES (?, ?, ?, ?) ON CONFLICT(store_id, line_user_id) DO UPDATE SET line_user_json = excluded.line_user_json, updated_at = excluded.updated_at",
  )
    .bind(storeId, lineUser.lineUserId, JSON.stringify(lineUser), new Date().toISOString())
    .run();
}

async function serveAsset(request, env) {
  const assetFetcher = env.ASSETS || env.__STATIC_CONTENT;
  if (!assetFetcher?.fetch) {
    return new Response("Static asset binding is not configured.", { status: 404, headers: securityHeaders });
  }

  const url = new URL(request.url);
  const pathname = decodeURIComponent(url.pathname);
  const normalizedPath = pathname === "/" ? "/index.html" : pathname;
  const assetPath = normalizedPath.split("/").filter(Boolean).join("/");
  const assetUrl = new URL(request.url);
  assetUrl.pathname = `/${assetPath}`;
  const response = await assetFetcher.fetch(new Request(assetUrl, request));

  if (!response.ok && !assetPath.includes(".")) {
    const fallbackUrl = new URL(request.url);
    fallbackUrl.pathname = "/index.html";
    return assetFetcher.fetch(new Request(fallbackUrl, request));
  }

  const extension = `.${assetPath.split(".").pop()}`;
  const headers = new Headers(response.headers);
  headers.set("Content-Type", contentTypes[extension] || headers.get("Content-Type") || "application/octet-stream");
  Object.entries(securityHeaders).forEach(([key, value]) => headers.set(key, value));
  return new Response(response.body, { status: response.status, headers });
}

async function readJson(request) {
  const text = await request.text();
  return text ? JSON.parse(text) : {};
}

function json(payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      ...securityHeaders,
    },
  });
}

function corsHeaders(request) {
  const origin = request.headers.get("Origin") || "*";
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-TRYWASH-Environment",
  };
}
