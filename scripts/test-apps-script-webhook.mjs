import { readFileSync } from "node:fs";

loadDotEnv();

const webhookUrl = process.env.GOOGLE_APPS_SCRIPT_WEBHOOK_URL;
const secret = process.env.GOOGLE_APPS_SCRIPT_SECRET;
const timezone = process.env.GOOGLE_CALENDAR_TIMEZONE || "Asia/Tokyo";

if (!webhookUrl || !secret) {
  console.error("GOOGLE_APPS_SCRIPT_WEBHOOK_URL と GOOGLE_APPS_SCRIPT_SECRET を .env に設定してください。");
  process.exit(1);
}

const startDateTime = process.env.TEST_START_DATETIME || makeDefaultStartDateTime();
const endDateTime = process.env.TEST_END_DATETIME || addOneHour(startDateTime);

const payload = {
  secret,
  customerName: "テスト送信",
  phone: "000-0000-0000",
  menu: "テストメニュー",
  carModel: "テスト車両",
  note: "Apps Script Webhookの疎通確認です。確認後、Googleカレンダーから削除してください。",
  lineUserId: "test-line-user-id",
  startDateTime,
  endDateTime,
};

console.log("Apps ScriptへテストPOSTします。");
console.log(`URL: ${maskUrl(webhookUrl)}`);
console.log(`タイムゾーン: ${timezone}`);
console.log(`開始: ${startDateTime}`);
console.log(`終了: ${endDateTime}`);

const response = await fetch(webhookUrl, {
  method: "POST",
  headers: {
    "Content-Type": "application/json; charset=utf-8",
  },
  body: JSON.stringify(payload),
});

const text = await response.text();
let result;
try {
  result = text ? JSON.parse(text) : {};
} catch {
  result = { raw: text };
}

console.log(`HTTP ${response.status}`);
console.log(JSON.stringify(result, null, 2));

if (!response.ok || result.ok === false) {
  process.exit(1);
}

function loadDotEnv(path = ".env") {
  let text = "";
  try {
    text = readFileSync(path, "utf8");
  } catch {
    return;
  }

  text.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;

    const separatorIndex = trimmed.indexOf("=");
    if (separatorIndex === -1) return;

    const key = trimmed.slice(0, separatorIndex).trim();
    const rawValue = trimmed.slice(separatorIndex + 1).trim();
    if (!key || process.env[key] != null) return;

    process.env[key] = rawValue.replace(/^['"]|['"]$/g, "");
  });
}

function makeDefaultStartDateTime() {
  const date = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}T10:00:00+09:00`;
}

function addOneHour(dateTime) {
  const date = new Date(dateTime);
  date.setHours(date.getHours() + 1);
  return toTokyoIso(date);
}

function toTokyoIso(date) {
  const parts = new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}T${values.hour}:${values.minute}:${values.second}+09:00`;
}

function maskUrl(url) {
  try {
    const parsed = new URL(url);
    return `${parsed.origin}${parsed.pathname}`;
  } catch {
    return "(設定済みURL)";
  }
}
