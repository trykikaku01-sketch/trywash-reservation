(function () {
  const storageKey = "trywash-yokosuka-bookings-v4";
  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
  const statusLabels = {
    new: "未確認",
    confirmed: "確定",
    checked_in: "入庫済",
    working: "作業中",
    done: "完了",
    follow_up: "フォロー",
    canceled: "キャンセル",
  };

  const state = {
    monthCursor: startOfMonth(new Date()),
    bookings: [],
    refreshTimer: null,
  };

  const elements = {
    canvas: document.querySelector("#reservationBoardCanvas"),
    updatedAt: document.querySelector("#boardUpdatedAt"),
    prevMonth: document.querySelector("#boardPrevMonth"),
    nextMonth: document.querySelector("#boardNextMonth"),
    thisMonth: document.querySelector("#boardThisMonth"),
    saveImage: document.querySelector("#boardSaveImage"),
  };

  init();

  function init() {
    elements.prevMonth.addEventListener("click", () => {
      state.monthCursor = startOfMonth(addMonths(state.monthCursor, -1));
      renderBoard();
    });
    elements.nextMonth.addEventListener("click", () => {
      state.monthCursor = startOfMonth(addMonths(state.monthCursor, 1));
      renderBoard();
    });
    elements.thisMonth.addEventListener("click", () => {
      state.monthCursor = startOfMonth(new Date());
      renderBoard();
    });
    elements.saveImage.addEventListener("click", saveBoardImage);

    refreshBookings();
    state.refreshTimer = window.setInterval(refreshBookings, 60000);
  }

  async function refreshBookings() {
    state.bookings = await loadBookings();
    renderBoard();
    elements.updatedAt.textContent = `${formatDateTime(new Date())} 更新 / ${state.bookings.length}件`;
  }

  async function loadBookings() {
    const remoteBookings = await loadRemoteBookings();
    if (remoteBookings.length) return normalizeBookings(remoteBookings);
    return normalizeBookings(readLocalBookings());
  }

  async function loadRemoteBookings() {
    if (!window.TryWashApi?.canUseRemoteApi()) return [];

    try {
      const response = await window.TryWashApi.listReservations();
      if (Array.isArray(response)) return response;
      if (Array.isArray(response?.reservations)) return response.reservations;
      if (Array.isArray(response?.bookings)) return response.bookings;
    } catch (error) {
      console.warn("予約状況カレンダーの共通DB読み込みをスキップしました。", error);
    }

    return [];
  }

  function readLocalBookings() {
    try {
      return JSON.parse(localStorage.getItem(storageKey)) || [];
    } catch {
      return [];
    }
  }

  function normalizeBookings(bookings) {
    return [...(bookings || [])]
      .filter((booking) => booking?.startDate && booking?.start)
      .filter((booking) => !["canceled", "deleted"].includes(getBookingStatus(booking)))
      .sort((a, b) => `${a.startDate} ${a.start}`.localeCompare(`${b.startDate} ${b.start}`));
  }

  function renderBoard() {
    const canvas = elements.canvas;
    const ctx = canvas.getContext("2d");
    const monthStart = startOfMonth(state.monthCursor);
    const gridStart = startOfWeek(monthStart);
    const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0);
    const title = `${monthStart.getFullYear()}年${monthStart.getMonth() + 1}月 予約状況`;
    const cells = Array.from({ length: 42 }, (_, index) => addDays(gridStart, index));

    drawBackground(ctx, canvas);
    drawTitle(ctx, title);
    drawLegend(ctx);
    drawWeekHeaders(ctx);

    cells.forEach((day, index) => {
      drawDayCell(ctx, day, index, monthStart, monthEnd);
    });
  }

  function drawBackground(ctx, canvas) {
    ctx.fillStyle = "#f7f5ef";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const gradient = ctx.createLinearGradient(34, 30, canvas.width - 34, canvas.height - 30);
    gradient.addColorStop(0, "#ffffff");
    gradient.addColorStop(0.62, "#fffaf0");
    gradient.addColorStop(1, "#f2ead7");
    ctx.fillStyle = gradient;
    roundRect(ctx, 34, 30, canvas.width - 68, canvas.height - 60, 20);
    ctx.fill();
    ctx.strokeStyle = "rgba(185, 138, 45, 0.32)";
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  function drawTitle(ctx, title) {
    ctx.fillStyle = "#171511";
    ctx.font = "700 42px sans-serif";
    ctx.fillText(title, 64, 92);
    ctx.fillStyle = "#6f685a";
    ctx.font = "700 18px sans-serif";
    ctx.fillText("TRY WASH 横須賀店", 64, 126);
  }

  function drawLegend(ctx) {
    const items = [
      ["#b98a2d", "予約あり"],
      ["#171511", "複数予約"],
      ["#9c9382", "予約なし"],
    ];
    let x = 1010;
    items.forEach(([color, label]) => {
      ctx.fillStyle = color;
      roundRect(ctx, x, 78, 18, 18, 9);
      ctx.fill();
      ctx.fillStyle = "#4b4539";
      ctx.font = "700 16px sans-serif";
      ctx.fillText(label, x + 26, 93);
      x += 112;
    });
  }

  function drawWeekHeaders(ctx) {
    const grid = getGridMetrics();
    weekdays.forEach((weekday, index) => {
      const x = grid.x + index * grid.cellW;
      ctx.fillStyle = index === 0 ? "#9b3429" : index === 6 ? "#285a88" : "#4b4539";
      ctx.font = "800 18px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(weekday, x + grid.cellW / 2, grid.y - 16);
    });
    ctx.textAlign = "left";
  }

  function drawDayCell(ctx, day, index, monthStart) {
    const grid = getGridMetrics();
    const col = index % 7;
    const row = Math.floor(index / 7);
    const x = grid.x + col * grid.cellW;
    const y = grid.y + row * grid.cellH;
    const date = toISODate(day);
    const bookings = getBookingsForDate(date);
    const inMonth = day.getMonth() === monthStart.getMonth();
    const isToday = date === toISODate(new Date());

    ctx.fillStyle = inMonth ? "#ffffff" : "#f2eee5";
    ctx.strokeStyle = isToday ? "#b98a2d" : "#ded6c4";
    ctx.lineWidth = isToday ? 3 : 1;
    roundRect(ctx, x + 5, y + 5, grid.cellW - 10, grid.cellH - 10, 12);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = inMonth ? "#171511" : "#9c9382";
    ctx.font = "800 24px sans-serif";
    ctx.fillText(String(day.getDate()), x + 18, y + 38);

    drawBookingCount(ctx, bookings.length, x + grid.cellW - 72, y + 18);
    drawBookingRows(ctx, bookings, x, y, grid.cellW, grid.cellH, inMonth);
  }

  function drawBookingCount(ctx, count, x, y) {
    const color = count > 1 ? "#171511" : count === 1 ? "#b98a2d" : "#9c9382";
    ctx.fillStyle = color;
    roundRect(ctx, x, y, 48, 24, 12);
    ctx.fill();
    ctx.fillStyle = "#ffffff";
    ctx.font = "800 13px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(count ? `${count}件` : "空", x + 24, y + 16);
    ctx.textAlign = "left";
  }

  function drawBookingRows(ctx, bookings, x, y, cellW, cellH, inMonth) {
    const rows = bookings.slice(0, 4);
    rows.forEach((booking, index) => {
      const rowY = y + 54 + index * 27;
      const status = getBookingStatus(booking);
      ctx.fillStyle = status === "done" ? "#edf7e8" : status === "working" ? "#fff6df" : "#fffaf0";
      roundRect(ctx, x + 13, rowY, cellW - 26, 22, 6);
      ctx.fill();
      ctx.fillStyle = inMonth ? "#171511" : "#8f846d";
      ctx.font = "800 13px sans-serif";
      const label = `${booking.start} ${booking.menuName || "予約"} ${booking.customer?.name || ""}`;
      ctx.fillText(truncateText(ctx, label, cellW - 40), x + 20, rowY + 15);
    });

    if (bookings.length > rows.length) {
      ctx.fillStyle = "#6f685a";
      ctx.font = "800 13px sans-serif";
      ctx.fillText(`他${bookings.length - rows.length}件`, x + 18, y + cellH - 18);
    }
  }

  function getBookingsForDate(date) {
    return state.bookings.filter((booking) => booking.startDate === date);
  }

  function getBookingStatus(booking) {
    return booking.admin?.status || booking.status || "new";
  }

  function saveBoardImage() {
    const link = document.createElement("a");
    const month = `${state.monthCursor.getFullYear()}-${String(state.monthCursor.getMonth() + 1).padStart(2, "0")}`;
    link.download = `trywash-reservations-${month}.png`;
    link.href = elements.canvas.toDataURL("image/png");
    link.click();
  }

  function getGridMetrics() {
    return { x: 54, y: 184, cellW: 184, cellH: 124 };
  }

  function truncateText(ctx, text, maxWidth) {
    if (ctx.measureText(text).width <= maxWidth) return text;
    let next = text;
    while (next.length && ctx.measureText(`${next}…`).width > maxWidth) {
      next = next.slice(0, -1);
    }
    return `${next}…`;
  }

  function roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
  }

  function formatDateTime(date) {
    return `${date.getMonth() + 1}/${date.getDate()} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  }

  function startOfMonth(date) {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  function startOfWeek(date) {
    const next = new Date(date);
    next.setDate(next.getDate() - next.getDay());
    next.setHours(0, 0, 0, 0);
    return next;
  }

  function addDays(date, days) {
    const next = new Date(date);
    next.setDate(next.getDate() + days);
    return next;
  }

  function addMonths(date, months) {
    return new Date(date.getFullYear(), date.getMonth() + months, 1);
  }

  function toISODate(date) {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  }
})();
