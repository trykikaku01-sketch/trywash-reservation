const CALENDAR_ID = "trykikaku01@gmail.com";
const TIME_ZONE = "Asia/Tokyo";
const SHEET_NAME = "reservations";
const HEADERS = [
  "受付日時",
  "予約ID",
function saveReservationToSheet(payload) {
  const record = makeSheetRecord(payload);
  const sheet = getReservationSheet();
  const rowNumber = findRowByReservationId(sheet, record.id);
  const rowValues = recordToRow(record);

  if (rowNumber) {
    sheet.getRange(rowNumber, 1, 1, HEADERS.length).setValues([rowValues]);
  } else {
    sheet.appendRow(rowValues);
  }

  return {
    ok: true,

function getReservationSheet() {
  const spreadsheetId = PropertiesService.getScriptProperties().getProperty("GOOGLE_SPREADSHEET_ID");
  const spreadsheet = spreadsheetId ? SpreadsheetApp.openById(spreadsheetId) : SpreadsheetApp.getActiveSpreadsheet();
  if (!spreadsheet) throw new Error("Spreadsheet not found. Set GOOGLE_SPREADSHEET_ID in Script Properties.");

  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = spreadsheet.insertSheet(SHEET_NAME);
  ensureHeaders(sheet);
  return sheet;
}
  if (needsHeader) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.setFrozenRows(1);
  }

  const payloadColumn = HEADERS.indexOf("payloadJson") + 1;
const CALENDAR_ID = "trykikaku01@gmail.com";
const TIME_ZONE = "Asia/Tokyo";
const SHEET_NAME = "予約一覧";
const HEADERS = [
  "受付日時",
  "予約ID",
function saveReservationToSheet(payload) {
  const record = makeSheetRecord(payload);
  const sheet = getReservationSheet();
  const rowValues = recordToRow(record);
  console.log("reservationId:", record.id);
  sheet.appendRow(rowValues);
  console.log("appendRow success:", record.id, "row:", sheet.getLastRow());

  return {
    ok: true,

function getReservationSheet() {
  const spreadsheetId = PropertiesService.getScriptProperties().getProperty("GOOGLE_SPREADSHEET_ID");
  console.log("spreadsheetId:", spreadsheetId);
  if (!spreadsheetId) throw new Error("GOOGLE_SPREADSHEET_ID is not set in Script Properties.");

  const spreadsheet = SpreadsheetApp.openById(spreadsheetId);

  let sheet = spreadsheet.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(SHEET_NAME);
    console.log("sheet created:", SHEET_NAME);
  }
  console.log("sheetName:", sheet.getName());
  ensureHeaders(sheet);
  return sheet;
}
  if (needsHeader) {
    sheet.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]);
    sheet.setFrozenRows(1);
    console.log("headers created:", sheet.getName());
  }

  const payloadColumn = HEADERS.indexOf("payloadJson") + 1;
