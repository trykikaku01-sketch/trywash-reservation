(function () {
  const stores = [
    {
      id: "yokosuka",
      name: "横須賀店",
      pageTitle: "横須賀店 予約サイト",
      positionLabel: "メイン店舗・全メニュー対応",
      reservationUrl: "yokosuka.html",
      liffUrl: "https://lin.ee/sGSGxIY",
      googleCalendarLabel: "TRY WASH 横須賀店",
      addressPlaceholder: "神奈川県横須賀市...",
      allowedMenuIds: null,
      limitedWeekdays: null,
      limitedDates: [],
    },
    {
      id: "yokohama",
      name: "横浜店",
      pageTitle: "横浜店 予約サイト",
      positionLabel: "限定日程・限定メニュー受付",
      reservationUrl: "yokohama.html",
      liffUrl: "https://lin.ee/sGSGxIY",
      googleCalendarLabel: "TRY WASH 横浜店",
      addressPlaceholder: "神奈川県横浜市...",
      allowedMenuIds: ["pure-wash", "limited-maintenance", "consultation"],
      limitedWeekdays: [0],
      limitedDates: [],
    },
  ];

  function getStoreById(storeId) {
    return stores.find((store) => store.id === storeId) || stores[0];
  }

  function getCurrentStoreId() {
    if (window.TRYWASH_PAGE_STORE_ID) return window.TRYWASH_PAGE_STORE_ID;
    const params = new URLSearchParams(window.location.search);
    if (params.get("store")) return params.get("store");
    if (window.location.pathname.includes("yokohama")) return "yokohama";
    return "yokosuka";
  }

  const currentStore = getStoreById(getCurrentStoreId());

  window.TRYWASH_STORES = stores;
  window.TRYWASH_CURRENT_STORE = currentStore;
  window.TRYWASH_CONFIG = {
    ...(window.TRYWASH_CONFIG || {}),
    storeId: currentStore.id,
    storeName: currentStore.name,
  };
})();
