const CALENDAR_ID = "trykikaku01@gmail.com";
const TIME_ZONE = "Asia/Tokyo";

function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents || "{}");
    const expectedSecret = PropertiesService.getScriptProperties().getProperty("GOOGLE_APPS_SCRIPT_SECRET");

    if (!expectedSecret || payload.secret !== expectedSecret) {
      return jsonOutput({
        ok: false,
        error: "Unauthorized",
      });
    }

    const reservationData = normalizeReservationPayload(payload);
    const calendar = CalendarApp.getCalendarById(CALENDAR_ID);
    if (!calendar) {
      throw new Error("Calendar not found: " + CALENDAR_ID);
    }

    const start = new Date(reservationData.startDateTime);
    const end = new Date(reservationData.endDateTime);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error("Invalid startDateTime or endDateTime");
    }

    const event = calendar.createEvent(
      makeTitle(reservationData),
      start,
      end,
      {
        description: makeDescription(reservationData),
        location: reservationData.storeName || "",
      },
    );

    return jsonOutput({
      ok: true,
      eventId: event.getId(),
      message: "Calendar event created",
    });
  } catch (error) {
    console.error(error);
    return jsonOutput({
      ok: false,
      error: error.message || "Google Calendar registration failed",
    });
  }
}

function makeTitle(payload) {
  return "【TRY WASH予約】" + (payload.customerName || "お客様") + " / " + (payload.menu || "予約");
}

function makeDescription(payload) {
  return [
    "お客様名: " + (payload.customerName || ""),
    "電話番号: " + (payload.phone || ""),
    "メニュー: " + (payload.menu || ""),
    "車種: " + (payload.carModel || ""),
    "備考: " + (payload.note || ""),
    "LINE userId: " + (payload.lineUserId || ""),
  ].join("\n");
}

function jsonOutput(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function normalizeReservationPayload(payload) {
  const reservation = payload.reservation || {};
  const customer = payload.customer || {};
  const vehicle = payload.vehicle || {};
  const lineUser = payload.lineUser || {};
  const startDateTime = payload.startDateTime || makeDateTime(reservation.startDate, reservation.startTime, "reservation.startDate/startTime");
  const endDateTime = payload.endDateTime || makeDateTime(reservation.endDate, reservation.endTime, "reservation.endDate/endTime");

  return {
    customerName: payload.customerName || customer.name || "",
    phone: payload.phone || customer.phone || "",
    menu: payload.menu || reservation.menuName || "",
    carModel: payload.carModel || vehicle.modelName || customer.carModel || "",
    note: payload.note || customer.request || customer.arrivalNote || reservation.sameDayChangeNote || "",
    lineUserId: payload.lineUserId || lineUser.lineUserId || "",
    storeName: payload.storeName || reservation.storeName || "",
    startDateTime: startDateTime,
    endDateTime: endDateTime,
  };
}

function makeDateTime(date, time, label) {
  if (!date || !time) {
    throw new Error((label || "reservation date/time") + " is required");
  }

  return date + "T" + String(time).slice(0, 5) + ":00+09:00";
}
