(function () {
  const isHostedHttp = window.location.protocol === "https:" || (window.location.protocol === "http:" && !["localhost", "127.0.0.1", "::1"].includes(window.location.hostname));

  window.TRYWASH_CONFIG = {
    environment: isHostedHttp ? "production" : "local",
    storeId: "yokosuka",
    apiBaseUrl: isHostedHttp ? "/api" : "",
    liffId: "2006165803-oWEnewYV",
    wordpressUrl: "https://try-wash.com",
    lineEnabled: isHostedHttp,
    ...(window.TRYWASH_CONFIG || {}),
  };
})();
