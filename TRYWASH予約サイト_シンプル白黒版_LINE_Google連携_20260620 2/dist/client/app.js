const vehicleSizes = [
  { id: "small", name: "小型車" },
  { id: "standard", name: "普通車" },
  { id: "large", name: "大型車" },
  { id: "extraLarge", name: "特大車" },
];

const vehicleConditions = [
  { id: "used", name: "経年車", priceType: "regular" },
  { id: "withinMonth", name: "新車納車1ヶ月以内", priceType: "newCar" },
];

const vehicleModelExamples = window.TryWashVehicleModels || [];
const vehicleBrandGroups = window.TryWashVehicleBrandGroups || { domestic: [], import: [] };
const vehicleGenreLabels = { domestic: "国産車", import: "輸入車" };

const addOnOptions = [
  {
    id: "wheelFaceCoating",
    name: "ホイール表面コーティング",
    choices: [
      { id: "upTo15", name: "15インチまで", price: 19800, durationMinutes: 60 },
      { id: "16to18", name: "16〜18インチ", price: 22000, durationMinutes: 60 },
      { id: "19to21", name: "19〜21インチ", price: 24400, durationMinutes: 60 },
      { id: "over22", name: "22インチ以上", price: 27500, durationMinutes: 60 },
    ],
    defaultChoiceId: "upTo15",
  },
  {
    id: "pureTiaraWash",
    name: "純水手洗い洗車",
    prices: { small: 6000, standard: 6500, large: 7000, extraLarge: 7500 },
    durationMinutes: 60,
  },
  {
    id: "glassScaleRemoval",
    name: "全面ガラスウロコ除去",
    prices: { small: 19800, standard: 23100, large: 27500, extraLarge: 33000 },
    durationMinutes: { small: 60, standard: 60, large: 90, extraLarge: 90 },
  },
  {
    id: "glassRepellent",
    name: "全面ガラス撥水コート",
    prices: { small: 11000, standard: 13200, large: 15400, extraLarge: 18700 },
    durationMinutes: { small: 30, standard: 30, large: 60, extraLarge: 60 },
  },
  {
    id: "glassScaleRepellentSet",
    name: "全面ガラスウロコ除去＋全面ガラス撥水コート セット（20%OFF）",
    prices: { small: 24640, standard: 29040, large: 34320, extraLarge: 41360 },
    durationMinutes: { small: 90, standard: 90, large: 150, extraLarge: 150 },
  },
  {
    id: "leatherShield",
    name: "LeatherShield EVO（レザーシールド エヴォ）",
    choiceMode: "leatherShield",
    choices: [
      {
        id: "frontSet",
        name: "運転席＋助手席セット",
        price: 29700,
        normalPrice: 33000,
        badge: "人気No.1",
        description: "最も施工依頼の多い人気プランです。",
        conflictsWith: ["driver", "passenger"],
      },
      {
        id: "rear2Set",
        name: "後席2脚追加",
        price: 28000,
        normalPrice: 33000,
        badge: "ファミリーおすすめ",
        subBadge: "後席もまとめて保護したい方におすすめ",
        description: "後席も含めて保護したい方におすすめです。",
        requiresChoiceId: "frontSet",
        conflictsWith: ["rear1", "rear2", "rear3", "rear4"],
      },
      { id: "driver", name: "運転席", price: 16500, conflictsWith: ["frontSet"] },
      { id: "passenger", name: "助手席", price: 16500, conflictsWith: ["frontSet"] },
      { id: "rear1", name: "後席1脚", price: 16500, exclusiveGroup: "rear", conflictsWith: ["rear2Set"] },
      { id: "rear2", name: "後席2脚", price: 33000, exclusiveGroup: "rear", conflictsWith: ["rear2Set"] },
      { id: "rear3", name: "後席3脚", price: 49500, exclusiveGroup: "rear", conflictsWith: ["rear2Set"] },
      { id: "rear4", name: "後席4脚", price: 66000, exclusiveGroup: "rear", conflictsWith: ["rear2Set"] },
    ],
    defaultChoiceIds: ["frontSet"],
    durationMinutes: 15,
  },
  {
    id: "interiorDeodorizingMist",
    name: "消臭・抗菌・ミストコーティング",
    prices: { small: 12100, standard: 14300, large: 16500, extraLarge: 19800 },
    durationMinutes: 30,
    groupTitle: "車内オプション",
  },
  {
    id: "resinCoating",
    name: "樹脂コーティング",
    prices: { small: 14300, standard: 16500, large: 19800, extraLarge: 22000 },
    durationMinutes: { small: 20, standard: 30, large: 45, extraLarge: 60 },
  },
  {
    id: "headlightCleaning",
    name: "ヘッドライトくすみ除去",
    prices: { small: 19800, standard: 19800, large: 19800, extraLarge: 19800 },
    durationMinutes: 60,
  },
];

const menus = [
  {
    id: "pure-wash",
    category: "wash",
    typeLabel: "洗車",
    displayGroup: "洗車メニュー",
    name: "純水手洗い洗車",
    minutes: 60,
    serviceLabel: "簡易コーティング仕上げ",
    prices: { small: 6000, standard: 6500, large: 7000, extraLarge: 7500 },
    waxPrices: { small: 13000, standard: 15000, large: 17000, extraLarge: 20000 },
    waxDurationMinutes: 30,
    copy: "純水手洗い洗車に簡易コーティングを合わせ、日常汚れをすっきり整えます。",
  },
  {
    id: "limited-maintenance",
    category: "wash",
    typeLabel: "メンテナンス",
    displayGroup: "限定受付メニュー",
    name: "基本メンテナンス",
    minutes: 90,
    serviceLabel: "横浜店対応 / 既存のお客様向け",
    prices: { small: 11000, standard: 13200, large: 15400, extraLarge: 18700 },
    copy: "既存施工車や状態確認を含む基本メンテナンスです。重度の水シミや本格研磨が必要な場合は横須賀店をご案内します。",
    storeOnly: ["yokohama"],
  },
  {
    id: "consultation",
    category: "wash",
    typeLabel: "相談",
    displayGroup: "限定受付メニュー",
    name: "相談予約",
    minutes: 30,
    serviceLabel: "店舗・メニュー相談",
    prices: { small: 0, standard: 0, large: 0, extraLarge: 0 },
    copy: "店舗選びやメニュー選びに迷う方向けの相談枠です。お車の状態を確認し、最適な店舗・メニューをご案内します。",
    storeOnly: ["yokohama"],
  },
  {
    id: "polish-reset-wash",
    category: "coating",
    typeLabel: "洗車",
    displayGroup: "洗車メニュー",
    name: "研磨リセット洗車",
    minutes: 300,
    serviceLabel: "軽研磨 / 当日仕上げ",
    prices: { small: 69800, standard: 79800, large: 89800, extraLarge: 99800 },
    copy: "軽研磨付きのリフレッシュ洗車。洗車では落ちない水シミや蓄積汚れを整え、艶感を向上させます。",
  },
  {
    id: "gold-coating",
    category: "coating",
    typeLabel: "コーティング",
    displayGroup: "ガラスコーティングメニュー",
    name: "GOLD COATING（ゴールドコーティング）",
    minutes: 480,
    serviceLabel: "当日仕上げ / 3年耐久",
    prices: { small: 110000, standard: 121000, large: 132000, extraLarge: 145000 },
    newCarPrices: { small: 99000, standard: 109000, large: 119000, extraLarge: 130000 },
    oneLayerPrices: { small: 16000, standard: 18000, large: 20000, extraLarge: 22000 },
    oneLayerDurationMinutes: { small: 30, standard: 30, large: 45, extraLarge: 45 },
    copy: "軽研磨で下地を整え、ガラスコーティング1層で艶・撥水性・防汚性を高めます。",
  },
  {
    id: "q2-pure-mohs",
    category: "coating",
    typeLabel: "コーティング",
    displayGroup: "セラミックコーティングメニュー",
    name: "GYEON Q² PURE EVO / Q² MOHS EVO",
    serviceLabel: "1泊2日 / 3年耐久",
    durabilityLabel: "3年耐久",
    defaultStayDays: 2,
    prices: { small: 198000, standard: 228000, large: 248000, extraLarge: 268000 },
    newCarPrices: { small: 178000, standard: 205000, large: 223000, extraLarge: 241000 },
    oneLayerPrices: { small: 30000, standard: 34000, large: 37000, extraLarge: 40000 },
    oneLayerDurationMinutes: { small: 30, standard: 30, large: 45, extraLarge: 45 },
    copy: "標準研磨、1泊2日、3年耐久。PURE/MOHSは車両状態に応じて施工店側で選定します。",
  },
  {
    id: "q2-syncro",
    category: "coating",
    typeLabel: "コーティング",
    displayGroup: "セラミックコーティングメニュー",
    name: "GYEON Q² SYNCRO EVO",
    serviceLabel: "経年車2泊3日・新車1泊2日目安 / 5年耐久",
    durabilityLabel: "5年耐久",
    defaultStayDays: 3,
    prices: { small: 258000, standard: 298000, large: 328000, extraLarge: 358000 },
    newCarPrices: { small: 230000, standard: 270000, large: 295000, extraLarge: 320000 },
    oneLayerPrices: { small: 39000, standard: 45000, large: 49000, extraLarge: 54000 },
    oneLayerDurationMinutes: { small: 30, standard: 30, large: 45, extraLarge: 45 },
    copy: "標準研磨、経年車は2泊3日、新車納車1ヶ月以内は入庫時間により1泊2日目安。MOHS EVO＋SKIN EVOによるツーレイヤー最上位モデルです。",
  },
  {
    id: "interior-cleaning",
    category: "coating",
    typeLabel: "車内クリーニング",
    displayGroup: "車内クリーニング",
    name: "車内まるごとクリーニング",
    minutes: 240,
    serviceLabel: "当日仕上げ",
    prices: { small: 31900, standard: 40700, large: 45100, extraLarge: 45100 },
    copy: "車内をまるごとクリーニングし、シートや内装の汚れを整えます。",
  },
];

const coatingComparisonMetrics = [
  { id: "gloss", label: "艶" },
  { id: "water", label: "水はじき" },
  { id: "dirt", label: "防汚性" },
  { id: "scratch", label: "耐擦り傷性" },
  { id: "durability", label: "耐久性" },
];

const coatingComparisonItems = [
  {
    menuId: "gold-coating",
    order: "①",
    badge: "コスパ重視",
    badgeClass: "is-value",
    total: "★★★★☆",
    target: "まずは綺麗な状態を維持したい方",
    description:
      "軽研磨により薄い洗車キズや軽度の水シミを改善し、美しい艶を引き出します。まずは綺麗な状態を維持したい方におすすめです。",
    ratings: { gloss: 4, water: 4, dirt: 4, scratch: 3, durability: 4 },
  },
  {
    menuId: "q2-pure-mohs",
    order: "②",
    badge: "人気No.1",
    badgeClass: "is-popular",
    total: "★★★★☆＋",
    target: "艶・防汚性・耐久性のバランスを重視したい方",
    description:
      "標準研磨により、研磨で除去可能な洗車キズや水シミを改善。艶・防汚性・耐久性のバランスに優れた当店おすすめのセラミックコーティングです。",
    ratings: { gloss: 4.5, water: 4.5, dirt: 4.5, scratch: 4, durability: 4.5 },
  },
  {
    menuId: "q2-syncro",
    order: "③",
    badge: "最高峰モデル",
    badgeClass: "is-premium",
    total: "★★★★★",
    target: "最高品質の艶と長期保護を求める方",
    description:
      "標準研磨による下地処理後、GYEON最高峰クラスの艶・防汚性・耐久性を実現するプレミアムセラミックコーティングです。",
    ratings: { gloss: 5, water: 5, dirt: 5, scratch: 5, durability: 5 },
  },
];

const standardBusinessDay = { open: "09:00", close: "18:00", label: "9:00-18:00" };
const businessHours = {
  0: standardBusinessDay,
  1: standardBusinessDay,
  2: standardBusinessDay,
  3: standardBusinessDay,
  4: standardBusinessDay,
  5: standardBusinessDay,
  6: standardBusinessDay,
};

const totalBooths = 3;
const washBoothCapacity = 1;
const loanerCarCapacity = 2;
const slotStepMinutes = 30;
const bufferMinutes = 15;
const ceramicDropoffSlots = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00"];
const pickupTime = "18:00";
const overnightScheduleRules = {
  "q2-pure-mohs": {
    used: { minStayDays: 2, workMinutes: 12 * 60 },
    withinMonth: { minStayDays: 2, workMinutes: 10 * 60 },
  },
  "q2-syncro": {
    used: { minStayDays: 3, workMinutes: 18 * 60, closePickup: true },
    withinMonth: { minStayDays: 2, workMinutes: 15 * 60 },
  },
};
const runtimeConfig = window.TryWashApi?.config || window.TRYWASH_CONFIG || {};
const currentStore = window.TRYWASH_CURRENT_STORE || {
  id: runtimeConfig.storeId || "yokosuka",
  name: runtimeConfig.storeName || "横須賀店",
  pageTitle: `${runtimeConfig.storeName || "横須賀店"} 予約サイト`,
  liffUrl: "https://lin.ee/sGSGxIY",
  googleCalendarLabel: `TRY WASH ${runtimeConfig.storeName || "横須賀店"}`,
  addressPlaceholder: "神奈川県横須賀市...",
};
const storageKey = `trywash-${currentStore.id}-bookings-v4`;
const customerStorageKey = `trywash-${currentStore.id}-customer-v1`;
const notificationStorageKey = `trywash-${currentStore.id}-line-notifications-v1`;
const lineProfileStorageKey = `trywash-${currentStore.id}-line-profile-v1`;
const lineLiffId = runtimeConfig.liffId || "2006165803-oWEnewYV";
const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
const workPlanVersion = "coating-work-rules-v1";
const goldCoatingUsedHours = { small: 4, standard: 4.5, large: 5, extraLarge: 6 };
const pureMohsUsedHours = { small: 6, standard: 7, large: 8, extraLarge: 9 };
const syncroUsedHours = { small: 7, standard: 8, large: 9, extraLarge: 10 };

const initialDate = findNextBusinessDate(new Date());
const initialBookings = readBookings();
const initialPreviousReservationVehicleInfo = getPreviousReservationVehicleInfo(initialBookings);
const initialVehicleModel = getVehicleModelByName(initialPreviousReservationVehicleInfo?.carModel);

let state = {
  selectedCarModel: initialPreviousReservationVehicleInfo?.carModel || "",
  selectedVehicleSize: initialPreviousReservationVehicleInfo?.vehicleSizeId || null,
  selectedMenu: null,
  selectedOptions: {},
  calculatedPrice: null,
  previousReservationVehicleInfo: initialPreviousReservationVehicleInfo,
  selectedMenuId: null,
  selectedVehicleId: initialPreviousReservationVehicleInfo?.vehicleSizeId || null,
  selectedDate: toISODate(initialDate),
  selectedSlot: null,
  vehicleCondition: "used",
  addLayer: false,
  addWax: false,
  addOns: {},
  addOnChoices: {},
  loanerRequired: false,
  vehicleGuideQuery: initialPreviousReservationVehicleInfo?.carModel || "",
  selectedVehicleGenre: initialVehicleModel?.genre || "domestic",
  selectedBrand: initialVehicleModel?.brand || getDefaultVehicleBrand("domestic"),
  ceramicStayDays: 2,
  editingBookingId: null,
  calendarView: "month",
  weekStart: startOfWeek(initialDate),
  monthCursor: startOfMonth(initialDate),
  lineProfile: readLineProfile(),
  bookings: initialBookings,
};

const elements = {
  menuList: document.querySelector("#menuList"),
  vehicleSizes: document.querySelector("#vehicleSizes"),
  vehicleGuide: document.querySelector("#vehicleGuide"),
  menuOptions: document.querySelector("#menuOptions"),
  loanerOptions: document.querySelector("#loanerOptions"),
  weekTitle: document.querySelector("#weekTitle"),
  weekGrid: document.querySelector("#weekGrid"),
  availabilityOverview: document.querySelector("#availabilityOverview"),
  selectedDateTitle: document.querySelector("#selectedDateTitle"),
  hoursPill: document.querySelector("#hoursPill"),
  slotGrid: document.querySelector("#slotGrid"),
  prevWeek: document.querySelector("#prevWeek"),
  nextWeek: document.querySelector("#nextWeek"),
  todayButton: document.querySelector("#todayButton"),
  currentWeekButton: document.querySelector("#currentWeekButton"),
  monthViewButton: document.querySelector("#monthViewButton"),
  summaryBox: document.querySelector("#summaryBox"),
  bookingForm: document.querySelector("#bookingForm"),
  bookingValidation: document.querySelector("#bookingValidation"),
  bookingCompletion: document.querySelector("#bookingCompletion"),
  submitButton: document.querySelector("#submitButton"),
  certificateFields: document.querySelector("#certificateFields"),
  washOptionalFields: document.querySelector("#washOptionalFields"),
  reservationList: document.querySelector("#reservationList"),
  floatingTotal: document.querySelector("#floatingTotal"),
  toast: document.querySelector("#toast"),
};

function applyStoreBranding() {
  document.title = `TRY WASH ${currentStore.name} | 洗車コーティング予約`;
  document.querySelectorAll(".brand strong").forEach((element) => {
    element.textContent = currentStore.pageTitle || `${currentStore.name} 予約サイト`;
  });
  document.querySelectorAll(".brand small").forEach((element) => {
    element.textContent = "洗車・コーティング予約";
  });
  const pageTitle = document.querySelector("#page-title");
  if (pageTitle) pageTitle.textContent = currentStore.pageTitle || `${currentStore.name} 予約サイト`;
  const lineLink = document.querySelector(".line-reservation-link");
  if (lineLink && currentStore.liffUrl) lineLink.href = currentStore.liffUrl;
  const addressInput = document.querySelector("#address");
  if (addressInput && currentStore.addressPlaceholder) addressInput.placeholder = currentStore.addressPlaceholder;
}

applyStoreBranding();
ensureBookingCompletionPanel();
ensureBookingValidationPanel();
decorateBookingFormLabels();
render();
bindEvents();

function ensureBookingCompletionPanel() {
  if (elements.bookingCompletion || !elements.bookingForm) return;

  const panel = document.createElement("section");
  panel.id = "bookingCompletion";
  panel.className = "booking-completion";
  panel.hidden = true;
  panel.setAttribute("aria-live", "polite");
  elements.bookingForm.insertAdjacentElement("afterend", panel);
  elements.bookingCompletion = panel;
}

function ensureBookingValidationPanel() {
  if (elements.bookingValidation || !elements.bookingForm) return;

  elements.bookingForm.noValidate = true;
  const panel = document.createElement("div");
  panel.id = "bookingValidation";
  panel.className = "booking-validation";
  panel.hidden = true;
  panel.setAttribute("aria-live", "polite");
  elements.bookingForm.prepend(panel);
  elements.bookingValidation = panel;
}

function decorateBookingFormLabels() {
  const fieldLabels = [
    { name: "customerName", type: "required" },
    { name: "customerPhone", type: "required" },
    { name: "carModel", type: "optional" },
    { name: "visitReason", type: "optional" },
    { name: "postalCode", type: "required" },
    { name: "address", type: "required" },
    { name: "coatingBodyColor", type: "required" },
    { name: "washBodyColor", type: "optional" },
    { name: "dirtConcern", type: "optional" },
    { name: "request", type: "optional" },
  ];

  fieldLabels.forEach(({ name, type }) => {
    const field = elements.bookingForm?.elements[name];
    const label = field?.closest("label");
    if (!label || label.querySelector(".field-badge")) return;

    const badge = document.createElement("span");
    badge.className = `field-badge field-badge-${type}`;
    badge.textContent = type === "required" ? "必須" : "任意";
    label.insertBefore(badge, label.firstElementChild || null);
  });
}

function bindEvents() {
  elements.prevWeek.addEventListener("click", () => {
    if (state.calendarView === "month") {
      selectMonth(addMonths(state.monthCursor, -1));
      return;
    }
    selectWeek(addDays(state.weekStart, -7));
  });

  elements.nextWeek.addEventListener("click", () => {
    if (state.calendarView === "month") {
      selectMonth(addMonths(state.monthCursor, 1));
      return;
    }
    selectWeek(addDays(state.weekStart, 7));
  });

  elements.todayButton.addEventListener("click", () => {
    const today = findNextBusinessDate(new Date());
    state.weekStart = startOfWeek(today);
    state.monthCursor = startOfMonth(today);
    state.selectedDate = toISODate(today);
    state.selectedSlot = null;
    render();
  });

  elements.currentWeekButton.addEventListener("click", () => {
    const today = findNextBusinessDate(new Date());
    state.calendarView = "week";
    state.weekStart = startOfWeek(today);
    state.selectedDate = toISODate(today);
    state.selectedSlot = null;
    render();
    scrollToStep("calendar");
  });

  elements.monthViewButton.addEventListener("click", () => {
    state.calendarView = "month";
    state.monthCursor = startOfMonth(parseISODate(state.selectedDate));
    state.selectedSlot = null;
    render();
    scrollToStep("calendar");
  });

  elements.bookingForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!hasSelectedMenu() || !hasSelectedVehicle()) {
      showToast("先に車両サイズとメニューを選択してください。");
      return;
    }
    if (!state.selectedSlot) return;

    const menu = getSelectedMenu();
    const vehicle = getSelectedVehicle();
    const options = getSelectedOptions(menu);
    const loanerRequired = Boolean(state.loanerRequired);
    const previousBooking = state.editingBookingId
      ? state.bookings.find((savedBooking) => savedBooking.id === state.editingBookingId)
      : null;

    if (!isSlotAvailable(state.selectedDate, state.selectedSlot, menu, options, vehicle.id, state.editingBookingId, loanerRequired)) {
      showToast("その枠は直前に埋まりました。別の時間を選んでください。");
      state.selectedSlot = null;
      render();
      return;
    }

    const missingFields = getMissingBookingFields();
    if (missingFields.length) {
      showBookingValidation(missingFields);
      return;
    }

    const booking = makeBookingRecord({
      date: state.selectedDate,
      slot: state.selectedSlot,
      menu,
      vehicle,
      options,
      loanerRequired,
      source: "user",
      customer: {
        name: elements.bookingForm.customerName.value.trim(),
        phone: elements.bookingForm.customerPhone.value.trim(),
        postalCode: elements.bookingForm.postalCode.value.trim(),
        address: elements.bookingForm.address.value.trim(),
        carModel: getCustomerCarModelValue(),
        vehicleNumber: elements.bookingForm.vehicleNumber?.value.trim() || "",
        visitReason: elements.bookingForm.visitReason.value,
        bodyColor: getBodyColorValue(),
        dirtConcern: elements.bookingForm.dirtConcern.value,
        request: elements.bookingForm.request.value.trim(),
        additionalConsultation: elements.bookingForm.additionalConsultation?.value.trim() || "",
        arrivalNote: elements.bookingForm.arrivalNote?.value.trim() || "",
        lineProfile: state.lineProfile,
      },
    });

    elements.submitButton.disabled = true;
    elements.submitButton.textContent = "予約を送信中...";

    try {
      if (previousBooking) {
        const bookingIndex = state.bookings.findIndex((savedBooking) => savedBooking.id === previousBooking.id);
        const updatedBooking = prepareEditedBooking(previousBooking, booking, "customer");
        const syncedBooking = await syncBookingToRemote(updatedBooking, "update");
        const finalBooking = syncedBooking ? { ...updatedBooking, ...syncedBooking } : updatedBooking;
        state.bookings[bookingIndex] = finalBooking;
        writeBookings(state.bookings);
        queueBookingChangeNotifications(finalBooking, "customer", previousBooking);
        state.editingBookingId = null;
        showBookingCompletion(finalBooking, "予約内容を変更しました");
        showToast("予約内容を変更しました。お客様と管理者へ案内予定を作成しました。");
      } else {
        const syncedBooking = await syncBookingToRemote(booking, "create");
        const finalBooking = syncedBooking ? { ...booking, ...syncedBooking } : booking;
        state.bookings.push(finalBooking);
        writeBookings(state.bookings);
        queueLineNotifications(finalBooking);
        showBookingCompletion(finalBooking, "予約を受け付けました");
        showToast("予約を受け付けました。LINE通知とリマインド予定を作成しました。");
      }
    } catch (error) {
      console.warn("Googleカレンダー登録または予約同期に失敗しました。", error);
      showToast("Googleカレンダー登録に失敗しました。時間をおいて再度お試しください。");
      elements.submitButton.disabled = false;
      elements.submitButton.textContent = state.editingBookingId ? "この内容で予約を変更する" : "この内容で予約する";
      return;
    }

    saveCustomerFromForm();
    state.selectedSlot = null;
    elements.bookingForm.reset();
    prefillCustomerForm();
    render();
  });

  elements.bookingCompletion?.addEventListener("click", (event) => {
    if (!event.target.closest("[data-new-booking]")) return;
    elements.bookingCompletion.hidden = true;
    elements.bookingForm.hidden = false;
    render();
    scrollToStep("menu");
  });

  elements.bookingForm.addEventListener("input", () => {
    if (!elements.bookingValidation || elements.bookingValidation.hidden) return;
    const missingFields = getMissingBookingFields();
    if (missingFields.length) {
      showBookingValidation(missingFields);
    } else {
      hideBookingValidation();
    }
  });

  elements.bookingForm.addEventListener("change", () => {
    updateRequiredFieldBadges();
    if (!elements.bookingValidation || elements.bookingValidation.hidden) return;
    const missingFields = getMissingBookingFields();
    if (missingFields.length) {
      showBookingValidation(missingFields);
    } else {
      hideBookingValidation();
    }
  });

  prefillCustomerForm();
  initLineProfile();
  hydrateRemoteBookings();
}

function render() {
  ensureSelectedMenuAllowedForStore();
  normalizeStateForMenu();
  syncDerivedReservationState();
  ensureSelectedDateOpen();
  renderStoreReservationNote();
  renderMenus();
  renderVehicleSizes();
  renderVehicleGuide();
  renderMenuOptions();
  renderLoanerOptions();
  renderWeek();
  renderAvailabilityOverview();
  renderSlots();
  renderFormFields();
  updateRequiredFieldBadges();
  renderSummary();
  renderFloatingTotal();
  renderReservations();
}

function showBookingCompletion(booking, title = "予約を受け付けました") {
  if (!elements.bookingCompletion) return;

  elements.bookingCompletion.innerHTML = `
    <p class="eyebrow">Complete</p>
    <h3>${escapeHtml(title)}</h3>
    <div class="completion-lines">
      <div><span>予約日時</span><strong>${escapeHtml(formatBookingPeriod(booking))}</strong></div>
      <div><span>メニュー</span><strong>${escapeHtml(booking.menuName || "")}</strong></div>
      <div><span>お客様名</span><strong>${escapeHtml(booking.customer?.name || "")}</strong></div>
    </div>
    <button class="text-button" type="button" data-new-booking>続けて別の予約をする</button>
  `;
  elements.bookingForm.hidden = true;
  elements.bookingCompletion.hidden = false;
  elements.bookingCompletion.scrollIntoView({ behavior: "smooth", block: "start" });
}

function getMissingBookingFields() {
  const checks = [
    { name: "customerName", label: "お名前" },
    { name: "customerPhone", label: "電話番号" },
  ];

  if (requiresCertificateInfo(getSelectedMenu())) {
    checks.push(
      { name: "postalCode", label: "郵便番号" },
      { name: "address", label: "ご住所" },
      { name: "coatingBodyColor", label: "ボディカラー" },
    );
  }

  return checks.filter(({ name }) => {
    const field = elements.bookingForm?.elements[name];
    return field && !String(field.value || "").trim();
  });
}

function showBookingValidation(missingFields) {
  if (!elements.bookingValidation) return;

  const labels = missingFields.map((field) => field.label);
  markMissingFields(missingFields);
  elements.bookingValidation.innerHTML = `
    <strong>入力が足りない項目があります</strong>
    <p>${labels.map((label) => `「${escapeHtml(label)}」`).join("、")}を入力してください。</p>
  `;
  elements.bookingValidation.hidden = false;
  elements.bookingValidation.scrollIntoView({ behavior: "smooth", block: "center" });
  focusFirstMissingField(missingFields);
}

function hideBookingValidation() {
  if (!elements.bookingValidation) return;
  elements.bookingValidation.hidden = true;
  elements.bookingValidation.innerHTML = "";
  clearMissingFieldMarks();
}

function focusFirstMissingField(missingFields) {
  const firstField = elements.bookingForm?.elements[missingFields[0]?.name];
  firstField?.focus({ preventScroll: true });
}

function markMissingFields(missingFields) {
  clearMissingFieldMarks();
  missingFields.forEach(({ name }) => {
    elements.bookingForm?.elements[name]?.classList.add("is-missing");
  });
}

function clearMissingFieldMarks() {
  elements.bookingForm?.querySelectorAll(".is-missing").forEach((field) => {
    field.classList.remove("is-missing");
  });
}

function updateRequiredFieldBadges() {
  const requiredWhenCertificate = new Set(["postalCode", "address", "coatingBodyColor"]);
  ["postalCode", "address", "coatingBodyColor"].forEach((name) => {
    const field = elements.bookingForm?.elements[name];
    const label = field?.closest("label");
    const badge = label?.querySelector(".field-badge");
    if (!badge) return;

    const isRequired = requiresCertificateInfo(getSelectedMenu()) && requiredWhenCertificate.has(name);
    badge.className = `field-badge field-badge-${isRequired ? "required" : "optional"}`;
    badge.textContent = isRequired ? "必須" : "任意";
  });
}

function renderStoreReservationNote() {
  const note = document.querySelector("#storeReservationNote");
  if (!note) return;

  if (currentStore.id === "yokohama") {
    note.innerHTML = `
      <h3>TRY WASH 横浜店 <small>限定日程・限定メニュー受付</small></h3>
      <p>横浜店は、限定日程・限定メニューでの受付となります。セラミックコーティング、本格的な研磨作業、重度の水シミ除去、長時間施工のコーティング・クリーニングメニューをご希望の場合は、横須賀店でのご予約をおすすめしております。</p>
      <p>どちらの店舗で予約すればよいかわからない場合は、LINEよりお気軽にご相談ください。お車の状態やご希望内容に合わせて、最適な店舗・メニューをご案内いたします。</p>
      <a class="line-consult-button" href="${escapeHtml(currentStore.liffUrl || "#")}">LINEで相談する</a>
    `;
    return;
  }

  note.innerHTML = `
    <h3>TRY WASH 横須賀店 <small>メイン店舗・全メニュー対応</small></h3>
    <p>コーティング、研磨、車内清掃、セットメニューなど、TRY WASHのすべてのメニューに対応しています。初めてのお客様や、しっかり施工をご希望のお客様はこちらからご予約ください。</p>
    <a class="line-consult-button" href="${escapeHtml(currentStore.liffUrl || "#")}">LINEで相談する</a>
  `;
}

function ensureSelectedMenuAllowedForStore() {
  const menu = getSelectedMenu();
  if (!menu || isMenuAllowedForStore(menu)) return;
  state.selectedMenuId = null;
  state.selectedMenu = null;
  state.selectedOptions = {};
  state.selectedSlot = null;
}

function renderMenus() {
  elements.menuList.innerHTML = "";
  const selectedVehicle = getSelectedVehicle();
  const groups = ["限定受付メニュー", "洗車メニュー", "ガラスコーティングメニュー", "セラミックコーティングメニュー", "車内クリーニング"];
  const visibleMenus = getVisibleMenus();

  groups.forEach((group) => {
    const groupMenus = visibleMenus.filter((menu) => menu.displayGroup === group);
    if (!groupMenus.length) return;

    const groupNode = document.createElement("section");
    groupNode.className = "menu-group";
    groupNode.innerHTML = `<h3 class="menu-group-title">${group}</h3>`;

    groupMenus.forEach((menu) => {
      const menuWrap = document.createElement("div");
      const button = document.createElement("button");
      const options = getSelectedOptions(menu);

      menuWrap.className = "menu-card-wrap";
      button.type = "button";
      button.className = `menu-card ${menu.id === state.selectedMenuId ? "is-selected" : ""}`;
      button.dataset.menuId = menu.id;
      button.setAttribute("aria-pressed", String(menu.id === state.selectedMenuId));
      button.innerHTML = `
        <span class="menu-card-top">
          <span>
            <span class="menu-title">${menu.name}</span>
            <span class="menu-meta">
              ${renderMenuMetaChips(menu, options, selectedVehicle?.name || "サイズ未選択")}
            </span>
          </span>
          ${renderMenuPriceMarkup(menu, state.selectedVehicleId, options, menu.id === state.selectedMenuId)}
        </span>
        <p>${menu.copy}</p>
      `;

      button.addEventListener("click", () => {
        if (!isMenuAllowedForStore(menu)) {
          showToast("このメニューは横須賀店での施工をおすすめしております。");
          return;
        }
        state.selectedMenuId = menu.id;
        state.selectedMenu = menu.id;
        state.selectedSlot = null;
        normalizeStateForMenu();
        render();
        scrollToStep("options");
      });

      menuWrap.append(button);
      const polishInfoHtml = renderPolishInfoHtml(menu);
      if (polishInfoHtml) {
        menuWrap.insertAdjacentHTML("beforeend", polishInfoHtml);
      }
      const coatingPerformanceHtml = renderCoatingPerformanceDetailsHtml(menu, options);
      if (coatingPerformanceHtml) {
        menuWrap.insertAdjacentHTML("beforeend", coatingPerformanceHtml);
      }
      groupNode.append(menuWrap);
    });

    elements.menuList.append(groupNode);
  });
}

function getVisibleMenus() {
  return menus.filter((menu) => isMenuAllowedForStore(menu));
}

function isMenuAllowedForStore(menu) {
  if (!menu) return false;
  if (menu.storeOnly?.length && !menu.storeOnly.includes(currentStore.id)) return false;
  if (!currentStore.allowedMenuIds?.length) return true;
  return currentStore.allowedMenuIds.includes(menu.id);
}

function renderPerformanceRow(metric, value) {
  return `
    <div class="performance-row">
      <span>${metric.label}</span>
      <strong>${formatRatingStars(value)} <small>(${formatRatingNumber(value)})</small></strong>
      <div class="performance-bar" aria-hidden="true"><span style="width: ${Math.min(value, 5) * 20}%"></span></div>
    </div>
  `;
}

function renderCoatingPerformanceDetailsHtml(menu, options = getSelectedOptions(menu)) {
  const item = getCoatingComparisonItem(menu);
  if (!item) return "";

  const ratings = getDisplayCoatingRatings(item, menu, options);
  const isLayered = menu.id === state.selectedMenuId && options.addLayer;
  const summary = isLayered ? "コーティング性能を星評価で見る（追加施工反映）" : "コーティング性能を星評価で見る";

  return `
    <details class="polish-details coating-performance-details">
      <summary>${summary}</summary>
      <div class="polish-detail-body coating-performance-body">
        <div class="coating-performance-note">
          <strong>${menu.name}</strong>
          <span>${isLayered ? `${getLayerOptionLabel(menu)} 反映後` : "基本施工"}</span>
          <p>${isLayered ? `${getLayerOptionLabel(menu)}を反映した性能目安です。` : "基本施工時の性能目安です。"}星評価と数値は5.0満点で表示しています。</p>
        </div>
        <div class="performance-list coating-performance-list">
          ${coatingComparisonMetrics.map((metric) => renderPerformanceRow(metric, ratings[metric.id])).join("")}
        </div>
      </div>
    </details>
  `;
}

function getCoatingComparisonItem(menu) {
  return coatingComparisonItems.find((item) => item.menuId === menu.id);
}

function getDisplayCoatingRatings(item, menu, options) {
  const shouldReflectLayer = menu.id === state.selectedMenuId && options.addLayer && menu.oneLayerPrices;
  return coatingComparisonMetrics.reduce((ratings, metric) => {
    const baseValue = item.ratings[metric.id];
    ratings[metric.id] = shouldReflectLayer ? getLayeredRatingValue(metric.id, baseValue) : baseValue;
    return ratings;
  }, {});
}

function formatRatingNumber(value) {
  return Number(value).toFixed(1);
}

function formatRatingStars(value) {
  if (value >= 5) return "★★★★★";
  const fullStars = Math.floor(value);
  const emptyStars = 5 - fullStars;
  const half = value % 1 === 0.5 ? "½" : "";
  return `${"★".repeat(fullStars)}${"☆".repeat(emptyStars)}${half}`;
}

function renderMenuMetaChips(menu, options, vehicleName) {
  const chips = [{ label: menu.typeLabel, className: "" }];
  const polishTypeLabel = getPolishTypeLabel(menu);
  const scheduleLabel = getScheduleChipLabel(menu, options);
  const durabilityLabel = getDurabilityChipLabel(menu);
  const genericServiceLabel = getGenericServiceChipLabel(menu, scheduleLabel, durabilityLabel);

  if (polishTypeLabel) {
    chips.push({
      label: polishTypeLabel,
      className: `polish-type-chip ${polishTypeLabel === "標準研磨" ? "is-standard" : "is-light"}`,
    });
  }
  if (genericServiceLabel) chips.push({ label: genericServiceLabel, className: "" });
  if (scheduleLabel) chips.push({ label: scheduleLabel, className: "schedule-chip" });
  if (durabilityLabel) {
    chips.push({
      label: durabilityLabel,
      className: `durability-chip ${durabilityLabel.includes("5年") ? "is-premium" : ""}`,
    });
  }
  chips.push({ label: vehicleName, className: "" });

  return chips
    .map((chip) => `<span class="chip ${chip.className}">${chip.label}</span>`)
    .join("");
}

function getScheduleChipLabel(menu, options = getSelectedOptions(menu)) {
  if (isOvernightService(menu)) return getOvernightMenuStayLabel(menu, options);
  if (menu.serviceLabel.includes("当日仕上げ")) return "当日仕上げ";
  return "";
}

function getDurabilityChipLabel(menu) {
  if (menu.durabilityLabel) return menu.durabilityLabel;
  return menu.serviceLabel.match(/\d+年耐久/)?.[0] || "";
}

function getGenericServiceChipLabel(menu, scheduleLabel, durabilityLabel) {
  if (isOvernightService(menu)) return "";

  return menu.serviceLabel
    .split("/")
    .map((item) => item.trim())
    .filter((item) => item && item !== scheduleLabel && item !== durabilityLabel && item !== getPolishTypeLabel(menu))
    .join(" / ");
}

function renderPolishInfoHtml(menu) {
  const info = getPolishInfo(menu);
  if (!info) return "";

  return `
    <details class="polish-details">
      <summary>${info.title}</summary>
      <div class="polish-detail-body">
        <div class="polish-purpose">
          <span>目的</span>
          <strong>${info.purpose}</strong>
        </div>
        <p>${info.description}</p>
        ${
          info.points?.length
            ? `<ul class="polish-point-list">
                ${info.points.map((item) => `<li>${item}</li>`).join("")}
              </ul>`
            : ""
        }
        <div class="polish-ratings" aria-label="仕上がりイメージ">
          <span class="polish-section-title">仕上がりイメージ</span>
          ${info.ratings
            .map(
              (rating) => `
                <div class="polish-rating-row">
                  <span>${rating.label}</span>
                  <strong>${rating.stars}</strong>
                </div>
              `,
            )
            .join("")}
        </div>
        <div class="polish-recommend">
          <span class="polish-section-title">おすすめ</span>
          <ul>
            ${info.recommendations.map((item) => `<li>${item}</li>`).join("")}
          </ul>
        </div>
      </div>
    </details>
  `;
}

function getPolishInfo(menu) {
  if (menu.id === "polish-reset-wash") {
    return {
      title: "軽研磨について",
      purpose: "塗装状態を整え、艶感を向上させる軽研磨",
      description:
        "研磨リセット洗車に含まれる研磨は「軽研磨」です。軽研磨とは、塗装への負担を抑えながら、薄い洗車キズ・軽度の水シミ・くすみ・艶の低下などを改善する下地処理です。深いキズや重度の水シミの除去を目的とした研磨ではありません。",
      points: ["薄い洗車キズ", "軽度の水シミ", "くすみ", "艶の低下"],
      ratings: [
        { label: "艶向上", stars: "★★★★★" },
        { label: "軽度の洗車キズ改善", stars: "★★☆☆☆" },
        { label: "軽度の水シミ改善", stars: "★★☆☆☆" },
      ],
      recommendations: [
        "車を綺麗にリフレッシュしたい方",
        "艶を向上させたい方",
        "軽度の洗車キズや水シミが気になる方",
        "コーティングまでは考えていない方",
      ],
    };
  }

  if (menu.id === "gold-coating") {
    return {
      title: "軽研磨について",
      purpose: "艶の向上と軽度なダメージの改善",
      description:
        "薄い洗車キズ、軽度の水シミ、くすみなどを改善し、塗装本来の艶を引き出します。塗装への負担を抑えながら美観を向上させる下地処理です。深いキズや重度の水シミは残る場合があります。",
      ratings: [
        { label: "艶", stars: "★★★★★" },
        { label: "キズ改善", stars: "★★☆☆☆" },
        { label: "水シミ改善", stars: "★★☆☆☆" },
      ],
      recommendations: ["新車", "比較的状態の良いお車", "コストを抑えながら綺麗にしたい方"],
    };
  }

  if (menu.id === "q2-pure-mohs" || menu.id === "q2-syncro") {
    return {
      title: "標準研磨について",
      purpose: "キズ・水シミの改善と高品質な仕上がり",
      description:
        "研磨で除去可能な洗車キズ、水シミ、くすみを改善し、塗装本来の美しさを引き出します。車両状態に応じて複数工程の研磨を行い、より高いレベルの仕上がりを目指します。",
      ratings: [
        { label: "艶", stars: "★★★★★" },
        { label: "キズ改善", stars: "★★★★☆" },
        { label: "水シミ改善", stars: "★★★★☆" },
      ],
      recommendations: ["経年車", "黒色車", "洗車キズや水シミが気になる方", "仕上がりを重視したい方"],
    };
  }

  return null;
}

function getPolishTypeLabel(menu) {
  if (menu.id === "polish-reset-wash" || menu.id === "gold-coating") {
    return "軽研磨";
  }

  if (menu.id === "q2-pure-mohs" || menu.id === "q2-syncro") {
    return "標準研磨";
  }

  return "";
}

function renderVehicleSizes() {
  elements.vehicleSizes.innerHTML = "";
  const selectedVehicle = getSelectedVehicle();
  elements.vehicleSizes.className = "vehicle-size-selector";
  elements.vehicleSizes.innerHTML = `
    ${renderPreviousReservationVehicleInfoHtml()}
    <div class="size-choice-grid" role="radiogroup" aria-label="車両サイズ">
      ${vehicleSizes
        .map(
          (vehicle) => `
            <button class="size-choice ${vehicle.id === state.selectedVehicleId ? "is-selected" : ""}" type="button" data-size-id="${vehicle.id}" role="radio" aria-checked="${vehicle.id === state.selectedVehicleId}">
              <span>${vehicle.name}</span>
              <strong>${vehicle.id === selectedVehicle?.id ? "選択中" : "選択する"}</strong>
            </button>
          `,
        )
        .join("")}
    </div>
    <small>車種検索から選ぶとサイズが自動で切り替わります。</small>
  `;

  elements.vehicleSizes.querySelectorAll("[data-size-id]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedVehicleId = button.dataset.sizeId;
      state.selectedVehicleSize = button.dataset.sizeId;
      state.selectedSlot = null;
      render();
      scrollToStep("menu");
    });
  });
}

function renderPreviousReservationVehicleInfoHtml() {
  const info = state.previousReservationVehicleInfo;
  if (!info) return "";

  return `
    <div class="previous-vehicle-note">
      <span>前回の予約</span>
      <strong>${escapeHtml(info.carModel || info.vehicleSizeName || "車種未登録")}</strong>
      <small>${escapeHtml(info.vehicleSizeName || "サイズ未登録")} / ${formatShortDate(info.startDate)} ${info.start || ""}</small>
    </div>
  `;
}

function renderVehicleGuide() {
  const selectedGenre = state.selectedVehicleGenre || "domestic";
  const brands = getVehicleBrandsForGenre(selectedGenre);
  if (!brands.includes(state.selectedBrand)) {
    state.selectedBrand = brands[0] || "";
  }

  elements.vehicleGuide.innerHTML = `
    <div class="section-head compact">
      <p class="eyebrow">Size Guide</p>
      <h2>車両サイズ案内</h2>
    </div>
    <div class="vehicle-guide">
      <label class="vehicle-search">
        車種名で検索
        <input id="vehicleSearch" type="search" value="${escapeHtml(state.vehicleGuideQuery)}" placeholder="例：アルファード、プリウス" autocomplete="off" />
      </label>
      <div class="vehicle-select-row" aria-label="メーカー選択">
        <label class="vehicle-select">
          区分
          <select id="vehicleGenreSelect">
            ${Object.entries(vehicleGenreLabels)
              .map(
                ([genre, label]) => `
                  <option value="${genre}" ${selectedGenre === genre ? "selected" : ""}>${label}</option>
                `,
              )
              .join("")}
          </select>
        </label>
        <label class="vehicle-select">
          メーカー
          <select id="vehicleBrandSelect">
            ${brands
              .map(
                (brand) => `
                  <option value="${escapeHtml(brand)}" ${state.selectedBrand === brand ? "selected" : ""}>${escapeHtml(brand)}</option>
                `,
              )
              .join("")}
          </select>
        </label>
      </div>
      <div class="vehicle-result-list">${renderVehicleResultsHtml()}</div>
    </div>
  `;

  const searchInput = elements.vehicleGuide.querySelector("#vehicleSearch");
  const genreSelect = elements.vehicleGuide.querySelector("#vehicleGenreSelect");
  const brandSelect = elements.vehicleGuide.querySelector("#vehicleBrandSelect");
  let isComposing = false;
  const updateResults = () => {
    elements.vehicleGuide.querySelector(".vehicle-result-list").innerHTML = renderVehicleResultsHtml();
    bindVehicleResultButtons();
  };

  searchInput.addEventListener("compositionstart", () => {
    isComposing = true;
  });
  searchInput.addEventListener("compositionend", (event) => {
    isComposing = false;
    state.vehicleGuideQuery = event.target.value;
    updateResults();
  });
  searchInput.addEventListener("input", (event) => {
    if (isComposing) return;
    state.vehicleGuideQuery = event.target.value;
    updateResults();
  });

  genreSelect.addEventListener("change", (event) => {
    state.selectedVehicleGenre = event.target.value;
    state.selectedBrand = getDefaultVehicleBrand(state.selectedVehicleGenre);
    state.vehicleGuideQuery = "";
    state.selectedSlot = null;
    renderVehicleGuide();
  });

  brandSelect.addEventListener("change", (event) => {
    state.selectedBrand = event.target.value;
    state.vehicleGuideQuery = "";
    state.selectedSlot = null;
    renderVehicleGuide();
  });

  bindVehicleResultButtons();
}

function bindVehicleResultButtons() {
  elements.vehicleGuide.querySelectorAll(".vehicle-result").forEach((button) => {
    button.addEventListener("click", () => {
      selectVehicleModelById(button.dataset.modelId);
    });
  });
}

function renderVehicleResultsHtml() {
  const matches = getVisibleVehicleModels().slice(0, 12);
  if (!matches.length) {
    return `<div class="vehicle-empty">該当する車種が見つかりません。上の車両サイズを手動で選択してください。</div>`;
  }

  return matches
    .map(
      (vehicle) => `
        <button class="vehicle-result" type="button" data-model-id="${escapeHtml(vehicle.id)}">
          <span>${escapeHtml(vehicle.name)}</span>
          <small>${escapeHtml(vehicle.brand)} / ${vehicle.keeperSize ? `${escapeHtml(vehicle.keeperSize)} - ` : ""}${getVehicleSizeName(vehicle.sizeId)}</small>
        </button>
      `,
    )
    .join("");
}

function getVisibleVehicleModels() {
  const query = normalizeSearchText(state.vehicleGuideQuery);
  return vehicleModelExamples.filter((vehicle) => {
    const haystack = normalizeSearchText(`${vehicle.brand} ${vehicle.name}`);
    return query ? haystack.includes(query) : vehicle.genre === state.selectedVehicleGenre && vehicle.brand === state.selectedBrand;
  });
}

function selectVehicleModelById(modelId) {
  const vehicle = getVehicleModelById(modelId);
  if (!vehicle) return;
  selectVehicleModel(vehicle.name, vehicle.sizeId, vehicle);
}

function selectVehicleModel(modelName, sizeId, vehicle = null) {
  const selectedModel = vehicle || getVehicleModelByNameAndSize(modelName, sizeId);
  state.selectedVehicleId = sizeId;
  state.selectedVehicleSize = sizeId;
  state.selectedCarModel = modelName;
  state.vehicleGuideQuery = modelName;
  if (selectedModel) {
    state.selectedVehicleGenre = selectedModel.genre;
    state.selectedBrand = selectedModel.brand;
  }
  state.selectedSlot = null;
  render();
  if (elements.bookingForm.carModel) {
    elements.bookingForm.carModel.value = modelName;
  }
  showToast(`${modelName} は ${getVehicleSizeName(sizeId)} を選択しました。`);
  scrollToStep("menu");
}

function getVehicleBrandsForGenre(genre) {
  const brandsWithModels = new Set(vehicleModelExamples.filter((vehicle) => vehicle.genre === genre).map((vehicle) => vehicle.brand));
  const configuredBrands = vehicleBrandGroups[genre] || [];
  const orderedBrands = configuredBrands.filter((brand) => brandsWithModels.has(brand));
  const extraBrands = [...brandsWithModels].filter((brand) => !orderedBrands.includes(brand)).sort((a, b) => a.localeCompare(b, "ja"));
  return [...orderedBrands, ...extraBrands];
}

function getDefaultVehicleBrand(genre = "domestic") {
  const brands = getVehicleBrandsForGenre(genre);
  return brands.includes("トヨタ") ? "トヨタ" : brands[0] || "";
}

function getVehicleModelById(modelId) {
  return vehicleModelExamples.find((vehicle) => String(vehicle.id) === String(modelId)) || null;
}

function getVehicleModelByName(modelName) {
  const query = normalizeSearchText(modelName || "");
  if (!query) return null;

  return (
    vehicleModelExamples.find((vehicle) => normalizeSearchText(vehicle.name) === query) ||
    vehicleModelExamples.find((vehicle) => normalizeSearchText(`${vehicle.brand} ${vehicle.name}`).includes(query) || normalizeSearchText(vehicle.name).includes(query)) ||
    null
  );
}

function getVehicleModelByNameAndSize(modelName, sizeId) {
  const query = normalizeSearchText(modelName || "");
  if (!query) return null;

  return (
    vehicleModelExamples.find((vehicle) => vehicle.sizeId === sizeId && normalizeSearchText(vehicle.name) === query) ||
    vehicleModelExamples.find((vehicle) => vehicle.sizeId === sizeId && normalizeSearchText(vehicle.name).includes(query)) ||
    getVehicleModelByName(modelName)
  );
}

function renderMenuOptions() {
  const menu = getSelectedMenu();
  if (!hasSelectedMenu()) {
    elements.menuOptions.innerHTML = `<div class="option-placeholder">メニューを選択するとオプションを選べます。</div>`;
    return;
  }
  if (!hasSelectedVehicle()) {
    elements.menuOptions.innerHTML = `<div class="option-placeholder">車両サイズを選択するとオプション料金が表示されます。</div>`;
    return;
  }
  const options = getSelectedOptions(menu);
  const availableAddOns = getAvailableAddOns(menu);
  const rows = [];

  rows.push(`
    <div class="option-block">
      <span class="option-title">オプション選択</span>
      <label class="check-card">
        <input type="checkbox" data-option="none" ${hasNoPaidOptions(menu, options) ? "checked" : ""} />
        <span>オプションなし</span>
      </label>
    </div>
  `);

  if (menu.stayChoices?.length) {
    rows.push(`
      <div class="option-block">
        <span class="option-title">お預かり日数</span>
        <div class="choice-grid" role="radiogroup" aria-label="お預かり日数">
          ${[
            { value: "2", label: "1泊2日" },
            { value: "3", label: "2泊3日" },
          ]
            .map(
              (item) => `
                <button class="choice-button ${String(options.stayDays) === item.value ? "is-selected" : ""}" type="button" data-option="stayDays" data-value="${item.value}" role="radio" aria-checked="${String(options.stayDays) === item.value}">
                  ${item.label}
                </button>
              `,
            )
            .join("")}
        </div>
      </div>
    `);
  }

  if (menu.waxPrices) {
    rows.push(`
      <div class="option-block">
        <span class="option-title">洗車オプション</span>
        <label class="check-card">
          <input type="checkbox" data-option="wax" ${options.addWax ? "checked" : ""} />
          <span>高級ワックス仕上げ（${formatYen(menu.waxPrices[state.selectedVehicleId])}${renderOptionDurationText(menu, menu.waxDurationMinutes, state.selectedVehicleId)}）</span>
        </label>
      </div>
    `);
  }

  if (menu.newCarPrices) {
    rows.push(`
      <div class="option-block">
        <span class="option-title">車両状態</span>
        <div class="choice-grid" role="radiogroup" aria-label="車両状態">
          ${vehicleConditions
            .map(
              (condition) => `
                <button class="choice-button ${options.vehicleCondition === condition.id ? "is-selected" : ""}" type="button" data-option="condition" data-value="${condition.id}" role="radio" aria-checked="${options.vehicleCondition === condition.id}">
                  ${condition.name}
                </button>
              `,
            )
            .join("")}
        </div>
      </div>
    `);
  }

  if (menu.oneLayerPrices) {
    rows.push(`
      <div class="option-block">
        <span class="option-title">コーティングオプション</span>
        <label class="check-card">
          <input type="checkbox" data-option="layer" ${options.addLayer ? "checked" : ""} ${menu.oneLayerPrices ? "" : "disabled"} />
          <span>${getLayerOptionDisplayLabel(menu)}（${formatYen(menu.oneLayerPrices[state.selectedVehicleId])}${renderOptionDurationText(menu, menu.oneLayerDurationMinutes, state.selectedVehicleId)}）</span>
        </label>
      </div>
    `);
    rows.push(renderLayeringUpgradeHtml(menu, options));
  }

  rows.push(renderAddOnOptionBlocks(availableAddOns, options, menu));

  rows.push(`
    <button class="option-complete-button" type="button" data-option="optionDone">
      これ以上追加しない
    </button>
  `);

  elements.menuOptions.innerHTML = rows.length
    ? `<div class="section-head compact"><p class="eyebrow">Options</p><h2>オプション</h2></div>${rows.join("")}`
    : "";

  elements.menuOptions.querySelectorAll("[data-option]").forEach((control) => {
    control.addEventListener("click", (event) => {
      const option = control.dataset.option;

      if (option === "stayDays") {
        state.ceramicStayDays = Number(control.dataset.value);
      }
      if (option === "none") {
        clearPaidOptions();
      }
      if (option === "optionDone") {
        state.selectedSlot = null;
        render();
        scrollToStep("calendar");
        return;
      }
      if (option === "condition") {
        state.vehicleCondition = control.dataset.value;
      }
      if (option === "layer") {
        state.addLayer = event.currentTarget.checked;
      }
      if (option === "wax") {
        state.addWax = event.currentTarget.checked;
      }
      if (option === "addOn") {
        state.addOns = getNextAddOnSelection(control.dataset.value, event.currentTarget.checked);
        state.addOnChoices = getNextAddOnChoices(control.dataset.value, event.currentTarget.checked);
      }
      if (option === "addOnChoice") {
        state.addOns = { ...state.addOns, [control.dataset.addOnId]: true };
        state.addOnChoices = { ...state.addOnChoices, [control.dataset.addOnId]: control.dataset.value };
      }
      if (option === "addOnChoiceMulti") {
        state.addOns = { ...state.addOns, [control.dataset.addOnId]: true };
        state.addOnChoices = getNextMultiAddOnChoices(control.dataset.addOnId, control.dataset.value, event.currentTarget.checked);
      }

      state.selectedSlot = null;
      render();
      if (option === "none") {
        scrollToStep("calendar");
      }
    });
  });
}

function renderAddOnOptionBlocks(addOns, options, menu) {
  if (!addOns.length) return "";

  const groups = [];
  addOns.forEach((addOn) => {
    const title = addOn.groupTitle || "追加オプション";
    let group = groups.find((candidate) => candidate.title === title);
    if (!group) {
      group = { title, addOns: [] };
      groups.push(group);
    }
    group.addOns.push(addOn);
  });

  return groups
    .map(
      (group) => `
        <div class="option-block">
          <span class="option-title">${group.title}</span>
          ${group.addOns
            .map(
              (addOn) => `
                <label class="check-card">
                  <input type="checkbox" data-option="addOn" data-value="${addOn.id}" ${options.addOns[addOn.id] ? "checked" : ""} ${addOn.disabled ? "disabled" : ""} />
                  <span>${addOn.name}${renderAddOnRecommendationBadge(addOn, menu, options)}（${getAddOnOptionLabel(addOn, state.selectedVehicleId, options, menu)}）</span>
                </label>
                ${renderAddOnChoiceControls(addOn, options, menu)}
              `,
            )
            .join("")}
        </div>
      `,
    )
    .join("");
}

function renderAddOnChoiceControls(addOn, options, menu) {
  if (!addOn.choices?.length || !options.addOns[addOn.id]) return "";
  if (isLeatherShieldAddOn(addOn)) {
    return renderLeatherShieldChoiceControls(addOn, options);
  }

  if (isMultiChoiceAddOn(addOn)) {
    const selectedChoiceIds = getSelectedAddOnChoiceIds(addOn, options);

    return `
      <div class="choice-grid add-on-choice-grid add-on-seat-grid" aria-label="${addOn.name}の施工シート">
        ${addOn.choices
          .map(
            (choice) => `
              <label class="check-card add-on-choice-card">
                <input type="checkbox" data-option="addOnChoiceMulti" data-add-on-id="${addOn.id}" data-value="${choice.id}" ${selectedChoiceIds.includes(choice.id) ? "checked" : ""} />
                <span>${choice.name}<small>${formatYen(choice.price)}</small></span>
              </label>
            `,
          )
          .join("")}
      </div>
    `;
  }

  const selectedChoice = getAddOnChoice(addOn, options);

  return `
    <div class="choice-grid add-on-choice-grid" role="radiogroup" aria-label="${addOn.name}のサイズ">
      ${addOn.choices
        .map(
          (choice) => `
            <button class="choice-button ${selectedChoice.id === choice.id ? "is-selected" : ""}" type="button" data-option="addOnChoice" data-add-on-id="${addOn.id}" data-value="${choice.id}" role="radio" aria-checked="${selectedChoice.id === choice.id}">
              ${choice.name}<small>${formatYen(choice.price)}${renderOptionDurationText(menu, choice.durationMinutes, state.selectedVehicleId)}</small>
            </button>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderLeatherShieldChoiceControls(addOn, options) {
  const selectedChoiceIds = getSelectedAddOnChoiceIds(addOn, options);
  const selectedFrontSet = selectedChoiceIds.includes("frontSet");
  const frontSetChoice = addOn.choices.find((choice) => choice.id === "frontSet");
  const rear2SetChoice = addOn.choices.find((choice) => choice.id === "rear2Set");
  const individualChoices = addOn.choices.filter((choice) => !["frontSet", "rear2Set"].includes(choice.id));
  const hasIndividualSelection = individualChoices.some((choice) => selectedChoiceIds.includes(choice.id));

  return `
    <div class="leather-choice-panel" aria-label="${addOn.name}の施工シート">
      ${renderLeatherSetChoiceCard(frontSetChoice, selectedChoiceIds, "leather-choice-card leather-choice-card-featured")}
      ${
        selectedFrontSet && rear2SetChoice
          ? `
            <div class="leather-choice-plus" aria-hidden="true">＋</div>
            ${renderLeatherSetChoiceCard(rear2SetChoice, selectedChoiceIds, "leather-choice-card leather-choice-card-addon")}
          `
          : ""
      }
      ${renderLeatherSavingsHtml(addOn, options)}
      <details class="leather-individual" ${hasIndividualSelection ? "open" : ""}>
        <summary>個別に選択したい方はこちら</summary>
        <div class="choice-grid add-on-choice-grid add-on-seat-grid">
          ${individualChoices
            .map(
              (choice) => `
                <label class="check-card add-on-choice-card">
                  <input type="checkbox" data-option="addOnChoiceMulti" data-add-on-id="${addOn.id}" data-value="${choice.id}" ${selectedChoiceIds.includes(choice.id) ? "checked" : ""} />
                  <span>${choice.name}<small>${formatYen(choice.price)}</small></span>
                </label>
              `,
            )
            .join("")}
        </div>
      </details>
    </div>
  `;
}

function renderLeatherSetChoiceCard(choice, selectedChoiceIds, className) {
  if (!choice) return "";
  const checked = selectedChoiceIds.includes(choice.id);
  const savings = (choice.normalPrice || choice.price) - choice.price;

  return `
    <label class="${className}">
      <input type="checkbox" data-option="addOnChoiceMulti" data-add-on-id="leatherShield" data-value="${choice.id}" ${checked ? "checked" : ""} />
      <span class="leather-choice-copy">
        <span class="leather-choice-badges">
          ${choice.badge ? `<b>${choice.badge}</b>` : ""}
          ${choice.subBadge ? `<em>${choice.subBadge}</em>` : ""}
        </span>
        <strong>${choice.name}</strong>
        <small>${choice.description}</small>
      </span>
      <span class="leather-choice-price">
        <strong>${formatYen(choice.price)}</strong>
        <small>通常価格 ${formatYen(choice.normalPrice || choice.price)}${savings > 0 ? ` / ${formatYen(savings)}お得` : ""}</small>
      </span>
    </label>
  `;
}

function renderLeatherSavingsHtml(addOn, options) {
  const selectedIds = getSelectedAddOnChoiceIds(addOn, options);
  const normalPrice = getLeatherShieldNormalPrice(addOn, options);
  const setPrice = getAddOnPriceValue(addOn, state.selectedVehicleId, options);
  const savings = normalPrice - setPrice;
  if (!selectedIds.length || savings <= 0) return "";

  return `
    <div class="leather-saving-panel">
      <span>
        <small>選択中の合計</small>
        <strong>${formatYen(setPrice)}</strong>
      </span>
      <span>
        <small>通常価格</small>
        <strong>${formatYen(normalPrice)}</strong>
      </span>
      <span class="is-saving">
        <small>お得額</small>
        <strong>${formatYen(savings)}お得</strong>
      </span>
    </div>
  `;
}

function renderAddOnRecommendationBadge(addOn, menu, options) {
  if (!menu.newCarPrices || options.vehicleCondition !== "withinMonth") return "";
  if (addOn.id === "glassRepellent") return `<span class="recommend-badge">推奨★★★</span>`;
  if (addOn.id === "leatherShield") return `<span class="recommend-badge">推奨★★（革シートの場合）</span>`;
  return "";
}

function getNextAddOnSelection(addOnId, checked) {
  const nextAddOns = { ...state.addOns, [addOnId]: checked };
  const glassSingleAddOnIds = ["glassScaleRemoval", "glassRepellent"];
  const glassAddOnIds = [...glassSingleAddOnIds, "glassScaleRepellentSet"];

  if (addOnId === "glassScaleRepellentSet" && checked) {
    glassSingleAddOnIds.forEach((id) => {
      nextAddOns[id] = false;
    });
  }

  if (glassSingleAddOnIds.includes(addOnId) && checked) {
    nextAddOns.glassScaleRepellentSet = false;
  }

  if (addOnId === "pureTiaraWash" && !checked) {
    glassAddOnIds.forEach((id) => {
      nextAddOns[id] = false;
    });
  }

  return nextAddOns;
}

function getNextAddOnChoices(addOnId, checked) {
  const nextChoices = { ...state.addOnChoices };
  const addOn = addOnOptions.find((item) => item.id === addOnId);

  if (checked && addOn?.choices?.length && !nextChoices[addOnId]) {
    nextChoices[addOnId] = isMultiChoiceAddOn(addOn) ? getDefaultAddOnChoiceIds(addOn) : addOn.defaultChoiceId || addOn.choices[0].id;
  }

  if (!checked) {
    delete nextChoices[addOnId];
  }

  return nextChoices;
}

function getNextMultiAddOnChoices(addOnId, choiceId, checked) {
  const addOn = addOnOptions.find((item) => item.id === addOnId);
  const selected = getSelectedAddOnChoiceIds(addOn, { addOnChoices: state.addOnChoices });
  const choice = addOn?.choices?.find((item) => item.id === choiceId);
  let nextSelected = selected;

  if (checked) {
    const keepSelected = choice?.exclusiveGroup
      ? selected.filter((id) => {
          const selectedChoice = addOn.choices.find((item) => item.id === id);
          return selectedChoice?.exclusiveGroup !== choice.exclusiveGroup;
        })
      : selected;
    nextSelected = [...new Set([...keepSelected, choiceId])].filter((id) => !choice?.conflictsWith?.includes(id));
  } else {
    nextSelected = selected.filter((id) => id !== choiceId);
  }

  nextSelected = nextSelected.filter((id) => {
    const selectedChoice = addOn?.choices?.find((item) => item.id === id);
    return !selectedChoice?.requiresChoiceId || nextSelected.includes(selectedChoice.requiresChoiceId);
  });

  if (!nextSelected.length) {
    nextSelected = getDefaultAddOnChoiceIds(addOn);
  }

  return { ...state.addOnChoices, [addOnId]: nextSelected };
}

function renderLoanerOptions() {
  if (!hasSelectedMenu() || !hasSelectedVehicle()) {
    elements.loanerOptions.innerHTML = "";
    return;
  }
  elements.loanerOptions.innerHTML = `
    <div class="section-head compact"><p class="eyebrow">Loaner</p><h2>代車</h2></div>
    <div class="option-block">
      <span class="option-title">代車のご利用</span>
      <div class="choice-grid" role="radiogroup" aria-label="代車のご利用">
        ${[
          { value: "false", label: "不要" },
          { value: "true", label: "必要" },
        ]
          .map(
            (item) => {
              const selected = String(Boolean(state.loanerRequired)) === item.value;
              return `
                <button class="choice-button ${selected ? "is-selected" : ""}" type="button" data-loaner-required="${item.value}" role="radio" aria-checked="${selected}">
                  ${item.label}
                </button>
              `;
            },
          )
          .join("")}
      </div>
      <small class="loaner-note">代車は2台までです。必要を選ぶと、代車の空きがある日時だけ予約できます。</small>
    </div>
  `;

  elements.loanerOptions.querySelectorAll("[data-loaner-required]").forEach((button) => {
    button.addEventListener("click", () => {
      state.loanerRequired = button.dataset.loanerRequired === "true";
      state.selectedSlot = null;
      render();
      scrollToStep("calendar");
    });
  });
}

function renderWeek() {
  elements.weekGrid.innerHTML = "";
  elements.weekGrid.className = state.calendarView === "month" ? "week-grid month-grid" : "week-grid";
  elements.currentWeekButton.classList.toggle("is-selected", state.calendarView === "week");
  elements.monthViewButton.classList.toggle("is-selected", state.calendarView === "month");
  elements.prevWeek.setAttribute("aria-label", state.calendarView === "month" ? "前の月" : "前の週");
  elements.prevWeek.setAttribute("title", state.calendarView === "month" ? "前の月" : "前の週");
  elements.nextWeek.setAttribute("aria-label", state.calendarView === "month" ? "次の月" : "次の週");
  elements.nextWeek.setAttribute("title", state.calendarView === "month" ? "次の月" : "次の週");

  if (state.calendarView === "month") {
    renderMonthCalendar();
    return;
  }

  const days = Array.from({ length: 7 }, (_, index) => addDays(state.weekStart, index));
  const first = days[0];
  const last = days[6];
  elements.weekTitle.textContent = `${first.getFullYear()}年${first.getMonth() + 1}月 ${first.getDate()}日 - ${last.getMonth() + 1}月${last.getDate()}日`;

  days.forEach((day) => {
    const date = toISODate(day);
    const hours = businessHours[day.getDay()];
    const availableSlots = hasSelectedMenu() && hasSelectedVehicle() ? getAvailableSlots(date) : [];
    const status = hasSelectedMenu() && hasSelectedVehicle()
      ? getDayStatus(date, hours, availableSlots.length)
      : hours && !isPastDate(date)
        ? { label: "選択後表示", kind: "open" }
        : getDayStatus(date, hours, availableSlots.length);
    const button = document.createElement("button");

    button.type = "button";
    button.className = `day-card ${status.kind} ${date === state.selectedDate ? "is-selected" : ""}`;
    button.disabled = isPastDate(date) || !hours || !isStoreDateBookable(date) || !hasSelectedMenu() || !hasSelectedVehicle() || availableSlots.length === 0;
    button.setAttribute("role", "listitem");
    button.setAttribute("aria-label", `${date} ${status.label}`);
    button.innerHTML = `
      <span class="day-label">
        <span class="weekday">${weekdays[day.getDay()]}</span>
        <span class="status-dot ${status.kind}" aria-hidden="true"></span>
      </span>
      <span class="date-number">${day.getDate()}</span>
      <span class="day-status">${status.label}</span>
      <span class="day-hours">${hours ? hours.label : "定休日"}</span>
    `;

    button.addEventListener("click", () => {
      state.selectedDate = date;
      state.selectedSlot = null;
      render();
      scrollToStep("slots");
    });

    elements.weekGrid.append(button);
  });
}

function renderMonthCalendar() {
  const start = new Date();
  const end = addDays(start, 30);
  const days = Array.from({ length: 31 }, (_, index) => addDays(start, index));

  elements.weekTitle.textContent = `${formatShortDate(toISODate(start))} - ${formatShortDate(toISODate(end))}`;

  days.forEach((day) => {
    const date = toISODate(day);
    const hours = businessHours[day.getDay()];
    const availableSlots = hasSelectedMenu() && hasSelectedVehicle() ? getAvailableSlots(date) : [];
    const status = hasSelectedMenu() && hasSelectedVehicle()
      ? getDayStatus(date, hours, availableSlots.length)
      : hours && !isPastDate(date)
        ? { label: "選択後表示", kind: "open" }
        : getDayStatus(date, hours, availableSlots.length);
    const button = document.createElement("button");

    button.type = "button";
    button.className = `day-card month-day ${status.kind} ${date === state.selectedDate ? "is-selected" : ""}`;
    button.disabled = isPastDate(date) || !hours || !isStoreDateBookable(date) || !hasSelectedMenu() || !hasSelectedVehicle() || availableSlots.length === 0;
    button.setAttribute("role", "listitem");
    button.setAttribute("aria-label", `${date} ${status.label}`);
    button.innerHTML = `
      <span class="day-label">
        <span class="weekday">${weekdays[day.getDay()]}</span>
        <span class="status-dot ${status.kind}" aria-hidden="true"></span>
      </span>
      <span class="date-number">${day.getDate()}</span>
      <span class="day-status">${status.label}</span>
    `;

    button.addEventListener("click", () => {
      state.selectedDate = date;
      state.weekStart = startOfWeek(day);
      state.selectedSlot = null;
      render();
      scrollToStep("slots");
    });

    elements.weekGrid.append(button);
  });
}

function renderAvailabilityOverview() {
  if (!elements.availabilityOverview) return;

  const isReady = hasSelectedMenu() && hasSelectedVehicle();
  const menu = getSelectedMenu();
  const vehicle = getSelectedVehicle();
  elements.availabilityOverview.innerHTML = `
    <div class="availability-head">
      <div>
        <p class="eyebrow">Open Slots</p>
        <h3>本日から1ヶ月の予約状況</h3>
      </div>
      <span>${isReady ? `${escapeHtml(menu.name)} / ${escapeHtml(vehicle.name)}` : "車種・メニュー選択後に表示"}</span>
    </div>
    <div class="availability-month-grid">${renderAvailabilityMonthHtml(isReady)}</div>
    ${isReady ? "" : `<div class="availability-placeholder">車両サイズとメニューを選ぶと、各日の「空きあり」「残りわずか」「予約不可」と時間枠が表示されます。</div>`}
  `;

  elements.availabilityOverview.querySelectorAll("[data-availability-slot]").forEach((button) => {
    button.addEventListener("click", () => {
      const date = button.dataset.availabilityDate;
      const slot = button.dataset.availabilitySlot;
      state.selectedDate = date;
      state.selectedSlot = slot;
      state.weekStart = startOfWeek(parseISODate(date));
      state.monthCursor = startOfMonth(parseISODate(date));
      render();
      scrollToStep("customer");
    });
  });
}

function renderAvailabilityMonthHtml(isReady = hasSelectedMenu() && hasSelectedVehicle()) {
  const today = new Date();
  const days = Array.from({ length: 31 }, (_, index) => addDays(today, index));

  return days.map((day) => renderAvailabilityDayHtml(day, isReady)).join("");
}

function renderAvailabilityDayHtml(day, isReady = hasSelectedMenu() && hasSelectedVehicle()) {
  const date = toISODate(day);
  const hours = businessHours[day.getDay()];
  const slots = hours && isReady ? getAvailableSlots(date) : [];
  const status = isReady
    ? getDayStatus(date, hours, slots.length)
    : hours && !isPastDate(date) && isStoreDateBookable(date)
      ? { label: "選択後に表示", kind: "pending" }
      : getDayStatus(date, hours, slots.length);
  const visibleSlots = slots.slice(0, 4);
  const extraCount = Math.max(slots.length - visibleSlots.length, 0);

  return `
    <section class="availability-day ${status.kind}" aria-label="${date} ${status.label}">
      <div class="availability-date">
        <span>${day.getMonth() + 1}/${day.getDate()}(${weekdays[day.getDay()]})</span>
        <strong>${slots.length ? `${status.label} ${slots.length}枠` : status.label}</strong>
      </div>
      ${
        slots.length
          ? `
            <div class="availability-times">
              ${visibleSlots
                .map(
                  (slot) => `
                    <button type="button" data-availability-date="${date}" data-availability-slot="${slot}">
                      <b>${slot}</b><small>空きあり</small>
                    </button>
                  `,
                )
                .join("")}
              ${extraCount ? `<span class="availability-more">他${extraCount}枠</span>` : ""}
            </div>
          `
          : `<p>${isReady ? (hours ? "別の日をお選びください" : "定休日") : status.label}</p>`
      }
    </section>
  `;
}

function renderSlots() {
  elements.slotGrid.innerHTML = "";
  const date = parseISODate(state.selectedDate);
  const hours = businessHours[date.getDay()];
  const menu = getSelectedMenu();
  const vehicle = getSelectedVehicle();
  const isReadyForCalendar = hasSelectedMenu() && hasSelectedVehicle();
  const slots = hours && isReadyForCalendar ? getAvailableSlots(state.selectedDate) : [];
  const options = getSelectedOptions(menu);
  const serviceLabel = isReadyForCalendar ? getMenuServiceLabel(menu, options) : "メニュー・車両サイズ未選択";

  elements.selectedDateTitle.textContent = `${date.getMonth() + 1}月${date.getDate()}日(${weekdays[date.getDay()]})`;
  elements.hoursPill.textContent = hours ? `${hours.label} / ${serviceLabel}` : "定休日";

  if (!hasSelectedVehicle()) {
    elements.slotGrid.innerHTML = `<div class="empty-state">先に車種検索、または車両サイズを選択してください。</div>`;
    return;
  }

  if (!hasSelectedMenu()) {
    elements.slotGrid.innerHTML = `<div class="empty-state">車両サイズを選んだあと、洗車メニューを選択してください。</div>`;
    return;
  }

  if (!hours) {
    elements.slotGrid.innerHTML = `<div class="empty-state">この日は定休日です。</div>`;
    return;
  }

  if (slots.length === 0) {
    elements.slotGrid.innerHTML = `<div class="empty-state">${menu.name}（${vehicle.name}）で予約可能な時間がありません。別の日をお選びください。</div>`;
    return;
  }

  slots.forEach((slot) => {
    const interval = isOvernightService(menu) ? getServiceInterval(state.selectedDate, slot, menu, options, vehicle.id) : null;
    const slotNote = interval ? `引き渡し ${formatShortDate(interval.endDate)} ${interval.end}` : "開始";
    const button = document.createElement("button");
    button.type = "button";
    button.className = `slot-button ${state.selectedSlot === slot ? "is-selected" : ""}`;
    button.innerHTML = `<strong>${slot}</strong><small>空きあり / ${slotNote}</small>`;
    button.addEventListener("click", () => {
      state.selectedSlot = slot;
      renderSummary();
      renderFloatingTotal();
      renderSlots();
      scrollToStep("customer");
    });
    elements.slotGrid.append(button);
  });
}

function renderSummary() {
  const menu = getSelectedMenu();
  const vehicle = getSelectedVehicle();
  const options = getSelectedOptions(menu);
  const date = parseISODate(state.selectedDate);
  const canCalculate = hasSelectedMenu() && hasSelectedVehicle();
  const interval = state.selectedSlot && canCalculate ? getServiceInterval(state.selectedDate, state.selectedSlot, menu, options, vehicle.id) : null;

  elements.summaryBox.innerHTML = `
    ${state.editingBookingId ? `<div class="summary-line"><span>操作</span><strong>予約変更中</strong></div>` : ""}
    <div class="summary-line"><span>店舗</span><strong>${escapeHtml(currentStore.name)}</strong></div>
    <div class="summary-line"><span>メニュー</span><strong>${menu ? getDisplayMenuName(menu, options) : "未選択"}</strong></div>
    <div class="summary-line"><span>車両サイズ</span><strong>${vehicle ? vehicle.name : "未選択"}</strong></div>
    <div class="summary-line"><span>日付</span><strong>${date.getMonth() + 1}月${date.getDate()}日(${weekdays[date.getDay()]})</strong></div>
    <div class="summary-line"><span>時間</span><strong>${interval ? formatInterval(interval) : "未選択"}</strong></div>
    <div class="summary-line"><span>代車</span><strong>${getLoanerLabel(state.loanerRequired)}</strong></div>
    ${
      interval && isOvernightService(menu)
        ? `<div class="summary-line"><span>引き渡し目安</span><strong>${formatShortDate(interval.endDate)} ${interval.end}</strong></div>`
        : ""
    }
    <div class="summary-line"><span>条件</span><strong>${canCalculate ? formatOptions(options, menu) : "未選択"}</strong></div>
    ${canCalculate ? renderPriceBreakdownHtml(menu, vehicle.id, options) : renderPricePendingHtml()}
  `;

  elements.submitButton.disabled = !state.selectedSlot || !canCalculate;
  elements.submitButton.textContent = state.editingBookingId ? "この内容で予約を変更する" : "この内容で予約する";
}

function renderFormFields() {
  const menu = getSelectedMenu();
  const needsCertificate = hasSelectedMenu() && requiresCertificateInfo(menu);

  elements.certificateFields.hidden = !needsCertificate;
  elements.washOptionalFields.hidden = needsCertificate;

  elements.bookingForm.postalCode.required = needsCertificate;
  elements.bookingForm.address.required = needsCertificate;
  elements.bookingForm.coatingBodyColor.required = needsCertificate;
  elements.bookingForm.washBodyColor.required = false;
}

function renderFloatingTotal() {
  const menu = getSelectedMenu();
  const vehicle = getSelectedVehicle();
  if (!hasSelectedMenu() || !hasSelectedVehicle()) {
    elements.floatingTotal.innerHTML = `
      <span>
        <small>予約ステップ</small>
        <strong>${hasSelectedVehicle() ? "洗車メニューを選択してください" : "車種検索・車両サイズ選択から始めてください"}</strong>
      </span>
      <span class="floating-total-price">料金未表示</span>
    `;
    return;
  }
  const options = getSelectedOptions(menu);
  const breakdown = getPriceBreakdown(menu, vehicle.id, options);

  elements.floatingTotal.innerHTML = `
    <span>
      <small>現在のご予約金額</small>
      <strong>${menu.name}</strong>
    </span>
    <span class="floating-total-price">${formatYen(breakdown.total)}<small>税込</small></span>
  `;
}

function renderReservations() {
  const all = [...getDemoBookings(), ...state.bookings]
    .filter((booking) => booking.admin?.status !== "canceled")
    .filter((booking) => booking.endDate >= toISODate(new Date()))
    .sort((a, b) => `${a.startDate} ${a.start}`.localeCompare(`${b.startDate} ${b.start}`))
    .slice(0, 8);

  elements.reservationList.innerHTML = "";

  if (all.length === 0) {
    elements.reservationList.innerHTML = `<div class="empty-state">予約はまだありません。</div>`;
    return;
  }

  all.forEach((booking) => {
    const item = document.createElement("div");
    item.className = "reservation-item";
    item.innerHTML = `
      <span class="reservation-main">
        <strong>${formatBookingPeriod(booking)}</strong>
        <span>${booking.menuName} / ${booking.vehicleName}${isBookingLoanerRequired(booking) ? " / 代車あり" : ""}</span>
      </span>
      ${
        booking.source === "user"
          ? `<span class="reservation-actions">
              <button class="reservation-edit" type="button" data-booking-id="${booking.id}">変更</button>
              <button class="reservation-remove" type="button" aria-label="予約を取り消す" title="予約を取り消す" data-booking-id="${booking.id}">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </span>`
          : ""
      }
    `;
    const editButton = item.querySelector(".reservation-edit");
    if (editButton) {
      editButton.addEventListener("click", () => {
        startEditingBooking(booking.id);
      });
    }
    const removeButton = item.querySelector(".reservation-remove");
    if (removeButton) {
      removeButton.addEventListener("click", () => {
        cancelCustomerBooking(booking.id);
      });
    }
    elements.reservationList.append(item);
  });
}

function startEditingBooking(bookingId) {
  const booking = state.bookings.find((savedBooking) => savedBooking.id === bookingId);
  if (!booking) return;

  const options = booking.options || {};
  state.editingBookingId = booking.id;
  state.selectedMenuId = booking.menuId || state.selectedMenuId;
  state.selectedVehicleId = booking.vehicleId || state.selectedVehicleId;
  state.selectedDate = booking.startDate;
  state.selectedSlot = booking.start;
  state.vehicleCondition = options.vehicleCondition || "used";
  state.addLayer = Boolean(options.addLayer);
  state.addWax = Boolean(options.addWax);
  state.addOns = { ...(options.addOns || {}) };
  state.addOnChoices = { ...(options.addOnChoices || {}) };
  state.loanerRequired = isBookingLoanerRequired(booking);
  state.vehicleGuideQuery = booking.customer?.carModel || "";
  state.weekStart = startOfWeek(parseISODate(booking.startDate));
  state.monthCursor = startOfMonth(parseISODate(booking.startDate));
  state.calendarView = "week";

  render();
  fillBookingFormFromBooking(booking);
  showToast("予約変更モードです。内容を変更して保存してください。");
  scrollToStep("calendar");
}

function fillBookingFormFromBooking(booking) {
  const customer = booking.customer || {};
  elements.bookingForm.customerName.value = customer.name || "";
  elements.bookingForm.customerPhone.value = customer.phone || "";
  elements.bookingForm.carModel.value = customer.carModel || "";
  if (elements.bookingForm.vehicleNumber) elements.bookingForm.vehicleNumber.value = customer.vehicleNumber || "";
  elements.bookingForm.visitReason.value = customer.visitReason || "";
  elements.bookingForm.postalCode.value = customer.postalCode || "";
  elements.bookingForm.address.value = customer.address || "";
  elements.bookingForm.coatingBodyColor.value = customer.bodyColor || "";
  elements.bookingForm.washBodyColor.value = customer.bodyColor || "";
  elements.bookingForm.dirtConcern.value = customer.dirtConcern || "";
  elements.bookingForm.request.value = customer.request || "";
  if (elements.bookingForm.additionalConsultation) elements.bookingForm.additionalConsultation.value = customer.additionalConsultation || "";
  if (elements.bookingForm.arrivalNote) elements.bookingForm.arrivalNote.value = customer.arrivalNote || "";
}

function cancelCustomerBooking(bookingId) {
  const bookingIndex = state.bookings.findIndex((savedBooking) => savedBooking.id === bookingId);
  if (bookingIndex < 0) return;

  const previousBooking = state.bookings[bookingIndex];
  const admin = previousBooking.admin || {};
  const canceledBooking = {
    ...previousBooking,
    admin: {
      ...admin,
      status: "canceled",
      previousStatus: admin.status || "new",
      canceledAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  };

  state.bookings[bookingIndex] = appendChangeHistory(canceledBooking, "customer", previousBooking);
  writeBookings(state.bookings);
  queueBookingChangeNotifications(state.bookings[bookingIndex], "customer", previousBooking, "予約がキャンセルされました");
  if (state.editingBookingId === bookingId) state.editingBookingId = null;
  state.selectedSlot = null;
  render();
  showToast("予約をキャンセルしました。お客様と管理者へ案内予定を作成しました。");
}

function syncLegacySelectionState() {
  if (state.selectedMenu && state.selectedMenu !== state.selectedMenuId) {
    state.selectedMenuId = state.selectedMenu;
  }
  if (state.selectedVehicleSize && state.selectedVehicleSize !== state.selectedVehicleId) {
    state.selectedVehicleId = state.selectedVehicleSize;
  }
}

function syncDerivedReservationState() {
  const menu = getSelectedMenu();
  const vehicle = getSelectedVehicle();
  state.selectedMenu = state.selectedMenuId || null;
  state.selectedVehicleSize = state.selectedVehicleId || null;
  state.selectedOptions = menu ? getSelectedOptions(menu) : {};
  state.calculatedPrice = menu && vehicle ? getPrice(menu, vehicle.id, state.selectedOptions) : null;
}

function hasSelectedMenu() {
  return Boolean(state.selectedMenuId && getSelectedMenu());
}

function hasSelectedVehicle() {
  return Boolean(state.selectedVehicleId && getSelectedVehicle());
}

function normalizeStateForMenu() {
  syncLegacySelectionState();
  const menu = getSelectedMenu();
  if (!menu) {
    clearPaidOptions();
    return;
  }
  if (!vehicleConditions.some((condition) => condition.id === state.vehicleCondition)) {
    state.vehicleCondition = "used";
  }
  if (!menu.oneLayerPrices) {
    state.addLayer = false;
  }
  if (!menu.waxPrices) {
    state.addWax = false;
  }
  if (!isOvernightService(menu)) {
    state.ceramicStayDays = 2;
  }
}

function hasNoPaidOptions(menu, options = getSelectedOptions(menu)) {
  const hasSelectedAddOns = getAvailableAddOns(menu).some((addOn) => options.addOns?.[addOn.id]);
  return !options.addLayer && !options.addWax && !hasSelectedAddOns;
}

function clearPaidOptions() {
  state.addLayer = false;
  state.addWax = false;
  state.addOns = {};
  state.addOnChoices = {};
}

function requiresCertificateInfo(menu) {
  return Boolean(menu?.newCarPrices);
}

function getAvailableAddOns(menu) {
  if (menu.id === "interior-cleaning") {
    const interiorAddOnIds = ["pureTiaraWash", "interiorDeodorizingMist", "leatherShield"];
    if (state.addOns.pureTiaraWash) {
      interiorAddOnIds.splice(1, 0, "glassScaleRemoval", "glassRepellent", "glassScaleRepellentSet");
    }
    return interiorAddOnIds.map((id) => addOnOptions.find((addOn) => addOn.id === id)).filter(Boolean);
  }

  const interiorOnlyAddOnIds = ["pureTiaraWash", "interiorDeodorizingMist"];
  return addOnOptions.filter((addOn) => !interiorOnlyAddOnIds.includes(addOn.id));
}

function ensureSelectedDateOpen() {
  if (!hasSelectedMenu() || !hasSelectedVehicle()) return;

  if (state.calendarView === "month") {
    const selected = parseISODate(state.selectedDate);
    if (
      selected.getFullYear() !== state.monthCursor.getFullYear() ||
      selected.getMonth() !== state.monthCursor.getMonth()
    ) {
      state.selectedDate = toISODate(findBestDateInMonth(state.monthCursor));
    }
    return;
  }

  const selected = parseISODate(state.selectedDate);
  const weekEnd = addDays(state.weekStart, 6);

  if (selected < state.weekStart || selected > weekEnd) {
    state.selectedDate = toISODate(findBestDateInWeek(state.weekStart));
  }
}

function selectWeek(weekStart) {
  state.weekStart = weekStart;
  state.selectedDate = toISODate(findBestDateInWeek(weekStart));
  state.selectedSlot = null;
  render();
}

function selectMonth(monthDate) {
  state.monthCursor = startOfMonth(monthDate);
  state.selectedDate = toISODate(findBestDateInMonth(state.monthCursor));
  state.weekStart = startOfWeek(parseISODate(state.selectedDate));
  state.selectedSlot = null;
  render();
}

function getSelectedMenu() {
  return menus.find((menu) => menu.id === state.selectedMenuId) || null;
}

function getSelectedVehicle() {
  return vehicleSizes.find((size) => size.id === state.selectedVehicleId) || null;
}

function getVehicleSizeName(sizeId) {
  return vehicleSizes.find((size) => size.id === sizeId)?.name || "車両サイズ未選択";
}

function getSelectedOptions(menu = getSelectedMenu()) {
  if (!menu) return { vehicleCondition: null, addLayer: false, addWax: false, addOns: {}, addOnChoices: {}, stayDays: null };
  return {
    vehicleCondition: menu.newCarPrices ? state.vehicleCondition : null,
    addLayer: Boolean(menu.oneLayerPrices && state.addLayer),
    addWax: Boolean(menu.waxPrices && state.addWax),
    addOns: { ...state.addOns },
    addOnChoices: { ...state.addOnChoices },
    stayDays: isOvernightService(menu)
      ? menu.stayChoices?.length
        ? state.ceramicStayDays || menu.defaultStayDays
        : menu.defaultStayDays
      : null,
  };
}

function getPrice(menu, vehicleId, options = getSelectedOptions(menu)) {
  return getPriceBreakdown(menu, vehicleId, options).total;
}

function getPriceBreakdown(menu, vehicleId, options = getSelectedOptions(menu)) {
  if (!menu || !vehicleId) {
    return { items: [], total: null };
  }

  const basePrices = shouldUseNewCarPrice(menu, options) ? menu.newCarPrices : menu.prices;
  const condition = menu.newCarPrices ? ` / ${getVehicleCondition(options.vehicleCondition).name}` : "";
  const items = [
    {
      name: menu.name,
      detail: `${getVehicleSizeName(vehicleId)}${condition}`,
      price: basePrices[vehicleId],
    },
  ];

  if (options.addWax && menu.waxPrices) {
    items.push({ name: "高級ワックス仕上げ", detail: "洗車オプション", price: menu.waxPrices[vehicleId] });
  }

  if (options.addLayer && menu.oneLayerPrices) {
    items.push({ name: getLayerOptionLabel(menu), detail: "コーティングオプション", price: menu.oneLayerPrices[vehicleId] });
  }

  getAvailableAddOns(menu).forEach((addOn) => {
    if (options.addOns?.[addOn.id] && hasAddOnPrice(addOn)) {
      items.push({ name: addOn.name, detail: getAddOnDetail(addOn, options), price: getAddOnPriceValue(addOn, vehicleId, options) });
    }
  });

  return {
    items,
    total: items.reduce((sum, item) => sum + item.price, 0),
  };
}

function renderMenuPriceMarkup(menu, vehicleId, options = getSelectedOptions(menu), isSelectedMenu = false) {
  if (!vehicleId || !isSelectedMenu) {
    return `<span class="menu-price-pending">${vehicleId ? "メニューを選択すると料金が表示されます" : "車両サイズを選択すると料金が表示されます"}</span>`;
  }

  const selectedPrice = getBaseMenuPrice(menu, vehicleId, options);

  if (menu.newCarPrices) {
    return `
      <span class="menu-price-table">
        <strong><small>${getVehicleCondition(options.vehicleCondition).name}</small>${formatYen(selectedPrice)}</strong>
      </span>
    `;
  }

  return `<span class="menu-price">${formatYen(selectedPrice)}</span>`;
}

function getBaseMenuPrice(menu, vehicleId, options = getSelectedOptions(menu)) {
  if (!menu || !vehicleId) return null;
  const basePrices = shouldUseNewCarPrice(menu, options) ? menu.newCarPrices : menu.prices;
  return basePrices[vehicleId];
}

function renderPriceBreakdownHtml(menu, vehicleId, options = getSelectedOptions(menu)) {
  const breakdown = getPriceBreakdown(menu, vehicleId, options);
  if (breakdown.total == null) return renderPricePendingHtml();

  return `
    <div class="price-breakdown">
      <span class="price-breakdown-title">現在のご予約金額</span>
      ${breakdown.items
        .map(
          (item) => `
            <div class="price-row">
              <span>
                <strong>${item.name}</strong>
                <small>${item.detail}</small>
              </span>
              <b>${formatYen(item.price)}</b>
            </div>
          `,
        )
        .join("")}
      <div class="price-total">
        <span>合計</span>
        <strong>${formatYen(breakdown.total)}<small>税込</small></strong>
      </div>
    </div>
  `;
}

function renderPricePendingHtml() {
  return `
    <div class="price-breakdown price-breakdown-pending">
      <span class="price-breakdown-title">現在のご予約金額</span>
      <div class="price-pending-message">車両サイズとメニューを選択すると料金が表示されます。</div>
    </div>
  `;
}

function getOptionPrice(menu, vehicleId, options = getSelectedOptions(menu)) {
  const layerPrice = options.addLayer && menu.oneLayerPrices ? menu.oneLayerPrices[vehicleId] : 0;
  const waxPrice = options.addWax && menu.waxPrices ? menu.waxPrices[vehicleId] : 0;
  return layerPrice + waxPrice + getAddOnPrice(vehicleId, options, menu);
}

function getOptionDuration(menu, vehicleId, options = getSelectedOptions(menu)) {
  if (!shouldApplyOptionDuration(menu)) return 0;

  const layerDuration = options.addLayer && menu.oneLayerDurationMinutes ? getDurationValue(menu.oneLayerDurationMinutes, vehicleId) : 0;
  const waxDuration = options.addWax && menu.waxDurationMinutes ? getDurationValue(menu.waxDurationMinutes, vehicleId) : 0;
  const addOnDuration = getAvailableAddOns(menu).reduce((total, addOn) => {
    if (!options.addOns?.[addOn.id]) return total;
    return total + getAddOnDurationValue(addOn, vehicleId, options);
  }, 0);

  return layerDuration + waxDuration + addOnDuration;
}

function shouldApplyOptionDuration(menu) {
  return ["pure-wash", "polish-reset-wash", "interior-cleaning"].includes(menu.id);
}

function renderOptionDurationText(menu, duration, vehicleId = state.selectedVehicleId) {
  if (!menu || !vehicleId || !shouldApplyOptionDuration(menu)) return "";
  const minutes = getDurationValue(duration, vehicleId);
  return minutes ? ` / ${formatDurationLabel(minutes)}` : "";
}

function getDurationValue(duration, vehicleId) {
  if (!duration) return 0;
  if (typeof duration === "number") return duration;
  return duration[vehicleId] || 0;
}

function formatDurationLabel(minutes) {
  if (!minutes) return "+0分";
  if (minutes < 60) return `+${minutes}分`;

  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest ? `+${hours}時間${rest}分` : `+${hours}時間`;
}

function shouldUseNewCarPrice(menu, options = getSelectedOptions(menu)) {
  if (!menu.newCarPrices) return false;
  return getVehicleCondition(options.vehicleCondition).priceType === "newCar";
}

function getVehicleCondition(conditionId) {
  return vehicleConditions.find((condition) => condition.id === conditionId) || vehicleConditions[0];
}

function getAddOnPrice(vehicleId, options = getSelectedOptions(), menu = getSelectedMenu()) {
  if (!menu || !vehicleId) return 0;
  return getAvailableAddOns(menu).reduce((total, addOn) => {
    return options.addOns?.[addOn.id] && hasAddOnPrice(addOn) ? total + getAddOnPriceValue(addOn, vehicleId, options) : total;
  }, 0);
}

function hasAddOnPrice(addOn) {
  return Boolean(addOn.prices || addOn.choices?.length);
}

function isLeatherShieldAddOn(addOn) {
  return addOn?.choiceMode === "leatherShield";
}

function isMultiChoiceAddOn(addOn) {
  return addOn?.choiceMode === "multi" || isLeatherShieldAddOn(addOn);
}

function getDefaultAddOnChoiceIds(addOn) {
  if (!addOn?.choices?.length) return [];
  return addOn.defaultChoiceIds?.length ? [...addOn.defaultChoiceIds] : [addOn.choices[0].id];
}

function getSelectedAddOnChoiceIds(addOn, options = getSelectedOptions()) {
  if (!isMultiChoiceAddOn(addOn)) return [];
  const selected = options.addOnChoices?.[addOn.id];
  const selectedIds = Array.isArray(selected) ? selected : selected ? [selected] : getDefaultAddOnChoiceIds(addOn);
  return selectedIds.filter((id) => addOn.choices.some((choice) => choice.id === id));
}

function getAddOnChoice(addOn, options = getSelectedOptions()) {
  if (!addOn.choices?.length || isMultiChoiceAddOn(addOn)) return null;
  const choiceId = options.addOnChoices?.[addOn.id] || addOn.defaultChoiceId || addOn.choices[0].id;
  return addOn.choices.find((choice) => choice.id === choiceId) || addOn.choices[0];
}

function getAddOnPriceValue(addOn, vehicleId, options = getSelectedOptions()) {
  if (isMultiChoiceAddOn(addOn)) {
    const selectedIds = getSelectedAddOnChoiceIds(addOn, options);
    return addOn.choices.reduce((total, choice) => (selectedIds.includes(choice.id) ? total + choice.price : total), 0);
  }

  const choice = getAddOnChoice(addOn, options);
  if (choice) return choice.price;
  return addOn.prices && vehicleId ? addOn.prices[vehicleId] : 0;
}

function getAddOnDurationValue(addOn, vehicleId, options = getSelectedOptions()) {
  if (isMultiChoiceAddOn(addOn)) return getDurationValue(addOn.durationMinutes, vehicleId);
  const choice = getAddOnChoice(addOn, options);
  if (choice) return choice.durationMinutes;
  return getDurationValue(addOn.durationMinutes, vehicleId);
}

function getAddOnDetail(addOn, options = getSelectedOptions()) {
  if (isMultiChoiceAddOn(addOn)) {
    const selectedIds = getSelectedAddOnChoiceIds(addOn, options);
    const selectedNames = addOn.choices.filter((choice) => selectedIds.includes(choice.id)).map((choice) => choice.name);
    const savings = isLeatherShieldAddOn(addOn) ? getLeatherShieldSavings(addOn, options) : 0;
    const savingsLabel = savings > 0 ? ` / ${formatYen(savings)}お得` : "";
    return selectedNames.length ? `追加オプション / ${selectedNames.join("・")}${savingsLabel}` : "追加オプション";
  }

  const choice = getAddOnChoice(addOn, options);
  return choice ? `追加オプション / ${choice.name}` : "追加オプション";
}

function getLeatherShieldNormalPrice(addOn, options = getSelectedOptions()) {
  if (!isLeatherShieldAddOn(addOn)) return 0;
  const selectedIds = getSelectedAddOnChoiceIds(addOn, options);
  return addOn.choices.reduce((total, choice) => {
    if (!selectedIds.includes(choice.id)) return total;
    return total + (choice.normalPrice || choice.price);
  }, 0);
}

function getLeatherShieldSavings(addOn, options = getSelectedOptions()) {
  return getLeatherShieldNormalPrice(addOn, options) - getAddOnPriceValue(addOn, state.selectedVehicleId, options);
}

function getAddOnPriceLabel(addOn, vehicleId, options = getSelectedOptions()) {
  if (hasAddOnPrice(addOn)) return formatYen(getAddOnPriceValue(addOn, vehicleId, options));
  return addOn.priceLabel;
}

function getAddOnOptionLabel(addOn, vehicleId, options = getSelectedOptions(), menu = getSelectedMenu()) {
  if (!vehicleId) return "車両サイズを選択すると料金が表示されます";
  const durationLabel = shouldApplyOptionDuration(menu) ? renderOptionDurationText(menu, getAddOnDurationValue(addOn, vehicleId, options), vehicleId) : "";
  return `${getAddOnPriceLabel(addOn, vehicleId, options)}${durationLabel}`;
}

function getDisplayMenuName(menu, options = getSelectedOptions(menu)) {
  return menu.name;
}

function getMenuServiceLabel(menu, options = getSelectedOptions(menu)) {
  if (isOvernightService(menu)) {
    return `${getOvernightMenuStayLabel(menu, options)} / ${getMenuDurabilityLabel(menu)}`;
  }
  return menu.serviceLabel;
}

function getMenuDurabilityLabel(menu) {
  return menu.durabilityLabel || menu.serviceLabel.split("/").at(-1).trim();
}

function getOvernightMenuStayLabel(menu, options = getSelectedOptions(menu)) {
  if (menu.id === "q2-syncro") {
    return options.vehicleCondition === "withinMonth" ? "新車1泊2日目安" : "経年車2泊3日";
  }

  return formatStayDays(getOvernightRule(menu, options).minStayDays);
}

function formatStayDays(stayDays) {
  return stayDays === 3 ? "2泊3日" : "1泊2日";
}

function formatOptions(options, menu = getSelectedMenu()) {
  const labels = [];
  if (options.vehicleCondition) labels.push(getVehicleCondition(options.vehicleCondition).name);
  if (isOvernightService(menu)) labels.push(getOvernightMenuStayLabel(menu, options));
  if (options.addLayer) labels.push(getLayerOptionLabel(menu));
  if (options.addWax) labels.push("高級ワックス仕上げ");
  getAvailableAddOns(menu).forEach((addOn) => {
    if (!options.addOns?.[addOn.id]) return;
    if (isMultiChoiceAddOn(addOn)) {
      const selectedNames = addOn.choices
        .filter((choice) => getSelectedAddOnChoiceIds(addOn, options).includes(choice.id))
        .map((choice) => choice.name);
      labels.push(selectedNames.length ? `${addOn.name}（${selectedNames.join("・")}）` : addOn.name);
      return;
    }
    const choice = getAddOnChoice(addOn, options);
    labels.push(choice ? `${addOn.name}（${choice.name}）` : addOn.name);
  });
  return labels.length ? labels.join(" / ") : "通常";
}

function getLayerOptionLabel(menu) {
  return menu.id === "q2-syncro" ? "コーティング3層仕上げ" : "コーティング2層仕上げ";
}

function getLayerOptionDisplayLabel(menu) {
  return `${getLayerOptionLabel(menu)}｜保護力・艶・撥水UP`;
}

function renderLayeringUpgradeHtml(menu, options) {
  if (!options.addLayer) return "";

  const comparison = coatingComparisonItems.find((item) => item.menuId === menu.id);
  if (!comparison) return "";

  return `
    <div class="layering-guide selected-coating-preview">
      <div class="layering-head">
        <strong>選択中のコーティング性能</strong>
        <span>${menu.name} + ${getLayerOptionLabel(menu)}</span>
      </div>
      <p>${getLayerOptionLabel(menu)}を追加すると、現在選択中のコーティングは下記の仕上がり目安になります。</p>
      <div class="layering-grid">
        ${coatingComparisonMetrics.map((metric) => renderLayeringUpgradeItem(metric, comparison.ratings[metric.id])).join("")}
      </div>
    </div>
  `;
}

function renderLayeringUpgradeItem(metric, baseValue) {
  const nextValue = getLayeredRatingValue(metric.id, baseValue);
  if (nextValue === baseValue) return "";

  return `
    <span>
      <small>${metric.label}</small>
      <strong><em>${formatRatingNumber(baseValue)}</em><b>→</b><em>${formatRatingNumber(nextValue)}</em></strong>
    </span>
  `;
}

function getLayeredRatingValue(metricId, baseValue) {
  if (metricId === "scratch") return baseValue;
  return baseValue + 0.5;
}

function getDayStatus(date, hours, availableCount) {
  if (isPastDate(date)) return { label: "受付終了", kind: "full" };
  if (!hours) return { label: "定休日", kind: "closed" };
  if (!isStoreDateBookable(date)) return { label: "限定日程外", kind: "closed" };
  if (date === toISODate(new Date()) && availableCount === 0) return { label: "本日終了", kind: "full" };
  if (availableCount === 0) return { label: "予約不可", kind: "full" };
  if (availableCount <= 3) return { label: "残りわずか", kind: "few" };
  return { label: "空きあり", kind: "open" };
}

function getAvailableSlots(
  date,
  menu = getSelectedMenu(),
  options = getSelectedOptions(menu),
  vehicleId = state.selectedVehicleId,
  excludeBookingId = state.editingBookingId,
  loanerRequired = state.loanerRequired,
) {
  if (!menu || !vehicleId) return [];
  return getAllSlots(date, menu, options, vehicleId).filter((slot) =>
    isSlotAvailable(date, slot, menu, options, vehicleId, excludeBookingId, loanerRequired),
  );
}

function getAllSlots(date, menu = getSelectedMenu(), options = getSelectedOptions(menu), vehicleId = state.selectedVehicleId) {
  if (!menu || !vehicleId) return [];
  if (!isStoreDateBookable(date)) return [];
  const day = parseISODate(date);
  const hours = businessHours[day.getDay()];
  if (!hours || isPastDate(date)) return [];

  const today = toISODate(new Date());
  const earliest = date === today ? getBookableStartForToday() : timeToMinutes(hours.open);
  const open = Math.max(timeToMinutes(hours.open), earliest);
  const close = timeToMinutes(hours.close);

  if (isOvernightService(menu)) {
    return ceramicDropoffSlots.filter((slot) => {
      const minutes = timeToMinutes(slot);
      return minutes >= open && minutes < close;
    });
  }

  const duration = getSameDayDuration(menu, vehicleId, options);
  const slots = [];
  const canOverrunBusinessHours = allowsOvertimeBooking(menu);

  for (let minutes = open; canOverrunBusinessHours ? minutes < close : minutes + duration <= close; minutes += slotStepMinutes) {
    slots.push(minutesToTime(minutes));
  }

  return slots;
}

function isStoreDateBookable(date) {
  if (currentStore.id !== "yokohama") return true;
  if (currentStore.limitedDates?.includes(date)) return true;
  const weekdaysAllowed = currentStore.limitedWeekdays || [];
  if (!weekdaysAllowed.length) return false;
  return weekdaysAllowed.includes(parseISODate(date).getDay());
}

function allowsOvertimeBooking(menu) {
  return menu?.id === "polish-reset-wash";
}

function getBookableStartForToday() {
  const now = new Date();
  const minutes = now.getHours() * 60 + now.getMinutes() + 60;
  return Math.ceil(minutes / slotStepMinutes) * slotStepMinutes;
}

function isSlotAvailable(
  date,
  slot,
  menu = getSelectedMenu(),
  options = getSelectedOptions(menu),
  vehicleId = state.selectedVehicleId,
  excludeBookingId = state.editingBookingId,
  loanerRequired = state.loanerRequired,
) {
  if (!menu || !vehicleId) return false;
  const interval = getServiceInterval(date, slot, menu, options, vehicleId);
  return isIntervalAvailable(interval, menu.category, excludeBookingId) && isLoanerAvailable(interval, loanerRequired, excludeBookingId);
}

function isIntervalAvailable(interval, proposedCategory, excludeBookingId = null) {
  if (!interval) return false;
  const allBookings = getAllBookings(excludeBookingId);
  const proposedInterval = addOperationalBuffer(interval, proposedCategory);

  for (let point = new Date(proposedInterval.startAt); point < proposedInterval.endAt; point = addMinutes(point, slotStepMinutes)) {
    const segmentEnd = minDate(addMinutes(point, slotStepMinutes), proposedInterval.endAt);
    const active = allBookings.filter((booking) => {
      const bookingInterval = addOperationalBuffer(bookingToInterval(booking), booking.category);
      return intervalsOverlap(bookingInterval.startAt, bookingInterval.endAt, point, segmentEnd);
    });
    const activeWash = active.filter((booking) => booking.category === "wash").length;
    const activeCoating = active.filter((booking) => booking.category === "coating").length;
    const activeTotal = activeWash + activeCoating;

    if (proposedCategory === "wash") {
      if (activeWash >= washBoothCapacity || activeTotal >= totalBooths) return false;
    } else {
      const coatingLimit = activeWash > 0 ? totalBooths - washBoothCapacity : totalBooths;
      if (activeCoating >= coatingLimit || activeTotal >= totalBooths) return false;
    }
  }

  return true;
}

function isLoanerAvailable(interval, loanerRequired = state.loanerRequired, excludeBookingId = null) {
  if (!loanerRequired) return true;
  if (!interval) return false;

  const activeLoanerBookings = getAllBookings(excludeBookingId).filter((booking) => isBookingLoanerRequired(booking));
  for (let point = new Date(interval.startAt); point < interval.endAt; point = addMinutes(point, slotStepMinutes)) {
    const segmentEnd = minDate(addMinutes(point, slotStepMinutes), interval.endAt);
    const activeLoaners = activeLoanerBookings.filter((booking) => {
      const bookingInterval = bookingToInterval(booking);
      return intervalsOverlap(bookingInterval.startAt, bookingInterval.endAt, point, segmentEnd);
    }).length;

    if (activeLoaners >= loanerCarCapacity) return false;
  }

  return true;
}

function getSameDayDuration(menu, vehicleId = state.selectedVehicleId, options = getSelectedOptions(menu)) {
  if (!menu || !vehicleId) return 0;
  return menu.minutes + getOptionDuration(menu, vehicleId, options);
}

function getServiceInterval(date, slot, menu = getSelectedMenu(), options = getSelectedOptions(menu), vehicleId = state.selectedVehicleId) {
  if (!menu || !vehicleId) return null;
  const startAt = dateAt(date, slot);

  if (isOvernightService(menu)) {
    return getOvernightServiceInterval(date, slot, menu, options, vehicleId);
  }

  const endAt = addMinutes(startAt, getSameDayDuration(menu, vehicleId, options));
  return {
    startAt,
    endAt,
    startDate: date,
    start: slot,
    endDate: toISODate(endAt),
    end: minutesToTime(endAt.getHours() * 60 + endAt.getMinutes()),
  };
}

function getOvernightServiceInterval(date, slot, menu, options, vehicleId) {
  const startAt = dateAt(date, slot);
  const rule = getOvernightRule(menu, options);
  const optionMinutes = getOptionDuration(menu, vehicleId, options);
  const workEndAt = addBusinessMinutes(startAt, rule.workMinutes + optionMinutes);
  const minPickupAt = getMinimumPickupAt(date, rule.minStayDays, rule.closePickup);
  const endAt = getAdjustedPickupAt(maxDate(workEndAt, minPickupAt), rule);

  return {
    startAt,
    endAt,
    startDate: date,
    start: slot,
    endDate: toISODate(endAt),
    end: minutesToTime(endAt.getHours() * 60 + endAt.getMinutes()),
  };
}

function getAdjustedPickupAt(endAt, rule) {
  if (!rule.closePickup) return endAt;

  const endDate = toISODate(endAt);
  const closePickupAt = dateAt(endDate, getPickupTime(endDate));

  if (endAt <= closePickupAt) {
    return closePickupAt;
  }

  return dateAt(getPickupDate(endDate, 2), getPickupTime(getPickupDate(endDate, 2)));
}

function getOvernightRule(menu, options = getSelectedOptions(menu)) {
  const conditionId = options.vehicleCondition === "withinMonth" ? "withinMonth" : "used";
  const rules = overnightScheduleRules[menu.id];

  if (!rules) {
    return { minStayDays: menu.defaultStayDays || 2, workMinutes: menu.minutes || 9 * 60 };
  }

  return rules[conditionId] || rules.used;
}

function getMinimumPickupAt(startDate, minStayDays, closePickup = false) {
  const pickupDate = getPickupDate(startDate, minStayDays);
  const hours = businessHours[parseISODate(pickupDate).getDay()];
  const pickup = closePickup ? getPickupTime(pickupDate) : hours?.open || pickupTime;
  return dateAt(pickupDate, pickup);
}

function getPickupDate(startDate, stayDays) {
  let pickupDate = addDays(parseISODate(startDate), stayDays - 1);
  while (!businessHours[pickupDate.getDay()]) {
    pickupDate = addDays(pickupDate, 1);
  }
  return toISODate(pickupDate);
}

function getPickupTime(date) {
  const close = businessHours[parseISODate(date).getDay()]?.close || pickupTime;
  return timeToMinutes(close) < timeToMinutes(pickupTime) ? close : pickupTime;
}

function addBusinessMinutes(startAt, minutes) {
  let current = new Date(startAt);
  let remaining = minutes;
  let guard = 0;

  while (remaining > 0 && guard < 90) {
    guard += 1;
    const hours = businessHours[current.getDay()];

    if (!hours) {
      current = getNextBusinessStart(addDays(current, 1));
      continue;
    }

    const currentDate = toISODate(current);
    const openAt = dateAt(currentDate, hours.open);
    const closeAt = dateAt(currentDate, hours.close);

    if (current < openAt) {
      current = openAt;
    }

    if (current >= closeAt) {
      current = getNextBusinessStart(addDays(current, 1));
      continue;
    }

    const availableMinutes = Math.floor((closeAt.getTime() - current.getTime()) / 60000);
    const minutesToUse = Math.min(remaining, availableMinutes);
    current = addMinutes(current, minutesToUse);
    remaining -= minutesToUse;

    if (remaining > 0) {
      current = getNextBusinessStart(addDays(current, 1));
    }
  }

  return current;
}

function getNextBusinessStart(fromDate) {
  for (let offset = 0; offset < 21; offset += 1) {
    const candidate = addDays(fromDate, offset);
    const hours = businessHours[candidate.getDay()];
    if (hours) return dateAt(toISODate(candidate), hours.open);
  }

  return fromDate;
}

function isOvernightService(menu) {
  return Boolean(menu.defaultStayDays);
}

function getAllBookings(excludeBookingId = null) {
  return [...getDemoBookings(), ...state.bookings].filter(
    (booking) => booking.admin?.status !== "canceled" && booking.id !== excludeBookingId,
  );
}

function isBookingLoanerRequired(booking) {
  return Boolean(booking.loanerRequired || booking.loanerCar?.required);
}

function getLoanerLabel(value) {
  return value ? "必要" : "不要";
}

function getDemoBookings() {
  const today = new Date();
  const day1 = findBusinessDateFrom(today, 1);
  const day2 = findBusinessDateFrom(day1, 1);
  const day3 = findBusinessDateFrom(day2, 1);

  return [
    makeBookingRecord({
      date: toISODate(day1),
      slot: "10:00",
      menu: menus[0],
      vehicle: vehicleSizes[1],
      source: "demo",
    }),
    makeBookingRecord({
      date: toISODate(day1),
      slot: "10:00",
      menu: menus[2],
      vehicle: vehicleSizes[2],
      options: { vehicleCondition: "withinMonth", addLayer: false, addWax: false, addOns: {}, variant: null, stayDays: null },
      source: "demo",
    }),
    makeBookingRecord({
      date: toISODate(day2),
      slot: "10:00",
      menu: menus[3],
      vehicle: vehicleSizes[1],
      options: { vehicleCondition: "used", addLayer: false, addWax: false, addOns: {}, variant: null, stayDays: 2 },
      source: "demo",
    }),
    makeBookingRecord({
      date: toISODate(day3),
      slot: "13:00",
      menu: menus[1],
      vehicle: vehicleSizes[0],
      source: "demo",
    }),
  ];
}

function makeBookingRecord({ date, slot, menu, vehicle, options = getSelectedOptions(menu), loanerRequired = false, customer = {}, source }) {
  const interval = getServiceInterval(date, slot, menu, options, vehicle.id);
  const booking = {
    id: source === "demo" ? `demo-${menu.id}-${date}-${slot}` : crypto.randomUUID(),
    source,
    storeId: currentStore.id,
    storeName: currentStore.name,
    googleCalendarLabel: currentStore.googleCalendarLabel || `TRY WASH ${currentStore.name}`,
    category: menu.category,
    startDate: interval.startDate,
    start: interval.start,
    endDate: interval.endDate,
    end: interval.end,
    menuId: menu.id,
    menuName: getDisplayMenuName(menu, options),
    vehicleId: vehicle.id,
    vehicleName: vehicle.name,
    options,
    loanerRequired: Boolean(loanerRequired),
    price: getPrice(menu, vehicle.id, options),
    customer,
    admin: makeInitialAdminRecord(menu, vehicle, options),
    createdAt: new Date().toISOString(),
  };

  if (source === "user") {
    booking.lineNotificationPlan = makeLineNotificationPlan(booking);
  }

  return booking;
}

function prepareEditedBooking(previousBooking, nextBooking, actor) {
  const nextAdminPlan = makeInitialAdminRecord(
    menus.find((menu) => menu.id === nextBooking.menuId) || getSelectedMenu(),
    vehicleSizes.find((vehicle) => vehicle.id === nextBooking.vehicleId) || getSelectedVehicle(),
    nextBooking.options || {},
  );
  const previousAdmin = previousBooking.admin || {};
  const updatedBooking = {
    ...nextBooking,
    id: previousBooking.id,
    source: previousBooking.source || "user",
    createdAt: previousBooking.createdAt || nextBooking.createdAt,
    admin: {
      ...nextAdminPlan,
      ...previousAdmin,
      planVersion: workPlanVersion,
      requiredStaff: nextAdminPlan.requiredStaff,
      plannedWorkHours: nextAdminPlan.plannedWorkHours,
      plannedStaffHours: nextAdminPlan.plannedStaffHours,
      updatedAt: new Date().toISOString(),
    },
  };

  return appendChangeHistory(updatedBooking, actor, previousBooking);
}

function appendChangeHistory(nextBooking, actor, previousBooking) {
  const history = Array.isArray(previousBooking.changeHistory) ? previousBooking.changeHistory : [];
  return {
    ...nextBooking,
    changeHistory: [
      ...history,
      {
        id: `change-${Date.now()}`,
        actor,
        changedAt: new Date().toISOString(),
        before: getBookingSnapshot(previousBooking),
        after: getBookingSnapshot(nextBooking),
      },
    ],
  };
}

function getBookingSnapshot(booking) {
  return {
    period: formatBookingPeriod(booking),
    menuName: booking.menuName,
    vehicleName: booking.vehicleName,
    loanerRequired: getLoanerLabel(isBookingLoanerRequired(booking)),
    price: booking.price,
    customerName: booking.customer?.name || "",
    customerPhone: booking.customer?.phone || "",
  };
}

function makeInitialAdminRecord(menu, vehicle, options) {
  const workPlan = getBaseWorkPlan(menu, vehicle, options);
  return {
    status: "new",
    planVersion: workPlanVersion,
    requiredStaff: workPlan.requiredStaff,
    plannedWorkHours: workPlan.plannedWorkHours,
    plannedStaffHours: workPlan.requiredStaff * workPlan.plannedWorkHours,
    actualStaff: 0,
    actualWorkHours: 0,
    actualStaffHours: 0,
    assignedStaff: "",
    assignedStaffIds: [],
    vehicleLeadStaffId: "",
    vehicleLeadStaffName: "",
    actualStart: "",
    actualEnd: "",
    workResult: "",
    finishCondition: "",
    nextSuggestion: "",
    internalNote: "",
    updatedAt: new Date().toISOString(),
  };
}

function estimateRequiredStaff(menu, vehicle, options) {
  return getBaseWorkPlan(menu, vehicle, options).requiredStaff;
}

function getBaseWorkPlan(menu, vehicle, options) {
  const coatingHours = getCoatingWorkHours(menu.id, vehicle.id, options);
  const optionHours = getOptionDuration(menu, vehicle.id, options) / 60;
  if (coatingHours) {
    return {
      requiredStaff: 2,
      plannedWorkHours: coatingHours + optionHours,
    };
  }

  const baseStaffByMenu = {
    "pure-wash": 1,
    "polish-reset-wash": 2,
    "gold-coating": 2,
    "q2-pure-mohs": 2,
    "q2-syncro": 2,
    "interior-cleaning": 2,
  };
  const selectedAddOns = Object.values(options.addOns || {}).filter(Boolean).length;
  let staff = baseStaffByMenu[menu.id] || (menu.category === "wash" ? 1 : 2);

  if (vehicle.id === "extraLarge" && menu.id !== "pure-wash") {
    staff += 1;
  }
  if (options.addLayer || selectedAddOns >= 2) {
    staff += 1;
  }

  return {
    requiredStaff: Math.min(staff, 4),
    plannedWorkHours: (menu.minutes ? menu.minutes / 60 : 8) + optionHours,
  };
}

function getCoatingWorkHours(menuId, vehicleId, options) {
  const sizeId = goldCoatingUsedHours[vehicleId] == null ? "standard" : vehicleId;
  const isNewCar = options.vehicleCondition === "withinMonth";
  const goldNewHours = goldCoatingUsedHours[sizeId] - 1;

  if (menuId === "gold-coating") {
    return isNewCar ? goldNewHours : goldCoatingUsedHours[sizeId];
  }
  if (menuId === "q2-pure-mohs") {
    return isNewCar ? goldNewHours : pureMohsUsedHours[sizeId];
  }
  if (menuId === "q2-syncro") {
    return isNewCar ? goldNewHours + 1 : syncroUsedHours[sizeId];
  }

  return null;
}

function makeLineNotificationPlan(booking) {
  const startAt = dateAt(booking.startDate, booking.start);
  const reminder7DaysAt = addMinutes(startAt, -7 * 24 * 60);
  const reminder1DayAt = addMinutes(startAt, -24 * 60);
  const checkInMorningAt = dateAt(booking.startDate, "08:00");
  const baseMessage = `${booking.customer.name || "お客様"}、${booking.storeName || currentStore.name}の${booking.menuName}（${booking.vehicleName}）のご予約内容です。日時：${formatBookingPeriod(booking)} / 代車：${getLoanerLabel(isBookingLoanerRequired(booking))} / 合計：${formatYen(booking.price)}`;
  const notices = [
    {
      type: "confirmation",
      label: "予約受付通知",
      sendAt: new Date().toISOString(),
      message: `ご予約を受け付けました。${baseMessage}`,
    },
    {
      type: "reminder7days",
      label: "1週間前リマインド",
      sendAt: reminder7DaysAt.toISOString(),
      message: `ご予約の1週間前です。${baseMessage}`,
    },
    {
      type: "reminder1day",
      label: "前日リマインド",
      sendAt: reminder1DayAt.toISOString(),
      message: `ご予約の前日です。${baseMessage}`,
    },
    {
      type: "checkInMorning",
      label: "入庫当日朝リマインド",
      sendAt: checkInMorningAt.toISOString(),
      message: `本日ご入庫予定です。${baseMessage}`,
    },
  ];

  return notices.filter((notice) => notice.type === "confirmation" || new Date(notice.sendAt) > new Date());
}

function makeBookingChangeNotificationPlan(booking, actor, previousBooking, title = "予約内容が変更されました") {
  const actorLabel = actor === "admin" ? "管理者" : "お客様";
  const changeSummary = getBookingChangeSummary(previousBooking, booking);
  const nextPeriod = formatBookingPeriod(booking);
  const price = formatYen(booking.price || 0);
  const customerName = booking.customer?.name || "お客様";
  const base = `${customerName} / ${booking.storeName || currentStore.name} / ${booking.menuName} / ${booking.vehicleName} / 日時：${nextPeriod} / 代車：${getLoanerLabel(isBookingLoanerRequired(booking))} / 合計：${price}`;

  return [
    {
      type: "bookingChangedCustomer",
      audience: "customer",
      channel: "line",
      targetLineUserId: booking.customer?.lineProfile?.userId || null,
      label: title,
      sendAt: new Date().toISOString(),
      message: `${title}。変更後の内容：${base}。${changeSummary}`,
    },
    {
      type: "bookingChangedAdmin",
      audience: "admin",
      channel: "admin",
      targetAdmin: `trywash-${currentStore.id}`,
      label: title,
      sendAt: new Date().toISOString(),
      message: `${actorLabel}側で予約変更がありました。${base}。${changeSummary}`,
    },
  ];
}

function getBookingChangeSummary(previousBooking, nextBooking) {
  const changes = [];
  if (formatBookingPeriod(previousBooking) !== formatBookingPeriod(nextBooking)) {
    changes.push(`日時：${formatBookingPeriod(previousBooking)} → ${formatBookingPeriod(nextBooking)}`);
  }
  if (previousBooking.menuName !== nextBooking.menuName) {
    changes.push(`メニュー：${previousBooking.menuName} → ${nextBooking.menuName}`);
  }
  if (previousBooking.vehicleName !== nextBooking.vehicleName) {
    changes.push(`車両サイズ：${previousBooking.vehicleName} → ${nextBooking.vehicleName}`);
  }
  if (isBookingLoanerRequired(previousBooking) !== isBookingLoanerRequired(nextBooking)) {
    changes.push(`代車：${getLoanerLabel(isBookingLoanerRequired(previousBooking))} → ${getLoanerLabel(isBookingLoanerRequired(nextBooking))}`);
  }
  if (Number(previousBooking.price) !== Number(nextBooking.price)) {
    changes.push(`金額：${formatYen(previousBooking.price || 0)} → ${formatYen(nextBooking.price || 0)}`);
  }

  return changes.length ? `変更点：${changes.join(" / ")}` : "変更点：お客様情報または管理情報が更新されました。";
}

function queueLineNotifications(booking) {
  if (!booking.lineNotificationPlan?.length) return;

  const queue = readLineNotificationQueue();
  const notifications = booking.lineNotificationPlan.map((notice) => ({
    id: `${booking.id}-${notice.type}`,
    bookingId: booking.id,
    status: "pending",
    channel: "line",
    targetLineUserId: booking.customer.lineProfile?.userId || null,
    ...notice,
  }));

  localStorage.setItem(notificationStorageKey, JSON.stringify([...queue, ...notifications]));
  syncMessagesToRemote(notifications);
}

function queueBookingChangeNotifications(booking, actor, previousBooking, title) {
  const queue = readLineNotificationQueue();
  const notices = makeBookingChangeNotificationPlan(booking, actor, previousBooking, title).map((notice) => ({
    id: `${booking.id}-${notice.type}-${Date.now()}`,
    bookingId: booking.id,
    status: "pending",
    ...notice,
  }));

  localStorage.setItem(notificationStorageKey, JSON.stringify([...queue, ...notices]));
  syncMessagesToRemote(notices);
}

function bookingToInterval(booking) {
  return {
    startAt: dateAt(booking.startDate, booking.start),
    endAt: dateAt(booking.endDate, booking.end),
  };
}

function addOperationalBuffer(interval, category) {
  return {
    startAt: interval.startAt,
    endAt: addMinutes(interval.endAt, category === "wash" || category === "coating" ? bufferMinutes : 0),
  };
}

function intervalsOverlap(startA, endA, startB, endB) {
  return startA < endB && endA > startB;
}

function findNextBusinessDate(fromDate) {
  return findBusinessDateFrom(fromDate, 0);
}

function findBusinessDateFrom(fromDate, minOffset) {
  for (let offset = minOffset; offset < minOffset + 21; offset += 1) {
    const candidate = addDays(fromDate, offset);
    if (businessHours[candidate.getDay()]) return candidate;
  }
  return fromDate;
}

function findBestDateInWeek(weekStart) {
  for (let offset = 0; offset < 7; offset += 1) {
    const candidate = addDays(weekStart, offset);
    const date = toISODate(candidate);
    if (!isPastDate(date) && businessHours[candidate.getDay()] && getAvailableSlots(date).length > 0) {
      return candidate;
    }
  }

  return weekStart;
}

function findBestDateInMonth(monthDate) {
  const first = startOfMonth(monthDate);
  const last = new Date(first.getFullYear(), first.getMonth() + 1, 0);

  for (let day = first; day <= last; day = addDays(day, 1)) {
    const date = toISODate(day);
    if (!isPastDate(date) && businessHours[day.getDay()] && getAvailableSlots(date).length > 0) {
      return day;
    }
  }

  return first;
}

function readBookings() {
  try {
    const bookings = JSON.parse(localStorage.getItem(storageKey)) || [];
    return bookings.filter((booking) => booking.startDate && booking.endDate && booking.category);
  } catch {
    return [];
  }
}

function writeBookings(bookings) {
  localStorage.setItem(storageKey, JSON.stringify(bookings));
}

async function hydrateRemoteBookings() {
  if (!window.TryWashApi?.canUseRemoteApi()) return;

  try {
    const response = await window.TryWashApi.listReservations();
    const remoteBookings = normalizeRemoteBookingsResponse(response);
    if (!remoteBookings.length) return;

    state.bookings = mergeBookings(state.bookings, remoteBookings);
    state.previousReservationVehicleInfo = getPreviousReservationVehicleInfo(state.bookings);
    applyPreviousReservationVehicleInfo();
    writeBookings(state.bookings);
    render();
  } catch (error) {
    console.warn("予約データの共通DB読み込みをスキップしました。", error);
  }
}

function getPreviousReservationVehicleInfo(bookings) {
  const latest = [...(bookings || [])]
    .filter((booking) => booking.source !== "demo")
    .filter((booking) => booking.vehicleId || booking.customer?.carModel)
    .sort((a, b) => {
      const left = `${a.startDate || ""} ${a.start || ""}`;
      const right = `${b.startDate || ""} ${b.start || ""}`;
      return right.localeCompare(left);
    })[0];

  if (!latest) return null;

  return {
    carModel: latest.customer?.carModel || "",
    vehicleSizeId: latest.vehicleId || "",
    vehicleSizeName: latest.vehicleName || getVehicleSizeName(latest.vehicleId),
    startDate: latest.startDate || "",
    start: latest.start || "",
  };
}

function applyPreviousReservationVehicleInfo({ force = false } = {}) {
  const info = state.previousReservationVehicleInfo;
  if (!info) return;

  if ((force || !state.selectedVehicleId) && info.vehicleSizeId) {
    state.selectedVehicleId = info.vehicleSizeId;
    state.selectedVehicleSize = info.vehicleSizeId;
  }

  if ((force || !state.selectedCarModel) && info.carModel) {
    state.selectedCarModel = info.carModel;
    state.vehicleGuideQuery = info.carModel;
    const previousModel = getVehicleModelByName(info.carModel);
    if (previousModel) {
      state.selectedVehicleGenre = previousModel.genre;
      state.selectedBrand = previousModel.brand;
    }
  }
}

function normalizeRemoteBookingsResponse(response) {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.reservations)) return response.reservations;
  if (Array.isArray(response?.bookings)) return response.bookings;
  return [];
}

function mergeBookings(localBookings, remoteBookings) {
  const byId = new Map(localBookings.map((booking) => [booking.id, booking]));
  remoteBookings.forEach((booking) => {
    if (!booking?.id) return;
    byId.set(booking.id, { ...byId.get(booking.id), ...booking, remoteSyncedAt: new Date().toISOString() });
  });
  return [...byId.values()];
}

async function syncBookingToRemote(booking, mode = "upsert") {
  if (!window.TryWashApi?.canUseRemoteApi()) return null;

  try {
    const response = await window.TryWashApi.saveReservation(booking, mode);
    return response?.reservation || null;
  } catch (error) {
    console.warn("予約データの共通DB同期、またはGoogleカレンダー登録に失敗しました。", error);
    throw error;
  }
}

async function syncMessagesToRemote(notices) {
  if (!window.TryWashApi?.canUseRemoteApi() || !notices.length) return;

  try {
    await window.TryWashApi.queueMessages(notices);
  } catch (error) {
    console.warn("LINE通知キューの共通DB同期を保留しました。", error);
  }
}

function readLineNotificationQueue() {
  try {
    return JSON.parse(localStorage.getItem(notificationStorageKey)) || [];
  } catch {
    return [];
  }
}

function readLineProfile() {
  try {
    return JSON.parse(localStorage.getItem(lineProfileStorageKey)) || null;
  } catch {
    return null;
  }
}

async function initLineProfile() {
  const isLikelyLineContext = navigator.userAgent.includes("Line") || location.href.includes("liff");
  if (!isLikelyLineContext || !window.liff?.init) return;

  try {
    await window.liff.init({ liffId: lineLiffId });
    if (!window.liff.isLoggedIn()) {
      if (!window.liff.isInClient?.()) {
        window.liff.login();
      }
      return;
    }

    const profile = await window.liff.getProfile();
    state.lineProfile = {
      userId: profile.userId,
      displayName: profile.displayName,
      pictureUrl: profile.pictureUrl,
    };
    localStorage.setItem(lineProfileStorageKey, JSON.stringify(state.lineProfile));
    if (window.TryWashApi?.canUseRemoteApi()) {
      await window.TryWashApi.upsertLineUser(state.lineProfile);
    }

    if (!elements.bookingForm.customerName.value && profile.displayName) {
      elements.bookingForm.customerName.value = profile.displayName;
    }
  } catch (error) {
    console.warn("LINEプロフィールを取得できませんでした。", error);
  }
}

function readSavedCustomer() {
  try {
    return JSON.parse(localStorage.getItem(customerStorageKey)) || null;
  } catch {
    return null;
  }
}

function saveCustomerFromForm() {
  const customer = {
    name: elements.bookingForm.customerName.value.trim(),
    phone: elements.bookingForm.customerPhone.value.trim(),
    postalCode: elements.bookingForm.postalCode.value.trim(),
    address: elements.bookingForm.address.value.trim(),
    carModel: getCustomerCarModelValue(),
    vehicleNumber: elements.bookingForm.vehicleNumber?.value.trim() || "",
    visitReason: elements.bookingForm.visitReason.value,
    bodyColor: getBodyColorValue(),
  };
  localStorage.setItem(customerStorageKey, JSON.stringify(customer));
}

function prefillCustomerForm() {
  const customer = readSavedCustomer();
  const previousVehicle = state.previousReservationVehicleInfo;

  const fieldMap = {
    customerName: customer?.name,
    customerPhone: customer?.phone,
    postalCode: customer?.postalCode,
    address: customer?.address,
    carModel: previousVehicle?.carModel || customer?.carModel,
    vehicleNumber: customer?.vehicleNumber,
    visitReason: customer?.visitReason,
    coatingBodyColor: customer?.bodyColor,
    washBodyColor: customer?.bodyColor,
  };

  Object.entries(fieldMap).forEach(([fieldName, value]) => {
    const field = elements.bookingForm[fieldName];
    if (field && value && !field.value) {
      field.value = value;
    }
  });
}

function getBodyColorValue() {
  const field = requiresCertificateInfo(getSelectedMenu()) ? elements.bookingForm.coatingBodyColor : elements.bookingForm.washBodyColor;
  return (field?.value || "").trim();
}

function getCustomerCarModelValue() {
  return (elements.bookingForm.carModel?.value || state.selectedCarModel || state.vehicleGuideQuery || getSelectedVehicle()?.name || "").trim();
}

function startOfWeek(date) {
  const base = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  base.setDate(base.getDate() - base.getDay());
  return base;
}

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addDays(date, amount) {
  const next = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  next.setDate(next.getDate() + amount);
  return next;
}

function addMonths(date, amount) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function addMinutes(date, amount) {
  return new Date(date.getTime() + amount * 60 * 1000);
}

function minDate(dateA, dateB) {
  return dateA < dateB ? dateA : dateB;
}

function maxDate(dateA, dateB) {
  return dateA > dateB ? dateA : dateB;
}

function parseISODate(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function dateAt(date, time) {
  const [year, month, day] = date.split("-").map(Number);
  const [hours, minutes] = time.split(":").map(Number);
  return new Date(year, month - 1, day, hours, minutes);
}

function toISODate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function isPastDate(date) {
  return date < toISODate(new Date());
}

function timeToMinutes(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

function formatYen(value) {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatInterval(interval) {
  if (interval.startDate === interval.endDate) {
    return `${interval.start} - ${interval.end}`;
  }
  return `${formatShortDate(interval.startDate)} ${interval.start} - ${formatShortDate(interval.endDate)} ${interval.end}`;
}

function formatBookingPeriod(booking) {
  if (booking.startDate === booking.endDate) {
    return `${formatShortDate(booking.startDate)} ${booking.start}-${booking.end}`;
  }
  return `${formatShortDate(booking.startDate)} ${booking.start} - ${formatShortDate(booking.endDate)} ${booking.end}`;
}

function formatShortDate(date) {
  const parsed = parseISODate(date);
  return `${parsed.getMonth() + 1}/${parsed.getDate()}(${weekdays[parsed.getDay()]})`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function normalizeSearchText(value) {
  return String(value)
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[・\sー-]/g, "");
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("is-visible");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    elements.toast.classList.remove("is-visible");
  }, 2800);
}

function scrollToStep(step) {
  const selectors = {
    menu: "#menuList",
    vehicle: "#vehicleSearch",
    options: "#menuOptions",
    calendar: "#calendarStep",
    slots: "#selectedDateTitle",
    customer: "#bookingForm",
  };
  const selector = selectors[step];
  if (!selector) return;

  window.setTimeout(() => {
    const target = document.querySelector(selector);
    if (!target) return;

    target.scrollIntoView({ behavior: "smooth", block: "start" });
    if (step === "vehicle" && typeof target.focus === "function") {
      target.focus({ preventScroll: true });
    }
  }, 80);
}
