import { writeFile } from "node:fs/promises";

const config = {
  environment: process.env.TRYWASH_ENVIRONMENT || "production",
  storeId: process.env.TRYWASH_STORE_ID || "yokosuka",
  apiBaseUrl: process.env.TRYWASH_API_BASE_URL || "",
  googleAppsScriptWebhookUrl: process.env.GOOGLE_APPS_SCRIPT_WEBHOOK_URL || "",
  googleAppsScriptSecret: process.env.GOOGLE_APPS_SCRIPT_SECRET || "",
  googleAppsScriptOpaqueFallback: process.env.GOOGLE_APPS_SCRIPT_OPAQUE_FALLBACK || "",
  liffId: process.env.TRYWASH_LIFF_ID || "",
  wordpressUrl: process.env.TRYWASH_WORDPRESS_URL || "https://try-wash.com",
  lineEnabled: process.env.TRYWASH_LINE_ENABLED || "true",
};

const source = `(function () {
  window.TRYWASH_CONFIG = {
    ...${JSON.stringify(config, null, 2)},
    ...(window.TRYWASH_CONFIG || {}),
  };
})();\n`;

await writeFile("runtime-config.js", source);

console.log("runtime-config.js generated for Render deployment.");
