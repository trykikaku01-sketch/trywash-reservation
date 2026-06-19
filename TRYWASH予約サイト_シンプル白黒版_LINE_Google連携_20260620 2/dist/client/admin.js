const adminStores = window.TRYWASH_STORES || [
  { id: "yokosuka", name: "横須賀店", googleCalendarLabel: "TRY WASH 横須賀店" },
  { id: "yokohama", name: "横浜店", googleCalendarLabel: "TRY WASH 横浜店" },
];
const adminStoreSelectionKey = "trywash-admin-selected-store-v1";
const initialAdminStoreId = localStorage.getItem(adminStoreSelectionKey) || "yokosuka";
let activeAdminStoreId = initialAdminStoreId;
const adminPrefsKey = "trywash-admin-prefs-v1";
const notificationStorageKey = "trywash-line-notifications-v1";
const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
const totalBooths = 3;
const washBoothCapacity = 1;
const loanerCarCapacity = 2;
const ceramicFinalFinishHours = 1;
const slotStepMinutes = 30;
const workPlanVersion = "coating-work-rules-v1";
const businessHours = {
  0: { open: "09:00", close: "17:30" },
  1: null,
  2: { open: "10:00", close: "19:00" },
  3: { open: "10:00", close: "19:00" },
  4: { open: "12:00", close: "21:00" },
  5: { open: "10:00", close: "20:00" },
  6: { open: "09:00", close: "18:00" },
};

const goldCoatingUsedHours = { small: 4, standard: 4.5, large: 5, extraLarge: 6 };
const pureMohsUsedHours = { small: 6, standard: 7, large: 8, extraLarge: 9 };
const syncroUsedHours = { small: 7, standard: 8, large: 9, extraLarge: 10 };
const defaultPickupTime = "18:00";

const manualVehicleSizes = [
  { id: "small", name: "小型車" },
  { id: "standard", name: "普通車" },
  { id: "large", name: "大型車" },
  { id: "extraLarge", name: "特大車" },
];

const manualMenus = [
  {
    id: "pure-wash",
    category: "wash",
    name: "純水手洗い洗車",
    minutes: 60,
    prices: { small: 6000, standard: 6500, large: 7000, extraLarge: 7500 },
  },
  {
    id: "polish-reset-wash",
    category: "coating",
    name: "研磨リセット洗車",
    minutes: 300,
    prices: { small: 69800, standard: 79800, large: 89800, extraLarge: 99800 },
  },
  {
    id: "gold-coating",
    category: "coating",
    name: "GOLD COATING（ゴールドコーティング）",
    minutes: 480,
    prices: { small: 110000, standard: 121000, large: 132000, extraLarge: 145000 },
    newCarPrices: { small: 99000, standard: 109000, large: 119000, extraLarge: 130000 },
  },
  {
    id: "q2-pure-mohs",
    category: "coating",
    name: "GYEON Q² PURE EVO / Q² MOHS EVO",
    defaultStayDays: 2,
    prices: { small: 198000, standard: 228000, large: 248000, extraLarge: 268000 },
    newCarPrices: { small: 178000, standard: 205000, large: 223000, extraLarge: 241000 },
  },
  {
    id: "q2-syncro",
    category: "coating",
    name: "GYEON Q² SYNCRO EVO",
    defaultStayDays: 3,
    prices: { small: 258000, standard: 298000, large: 328000, extraLarge: 358000 },
    newCarPrices: { small: 230000, standard: 270000, large: 295000, extraLarge: 320000 },
  },
  {
    id: "interior-cleaning",
    category: "coating",
    name: "車内まるごとクリーニング",
    minutes: 240,
    prices: { small: 31900, standard: 40700, large: 45100, extraLarge: 45100 },
  },
];

const defaultStaffRoster = [
  { id: "staff-1", name: "スタッフ1" },
  { id: "staff-2", name: "スタッフ2" },
  { id: "staff-3", name: "スタッフ3" },
  { id: "staff-4", name: "スタッフ4" },
];

const visitReasonOptions = [
  "",
  "ホームページ",
  "Google検索",
  "Googleマップ",
  "YouTube",
  "Instagram",
  "TikTok",
  "X",
  "看板を見て",
  "口コミ",
  "紹介",
  "リピーター",
  "楽天市場",
  "Amazon",
  "その他",
];

const statusOptions = [
  { id: "new", label: "未確認" },
  { id: "confirmed", label: "確定" },
  { id: "checked_in", label: "入庫済" },
  { id: "working", label: "作業中" },
  { id: "done", label: "完了" },
  { id: "follow_up", label: "フォロー" },
  { id: "canceled", label: "キャンセル" },
];

const menuStaffDefaults = {
  "pure-wash": 1,
  "polish-reset-wash": 2,
  "gold-coating": 2,
  "q2-pure-mohs": 2,
  "q2-syncro": 3,
  "interior-cleaning": 2,
};

const menuCategoryLabels = {
  wash: "洗車",
  coating: "施工",
};

const elements = {
  seedButton: document.querySelector("#seedButton"),
  showManualBookingButton: document.querySelector("#showManualBookingButton"),
  storeFilter: document.querySelector("#storeFilter"),
  searchInput: document.querySelector("#searchInput"),
  rangeFilter: document.querySelector("#rangeFilter"),
  exportButton: document.querySelector("#exportButton"),
  manualBookingPanel: document.querySelector("#manualBookingPanel"),
  manualBookingForm: document.querySelector("#manualBookingForm"),
  hideManualBookingButton: document.querySelector("#hideManualBookingButton"),
  manualCustomerName: document.querySelector("#manualCustomerName"),
  manualCustomerPhone: document.querySelector("#manualCustomerPhone"),
  manualCarModel: document.querySelector("#manualCarModel"),
  manualVehicleNumber: document.querySelector("#manualVehicleNumber"),
  manualMenuId: document.querySelector("#manualMenuId"),
  manualVehicleId: document.querySelector("#manualVehicleId"),
  manualVehicleCondition: document.querySelector("#manualVehicleCondition"),
  manualLoanerRequired: document.querySelector("#manualLoanerRequired"),
  manualStartDate: document.querySelector("#manualStartDate"),
  manualStartTime: document.querySelector("#manualStartTime"),
  manualEndDate: document.querySelector("#manualEndDate"),
  manualEndTime: document.querySelector("#manualEndTime"),
  manualVisitReason: document.querySelector("#manualVisitReason"),
  manualPrice: document.querySelector("#manualPrice"),
  manualOptionsSummary: document.querySelector("#manualOptionsSummary"),
  manualNote: document.querySelector("#manualNote"),
  manualBookingPreview: document.querySelector("#manualBookingPreview"),
  metricsGrid: document.querySelector("#metricsGrid"),
  staffRoster: document.querySelector("#staffRoster"),
  addStaffButton: document.querySelector("#addStaffButton"),
  statusTabs: document.querySelector("#statusTabs"),
  dayLoadList: document.querySelector("#dayLoadList"),
  bookingList: document.querySelector("#bookingList"),
  adminForm: document.querySelector("#adminForm"),
  detailEmpty: document.querySelector("#detailEmpty"),
  detailContent: document.querySelector("#detailContent"),
  detailTitle: document.querySelector("#detailTitle"),
  detailSubTitle: document.querySelector("#detailSubTitle"),
  printButton: document.querySelector("#printButton"),
  cancelBookingButton: document.querySelector("#cancelBookingButton"),
  deleteBookingButton: document.querySelector("#deleteBookingButton"),
  bookingStatus: document.querySelector("#bookingStatus"),
  detailStartDate: document.querySelector("#detailStartDate"),
  detailStartTime: document.querySelector("#detailStartTime"),
  detailEndDate: document.querySelector("#detailEndDate"),
  detailEndTime: document.querySelector("#detailEndTime"),
  detailLoanerRequired: document.querySelector("#detailLoanerRequired"),
  detailMenuName: document.querySelector("#detailMenuName"),
  detailVehicleName: document.querySelector("#detailVehicleName"),
  detailPrice: document.querySelector("#detailPrice"),
  detailOptionsSummary: document.querySelector("#detailOptionsSummary"),
  detailSameDayChangeNote: document.querySelector("#detailSameDayChangeNote"),
  requiredStaff: document.querySelector("#requiredStaff"),
  plannedWorkHours: document.querySelector("#plannedWorkHours"),
  plannedStaffHours: document.querySelector("#plannedStaffHours"),
  actualStaff: document.querySelector("#actualStaff"),
  assignedStaffPicker: document.querySelector("#assignedStaffPicker"),
  vehicleLeadStaff: document.querySelector("#vehicleLeadStaff"),
  actualStart: document.querySelector("#actualStart"),
  actualEnd: document.querySelector("#actualEnd"),
  detailCustomerName: document.querySelector("#detailCustomerName"),
  detailCustomerPhone: document.querySelector("#detailCustomerPhone"),
  detailCarModel: document.querySelector("#detailCarModel"),
  detailVehicleNumber: document.querySelector("#detailVehicleNumber"),
  detailBodyColor: document.querySelector("#detailBodyColor"),
  detailVisitReason: document.querySelector("#detailVisitReason"),
  detailAddress: document.querySelector("#detailAddress"),
  customerSummary: document.querySelector("#customerSummary"),
  customerHistoryList: document.querySelector("#customerHistoryList"),
  workResult: document.querySelector("#workResult"),
  actualWorkHours: document.querySelector("#actualWorkHours"),
  actualStaffHours: document.querySelector("#actualStaffHours"),
  finishCondition: document.querySelector("#finishCondition"),
  nextSuggestion: document.querySelector("#nextSuggestion"),
  internalNote: document.querySelector("#internalNote"),
  requestLog: document.querySelector("#requestLog"),
  toast: document.querySelector("#toast"),
};

const prefs = readPrefs();
const initialStaffRoster = normalizeStaffRoster(prefs.staffRoster);
let state = {
  bookings: readBookings(),
  storeId: initialAdminStoreId,
  selectedId: null,
  statusFilter: "all",
  rangeFilter: "upcoming",
  searchQuery: "",
  staffRoster: initialStaffRoster,
  presentStaffIds: normalizePresentStaffIds(prefs.presentStaffIds, initialStaffRoster),
};
let pendingDeleteId = null;
let pendingDeleteTimer = null;

if (elements.storeFilter) elements.storeFilter.value = state.storeId;
elements.rangeFilter.value = state.rangeFilter;
configureRemoteStore(state.storeId);
initializeManualBookingForm();
bindEvents();
render();
hydrateRemoteBookings();

function bindEvents() {
  if (elements.storeFilter) {
    elements.storeFilter.addEventListener("change", (event) => {
      state.storeId = event.target.value;
      activeAdminStoreId = state.storeId;
      localStorage.setItem(adminStoreSelectionKey, state.storeId);
      configureRemoteStore(state.storeId);
      state.bookings = readBookings();
      state.selectedId = null;
      hydrateRemoteBookings();
      render();
    });
  }

  elements.searchInput.addEventListener("input", (event) => {
    state.searchQuery = event.target.value;
    render();
  });

  elements.rangeFilter.addEventListener("change", (event) => {
    state.rangeFilter = event.target.value;
    render();
  });

  elements.staffRoster.addEventListener("input", (event) => {
    const input = event.target.closest("[data-staff-name]");
    if (!input) return;
    state.staffRoster = state.staffRoster.map((staff) =>
      staff.id === input.dataset.staffName ? { ...staff, name: input.value } : staff,
    );
    writeStaffPrefs();
    renderAssignedStaffPickerForCurrentBooking();
    renderVehicleLeadStaffSelectForCurrentBooking();
  });

  elements.staffRoster.addEventListener("change", (event) => {
    const checkbox = event.target.closest("[data-present-staff]");
    if (!checkbox) return;
    const staffId = checkbox.dataset.presentStaff;
    state.presentStaffIds = checkbox.checked
      ? [...new Set([...state.presentStaffIds, staffId])]
      : state.presentStaffIds.filter((id) => id !== staffId);
    writeStaffPrefs();
    render();
  });

  elements.staffRoster.addEventListener("click", (event) => {
    const removeButton = event.target.closest("[data-remove-staff]");
    if (!removeButton) return;
    const staffId = removeButton.dataset.removeStaff;
    state.staffRoster = state.staffRoster.filter((staff) => staff.id !== staffId);
    state.presentStaffIds = state.presentStaffIds.filter((id) => id !== staffId);
    state.bookings = state.bookings.map((booking) => ({
      ...booking,
      admin: {
        ...getAdminRecord(booking),
        assignedStaffIds: getAssignedStaffIds(booking).filter((id) => id !== staffId),
        vehicleLeadStaffId: getAdminRecord(booking).vehicleLeadStaffId === staffId ? "" : getAdminRecord(booking).vehicleLeadStaffId,
        vehicleLeadStaffName: getAdminRecord(booking).vehicleLeadStaffId === staffId ? "" : getAdminRecord(booking).vehicleLeadStaffName,
      },
    }));
    writeStaffPrefs();
    writeBookings(state.bookings);
    render();
  });

  elements.addStaffButton.addEventListener("click", () => {
    const staff = { id: `staff-${Date.now()}`, name: `スタッフ${state.staffRoster.length + 1}` };
    state.staffRoster = [...state.staffRoster, staff];
    state.presentStaffIds = [...new Set([...state.presentStaffIds, staff.id])];
    writeStaffPrefs();
    render();
  });

  elements.showManualBookingButton.addEventListener("click", () => {
    openManualBookingPanel();
  });

  elements.hideManualBookingButton.addEventListener("click", () => {
    elements.manualBookingPanel.hidden = true;
  });

  elements.manualBookingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    addManualBooking();
  });

  [
    elements.manualMenuId,
    elements.manualVehicleId,
    elements.manualVehicleCondition,
    elements.manualLoanerRequired,
    elements.manualStartDate,
    elements.manualStartTime,
  ].forEach((input) => {
    input.addEventListener("input", updateManualBookingDefaults);
    input.addEventListener("change", updateManualBookingDefaults);
  });

  elements.assignedStaffPicker.addEventListener("change", () => {
    const selectedIds = getCheckedStaffIds();
    if (selectedIds.length > 0) {
      elements.actualStaff.value = selectedIds.length;
      if (!elements.vehicleLeadStaff.value) {
        elements.vehicleLeadStaff.value = selectedIds[0];
      }
    }
    updateStaffHourPreviews();
  });

  [elements.requiredStaff, elements.plannedWorkHours, elements.actualStaff, elements.actualWorkHours].forEach((input) => {
    input.addEventListener("input", updateStaffHourPreviews);
  });

  elements.statusTabs.addEventListener("click", (event) => {
    const button = event.target.closest("[data-status-filter]");
    if (!button) return;
    state.statusFilter = button.dataset.statusFilter;
    render();
  });

  elements.bookingList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-booking-id]");
    if (!button) return;
    resetDeleteConfirmation();
    state.selectedId = button.dataset.bookingId;
    renderDetail();
    scrollDetailIntoView();
  });

  elements.adminForm.addEventListener("submit", (event) => {
    event.preventDefault();
    saveSelectedBooking();
  });

  elements.seedButton.addEventListener("click", () => {
    addSampleBookings();
  });

  elements.exportButton.addEventListener("click", () => {
    exportVisibleBookings();
  });

  elements.printButton.addEventListener("click", () => {
    window.print();
  });

  elements.cancelBookingButton.addEventListener("click", () => {
    toggleSelectedBookingCancellation();
  });

  elements.deleteBookingButton.addEventListener("click", () => {
    deleteSelectedBooking();
  });

  window.addEventListener("storage", (event) => {
    if (event.key !== getStoreStorageKey(state.storeId)) return;
    state.bookings = readBookings();
    render();
  });
}

function render() {
  renderAdminStoreLabels();
  const visibleBookings = getFilteredBookings();
  if (!state.selectedId && visibleBookings.length) {
    state.selectedId = visibleBookings[0].id;
  }
  if (state.selectedId && !state.bookings.some((booking) => booking.id === state.selectedId)) {
    state.selectedId = visibleBookings[0]?.id || null;
  }

  renderStaffRoster();
  renderMetrics();
  renderStatusTabs();
  renderDayLoad();
  renderBookingList(visibleBookings);
  renderDetail();
}

function renderAdminStoreLabels() {
  const store = getAdminStore();
  document.title = `TRY WASH ${store.name} | 予約管理`;
  document.querySelectorAll(".brand strong").forEach((element) => {
    element.textContent = `${store.name} 予約管理`;
  });
  const heading = document.querySelector(".admin-toolbar h1");
  if (heading) heading.textContent = `${store.name} 予約管理`;
}

function initializeManualBookingForm() {
  elements.manualMenuId.innerHTML = manualMenus
    .map((menu) => `<option value="${escapeHtml(menu.id)}">${escapeHtml(menu.name)}</option>`)
    .join("");
  elements.manualVehicleId.innerHTML = manualVehicleSizes
    .map((vehicle) => `<option value="${escapeHtml(vehicle.id)}">${escapeHtml(vehicle.name)}</option>`)
    .join("");
  elements.manualVisitReason.innerHTML = visitReasonOptions
    .map((reason) => `<option value="${escapeHtml(reason)}">${reason || "未選択"}</option>`)
    .join("");

  const firstBusinessDay = findBusinessDateFrom(new Date(), 0);
  elements.manualMenuId.value = "gold-coating";
  elements.manualVehicleId.value = "standard";
  elements.manualVehicleCondition.value = "used";
  elements.manualLoanerRequired.value = "false";
  elements.manualStartDate.value = toISODate(firstBusinessDay);
  elements.manualStartTime.value = getBusinessOpenTime(elements.manualStartDate.value);
  elements.manualPrice.dataset.autoValue = "";
  updateManualBookingDefaults();
}

function openManualBookingPanel() {
  elements.manualBookingPanel.hidden = false;
  updateManualBookingDefaults();
  elements.manualBookingPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  window.setTimeout(() => elements.manualCustomerName.focus(), 120);
}

function updateManualBookingDefaults() {
  const menu = getManualMenu();
  const vehicle = getManualVehicle();
  const options = getManualOptions(menu);
  const interval = getManualInterval(menu, vehicle.id, options);
  const autoPrice = getManualPrice(menu, vehicle.id, options);
  const currentPrice = Number(elements.manualPrice.value);
  const previousAutoPrice = Number(elements.manualPrice.dataset.autoValue);

  elements.manualVehicleCondition.disabled = !menu.newCarPrices;
  elements.manualEndDate.value = interval.endDate;
  elements.manualEndTime.value = interval.end;
  if (!elements.manualPrice.value || currentPrice === previousAutoPrice) {
    elements.manualPrice.value = autoPrice;
  }
  elements.manualPrice.dataset.autoValue = String(autoPrice);

  const previewBooking = buildManualBookingDraft();
  const plan = getBaseWorkPlan(previewBooking);
  elements.manualBookingPreview.textContent = `${formatBookingPeriod(previewBooking)} / ${previewBooking.vehicleName} / 代車${getLoanerLabel(isBookingLoanerRequired(previewBooking))} / ${getBookingOptionsSummary(previewBooking)} / ${plan.requiredStaff}名 x ${formatHours(plan.plannedWorkHours)}h / ${formatYen(previewBooking.price)}`;
}

function addManualBooking() {
  if (!elements.manualCustomerName.value.trim()) {
    elements.manualCustomerName.focus();
    showToast("お名前を入力してください。");
    return;
  }

  const booking = {
    ...buildManualBookingDraft(),
    id: createManualBookingId(),
    source: "admin",
    createdAt: new Date().toISOString(),
  };
  booking.admin = {
    ...makeInitialAdminRecordFromBooking(booking),
    status: "confirmed",
    internalNote: elements.manualNote.value.trim(),
    updatedAt: new Date().toISOString(),
  };

  state.bookings = [...state.bookings, booking];
  state.selectedId = booking.id;
  writeBookings(state.bookings);
  syncBookingToRemote(booking, "create");
  elements.manualBookingForm.reset();
  initializeManualBookingForm();
  elements.manualBookingPanel.hidden = true;
  render();
  showToast("手動予約を追加しました。詳細画面で日時や担当を続けて編集できます。");
}

function buildManualBookingDraft() {
  const menu = getManualMenu();
  const vehicle = getManualVehicle();
  const options = getManualOptions(menu);
  const interval = getManualInterval(menu, vehicle.id, options);
  const manualPrice = elements.manualPrice.value.trim();
  const price = manualPrice ? clampNumber(Number(manualPrice), 0, 9999999, getManualPrice(menu, vehicle.id, options)) : getManualPrice(menu, vehicle.id, options);
  const optionsSummary = elements.manualOptionsSummary.value.trim() || formatOptions(options);
  const store = getAdminStore();

  return {
    id: "manual-preview",
    source: "admin",
    storeId: store.id,
    storeName: store.name,
    googleCalendarLabel: store.googleCalendarLabel || `TRY WASH ${store.name}`,
    category: menu.category,
    startDate: elements.manualStartDate.value || interval.startDate,
    start: elements.manualStartTime.value || interval.start,
    endDate: elements.manualEndDate.value || interval.endDate,
    end: elements.manualEndTime.value || interval.end,
    menuId: menu.id,
    menuName: menu.name,
    vehicleId: vehicle.id,
    vehicleName: vehicle.name,
    options,
    optionsSummary,
    loanerRequired: elements.manualLoanerRequired.value === "true",
    price,
    customer: {
      name: elements.manualCustomerName.value.trim(),
      phone: elements.manualCustomerPhone.value.trim(),
      carModel: elements.manualCarModel.value.trim(),
      vehicleNumber: elements.manualVehicleNumber.value.trim(),
      visitReason: elements.manualVisitReason.value,
    },
    createdAt: new Date().toISOString(),
  };
}

function getManualMenu() {
  return manualMenus.find((menu) => menu.id === elements.manualMenuId.value) || manualMenus[0];
}

function getManualVehicle() {
  return manualVehicleSizes.find((vehicle) => vehicle.id === elements.manualVehicleId.value) || manualVehicleSizes[1];
}

function getManualOptions(menu = getManualMenu()) {
  const vehicleCondition = menu.newCarPrices ? elements.manualVehicleCondition.value || "used" : null;
  return {
    vehicleCondition,
    addLayer: false,
    addWax: false,
    addOns: {},
    stayDays: getManualStayDays(menu, vehicleCondition),
  };
}

function getManualStayDays(menu, vehicleCondition) {
  if (menu.id === "q2-syncro") {
    return vehicleCondition === "withinMonth" ? 2 : 3;
  }
  return menu.defaultStayDays || null;
}

function getManualPrice(menu, vehicleId, options) {
  const prices = menu.newCarPrices && options.vehicleCondition === "withinMonth" ? menu.newCarPrices : menu.prices;
  return prices?.[vehicleId] || 0;
}

function getManualInterval(menu, vehicleId, options) {
  const startDate = elements.manualStartDate.value || toISODate(findBusinessDateFrom(new Date(), 0));
  const start = elements.manualStartTime.value || getBusinessOpenTime(startDate);

  if (menu.defaultStayDays) {
    const endDate = getManualPickupDate(startDate, options.stayDays || menu.defaultStayDays);
    return {
      startDate,
      start,
      endDate,
      end: getManualPickupTime(endDate),
    };
  }

  const startAt = dateAt(startDate, start);
  const coatingHours = getCoatingWorkHours(menu.id, vehicleId, options);
  const durationMinutes = coatingHours ? coatingHours * 60 : menu.minutes || 60;
  const endAt = addMinutes(startAt, durationMinutes);

  return {
    startDate,
    start,
    endDate: toISODate(endAt),
    end: minutesToTime(endAt.getHours() * 60 + endAt.getMinutes()),
  };
}

function getManualPickupDate(startDate, stayDays) {
  let pickupDate = addDays(parseISODate(startDate), stayDays - 1);
  while (!businessHours[pickupDate.getDay()]) {
    pickupDate = addDays(pickupDate, 1);
  }
  return toISODate(pickupDate);
}

function getManualPickupTime(date) {
  const hours = businessHours[parseISODate(date).getDay()];
  if (!hours) return defaultPickupTime;
  return timeToMinutes(hours.close) < timeToMinutes(defaultPickupTime) ? hours.close : defaultPickupTime;
}

function getBusinessOpenTime(date) {
  return businessHours[parseISODate(date).getDay()]?.open || "10:00";
}

function createManualBookingId() {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }
  return `admin-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function makeInitialAdminRecordFromBooking(booking) {
  const basePlan = getBaseWorkPlan(booking);
  return {
    status: "new",
    previousStatus: "",
    canceledAt: "",
    planVersion: workPlanVersion,
    requiredStaff: basePlan.requiredStaff,
    plannedWorkHours: basePlan.plannedWorkHours,
    plannedStaffHours: basePlan.requiredStaff * basePlan.plannedWorkHours,
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

function renderMetrics() {
  const today = toISODate(new Date());
  const liveBookings = state.bookings.filter((booking) => getBookingStatus(booking) !== "canceled");
  const todayBookings = liveBookings.filter((booking) => isBookingWorkActiveOnDate(booking, today));
  const todayLoad = getDailyLoad(today, liveBookings);
  const unfinished = liveBookings.filter((booking) => !["done", "follow_up"].includes(getBookingStatus(booking))).length;
  const remainingStaffHours = Math.max(0, todayLoad.capacityStaffHours - todayLoad.requiredStaffHours);

  const metrics = [
    {
      label: "本日予約",
      value: `${todayBookings.length}件`,
      meta: `必要 ${formatHours(todayLoad.requiredStaffHours)}人時 / 枠 ${formatHours(todayLoad.capacityStaffHours)}人時`,
    },
    { label: "未完了", value: `${unfinished}件`, meta: `未確認 ${countByStatus("new")}件` },
    { label: "出勤", value: `${getPresentStaffCount()}名`, meta: `本日残り ${formatHours(remainingStaffHours)}人時` },
    {
      label: "本日ブース",
      value: `${todayLoad.peakTotalBooths}/${totalBooths}`,
      meta: `洗車 ${todayLoad.peakWashBooths}/${washBoothCapacity} / 施工 ${todayLoad.peakCoatingBooths}`,
    },
    {
      label: "本日代車",
      value: `${todayLoad.peakLoaners}/${loanerCarCapacity}`,
      meta: todayLoad.hasLoanerConflict ? "代車台数を超過しています" : "代車予約の最大同時利用",
    },
  ];

  elements.metricsGrid.innerHTML = metrics
    .map(
      (metric) => `
        <div class="metric-tile">
          <span>${metric.label}</span>
          <strong>${metric.value}</strong>
          <small>${metric.meta}</small>
        </div>
      `,
    )
    .join("");
}

function renderStaffRoster() {
  elements.staffRoster.innerHTML = state.staffRoster
    .map(
      (staff, index) => `
        <div class="staff-row">
          <label class="staff-present">
            <input type="checkbox" data-present-staff="${staff.id}" ${state.presentStaffIds.includes(staff.id) ? "checked" : ""} />
            出勤
          </label>
          <input data-staff-name="${staff.id}" value="${escapeHtml(staff.name)}" aria-label="スタッフ${index + 1}の名前" />
          <button class="icon-button staff-remove" type="button" data-remove-staff="${staff.id}" aria-label="${escapeHtml(staff.name)}を削除" title="削除">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      `,
    )
    .join("");
}

function renderStatusTabs() {
  const baseBookings = getFilteredBookings({ ignoreStatus: true });
  const tabs = [{ id: "all", label: "すべて" }, ...statusOptions];

  elements.statusTabs.innerHTML = tabs
    .map((status) => {
      const count =
        status.id === "all"
          ? baseBookings.length
          : baseBookings.filter((booking) => getBookingStatus(booking) === status.id).length;
      return `
        <button class="status-tab ${state.statusFilter === status.id ? "is-selected" : ""}" type="button" data-status-filter="${status.id}" role="tab" aria-selected="${state.statusFilter === status.id}">
          <span>${status.label}</span>
          <b>${count}</b>
        </button>
      `;
    })
    .join("");
}

function renderDayLoad() {
  const today = new Date();
  const liveBookings = state.bookings.filter((booking) => getBookingStatus(booking) !== "canceled");
  const days = Array.from({ length: 10 }, (_, index) => addDays(today, index));

  elements.dayLoadList.innerHTML = days
    .map((day) => {
      const date = toISODate(day);
      const load = getDailyLoad(date, liveBookings);
      const shortage = Math.max(0, load.requiredStaffHours - load.capacityStaffHours);
      const remaining = Math.max(0, load.capacityStaffHours - load.requiredStaffHours);
      const className = shortage > 0 || load.hasBoothConflict || load.hasLoanerConflict ? "day-load-item needs-staff" : "day-load-item";
      return `
        <div class="${className}">
          <span>
            <strong>${formatShortDate(date)}</strong>
            <small>${load.bookingCount}件 / 作業 ${formatHours(load.requiredStaffHours)}人時 / ブース最大 ${load.peakTotalBooths}/${totalBooths} / 代車最大 ${load.peakLoaners}/${loanerCarCapacity}</small>
          </span>
          <span>
            <b>${load.peakStaff}名</b>
            <small>${formatDayLoadStatus(load, shortage, remaining)}</small>
          </span>
        </div>
      `;
    })
    .join("");
}

function renderBookingList(bookings) {
  if (!bookings.length) {
    elements.bookingList.innerHTML = `<div class="empty-state">予約データがありません。</div>`;
    return;
  }

  elements.bookingList.innerHTML = bookings
    .map((booking) => {
      const status = getStatusOption(getBookingStatus(booking));
      const isSelected = state.selectedId === booking.id;
      const workPlan = getWorkPlan(booking);
      return `
        <button class="admin-booking-card ${isSelected ? "is-selected" : ""}" type="button" data-booking-id="${booking.id}">
          <span class="admin-booking-top">
            <span class="status-pill status-${status.id}">${status.label}</span>
            <span>${formatBookingPeriod(booking)}</span>
          </span>
          <strong>${escapeHtml(booking.customer?.name || "お名前未入力")}</strong>
          <span>${escapeHtml(booking.menuName || "メニュー未設定")}</span>
          <span class="admin-booking-meta">
            <small>${escapeHtml(booking.customer?.carModel || booking.vehicleName || "車両未設定")}</small>
            ${isBookingLoanerRequired(booking) ? `<small>代車あり</small>` : ""}
            ${getVehicleLeadStaffName(booking) ? `<small>主担当 ${escapeHtml(getVehicleLeadStaffName(booking))}</small>` : ""}
            <small>${workPlan.requiredStaff}名 x ${formatHours(workPlan.plannedWorkHours)}h</small>
            <small>${formatHours(workPlan.plannedStaffHours)}人時</small>
            <small>${getBoothOccupancyLabel(booking)}</small>
            <small>${formatYen(Number(booking.price) || 0)}</small>
          </span>
        </button>
      `;
    })
    .join("");
}

function renderDetail() {
  const booking = getSelectedBooking();

  if (!booking) {
    elements.detailEmpty.hidden = false;
    elements.detailContent.hidden = true;
    return;
  }

  const admin = getAdminRecord(booking);
  const customer = booking.customer || {};
  const workPlan = getWorkPlan(booking);
  elements.detailEmpty.hidden = true;
  elements.detailContent.hidden = false;

  elements.detailTitle.textContent = customer.name || "お名前未入力";
  elements.detailSubTitle.textContent = `${formatBookingPeriod(booking)} / ${booking.menuName || "メニュー未設定"}`;
  elements.bookingStatus.innerHTML = statusOptions
    .map(
      (status) =>
        `<option value="${status.id}" ${admin.status === status.id ? "selected" : ""}>${status.label}</option>`,
    )
    .join("");
  elements.cancelBookingButton.textContent = admin.status === "canceled" ? "キャンセル復帰" : "キャンセル";
  elements.cancelBookingButton.classList.toggle("restore-button", admin.status === "canceled");
  elements.deleteBookingButton.textContent = pendingDeleteId === booking.id ? "もう一度押して削除" : "完全削除";
  elements.deleteBookingButton.classList.toggle("is-confirming", pendingDeleteId === booking.id);
  elements.detailStartDate.value = booking.startDate || "";
  elements.detailStartTime.value = booking.start || "";
  elements.detailEndDate.value = booking.endDate || "";
  elements.detailEndTime.value = booking.end || "";
  elements.detailLoanerRequired.value = String(isBookingLoanerRequired(booking));
  elements.detailMenuName.value = booking.menuName || "";
  elements.detailVehicleName.value = booking.vehicleName || "";
  elements.detailPrice.value = Number(booking.price) || 0;
  elements.detailOptionsSummary.value = getBookingOptionsSummary(booking);
  elements.detailSameDayChangeNote.value = booking.sameDayChangeNote || "";
  elements.requiredStaff.value = workPlan.requiredStaff;
  elements.plannedWorkHours.value = formatNumberInput(workPlan.plannedWorkHours);
  elements.plannedStaffHours.value = `${formatHours(workPlan.plannedStaffHours)}人時`;
  elements.actualStaff.value = Number(admin.actualStaff) || 0;
  elements.actualStart.value = admin.actualStart || "";
  elements.actualEnd.value = admin.actualEnd || "";
  elements.detailCustomerName.value = customer.name || "";
  elements.detailCustomerPhone.value = customer.phone || "";
  elements.detailCarModel.value = customer.carModel || "";
  elements.detailVehicleNumber.value = customer.vehicleNumber || "";
  elements.detailBodyColor.value = customer.bodyColor || "";
  elements.detailVisitReason.innerHTML = visitReasonOptions
    .map(
      (reason) =>
        `<option value="${escapeHtml(reason)}" ${getVisitReason(customer) === reason ? "selected" : ""}>${reason || "未選択"}</option>`,
    )
    .join("");
  elements.detailAddress.value = customer.address || "";
  elements.workResult.value = admin.workResult || "";
  elements.actualWorkHours.value = admin.actualWorkHours ? formatNumberInput(admin.actualWorkHours) : "";
  elements.finishCondition.value = admin.finishCondition || "";
  elements.nextSuggestion.value = admin.nextSuggestion || "";
  elements.internalNote.value = admin.internalNote || "";
  renderAssignedStaffPicker(getAssignedStaffIds(booking));
  renderVehicleLeadStaffSelect(admin.vehicleLeadStaffId);
  updateStaffHourPreviews();

  elements.customerSummary.innerHTML = `
    <div class="summary-line"><span>料金</span><strong>${formatYen(Number(booking.price) || 0)}</strong></div>
    <div class="summary-line"><span>車両サイズ</span><strong>${escapeHtml(booking.vehicleName || "-")}</strong></div>
    <div class="summary-line"><span>代車</span><strong>${getLoanerLabel(isBookingLoanerRequired(booking))}</strong></div>
    <div class="summary-line"><span>区分</span><strong>${menuCategoryLabels[booking.category] || booking.category || "-"}</strong></div>
    <div class="summary-line"><span>内容</span><strong>${escapeHtml(getBookingOptionsSummary(booking))}</strong></div>
    <div class="summary-line"><span>予定作業</span><strong>${workPlan.requiredStaff}名 x ${formatHours(workPlan.plannedWorkHours)}h</strong></div>
    <div class="summary-line"><span>予定人時</span><strong>${formatHours(workPlan.plannedStaffHours)}人時</strong></div>
    <div class="summary-line"><span>車両主担当</span><strong>${escapeHtml(getVehicleLeadStaffName(booking) || "未設定")}</strong></div>
    <div class="summary-line"><span>ブース占有</span><strong>${getBoothOccupancyLabel(booking)}</strong></div>
    <div class="summary-line"><span>作業配分</span><strong>${getWorkDistributionLabel(booking)}</strong></div>
  `;

  renderCustomerHistory(booking);
  elements.requestLog.innerHTML = renderRequestLog(customer, booking);
}

function saveSelectedBooking() {
  const bookingIndex = state.bookings.findIndex((booking) => booking.id === state.selectedId);
  if (bookingIndex < 0) return;

  const booking = state.bookings[bookingIndex];
  const basePlan = getBaseWorkPlan(booking);
  const requiredStaff = clampNumber(Number(elements.requiredStaff.value), 1, 8, basePlan.requiredStaff);
  const plannedWorkHours = clampNumber(Number(elements.plannedWorkHours.value), 0.25, 48, basePlan.plannedWorkHours);
  const actualStaff = clampNumber(Number(elements.actualStaff.value), 0, 8, 0);
  const actualWorkHours = clampNumber(Number(elements.actualWorkHours.value), 0, 72, 0);
  const assignedStaffIds = getCheckedStaffIds();
  const vehicleLeadStaffId = elements.vehicleLeadStaff.value;
  const previousBooking = booking;
  const menuName = elements.detailMenuName.value.trim() || booking.menuName || "メニュー未設定";
  const vehicleName = elements.detailVehicleName.value.trim() || booking.vehicleName || "車両未設定";
  const price = clampNumber(Number(elements.detailPrice.value), 0, 9999999, Number(booking.price) || 0);
  const optionsSummary = elements.detailOptionsSummary.value.trim() || "通常";
  const sameDayChangeNote = elements.detailSameDayChangeNote.value.trim();
  const loanerRequired = elements.detailLoanerRequired.value === "true";
  const hasServiceChange =
    menuName !== (booking.menuName || "") ||
    vehicleName !== (booking.vehicleName || "") ||
    price !== (Number(booking.price) || 0) ||
    optionsSummary !== getBookingOptionsSummary(booking) ||
    sameDayChangeNote !== (booking.sameDayChangeNote || "") ||
    loanerRequired !== isBookingLoanerRequired(booking);

  const updatedBooking = {
    ...booking,
    menuName,
    vehicleName,
    price,
    optionsSummary,
    sameDayChangeNote,
    loanerRequired,
    sameDayUpdatedAt: hasServiceChange ? new Date().toISOString() : booking.sameDayUpdatedAt || "",
    startDate: elements.detailStartDate.value || booking.startDate,
    start: elements.detailStartTime.value || booking.start,
    endDate: elements.detailEndDate.value || booking.endDate,
    end: elements.detailEndTime.value || booking.end,
    customer: {
      ...(booking.customer || {}),
      name: elements.detailCustomerName.value.trim(),
      phone: elements.detailCustomerPhone.value.trim(),
      carModel: elements.detailCarModel.value.trim(),
      vehicleNumber: elements.detailVehicleNumber.value.trim(),
      bodyColor: elements.detailBodyColor.value.trim(),
      visitReason: elements.detailVisitReason.value,
      address: elements.detailAddress.value.trim(),
    },
    admin: {
      ...getAdminRecord(booking),
      status: elements.bookingStatus.value,
      planVersion: workPlanVersion,
      requiredStaff,
      plannedWorkHours,
      plannedStaffHours: requiredStaff * plannedWorkHours,
      actualStaff,
      actualWorkHours,
      actualStaffHours: actualStaff * actualWorkHours,
      assignedStaffIds,
      assignedStaff: getStaffNames(assignedStaffIds).join(" / "),
      vehicleLeadStaffId,
      vehicleLeadStaffName: getStaffName(vehicleLeadStaffId),
      actualStart: elements.actualStart.value,
      actualEnd: elements.actualEnd.value,
      workResult: elements.workResult.value.trim(),
      finishCondition: elements.finishCondition.value,
      nextSuggestion: elements.nextSuggestion.value.trim(),
      internalNote: elements.internalNote.value.trim(),
      updatedAt: new Date().toISOString(),
    },
  };

  state.bookings[bookingIndex] = appendChangeHistory(updatedBooking, "admin", previousBooking);
  writeBookings(state.bookings);
  syncBookingToRemote(state.bookings[bookingIndex], "update");
  if (hasBookingChange(previousBooking, state.bookings[bookingIndex])) {
    queueBookingChangeNotifications(state.bookings[bookingIndex], "admin", previousBooking);
  }
  if (getBookingStatus(previousBooking) !== "done" && getBookingStatus(state.bookings[bookingIndex]) === "done") {
    queueCompletionFollowupNotifications(state.bookings[bookingIndex]);
  }
  render();
  showToast("予約管理データを保存しました。変更がある場合は双方への案内予定を作成しました。");
}

function renderRequestLog(customer, booking) {
  const rows = [
    ["現在のメニュー・オプション", getBookingOptionsSummary(booking)],
    ["代車", getLoanerLabel(isBookingLoanerRequired(booking))],
    ["当日変更メモ", booking.sameDayChangeNote],
    ["ご来店のきっかけ", getVisitReason(customer)],
    ["気になる汚れ", customer.dirtConcern],
    ["ご要望", customer.request],
    ["追加相談", customer.additionalConsultation],
    ["当日メモ", customer.arrivalNote],
    ["郵便番号", customer.postalCode],
    ["LINE名", customer.lineProfile?.displayName],
    ["予約ID", booking.id],
  ].filter(([, value]) => value);

  if (!rows.length) {
    return `<div class="empty-state">予約時メモはありません。</div>`;
  }

  return rows
    .map(
      ([label, value]) => `
        <div class="request-row">
          <span>${label}</span>
          <strong>${escapeHtml(value)}</strong>
        </div>
      `,
    )
    .join("");
}

function renderCustomerHistory(booking) {
  const historyBookings = getCustomerHistoryBookings(booking);
  if (!historyBookings.length) {
    elements.customerHistoryList.innerHTML = `<div class="empty-state">同じお客様の予約履歴はまだありません。</div>`;
    return;
  }

  elements.customerHistoryList.innerHTML = historyBookings
    .map((historyBooking) => {
      const status = getStatusOption(getBookingStatus(historyBooking));
      const isCurrent = historyBooking.id === booking.id;
      return `
        <article class="customer-history-item ${isCurrent ? "is-current" : ""}">
          <div class="customer-history-top">
            <strong>${escapeHtml(formatBookingPeriod(historyBooking))}</strong>
            <span class="status-pill status-${status.id}">${status.label}${isCurrent ? " / 表示中" : ""}</span>
          </div>
          <div>${escapeHtml(historyBooking.menuName || "メニュー未設定")}</div>
          <div class="customer-history-meta">
            <small>${escapeHtml(historyBooking.vehicleName || historyBooking.customer?.carModel || "車両未設定")}</small>
            <small>代車${getLoanerLabel(isBookingLoanerRequired(historyBooking))}</small>
            <small>${formatYen(Number(historyBooking.price) || 0)}</small>
            <small>${escapeHtml(getBookingOptionsSummary(historyBooking))}</small>
          </div>
        </article>
      `;
    })
    .join("");
}

function getCustomerHistoryBookings(booking) {
  const customer = booking.customer || {};
  const phone = normalizeSearchText(customer.phone || "");
  const name = normalizeSearchText(customer.name || "");

  return [...state.bookings]
    .filter((candidate) => {
      const candidateCustomer = candidate.customer || {};
      if (phone) {
        return normalizeSearchText(candidateCustomer.phone || "") === phone;
      }
      return name && normalizeSearchText(candidateCustomer.name || "") === name;
    })
    .sort((a, b) => `${b.startDate} ${b.start}`.localeCompare(`${a.startDate} ${a.start}`));
}

function getFilteredBookings({ ignoreStatus = false } = {}) {
  const today = toISODate(new Date());
  const query = normalizeSearchText(state.searchQuery);

  return [...state.bookings]
    .filter((booking) => {
      if (!ignoreStatus && state.statusFilter !== "all" && getBookingStatus(booking) !== state.statusFilter) {
        return false;
      }
      if (state.rangeFilter === "today" && !isBookingWorkActiveOnDate(booking, today)) return false;
      if (state.rangeFilter === "upcoming" && booking.endDate < today) return false;
      if (state.rangeFilter === "past" && booking.endDate >= today) return false;
      if (!query) return true;

      const haystack = normalizeSearchText(
        [
          booking.menuName,
          booking.vehicleName,
          isBookingLoanerRequired(booking) ? "代車あり 必要" : "代車不要 不要",
          getBookingOptionsSummary(booking),
          booking.sameDayChangeNote,
          booking.customer?.name,
          booking.customer?.phone,
          booking.customer?.carModel,
          booking.customer?.vehicleNumber,
          booking.customer?.bodyColor,
          getVisitReason(booking.customer || {}),
          getVehicleLeadStaffName(booking),
          booking.customer?.address,
        ].join(" "),
      );
      return haystack.includes(query);
    })
    .sort((a, b) => `${a.startDate} ${a.start}`.localeCompare(`${b.startDate} ${b.start}`));
}

function getDailyLoad(date, bookings = state.bookings) {
  const activeBookings = bookings.filter((booking) => isBookingWorkActiveOnDate(booking, date));
  const boothBookings = bookings.filter((booking) => isBookingBoothActiveOnDate(booking, date));
  const loanerBookings = bookings.filter((booking) => isBookingLoanerActiveOnDate(booking, date));
  const dayStart = dateAt(date, "00:00");
  const dayEnd = dateAt(date, "23:59");
  const capacityStaffHours = getDailyCapacityStaffHours(date);
  let peakStaff = 0;
  let peakWashBooths = 0;
  let peakCoatingBooths = 0;
  let peakTotalBooths = 0;
  let peakLoaners = 0;
  let hasBoothConflict = false;
  let hasLoanerConflict = false;
  let requiredStaffHours = 0;

  for (let point = dayStart; point < dayEnd; point = addMinutes(point, slotStepMinutes)) {
    const segmentEnd = addMinutes(point, slotStepMinutes);
    const activeStaff = activeBookings.reduce((total, booking) => {
      const segments = getWorkSegments(booking);
      if (!segments.some((segment) => intervalsOverlap(segment.startAt, segment.endAt, point, segmentEnd))) return total;
      return total + getWorkPlan(booking).requiredStaff;
    }, 0);
    const activeBoothBookings = boothBookings.filter((booking) => {
      const interval = bookingToBoothInterval(booking);
      return intervalsOverlap(interval.startAt, interval.endAt, point, segmentEnd);
    });
    const activeWash = activeBoothBookings.filter((booking) => booking.category === "wash").length;
    const activeCoating = activeBoothBookings.filter((booking) => booking.category === "coating").length;
    const activeTotal = activeWash + activeCoating;
    const coatingLimit = activeWash > 0 ? totalBooths - washBoothCapacity : totalBooths;
    const activeLoaners = loanerBookings.filter((booking) => {
      const interval = bookingToInterval(booking);
      return intervalsOverlap(interval.startAt, interval.endAt, point, segmentEnd);
    }).length;

    peakStaff = Math.max(peakStaff, activeStaff);
    peakWashBooths = Math.max(peakWashBooths, activeWash);
    peakCoatingBooths = Math.max(peakCoatingBooths, activeCoating);
    peakTotalBooths = Math.max(peakTotalBooths, activeTotal);
    peakLoaners = Math.max(peakLoaners, activeLoaners);
    hasBoothConflict =
      hasBoothConflict ||
      activeWash > washBoothCapacity ||
      activeCoating > coatingLimit ||
      activeTotal > totalBooths;
    hasLoanerConflict = hasLoanerConflict || activeLoaners > loanerCarCapacity;
  }

  activeBookings.forEach((booking) => {
    requiredStaffHours += getStaffHoursForDate(booking, date);
  });

  return {
    bookingCount: activeBookings.length,
    requiredStaffHours,
    capacityStaffHours,
    peakStaff,
    peakWashBooths,
    peakCoatingBooths,
    peakTotalBooths,
    peakLoaners,
    hasBoothConflict,
    hasLoanerConflict,
  };
}

function getDailyCapacityStaffHours(date) {
  const hours = businessHours[parseISODate(date).getDay()];
  if (!hours) return 0;
  const workHours = (timeToMinutes(hours.close) - timeToMinutes(hours.open)) / 60;
  return getPresentStaffCount() * workHours;
}

function getStaffHoursForDate(booking, date) {
  const dayStart = dateAt(date, "00:00");
  const dayEnd = dateAt(date, "23:59");
  return getWorkSegments(booking).reduce((total, segment) => {
    const overlapStart = maxDate(segment.startAt, dayStart);
    const overlapEnd = minDate(segment.endAt, dayEnd);
    if (overlapEnd <= overlapStart) return total;
    return total + ((overlapEnd - overlapStart) / (60 * 60 * 1000)) * segment.staff;
  }, 0);
}

function isBookingWorkActiveOnDate(booking, date) {
  const dayStart = dateAt(date, "00:00");
  const dayEnd = dateAt(date, "23:59");
  return getWorkSegments(booking).some((segment) => intervalsOverlap(segment.startAt, segment.endAt, dayStart, dayEnd));
}

function isBookingBoothActiveOnDate(booking, date) {
  const interval = bookingToBoothInterval(booking);
  const dayStart = dateAt(date, "00:00");
  const dayEnd = dateAt(date, "23:59");
  return intervalsOverlap(interval.startAt, interval.endAt, dayStart, dayEnd);
}

function isBookingLoanerActiveOnDate(booking, date) {
  if (!isBookingLoanerRequired(booking)) return false;
  const interval = bookingToInterval(booking);
  const dayStart = dateAt(date, "00:00");
  const dayEnd = dateAt(date, "23:59");
  return intervalsOverlap(interval.startAt, interval.endAt, dayStart, dayEnd);
}

function toggleSelectedBookingCancellation() {
  const bookingIndex = state.bookings.findIndex((booking) => booking.id === state.selectedId);
  if (bookingIndex < 0) return;

  const booking = state.bookings[bookingIndex];
  const admin = getAdminRecord(booking);
  const isCanceled = admin.status === "canceled";
  const nextStatus = isCanceled ? admin.previousStatus || "confirmed" : "canceled";

  const updatedBooking = {
    ...booking,
    admin: {
      ...admin,
      status: nextStatus,
      previousStatus: isCanceled ? "" : admin.status,
      canceledAt: isCanceled ? "" : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  };
  state.bookings[bookingIndex] = appendChangeHistory(updatedBooking, "admin", booking);

  writeBookings(state.bookings);
  syncBookingToRemote(state.bookings[bookingIndex], "update");
  queueBookingChangeNotifications(
    state.bookings[bookingIndex],
    "admin",
    booking,
    isCanceled ? "予約キャンセルが復帰されました" : "予約がキャンセルされました",
  );
  render();
  showToast(isCanceled ? "キャンセルを復帰しました。双方への案内予定を作成しました。" : "予約をキャンセルしました。双方への案内予定を作成しました。");
}

function deleteSelectedBooking() {
  const bookingIndex = state.bookings.findIndex((booking) => booking.id === state.selectedId);
  if (bookingIndex < 0) return;

  const booking = state.bookings[bookingIndex];
  if (pendingDeleteId !== booking.id) {
    pendingDeleteId = booking.id;
    window.clearTimeout(pendingDeleteTimer);
    pendingDeleteTimer = window.setTimeout(() => {
      resetDeleteConfirmation();
    }, 5000);
    renderDetail();
    showToast("完全削除する場合は、5秒以内にもう一度「もう一度押して削除」を押してください。");
    return;
  }

  resetDeleteConfirmation();
  const visibleBefore = getFilteredBookings();
  const visibleIndex = visibleBefore.findIndex((visibleBooking) => visibleBooking.id === booking.id);

  state.bookings = state.bookings.filter((candidate) => candidate.id !== booking.id);
  writeBookings(state.bookings);
  deleteBookingFromRemote(booking.id);

  const visibleAfter = getFilteredBookings();
  state.selectedId = visibleAfter[visibleIndex]?.id || visibleAfter[visibleIndex - 1]?.id || visibleAfter[0]?.id || null;
  render();
  showToast("予約を完全削除しました。");
}

function resetDeleteConfirmation() {
  pendingDeleteId = null;
  window.clearTimeout(pendingDeleteTimer);
  pendingDeleteTimer = null;
  if (elements.deleteBookingButton) {
    elements.deleteBookingButton.classList.remove("is-confirming");
    elements.deleteBookingButton.textContent = "完全削除";
  }
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

function hasBookingChange(previousBooking, nextBooking) {
  return JSON.stringify(getBookingSnapshot(previousBooking)) !== JSON.stringify(getBookingSnapshot(nextBooking));
}

function getBookingSnapshot(booking) {
  return {
    period: formatBookingPeriod(booking),
    menuName: booking.menuName || "",
    vehicleName: booking.vehicleName || "",
    loanerRequired: getLoanerLabel(isBookingLoanerRequired(booking)),
    optionsSummary: getBookingOptionsSummary(booking),
    price: Number(booking.price) || 0,
    sameDayChangeNote: booking.sameDayChangeNote || "",
    status: getStatusOption(getBookingStatus(booking)).label,
    customerName: booking.customer?.name || "",
    customerPhone: booking.customer?.phone || "",
    carModel: booking.customer?.carModel || "",
    vehicleNumber: booking.customer?.vehicleNumber || "",
  };
}

function makeBookingChangeNotificationPlan(booking, actor, previousBooking, title = "予約内容が変更されました") {
  const actorLabel = actor === "admin" ? "管理者" : "お客様";
  const changeSummary = getBookingChangeSummary(previousBooking, booking);
  const nextPeriod = formatBookingPeriod(booking);
  const price = formatYen(booking.price || 0);
  const customerName = booking.customer?.name || "お客様";
  const base = `${customerName} / ${booking.storeName || getAdminStore(booking.storeId).name} / ${booking.menuName} / ${booking.vehicleName} / 日時：${nextPeriod} / 代車：${getLoanerLabel(isBookingLoanerRequired(booking))} / 合計：${price}`;

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
      targetAdmin: `trywash-${booking.storeId || state.storeId}`,
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
  if ((previousBooking.menuName || "") !== (nextBooking.menuName || "")) {
    changes.push(`メニュー：${previousBooking.menuName || "-"} → ${nextBooking.menuName || "-"}`);
  }
  if ((previousBooking.vehicleName || "") !== (nextBooking.vehicleName || "")) {
    changes.push(`車両サイズ：${previousBooking.vehicleName || "-"} → ${nextBooking.vehicleName || "-"}`);
  }
  if (isBookingLoanerRequired(previousBooking) !== isBookingLoanerRequired(nextBooking)) {
    changes.push(`代車：${getLoanerLabel(isBookingLoanerRequired(previousBooking))} → ${getLoanerLabel(isBookingLoanerRequired(nextBooking))}`);
  }
  if (getBookingOptionsSummary(previousBooking) !== getBookingOptionsSummary(nextBooking)) {
    changes.push(`オプション：${getBookingOptionsSummary(previousBooking)} → ${getBookingOptionsSummary(nextBooking)}`);
  }
  if (Number(previousBooking.price) !== Number(nextBooking.price)) {
    changes.push(`金額：${formatYen(previousBooking.price || 0)} → ${formatYen(nextBooking.price || 0)}`);
  }
  if (getBookingStatus(previousBooking) !== getBookingStatus(nextBooking)) {
    changes.push(`ステータス：${getStatusOption(getBookingStatus(previousBooking)).label} → ${getStatusOption(getBookingStatus(nextBooking)).label}`);
  }
  if (previousBooking.customer?.name !== nextBooking.customer?.name) {
    changes.push(`氏名：${previousBooking.customer?.name || "-"} → ${nextBooking.customer?.name || "-"}`);
  }
  if (previousBooking.customer?.phone !== nextBooking.customer?.phone) {
    changes.push(`電話番号：${previousBooking.customer?.phone || "-"} → ${nextBooking.customer?.phone || "-"}`);
  }
  if ((previousBooking.sameDayChangeNote || "") !== (nextBooking.sameDayChangeNote || "")) {
    changes.push(`当日変更メモ：${previousBooking.sameDayChangeNote || "-"} → ${nextBooking.sameDayChangeNote || "-"}`);
  }

  return changes.length ? `変更点：${changes.join(" / ")}` : "変更点：お客様情報または管理情報が更新されました。";
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

function queueCompletionFollowupNotifications(booking) {
  const queue = readLineNotificationQueue();
  const notices = makeCompletionFollowupNotificationPlan(booking).map((notice) => ({
    id: `${booking.id}-${notice.type}-${Date.now()}`,
    bookingId: booking.id,
    status: "pending",
    ...notice,
  }));

  localStorage.setItem(notificationStorageKey, JSON.stringify([...queue, ...notices]));
  syncMessagesToRemote(notices);
}

function makeCompletionFollowupNotificationPlan(booking) {
  const completedAt = new Date();
  const reviewAt = addDays(completedAt, 3);
  const maintenance6MonthsAt = addMonths(completedAt, 6);
  const maintenance12MonthsAt = addMonths(completedAt, 12);
  const customerName = booking.customer?.name || "お客様";
  const base = `${customerName} / ${booking.menuName || "施工メニュー"} / ${booking.vehicleName || "車両"} / 合計：${formatYen(booking.price || 0)}`;
  const targetLineUserId = booking.customer?.lineProfile?.userId || null;

  return [
    {
      type: "serviceCompleted",
      audience: "customer",
      channel: "line",
      targetLineUserId,
      label: "施工完了通知",
      sendAt: completedAt.toISOString(),
      message: `施工が完了しました。${base}。この度はTRY WASHをご利用いただきありがとうございます。`,
    },
    {
      type: "reviewRequest3days",
      audience: "customer",
      channel: "line",
      targetLineUserId,
      label: "口コミ依頼",
      sendAt: reviewAt.toISOString(),
      message: `施工後の状態はいかがでしょうか。よろしければ口コミのご協力をお願いいたします。${base}`,
    },
    {
      type: "maintenance6months",
      audience: "customer",
      channel: "line",
      targetLineUserId,
      label: "半年後メンテナンス案内",
      sendAt: maintenance6MonthsAt.toISOString(),
      message: `施工から半年のメンテナンス時期です。きれいな状態を保つため、メンテナンス洗車をご検討ください。${base}`,
    },
    {
      type: "maintenance12months",
      audience: "customer",
      channel: "line",
      targetLineUserId,
      label: "1年後メンテナンス案内",
      sendAt: maintenance12MonthsAt.toISOString(),
      message: `施工から1年のメンテナンス時期です。コーティング状態の点検とメンテナンスをご検討ください。${base}`,
    },
  ];
}

function readLineNotificationQueue() {
  try {
    return JSON.parse(localStorage.getItem(notificationStorageKey)) || [];
  } catch {
    return [];
  }
}

function getSelectedBooking() {
  return state.bookings.find((booking) => booking.id === state.selectedId) || null;
}

function getBookingStatus(booking) {
  return getAdminRecord(booking).status;
}

function getAdminRecord(booking) {
  const admin = booking.admin || {};
  const basePlan = getBaseWorkPlan(booking);
  const requiredStaff = clampNumber(Number(admin.requiredStaff), 1, 8, basePlan.requiredStaff);
  const plannedWorkHours = clampNumber(Number(admin.plannedWorkHours), 0.25, 48, basePlan.plannedWorkHours);
  const actualStaff = clampNumber(Number(admin.actualStaff), 0, 8, 0);
  const actualWorkHours = clampNumber(Number(admin.actualWorkHours), 0, 72, 0);
  return {
    status: admin.status || "new",
    previousStatus: admin.previousStatus || "",
    canceledAt: admin.canceledAt || "",
    planVersion: admin.planVersion || "",
    requiredStaff,
    plannedWorkHours,
    plannedStaffHours: requiredStaff * plannedWorkHours,
    actualStaff,
    actualWorkHours,
    actualStaffHours: actualStaff * actualWorkHours,
    assignedStaffIds: Array.isArray(admin.assignedStaffIds) ? admin.assignedStaffIds : [],
    assignedStaff: admin.assignedStaff || "",
    vehicleLeadStaffId: admin.vehicleLeadStaffId || "",
    vehicleLeadStaffName: admin.vehicleLeadStaffName || "",
    actualStart: admin.actualStart || "",
    actualEnd: admin.actualEnd || "",
    workResult: admin.workResult || "",
    finishCondition: admin.finishCondition || "",
    nextSuggestion: admin.nextSuggestion || "",
    internalNote: admin.internalNote || "",
    updatedAt: admin.updatedAt || booking.createdAt || "",
  };
}

function getRequiredStaff(booking) {
  return getWorkPlan(booking).requiredStaff;
}

function estimateRequiredStaff(booking) {
  return getBaseWorkPlan(booking).requiredStaff;
}

function getWorkPlan(booking) {
  const admin = getAdminRecord(booking);
  return {
    requiredStaff: admin.requiredStaff,
    plannedWorkHours: admin.plannedWorkHours,
    plannedStaffHours: admin.requiredStaff * admin.plannedWorkHours,
  };
}

function getBaseWorkPlan(booking) {
  const coatingHours = getCoatingWorkHours(booking.menuId, booking.vehicleId, booking.options || {});
  if (coatingHours) {
    return {
      requiredStaff: 2,
      plannedWorkHours: coatingHours,
    };
  }

  const selectedAddOns = Object.values(booking.options?.addOns || {}).filter(Boolean).length;
  let staff = menuStaffDefaults[booking.menuId] || (booking.category === "wash" ? 1 : 2);

  if (booking.vehicleId === "extraLarge" && booking.menuId !== "pure-wash") {
    staff += 1;
  }
  if (booking.options?.addLayer || selectedAddOns >= 2) {
    staff += 1;
  }

  return {
    requiredStaff: Math.min(staff, 4),
    plannedWorkHours: getFallbackWorkHours(booking),
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

function getFallbackWorkHours(booking) {
  const interval = bookingToInterval(booking);
  const hours = (interval.endAt - interval.startAt) / (60 * 60 * 1000);
  if (Number.isFinite(hours) && hours > 0 && hours <= 12) return hours;
  return 8;
}

function getStatusOption(statusId) {
  return statusOptions.find((status) => status.id === statusId) || statusOptions[0];
}

function countByStatus(statusId) {
  return state.bookings.filter((booking) => getBookingStatus(booking) === statusId).length;
}

function renderAssignedStaffPicker(assignedIds = []) {
  if (!state.staffRoster.length) {
    elements.assignedStaffPicker.innerHTML = `<div class="empty-state">スタッフを追加してください。</div>`;
    return;
  }

  elements.assignedStaffPicker.innerHTML = state.staffRoster
    .map(
      (staff) => `
        <label class="staff-choice">
          <input type="checkbox" value="${staff.id}" ${assignedIds.includes(staff.id) ? "checked" : ""} />
          <span>${escapeHtml(staff.name || "未設定")}</span>
        </label>
      `,
    )
    .join("");
}

function renderAssignedStaffPickerForCurrentBooking() {
  const booking = getSelectedBooking();
  if (!booking || elements.detailContent.hidden) return;
  renderAssignedStaffPicker(getCheckedStaffIds());
}

function renderVehicleLeadStaffSelect(selectedStaffId = "") {
  const options = [
    `<option value="">未設定</option>`,
    ...state.staffRoster.map(
      (staff) =>
        `<option value="${staff.id}" ${staff.id === selectedStaffId ? "selected" : ""}>${escapeHtml(staff.name || "未設定")}</option>`,
    ),
  ];
  elements.vehicleLeadStaff.innerHTML = options.join("");
}

function renderVehicleLeadStaffSelectForCurrentBooking() {
  const booking = getSelectedBooking();
  if (!booking || elements.detailContent.hidden) return;
  renderVehicleLeadStaffSelect(elements.vehicleLeadStaff.value || getAdminRecord(booking).vehicleLeadStaffId);
}

function getCheckedStaffIds() {
  return [...elements.assignedStaffPicker.querySelectorAll("input:checked")].map((input) => input.value);
}

function getAssignedStaffIds(booking) {
  const admin = booking.admin || {};
  if (Array.isArray(admin.assignedStaffIds) && admin.assignedStaffIds.length) {
    return admin.assignedStaffIds.filter((id) => state.staffRoster.some((staff) => staff.id === id));
  }

  const assignedNames = String(admin.assignedStaff || "")
    .split(/[、,/]/)
    .map((name) => name.trim())
    .filter(Boolean);

  return state.staffRoster
    .filter((staff) => assignedNames.some((name) => normalizeSearchText(staff.name) === normalizeSearchText(name)))
    .map((staff) => staff.id);
}

function getStaffNames(staffIds) {
  return staffIds
    .map((id) => state.staffRoster.find((staff) => staff.id === id)?.name?.trim())
    .filter(Boolean);
}

function getStaffName(staffId) {
  if (!staffId) return "";
  return state.staffRoster.find((staff) => staff.id === staffId)?.name?.trim() || "";
}

function getVehicleLeadStaffName(booking) {
  const admin = getAdminRecord(booking);
  return getStaffName(admin.vehicleLeadStaffId) || admin.vehicleLeadStaffName || "";
}

function normalizeStaffRoster(roster) {
  const source = Array.isArray(roster) && roster.length ? roster : defaultStaffRoster;
  return source.map((staff, index) => ({
    id: staff.id || `staff-${index + 1}`,
    name: staff.name || `スタッフ${index + 1}`,
  }));
}

function normalizePresentStaffIds(ids, roster = state?.staffRoster || defaultStaffRoster) {
  const rosterIds = roster.map((staff) => staff.id);
  if (!Array.isArray(ids) || !ids.length) {
    return rosterIds.slice(0, Math.min(3, rosterIds.length));
  }
  return ids.filter((id) => rosterIds.includes(id));
}

function writeStaffPrefs() {
  writePrefs({
    staffRoster: state.staffRoster,
    presentStaffIds: state.presentStaffIds,
  });
}

function getPresentStaffCount() {
  return state.presentStaffIds.filter((id) => state.staffRoster.some((staff) => staff.id === id)).length;
}

function getVisitReason(customer) {
  return customer.visitReason || "";
}

function formatDayLoadStatus(load, shortage, remaining) {
  if (load.hasBoothConflict) {
    return "ブース超過";
  }
  if (load.hasLoanerConflict) {
    return "代車超過";
  }
  if (shortage > 0) {
    return `不足 ${formatHours(shortage)}人時`;
  }
  return `残り ${formatHours(remaining)}人時`;
}

function getBoothOccupancyLabel(booking) {
  if (isCeramicBooking(booking)) {
    return "施工ブース2日";
  }
  if (booking.category === "wash") {
    return "洗車ブース当日";
  }
  return "施工ブース当日";
}

function getWorkDistributionLabel(booking) {
  const workPlan = getWorkPlan(booking);
  if (!isCeramicBooking(booking)) {
    return `当日 ${formatHours(workPlan.plannedWorkHours)}h`;
  }

  const firstDayHours = Math.max(0, workPlan.plannedWorkHours - ceramicFinalFinishHours);
  return `1日目 ${formatHours(firstDayHours)}h / 2日目 ${formatHours(ceramicFinalFinishHours)}h`;
}

function updateStaffHourPreviews() {
  const requiredStaff = clampNumber(Number(elements.requiredStaff.value), 1, 8, 1);
  const plannedWorkHours = clampNumber(Number(elements.plannedWorkHours.value), 0, 48, 0);
  const actualStaff = clampNumber(Number(elements.actualStaff.value), 0, 8, 0);
  const actualWorkHours = clampNumber(Number(elements.actualWorkHours.value), 0, 72, 0);
  elements.plannedStaffHours.value = `${formatHours(requiredStaff * plannedWorkHours)}人時`;
  elements.actualStaffHours.value = `${formatHours(actualStaff * actualWorkHours)}人時`;
}

function getBookingOptionsSummary(booking) {
  if (booking.optionsSummary) return booking.optionsSummary;
  return formatOptions(booking.options);
}

function isBookingLoanerRequired(booking) {
  return Boolean(booking.loanerRequired || booking.loanerCar?.required);
}

function getLoanerLabel(value) {
  return value ? "必要" : "不要";
}

function formatOptions(options = {}) {
  const labels = [];
  if (options.vehicleCondition === "withinMonth") labels.push("新車納車1ヶ月以内");
  if (options.vehicleCondition === "used") labels.push("経年車");
  if (options.stayDays) labels.push(options.stayDays === 3 ? "2泊3日" : "1泊2日");
  if (options.addLayer) labels.push("追加レイヤー");
  if (options.addWax) labels.push("高級ワックス");
  Object.entries(options.addOns || {}).forEach(([key, value]) => {
    if (value) labels.push(formatAddOnName(key));
  });
  return labels.length ? labels.join(" / ") : "通常";
}

function formatAddOnName(addOnId) {
  const names = {
    wheelFaceCoating: "ホイール表面",
    glassScaleRemoval: "ガラスウロコ",
    glassRepellent: "ガラス撥水",
    leatherShield: "レザーシールド",
    resinCoating: "樹脂",
    headlightCleaning: "ヘッドライト",
    leatherCleaning: "レザー清掃",
    leatherCoating: "レザー施工",
  };
  return names[addOnId] || addOnId;
}

function addSampleBookings() {
  const now = new Date();
  const day1 = findBusinessDateFrom(now, 0);
  const day2 = findBusinessDateFrom(day1, 1);
  const day3 = findBusinessDateFrom(day2, 1);
  const timestamp = Date.now();
  const samples = [
    makeSampleBooking({
      id: `sample-wash-${timestamp}`,
      date: toISODate(day1),
      slot: "13:00",
      endDate: toISODate(day1),
      end: "14:00",
      menuId: "pure-wash",
      menuName: "純水手洗い洗車",
      category: "wash",
      vehicleId: "standard",
      vehicleName: "普通車",
      price: 6500,
      customer: {
        name: "テスト 太郎",
        phone: "090-0000-0001",
        carModel: "プリウス",
        vehicleNumber: "横浜 300 あ 12-34",
        bodyColor: "ホワイト",
        visitReason: "Googleマップ",
        request: "水シミが気になる",
      },
    }),
    makeSampleBooking({
      id: `sample-coating-${timestamp}`,
      date: toISODate(day2),
      slot: "10:00",
      endDate: toISODate(day2),
      end: "18:00",
      menuId: "gold-coating",
      menuName: "GOLD COATING（ゴールドコーティング）",
      category: "coating",
      vehicleId: "large",
      vehicleName: "大型車",
      price: 132000,
      options: { vehicleCondition: "used", addLayer: false, addWax: false, addOns: {} },
      customer: {
        name: "予約 花子",
        phone: "090-0000-0002",
        postalCode: "238-0000",
        address: "神奈川県横須賀市",
        carModel: "アルファード",
        vehicleNumber: "横須賀 500 さ 56-78",
        bodyColor: "ブラック",
        visitReason: "ホームページ",
        additionalConsultation: "ホイールも相談したい",
      },
    }),
    makeSampleBooking({
      id: `sample-syncro-${timestamp}`,
      date: toISODate(day3),
      slot: "10:00",
      endDate: toISODate(findBusinessDateFrom(day3, 1)),
      end: "18:00",
      menuId: "q2-syncro",
      menuName: "GYEON Q² SYNCRO EVO",
      category: "coating",
      vehicleId: "extraLarge",
      vehicleName: "特大車",
      price: 358000,
      options: { vehicleCondition: "used", addLayer: false, addWax: false, addOns: {}, stayDays: 2 },
      customer: {
        name: "施工 次郎",
        phone: "090-0000-0003",
        carModel: "ランドクルーザー",
        vehicleNumber: "品川 300 す 90-12",
        bodyColor: "グレー",
        visitReason: "Instagram",
        arrivalNote: "午前中に電話確認",
      },
    }),
  ];

  state.bookings = [...state.bookings, ...samples];
  state.selectedId = samples[0].id;
  writeBookings(state.bookings);
  render();
  showToast("テスト予約を追加しました。");
}

function makeSampleBooking(sample) {
  const store = getAdminStore();
  const booking = {
    source: "user",
    storeId: store.id,
    storeName: store.name,
    googleCalendarLabel: store.googleCalendarLabel || `TRY WASH ${store.name}`,
    startDate: sample.date,
    start: sample.slot,
    endDate: sample.endDate,
    end: sample.end,
    options: sample.options || { addLayer: false, addWax: false, addOns: {} },
    createdAt: new Date().toISOString(),
    ...sample,
  };
  booking.admin = {
    status: "new",
    planVersion: workPlanVersion,
    requiredStaff: getBaseWorkPlan(booking).requiredStaff,
    plannedWorkHours: getBaseWorkPlan(booking).plannedWorkHours,
    plannedStaffHours: getBaseWorkPlan(booking).requiredStaff * getBaseWorkPlan(booking).plannedWorkHours,
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
  return booking;
}

function exportVisibleBookings() {
  const rows = getFilteredBookings();
  if (!rows.length) {
    showToast("出力する予約がありません。");
    return;
  }

  const header = [
    "予約ID",
    "店舗",
    "ステータス",
    "開始日",
    "開始",
    "終了日",
    "終了",
    "メニュー",
    "車両サイズ",
    "代車",
    "オプション内容",
    "氏名",
    "電話番号",
    "車種",
    "ナンバー",
    "ご来店のきっかけ",
    "料金",
    "当日変更メモ",
    "必要人数",
    "予定作業時間",
    "予定人時",
    "実績人数",
    "実作業時間",
    "実績人時",
    "担当",
    "車両主担当",
    "仕上がり",
    "作業記録",
  ];
  const csvRows = rows.map((booking) => {
    const admin = getAdminRecord(booking);
    const status = getStatusOption(admin.status);
    const workPlan = getWorkPlan(booking);
    return [
      booking.id,
      booking.storeName || getAdminStore(booking.storeId).name,
      status.label,
      booking.startDate,
      booking.start,
      booking.endDate,
      booking.end,
      booking.menuName,
      booking.vehicleName,
      getLoanerLabel(isBookingLoanerRequired(booking)),
      getBookingOptionsSummary(booking),
      booking.customer?.name,
      booking.customer?.phone,
      booking.customer?.carModel,
      booking.customer?.vehicleNumber,
      getVisitReason(booking.customer || {}),
      booking.price,
      booking.sameDayChangeNote,
      workPlan.requiredStaff,
      workPlan.plannedWorkHours,
      workPlan.plannedStaffHours,
      admin.actualStaff,
      admin.actualWorkHours,
      admin.actualStaffHours,
      admin.assignedStaff,
      getVehicleLeadStaffName(booking),
      admin.finishCondition,
      admin.workResult,
    ];
  });
  const csv = [header, ...csvRows].map((row) => row.map(csvCell).join(",")).join("\n");
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `trywash-bookings-${toISODate(new Date())}.csv`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showToast("CSVを出力しました。");
}

function csvCell(value) {
  const text = value == null ? "" : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

function getAdminStore(storeId = activeAdminStoreId) {
  return adminStores.find((store) => store.id === storeId) || adminStores[0];
}

function getStoreStorageKey(storeId = activeAdminStoreId) {
  return `trywash-${storeId}-bookings-v4`;
}

function configureRemoteStore(storeId = activeAdminStoreId) {
  if (!window.TryWashApi?.config) return;
  const store = getAdminStore(storeId);
  window.TryWashApi.config.storeId = store.id;
  window.TryWashApi.config.storeName = store.name;
}

function readBookings() {
  try {
    const store = getAdminStore();
    const bookings = JSON.parse(localStorage.getItem(getStoreStorageKey(store.id))) || [];
    return bookings
      .filter((booking) => booking.startDate && booking.endDate && booking.category)
      .map((booking) => ({
        ...booking,
        storeId: booking.storeId || store.id,
        storeName: booking.storeName || store.name,
        googleCalendarLabel: booking.googleCalendarLabel || store.googleCalendarLabel || `TRY WASH ${store.name}`,
        admin: getAdminRecord(booking),
      }));
  } catch {
    return [];
  }
}

function writeBookings(bookings) {
  const store = getAdminStore();
  const normalizedBookings = bookings.map((booking) => ({
    ...booking,
    storeId: booking.storeId || store.id,
    storeName: booking.storeName || store.name,
    googleCalendarLabel: booking.googleCalendarLabel || store.googleCalendarLabel || `TRY WASH ${store.name}`,
  }));
  localStorage.setItem(getStoreStorageKey(store.id), JSON.stringify(normalizedBookings));
}

async function hydrateRemoteBookings() {
  if (!window.TryWashApi?.canUseRemoteApi()) return;
  configureRemoteStore(state.storeId);

  try {
    const response = await window.TryWashApi.listReservations();
    const remoteBookings = normalizeRemoteBookingsResponse(response);
    if (!remoteBookings.length) return;

    state.bookings = mergeBookings(state.bookings, remoteBookings).map((booking) => ({ ...booking, admin: getAdminRecord(booking) }));
    writeBookings(state.bookings);
    render();
  } catch (error) {
    console.warn("予約データの共通DB読み込みをスキップしました。", error);
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
  if (!window.TryWashApi?.canUseRemoteApi()) return;
  configureRemoteStore(booking.storeId || state.storeId);

  try {
    await window.TryWashApi.saveReservation(booking, mode);
  } catch (error) {
    console.warn("予約データの共通DB同期を保留しました。", error);
  }
}

async function deleteBookingFromRemote(bookingId) {
  if (!window.TryWashApi?.canUseRemoteApi()) return;
  configureRemoteStore(state.storeId);

  try {
    await window.TryWashApi.deleteReservation(bookingId);
  } catch (error) {
    console.warn("予約削除の共通DB同期を保留しました。", error);
  }
}

async function syncMessagesToRemote(notices) {
  if (!window.TryWashApi?.canUseRemoteApi() || !notices.length) return;
  configureRemoteStore(state.storeId);

  try {
    await window.TryWashApi.queueMessages(notices);
  } catch (error) {
    console.warn("LINE通知キューの共通DB同期を保留しました。", error);
  }
}

function readPrefs() {
  try {
    return JSON.parse(localStorage.getItem(adminPrefsKey)) || {};
  } catch {
    return {};
  }
}

function writePrefs(nextPrefs) {
  localStorage.setItem(adminPrefsKey, JSON.stringify({ ...readPrefs(), ...nextPrefs }));
}

function bookingToInterval(booking) {
  return {
    startAt: dateAt(booking.startDate, booking.start),
    endAt: dateAt(booking.endDate, booking.end),
  };
}

function bookingToBoothInterval(booking) {
  return bookingToInterval(booking);
}

function getWorkSegments(booking) {
  const workPlan = getWorkPlan(booking);
  const startAt = dateAt(booking.startDate, booking.start);
  const staff = workPlan.requiredStaff;

  if (!isCeramicBooking(booking)) {
    return [{ startAt, endAt: addMinutes(startAt, workPlan.plannedWorkHours * 60), staff }];
  }

  const finalHours = Math.min(ceramicFinalFinishHours, workPlan.plannedWorkHours);
  const firstDayHours = Math.max(0, workPlan.plannedWorkHours - finalHours);
  const finalEndAt = dateAt(booking.endDate, booking.end);
  const finalStartAt = addMinutes(finalEndAt, -finalHours * 60);
  const segments = [];

  if (firstDayHours > 0) {
    segments.push({ startAt, endAt: addMinutes(startAt, firstDayHours * 60), staff });
  }
  if (finalHours > 0) {
    segments.push({ startAt: finalStartAt, endAt: finalEndAt, staff });
  }

  return segments;
}

function isCeramicBooking(booking) {
  return booking.menuId === "q2-pure-mohs" || booking.menuId === "q2-syncro";
}

function intervalsOverlap(startA, endA, startB, endB) {
  return startA < endB && endA > startB;
}

function maxDate(dateA, dateB) {
  return dateA > dateB ? dateA : dateB;
}

function minDate(dateA, dateB) {
  return dateA < dateB ? dateA : dateB;
}

function findBusinessDateFrom(fromDate, minOffset) {
  for (let offset = minOffset; offset < minOffset + 21; offset += 1) {
    const candidate = addDays(fromDate, offset);
    if (businessHours[candidate.getDay()]) return candidate;
  }
  return fromDate;
}

function addDays(date, amount) {
  const next = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  next.setDate(next.getDate() + amount);
  return next;
}

function addMonths(date, amount) {
  const next = new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes());
  next.setMonth(next.getMonth() + amount);
  return next;
}

function addMinutes(date, amount) {
  return new Date(date.getTime() + amount * 60 * 1000);
}

function timeToMinutes(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

function minutesToTime(totalMinutes) {
  const hours = Math.floor(totalMinutes / 60) % 24;
  const minutes = totalMinutes % 60;
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
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

function formatShortDate(date) {
  const parsed = parseISODate(date);
  return `${parsed.getMonth() + 1}/${parsed.getDate()}(${weekdays[parsed.getDay()]})`;
}

function parseISODate(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function formatBookingPeriod(booking) {
  if (booking.startDate === booking.endDate) {
    return `${formatShortDate(booking.startDate)} ${booking.start}-${booking.end}`;
  }
  return `${formatShortDate(booking.startDate)} ${booking.start} - ${formatShortDate(booking.endDate)} ${booking.end}`;
}

function formatYen(value) {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatHours(value) {
  const number = Number(value) || 0;
  return Number.isInteger(number) ? String(number) : String(Math.round(number * 100) / 100);
}

function formatNumberInput(value) {
  return formatHours(value);
}

function normalizeSearchText(value) {
  return String(value)
    .normalize("NFKC")
    .toLowerCase()
    .replace(/[・\sー-]/g, "");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function clampNumber(value, min, max, fallback) {
  if (!Number.isFinite(value)) return fallback;
  return Math.min(max, Math.max(min, value));
}

function scrollDetailIntoView() {
  if (window.matchMedia("(max-width: 980px)").matches) {
    elements.detailContent.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("is-visible");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    elements.toast.classList.remove("is-visible");
  }, 2800);
}
