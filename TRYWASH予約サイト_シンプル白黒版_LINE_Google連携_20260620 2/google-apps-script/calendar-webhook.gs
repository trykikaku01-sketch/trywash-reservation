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

    const calendar = CalendarApp.getCalendarById(CALENDAR_ID);
    if (!calendar) {
      throw new Error("Calendar not found: " + CALENDAR_ID);
    }

    const start = new Date(payload.startDateTime);
    const end = new Date(payload.endDateTime);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new Error("Invalid startDateTime or endDateTime");
    }

    const event = calendar.createEvent(
      payload.title || makeTitle(payload),
      start,
      end,
      {
        description: makeDescription(payload),
        location: payload.storeName || "",
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
