const storageKey = "trywash-owner-staff-evaluation-v1";
const sessionKey = "trywash-owner-staff-evaluation-unlocked";
const ownerPasscode = "trywash-owner";
const allowedRoles = ["代表者", "オーナー"];

const evaluationItems = [
  { id: "technical", label: "技術力" },
  { id: "service", label: "接客力" },
  { id: "proposal", label: "提案力" },
  { id: "sns", label: "SNS貢献" },
  { id: "store", label: "店舗貢献" },
];

const elements = {
  accessPanel: document.querySelector("#accessPanel"),
  accessForm: document.querySelector("#accessForm"),
  accessRole: document.querySelector("#accessRole"),
  accessCode: document.querySelector("#accessCode"),
  accessMessage: document.querySelector("#accessMessage"),
  appShell: document.querySelector("#appShell"),
  lockButton: document.querySelector("#lockButton"),
  metricGrid: document.querySelector("#metricGrid"),
  staffList: document.querySelector("#staffList"),
  addStaffButton: document.querySelector("#addStaffButton"),
  basicForm: document.querySelector("#basicForm"),
  staffName: document.querySelector("#staffName"),
  hireDate: document.querySelector("#hireDate"),
  staffRole: document.querySelector("#staffRole"),
  employmentType: document.querySelector("#employmentType"),
  performanceForm: document.querySelector("#performanceForm"),
  recordMonth: document.querySelector("#recordMonth"),
  caseCount: document.querySelector("#caseCount"),
  salesAmount: document.querySelector("#salesAmount"),
  profitAmount: document.querySelector("#profitAmount"),
  workHours: document.querySelector("#workHours"),
  workPeople: document.querySelector("#workPeople"),
  performanceList: document.querySelector("#performanceList"),
  evaluationGrid: document.querySelector("#evaluationGrid"),
  interviewForm: document.querySelector("#interviewForm"),
  interviewDate: document.querySelector("#interviewDate"),
  evaluationComment: document.querySelector("#evaluationComment"),
  interviewContent: document.querySelector("#interviewContent"),
  issueText: document.querySelector("#issueText"),
  improvementText: document.querySelector("#improvementText"),
  goalText: document.querySelector("#goalText"),
  interviewList: document.querySelector("#interviewList"),
  exportButton: document.querySelector("#exportButton"),
  toast: document.querySelector("#toast"),
};

let state = readState();

bindEvents();
if (sessionStorage.getItem(sessionKey) === "true") {
  unlockApp();
}

function bindEvents() {
  elements.accessForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const role = elements.accessRole.value;
    const code = elements.accessCode.value.trim();

    if (!allowedRoles.includes(role)) {
      elements.accessMessage.textContent = "このシステムは代表者・オーナーのみ閲覧可能です。";
      return;
    }
    if (code !== ownerPasscode) {
      elements.accessMessage.textContent = "パスコードが一致しません。";
      return;
    }

    sessionStorage.setItem(sessionKey, "true");
    unlockApp();
  });

  elements.lockButton.addEventListener("click", () => {
    sessionStorage.removeItem(sessionKey);
    elements.appShell.hidden = true;
    elements.accessPanel.hidden = false;
    elements.accessCode.value = "";
  });

  elements.addStaffButton.addEventListener("click", () => {
    const staff = createStaff();
    state.staff.push(staff);
    state.selectedStaffId = staff.id;
    writeState();
    render();
    showToast("スタッフを追加しました。");
  });

  elements.staffList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-staff-id]");
    const deleteButton = event.target.closest("[data-delete-staff]");
    if (deleteButton) {
      deleteStaff(deleteButton.dataset.deleteStaff);
      return;
    }
    if (!button) return;
    state.selectedStaffId = button.dataset.staffId;
    writeState();
    render();
  });

  elements.basicForm.addEventListener("submit", (event) => {
    event.preventDefault();
    updateSelectedStaff({
      basic: {
        name: elements.staffName.value.trim() || "未設定",
        hireDate: elements.hireDate.value,
        role: elements.staffRole.value.trim(),
        employmentType: elements.employmentType.value,
      },
    });
    render();
    showToast("基本情報を保存しました。");
  });

  elements.performanceForm.addEventListener("submit", (event) => {
    event.preventDefault();
    addMonthlyRecord();
  });

  elements.performanceList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-delete-record]");
    if (!button) return;
    const staff = getSelectedStaff();
    staff.monthlyRecords = staff.monthlyRecords.filter((record) => record.id !== button.dataset.deleteRecord);
    writeState();
    render();
    showToast("月次実績を削除しました。");
  });

  elements.evaluationGrid.addEventListener("input", (event) => {
    const input = event.target.closest("[data-score]");
    if (!input) return;
    const staff = getSelectedStaff();
    staff.evaluation[input.dataset.score] = Number(input.value);
    writeState();
    renderEvaluation();
    renderMetrics();
  });

  elements.interviewForm.addEventListener("submit", (event) => {
    event.preventDefault();
    addInterviewRecord();
  });

  elements.interviewList.addEventListener("click", (event) => {
    const button = event.target.closest("[data-delete-interview]");
    if (!button) return;
    const staff = getSelectedStaff();
    staff.interviews = staff.interviews.filter((record) => record.id !== button.dataset.deleteInterview);
    writeState();
    renderInterviews();
    showToast("面談記録を削除しました。");
  });

  elements.exportButton.addEventListener("click", exportCsv);
}

function unlockApp() {
  elements.accessPanel.hidden = true;
  elements.appShell.hidden = false;
  render();
}

function render() {
  ensureSelectedStaff();
  renderMetrics();
  renderStaffList();
  renderSelectedStaff();
}

function renderMetrics() {
  const currentMonth = getCurrentMonth();
  const allRecords = state.staff.flatMap((staff) => staff.monthlyRecords.map((record) => ({ ...record, staffId: staff.id })));
  const monthRecords = allRecords.filter((record) => record.month === currentMonth);
  const monthSales = monthRecords.reduce((sum, record) => sum + record.sales, 0);
  const monthCases = monthRecords.reduce((sum, record) => sum + record.cases, 0);
  const rates = allRecords.map(getLeverate).filter((value) => value > 0);
  const avgRate = rates.length ? rates.reduce((sum, value) => sum + value, 0) / rates.length : 0;
  const bestRate = rates.length ? Math.max(...rates) : 0;

  const metrics = [
    { label: "登録スタッフ", value: `${state.staff.length}名`, meta: "代表者専用データ" },
    { label: "今月担当売上", value: formatYen(monthSales), meta: `${monthCases}件` },
    { label: "平均レバレート", value: formatYen(avgRate), meta: "売上 ÷ 作業人数 ÷ 作業時間" },
    { label: "最高レバレート", value: formatYen(bestRate), meta: "月次実績内の最高値" },
  ];

  elements.metricGrid.innerHTML = metrics
    .map(
      (metric) => `
        <div class="metric-card">
          <span>${metric.label}</span>
          <strong>${metric.value}</strong>
          <small>${metric.meta}</small>
        </div>
      `,
    )
    .join("");
}

function renderStaffList() {
  elements.staffList.innerHTML = state.staff
    .map((staff) => {
      const totals = getStaffTotals(staff);
      const selected = staff.id === state.selectedStaffId ? "is-selected" : "";
      return `
        <button class="staff-card ${selected}" type="button" data-staff-id="${staff.id}">
          <span>
            <strong>${escapeHtml(staff.basic.name)}</strong>
            <small>${escapeHtml(staff.basic.role || "役職未設定")} / ${escapeHtml(staff.basic.employmentType || "-")}</small>
          </span>
          <span>
            <b>${formatYen(totals.sales)}</b>
            <small>${totals.cases}件 / ${formatYen(totals.avgLeverate)}</small>
          </span>
        </button>
      `;
    })
    .join("");
}

function renderSelectedStaff() {
  const staff = getSelectedStaff();
  if (!staff) return;

  elements.staffName.value = staff.basic.name;
  elements.hireDate.value = staff.basic.hireDate || "";
  elements.staffRole.value = staff.basic.role || "";
  elements.employmentType.value = staff.basic.employmentType || "正社員";
  elements.recordMonth.value = getCurrentMonth();
  elements.caseCount.value = "";
  elements.salesAmount.value = "";
  elements.profitAmount.value = "";
  elements.workHours.value = "";
  elements.workPeople.value = "";
  renderPerformance();
  renderEvaluation();
  renderInterviews();
}

function renderPerformance() {
  const staff = getSelectedStaff();
  const totals = getStaffTotals(staff);
  const rows = [
    ["担当件数", `${totals.cases}件`],
    ["担当売上", formatYen(totals.sales)],
    ["平均単価", formatYen(totals.averageTicket)],
    ["利益額", formatYen(totals.profit)],
    ["作業時間", `${formatNumber(totals.workHours)}h`],
    ["平均レバレート", formatYen(totals.avgLeverate)],
    ["最高レバレート", formatYen(totals.bestLeverate)],
  ];

  elements.performanceList.innerHTML = `
    <div class="summary-grid">
      ${rows.map(([label, value]) => `<span><small>${label}</small><strong>${value}</strong></span>`).join("")}
    </div>
    <div class="record-stack">
      ${staff.monthlyRecords
        .slice()
        .sort((a, b) => b.month.localeCompare(a.month))
        .map(
          (record) => `
            <div class="record-row">
              <span>
                <strong>${record.month}</strong>
                <small>${record.cases}件 / 売上 ${formatYen(record.sales)} / レバ ${formatYen(getLeverate(record))}</small>
              </span>
              <button class="icon-button" type="button" data-delete-record="${record.id}" aria-label="月次実績を削除">x</button>
            </div>
          `,
        )
        .join("")}
    </div>
  `;
}

function renderEvaluation() {
  const staff = getSelectedStaff();
  const total = getEvaluationTotal(staff.evaluation);

  elements.evaluationGrid.innerHTML = `
    ${evaluationItems
      .map(
        (item) => `
          <label class="score-row">
            <span>${item.label}</span>
            <input type="range" min="0" max="5" step="1" value="${staff.evaluation[item.id] || 0}" data-score="${item.id}" />
            <b>${staff.evaluation[item.id] || 0}</b>
          </label>
        `,
      )
      .join("")}
    <div class="total-score">
      <span>総合評価</span>
      <strong>${formatNumber(total)} / 5</strong>
    </div>
  `;
}

function renderInterviews() {
  const staff = getSelectedStaff();
  elements.interviewDate.value = toISODate(new Date());
  elements.evaluationComment.value = "";
  elements.interviewContent.value = "";
  elements.issueText.value = "";
  elements.improvementText.value = "";
  elements.goalText.value = "";

  elements.interviewList.innerHTML = staff.interviews
    .slice()
    .sort((a, b) => b.date.localeCompare(a.date))
    .map(
      (record) => `
        <div class="interview-card">
          <div>
            <strong>${record.date}</strong>
            <button class="icon-button" type="button" data-delete-interview="${record.id}" aria-label="面談記録を削除">x</button>
          </div>
          ${renderInterviewLine("評価コメント", record.comment)}
          ${renderInterviewLine("面談内容", record.content)}
          ${renderInterviewLine("課題", record.issue)}
          ${renderInterviewLine("改善内容", record.improvement)}
          ${renderInterviewLine("目標設定", record.goal)}
        </div>
      `,
    )
    .join("");
}

function renderInterviewLine(label, value) {
  if (!value) return "";
  return `<p><span>${label}</span>${escapeHtml(value)}</p>`;
}

function addMonthlyRecord() {
  const staff = getSelectedStaff();
  staff.monthlyRecords.push({
    id: crypto.randomUUID(),
    month: elements.recordMonth.value,
    cases: Number(elements.caseCount.value) || 0,
    sales: Number(elements.salesAmount.value) || 0,
    profit: Number(elements.profitAmount.value) || 0,
    workHours: Number(elements.workHours.value) || 0,
    workPeople: Number(elements.workPeople.value) || 0,
    createdAt: new Date().toISOString(),
  });
  writeState();
  render();
  showToast("月次実績を追加しました。");
}

function addInterviewRecord() {
  const staff = getSelectedStaff();
  staff.interviews.push({
    id: crypto.randomUUID(),
    date: elements.interviewDate.value,
    comment: elements.evaluationComment.value.trim(),
    content: elements.interviewContent.value.trim(),
    issue: elements.issueText.value.trim(),
    improvement: elements.improvementText.value.trim(),
    goal: elements.goalText.value.trim(),
    createdAt: new Date().toISOString(),
  });
  writeState();
  renderInterviews();
  showToast("面談記録を追加しました。");
}

function updateSelectedStaff(patch) {
  const staff = getSelectedStaff();
  Object.assign(staff, patch);
  writeState();
}

function deleteStaff(staffId) {
  if (state.staff.length <= 1) {
    showToast("最低1名は残してください。");
    return;
  }
  state.staff = state.staff.filter((staff) => staff.id !== staffId);
  if (state.selectedStaffId === staffId) {
    state.selectedStaffId = state.staff[0].id;
  }
  writeState();
  render();
  showToast("スタッフを削除しました。");
}

function exportCsv() {
  const header = [
    "氏名",
    "入社日",
    "役職",
    "雇用形態",
    "担当件数",
    "担当売上",
    "平均単価",
    "利益額",
    "作業時間",
    "作業人数",
    "平均レバレート",
    "最高レバレート",
    "総合評価",
    "面談記録数",
  ];
  const rows = state.staff.map((staff) => {
    const totals = getStaffTotals(staff);
    return [
      staff.basic.name,
      staff.basic.hireDate,
      staff.basic.role,
      staff.basic.employmentType,
      totals.cases,
      totals.sales,
      totals.averageTicket,
      totals.profit,
      totals.workHours,
      totals.workPeople,
      totals.avgLeverate,
      totals.bestLeverate,
      getEvaluationTotal(staff.evaluation),
      staff.interviews.length,
    ];
  });
  const csv = [header, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `trywash-owner-staff-evaluation-${toISODate(new Date())}.csv`;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
  showToast("評価CSVを出力しました。");
}

function ensureSelectedStaff() {
  if (!state.staff.length) {
    state.staff.push(createStaff("スタッフ1"));
  }
  if (!state.staff.some((staff) => staff.id === state.selectedStaffId)) {
    state.selectedStaffId = state.staff[0].id;
  }
}

function getSelectedStaff() {
  return state.staff.find((staff) => staff.id === state.selectedStaffId);
}

function createStaff(name = `スタッフ${state?.staff?.length ? state.staff.length + 1 : 1}`) {
  return {
    id: crypto.randomUUID(),
    basic: {
      name,
      hireDate: "",
      role: "",
      employmentType: "正社員",
    },
    monthlyRecords: [],
    evaluation: evaluationItems.reduce((scores, item) => ({ ...scores, [item.id]: 0 }), {}),
    interviews: [],
    createdAt: new Date().toISOString(),
  };
}

function getStaffTotals(staff) {
  const cases = staff.monthlyRecords.reduce((sum, record) => sum + record.cases, 0);
  const sales = staff.monthlyRecords.reduce((sum, record) => sum + record.sales, 0);
  const profit = staff.monthlyRecords.reduce((sum, record) => sum + record.profit, 0);
  const workHours = staff.monthlyRecords.reduce((sum, record) => sum + record.workHours, 0);
  const workPeople = staff.monthlyRecords.reduce((sum, record) => sum + record.workPeople, 0);
  const leverates = staff.monthlyRecords.map(getLeverate).filter((value) => value > 0);

  return {
    cases,
    sales,
    profit,
    workHours,
    workPeople,
    averageTicket: cases ? sales / cases : 0,
    avgLeverate: leverates.length ? leverates.reduce((sum, value) => sum + value, 0) / leverates.length : 0,
    bestLeverate: leverates.length ? Math.max(...leverates) : 0,
  };
}

function getLeverate(record) {
  if (!record.workPeople || !record.workHours) return 0;
  return record.sales / record.workPeople / record.workHours;
}

function getEvaluationTotal(evaluation) {
  const scores = evaluationItems.map((item) => Number(evaluation[item.id]) || 0);
  return scores.length ? scores.reduce((sum, value) => sum + value, 0) / scores.length : 0;
}

function readState() {
  try {
    const parsed = JSON.parse(localStorage.getItem(storageKey));
    if (parsed?.staff?.length) {
      return parsed;
    }
  } catch {
    // Empty or invalid storage falls back to a fresh owner-only dataset.
  }
  const firstStaff = createStaff("スタッフ1");
  return {
    selectedStaffId: firstStaff.id,
    staff: [firstStaff],
  };
}

function writeState() {
  localStorage.setItem(storageKey, JSON.stringify(state));
  syncStaffStateToRemote();
}

async function syncStaffStateToRemote() {
  if (!window.TryWashApi?.canUseRemoteApi()) return;

  try {
    await window.TryWashApi.saveStaffEvaluationState(state);
  } catch (error) {
    console.warn("スタッフ評価データの共通DB同期を保留しました。", error);
  }
}

function getCurrentMonth() {
  const date = new Date();
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function toISODate(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function formatYen(value) {
  return new Intl.NumberFormat("ja-JP", {
    style: "currency",
    currency: "JPY",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
}

function formatNumber(value) {
  const number = Number(value) || 0;
  return Number.isInteger(number) ? String(number) : String(Math.round(number * 100) / 100);
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function csvCell(value) {
  const text = value == null ? "" : String(value);
  return `"${text.replaceAll('"', '""')}"`;
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("is-visible");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => {
    elements.toast.classList.remove("is-visible");
  }, 2400);
}
