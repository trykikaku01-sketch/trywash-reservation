(function () {
  const defaultConfig = {
    environment: "local",
    storeId: "yokosuka",
    apiBaseUrl: "",
    liffId: "2006165803-oWEnewYV",
    wordpressUrl: "https://try-wash.com",
    lineEnabled: false,
  };

  const config = {
    ...defaultConfig,
    ...(window.TRYWASH_CONFIG || {}),
  };

  function canUseRemoteApi() {
    return Boolean(config.apiBaseUrl);
  }

  function makeUrl(path) {
    const base = config.apiBaseUrl.replace(/\/$/, "");
    const nextPath = path.startsWith("/") ? path : `/${path}`;
    return `${base}${nextPath}`;
  }

  async function request(path, options = {}) {
    if (!canUseRemoteApi()) {
      return { ok: false, skipped: true, reason: "apiBaseUrl is not configured" };
    }

    const response = await fetch(makeUrl(path), {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        "X-TRYWASH-Environment": config.environment,
        ...(options.headers || {}),
      },
      body: options.body == null ? undefined : JSON.stringify(options.body),
      credentials: "include",
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    if (!response.ok) {
      const error = new Error(data?.message || `API request failed: ${response.status}`);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  }

  function getReservationId(booking) {
    return encodeURIComponent(booking.remoteId || booking.id);
  }

  function toReservationPayload(booking) {
    const customer = booking.customer || {};
    const lineProfile = customer.lineProfile || {};

    return {
      storeId: booking.storeId || config.storeId,
      reservation: {
        id: booking.remoteId || booking.id,
        localId: booking.id,
        storeId: booking.storeId || config.storeId,
        storeName: booking.storeName || config.storeName || "",
        googleCalendarLabel: booking.googleCalendarLabel || "",
        source: booking.source || "user",
        status: booking.admin?.status || "new",
        category: booking.category,
        menuId: booking.menuId,
        menuName: booking.menuName,
        startDate: booking.startDate,
        startTime: booking.start,
        endDate: booking.endDate,
        endTime: booking.end,
        vehicleSizeId: booking.vehicleId,
        vehicleSizeName: booking.vehicleName,
        loanerRequired: Boolean(booking.loanerRequired),
        price: Number(booking.price) || 0,
        options: booking.options || {},
        optionsSummary: booking.optionsSummary || "",
        sameDayChangeNote: booking.sameDayChangeNote || "",
        admin: booking.admin || {},
        changeHistory: booking.changeHistory || [],
        createdAt: booking.createdAt,
        updatedAt: new Date().toISOString(),
      },
      customer: {
        name: customer.name || "",
        phone: customer.phone || "",
        postalCode: customer.postalCode || "",
        address: customer.address || "",
        bodyColor: customer.bodyColor || "",
        visitReason: customer.visitReason || "",
        dirtConcern: customer.dirtConcern || "",
        request: customer.request || "",
        additionalConsultation: customer.additionalConsultation || "",
        arrivalNote: customer.arrivalNote || "",
      },
      vehicle: {
        modelName: customer.carModel || "",
        vehicleNumber: customer.vehicleNumber || "",
        sizeId: booking.vehicleId,
        sizeName: booking.vehicleName,
        bodyColor: customer.bodyColor || "",
      },
      lineUser: lineProfile.userId
        ? {
            lineUserId: lineProfile.userId,
            displayName: lineProfile.displayName || "",
            pictureUrl: lineProfile.pictureUrl || "",
          }
        : null,
      notificationPlan: booking.lineNotificationPlan || [],
    };
  }

  function toMessagePayload(notice) {
    return {
      storeId: config.storeId,
      id: notice.id,
      reservationId: notice.bookingId,
      channel: notice.channel || "line",
      audience: notice.audience || "customer",
      targetLineUserId: notice.targetLineUserId || null,
      type: notice.type,
      label: notice.label,
      message: notice.message,
      sendAt: notice.sendAt,
      status: notice.status || "pending",
    };
  }

  async function listReservations() {
    return request(`/reservations?storeId=${encodeURIComponent(config.storeId)}`);
  }

  async function saveReservation(booking, mode = "upsert") {
    const method = mode === "create" ? "POST" : "PUT";
    const path = mode === "create" ? "/reservations" : `/reservations/${getReservationId(booking)}`;
    return request(path, {
      method,
      body: toReservationPayload(booking),
    });
  }

  async function deleteReservation(bookingId) {
    return request(`/reservations/${encodeURIComponent(bookingId)}`, {
      method: "DELETE",
      body: { storeId: config.storeId },
    });
  }

  async function queueMessages(notices) {
    const messages = (Array.isArray(notices) ? notices : [notices]).map(toMessagePayload);
    return request("/messages/queue", {
      method: "POST",
      body: { storeId: config.storeId, messages },
    });
  }

  async function upsertLineUser(profile) {
    if (!profile?.userId) return { ok: false, skipped: true };

    return request("/line/users", {
      method: "POST",
      body: {
        storeId: config.storeId,
        lineUser: {
          lineUserId: profile.userId,
          displayName: profile.displayName || "",
          pictureUrl: profile.pictureUrl || "",
        },
      },
    });
  }

  async function saveStaffEvaluationState(state) {
    return request("/staff/evaluations/snapshot", {
      method: "PUT",
      body: {
        storeId: config.storeId,
        state,
        updatedAt: new Date().toISOString(),
      },
    });
  }

  window.TryWashApi = {
    config,
    canUseRemoteApi,
    request,
    listReservations,
    saveReservation,
    deleteReservation,
    queueMessages,
    upsertLineUser,
    saveStaffEvaluationState,
    toReservationPayload,
  };
})();
