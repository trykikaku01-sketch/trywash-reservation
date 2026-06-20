(function () {
  const isHostedHttp = window.location.protocol === "https:" || (window.location.protocol === "http:" && !["localhost", "127.0.0.1", "::1"].includes(window.location.hostname));

  window.TRYWASH_CONFIG = {
    environment: isHostedHttp ? "production" : "local",
    storeId: "yokosuka",
    apiBaseUrl: "",
    googleAppsScriptWebhookUrl: "hhttps://script.google.com/macros/s/AKfycbyYNb2nGFr2lJxk0kXbSgZSVygNouCtfehQmRagQctviCn70ckvUX_DmbZ2jASwF34/exec",
    googleAppsScriptSecret: "trywash_calendar_2026",
    googleAppsScriptOpaqueFallback: true,
    liffId: "2006165803-oWEnewYV",
    wordpressUrl: "https://try-wash.com",
    lineEnabled: isHostedHttp,
    ...(window.TRYWASH_CONFIG || {}),
  };
})();
