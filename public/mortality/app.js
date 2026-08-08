const DATA_URL = "/mortality/data/mortality.json?v=20260807-5";

const numberFormat = new Intl.NumberFormat("de-AT");
const decimalFormat = new Intl.NumberFormat("de-AT", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
const percentFormat = new Intl.NumberFormat("de-AT", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const YLL_METRICS = new Set(["yll", "yllRate", "yllAsr"]);
const ESP_2013_WEIGHTS = [
  { min: 0, max: 0, weight: 1000 },
  { min: 1, max: 4, weight: 4000 },
  { min: 5, max: 9, weight: 5500 },
  { min: 10, max: 14, weight: 5500 },
  { min: 15, max: 19, weight: 5500 },
  { min: 20, max: 24, weight: 6000 },
  { min: 25, max: 29, weight: 6000 },
  { min: 30, max: 34, weight: 6500 },
  { min: 35, max: 39, weight: 7000 },
  { min: 40, max: 44, weight: 7000 },
  { min: 45, max: 49, weight: 7000 },
  { min: 50, max: 54, weight: 7000 },
  { min: 55, max: 59, weight: 6500 },
  { min: 60, max: 64, weight: 6000 },
  { min: 65, max: 69, weight: 5500 },
  { min: 70, max: 74, weight: 5000 },
  { min: 75, max: 79, weight: 4000 },
  { min: 80, max: 84, weight: 2500 },
  { min: 85, max: 89, weight: 1500 },
  { min: 90, max: 94, weight: 800 },
  { min: 95, max: 100, weight: 200 },
];

const state = {
  year: 2025,
  sex: "all",
  ageIndex: 0,
  metric: "absolute",
  level: "broad",
  selectedGroup: "all",
  selectedCause: "all",
  compareEnabled: false,
  compareDimension: "sex",
  compareValue: "female",
  trendMode: "value",
  search: "",
  tableLimit: 14,
  tableSortKey: "value",
  tableSortDirection: "desc",
};

let dataset;

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function causeById(id) {
  return dataset.causes.find((cause) => cause.id === id);
}

function causeGroups() {
  const groups = [];
  let currentGroup = null;

  dataset.causes.forEach((cause) => {
    if (cause.isBroad) {
      currentGroup = { ...cause, children: [] };
      groups.push(currentGroup);
    } else if (cause.id !== "all" && currentGroup) {
      currentGroup.children.push(cause);
    }
  });

  return groups;
}

function selectedGroup() {
  if (state.selectedGroup === "all") return null;
  return causeGroups().find((group) => group.id === state.selectedGroup) || causeGroups()[0];
}

function groupForCause(causeId) {
  return causeGroups().find(
    (group) => group.id === causeId || group.children.some((cause) => cause.id === causeId),
  );
}

function sexLabel(sex = state.sex) {
  return { all: "Alle Geschlechter", male: "Männer", female: "Frauen" }[sex];
}

function currentAgeLabel() {
  const profile = dataset.ageProfiles[String(state.year)];
  return profile?.ageGroups[state.ageIndex]?.label || "Alle Altersgruppen";
}

function yearIndex(year) {
  return dataset.years.indexOf(Number(year));
}

function hasAgeProfile(year = state.year) {
  return Boolean(dataset.ageProfiles[String(year)]);
}

function matchingAgeIndex(year, label = currentAgeLabel()) {
  const profile = dataset.ageProfiles[String(year)];
  if (!profile) return -1;
  return profile.ageGroups.findIndex((group) => group.label === label);
}

function isYllMetric(metric = state.metric) {
  return YLL_METRICS.has(metric);
}

function isYllRateMetric(metric = state.metric) {
  return metric === "yllRate" || metric === "yllAsr";
}

function getValue(causeId, year = state.year, options = {}) {
  const sex = options.sex || state.sex;
  const ageIndex = options.ageIndex ?? state.ageIndex;
  const metric = options.metric || state.metric;
  const profile = dataset.ageProfiles[String(year)];

  if (isYllMetric(metric)) {
    if (metric === "yll") return getYearsLost(causeId, year, { sex, ageIndex });
    return getYllRate(causeId, year, {
      sex,
      ageIndex,
      standardized: metric === "yllAsr",
    });
  }

  if (ageIndex > 0 && profile) {
    return profile.sexes[sex]?.[causeId]?.[ageIndex] ?? 0;
  }

  const index = yearIndex(year);
  if (index < 0) return null;
  return dataset.series[sex]?.[metric]?.[causeId]?.[index] ?? 0;
}

function representativeAge(label) {
  if (label === "Unter 1 Jahr") return 0;
  const range = label.match(/(\d+)\s*[–-]\s*(\d+)/);
  if (range) return Math.round((Number(range[1]) + Number(range[2])) / 2);
  const openEnded = label.match(/(\d+)\s+Jahre und älter/);
  return openEnded ? Number(openEnded[1]) + 2 : null;
}

function remainingLifeExpectancy(year, sex, age) {
  const table = dataset.lifeTables?.[String(year)];
  if (!table || age === null) return null;
  const values = table.sexes?.[sex];
  if (!values) return null;
  const availableAges = Object.keys(values).map(Number).sort((a, b) => a - b);
  const nearestAge = availableAges.reduce(
    (nearest, candidate) =>
      Math.abs(candidate - age) < Math.abs(nearest - age) ? candidate : nearest,
    availableAges[0],
  );
  return values[String(nearestAge)] ?? null;
}

function getYearsLost(causeId, year = state.year, options = {}) {
  const sex = options.sex || state.sex;
  const ageIndex = options.ageIndex ?? state.ageIndex;
  const profile = dataset.ageProfiles[String(year)];
  if (!profile || !dataset.lifeTables?.[String(year)]) return null;

  if (sex === "all") {
    const male = getYearsLost(causeId, year, { sex: "male", ageIndex }) || 0;
    const female = getYearsLost(causeId, year, { sex: "female", ageIndex }) || 0;
    return Math.round((male + female) * 10) / 10;
  }

  const indices = ageIndex > 0
    ? [ageIndex]
    : profile.ageGroups.map((_, index) => index).slice(1);
  const deaths = profile.sexes[sex]?.[causeId];
  if (!deaths) return 0;

  const total = indices.reduce((sum, index) => {
    const age = representativeAge(profile.ageGroups[index]?.label || "");
    const expectancy = remainingLifeExpectancy(year, sex, age);
    return sum + (deaths[index] || 0) * (expectancy || 0);
  }, 0);
  return Math.round(total * 10) / 10;
}

function ageBounds(label) {
  if (label === "Alle Altersgruppen") return { min: 0, max: 100 };
  if (label === "Unter 1 Jahr") return { min: 0, max: 0 };
  const range = label.match(/(\d+)\s*[–-]\s*(\d+)/);
  if (range) return { min: Number(range[1]), max: Number(range[2]) };
  const openEnded = label.match(/(\d+)\s+Jahre und älter/);
  if (openEnded) return { min: Number(openEnded[1]), max: 100 };
  return null;
}

function populationForAgeGroup(year, sex, label) {
  const ages = dataset.populationTables?.[String(year)]?.sexes?.[sex];
  const bounds = ageBounds(label);
  if (!ages || !bounds) return null;
  return Object.entries(ages).reduce((sum, [age, population]) => {
    const numericAge = Number(age);
    return numericAge >= bounds.min && numericAge <= bounds.max
      ? sum + Number(population || 0)
      : sum;
  }, 0);
}

function espWeightForAgeGroup(label) {
  const bounds = ageBounds(label);
  if (!bounds) return 0;
  return ESP_2013_WEIGHTS.reduce(
    (sum, group) =>
      group.max >= bounds.min && group.min <= bounds.max ? sum + group.weight : sum,
    0,
  );
}

function getYllRate(causeId, year = state.year, options = {}) {
  const sex = options.sex || state.sex;
  const ageIndex = options.ageIndex ?? state.ageIndex;
  const standardized = Boolean(options.standardized);
  const profile = dataset.ageProfiles[String(year)];
  if (!profile || !dataset.populationTables?.[String(year)]) return null;

  if (!standardized || ageIndex > 0) {
    const label = profile.ageGroups[ageIndex]?.label || "Alle Altersgruppen";
    const population = populationForAgeGroup(year, sex, label);
    const yll = getYearsLost(causeId, year, { sex, ageIndex });
    return population > 0 && yll !== null
      ? Math.round((yll / population) * 1000000) / 10
      : null;
  }

  const standardizedRate = profile.ageGroups.slice(1).reduce((sum, group, offset) => {
    const groupAgeIndex = offset + 1;
    const population = populationForAgeGroup(year, sex, group.label);
    const weight = espWeightForAgeGroup(group.label);
    const yll = getYearsLost(causeId, year, { sex, ageIndex: groupAgeIndex });
    if (!population || yll === null || !weight) return sum;
    return sum + (yll / population) * weight;
  }, 0);
  return Math.round(standardizedRate * 10) / 10;
}

function formatValue(value, metric = state.metric, compact = false) {
  if (value === null || value === undefined || Number.isNaN(value)) return "–";
  if (compact && Math.abs(value) >= 1000) {
    const divisor = Math.abs(value) >= 1_000_000 ? 1_000_000 : 1000;
    const suffix = divisor === 1_000_000 ? " Mio." : " Tsd.";
    return `${decimalFormat.format(value / divisor)}${suffix}`;
  }
  return (metric === "asr" && state.ageIndex === 0) || isYllRateMetric(metric)
    ? decimalFormat.format(value)
    : numberFormat.format(Math.round(value));
}

function percent(part, whole) {
  return whole > 0 ? (part / whole) * 100 : 0;
}

function changePercent(current, previous) {
  if (!previous) return null;
  return ((current - previous) / previous) * 100;
}

function niceInterval(value) {
  if (value <= 0) return 1;
  const exponent = 10 ** Math.floor(Math.log10(value));
  const fraction = value / exponent;
  const nice = fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 2.5 ? 2.5 : fraction <= 5 ? 5 : 10;
  return nice * exponent;
}

function signedPercent(value) {
  if (value === null || Number.isNaN(value)) return "–";
  return `${value > 0 ? "+" : ""}${percentFormat.format(value)} %`;
}

function ageLabelFor(year, ageIndex) {
  return dataset.ageProfiles[String(year)]?.ageGroups[ageIndex]?.label || "Alle Altersgruppen";
}

function comparisonConfig() {
  const config = {
    causeId: state.selectedCause,
    sex: state.sex,
    ageIndex: state.ageIndex,
  };
  if (!state.compareEnabled) return config;
  if (state.compareDimension === "cause") config.causeId = state.compareValue;
  if (state.compareDimension === "sex") config.sex = state.compareValue;
  if (state.compareDimension === "age") config.ageIndex = Number(state.compareValue);
  return config;
}

function comparisonLabel(config = comparisonConfig()) {
  if (!state.compareEnabled) return "";
  if (state.compareDimension === "cause") return causeById(config.causeId)?.name || "Vergleichsursache";
  if (state.compareDimension === "sex") return sexLabel(config.sex);
  return ageLabelFor(state.year, config.ageIndex);
}

function primaryTrendLabel() {
  const cause = causeById(state.selectedCause);
  if (state.compareDimension === "cause" && state.compareEnabled) return cause?.name || "Alle Todesursachen";
  if (state.compareDimension === "sex" && state.compareEnabled) return sexLabel();
  if (state.compareDimension === "age" && state.compareEnabled) return currentAgeLabel();
  return cause?.name || "Alle Todesursachen";
}

function trendMetricLabel() {
  if (state.trendMode === "share") return "Anteil an allen Todesfällen";
  if (state.trendMode === "index") return "Index · erstes verfügbares Jahr = 100";
  if (state.metric === "yll") return "verlorene Lebensjahre";
  if (state.metric === "yllRate") return "verlorene Lebensjahre je 100.000";
  if (state.metric === "yllAsr") return "altersstandardisierte YLL-Rate je 100.000";
  if (state.metric === "asr" && state.ageIndex === 0) return "Rate je 100.000";
  return "Fälle";
}

function formatTrendValue(value, compact = false) {
  if (state.trendMode === "share") return `${percentFormat.format(value)} %`;
  if (state.trendMode === "index") return decimalFormat.format(value);
  return formatValue(value, state.metric, compact);
}

function updateUrlState() {
  const params = new URLSearchParams();
  params.set("year", state.year);
  params.set("sex", state.sex);
  params.set("age", state.ageIndex);
  params.set("metric", state.metric);
  params.set("group", state.selectedGroup);
  params.set("cause", state.selectedCause);
  params.set("level", state.level);
  params.set("trend", state.trendMode);
  if (state.compareEnabled) {
    params.set("compare", state.compareDimension);
    params.set("with", state.compareValue);
  }
  history.replaceState(null, "", `${location.pathname}?${params.toString()}${location.hash}`);
}

function applyUrlState() {
  const params = new URLSearchParams(location.search);
  const year = Number(params.get("year"));
  if (dataset.years.includes(year)) state.year = year;
  if (["all", "male", "female"].includes(params.get("sex"))) state.sex = params.get("sex");
  if (["absolute", "asr", "yll", "yllRate", "yllAsr"].includes(params.get("metric"))) state.metric = params.get("metric");
  if (["broad", "detail"].includes(params.get("level"))) state.level = params.get("level");
  if (["value", "share", "index"].includes(params.get("trend"))) state.trendMode = params.get("trend");
  const validCauses = new Set(dataset.causes.map((cause) => cause.id));
  const group = params.get("group");
  const cause = params.get("cause");
  if (group === "all" || validCauses.has(group)) state.selectedGroup = group;
  if (validCauses.has(cause)) state.selectedCause = cause;
  if (state.selectedGroup === "all") state.selectedCause = "all";
  const profile = dataset.ageProfiles[String(state.year)];
  const ageIndex = Number(params.get("age"));
  if (profile && Number.isInteger(ageIndex) && ageIndex >= 0 && ageIndex < profile.ageGroups.length) {
    state.ageIndex = ageIndex;
  }
  const compare = params.get("compare");
  if (["sex", "cause", "age"].includes(compare)) {
    state.compareEnabled = true;
    state.compareDimension = compare;
    state.compareValue = params.get("with") || state.compareValue;
  }
}

function selectionDescription() {
  return `${state.year} · ${sexLabel()} · ${currentAgeLabel()}`;
}

function renderAgeOptions() {
  const select = $("#age-select");
  const profile = dataset.ageProfiles[String(state.year)];
  const badge = $("#year-detail-badge");
  const help = $("#age-help");

  if (!profile) {
    state.ageIndex = 0;
    select.innerHTML = '<option value="0">Alle Altersgruppen</option>';
    select.disabled = true;
    badge.classList.add("hidden");
    help.textContent = "Altersfilter in frei zugänglichen Jahrbüchern ab 2017";
  } else {
    select.disabled = false;
    select.innerHTML = profile.ageGroups
      .map(
        (group, index) =>
          `<option value="${index}">${escapeHtml(group.label)}</option>`,
      )
      .join("");
    select.value = String(state.ageIndex);
    badge.classList.remove("hidden");
    help.textContent = "Detaillierte Altersdaten für dieses Jahr verfügbar";
  }
}

function syncMetricControl() {
  const isAgeSpecific = state.ageIndex > 0;
  const canCalculateYll = hasAgeProfile() && Boolean(dataset.lifeTables?.[String(state.year)]);
  const canCalculateYllRate = canCalculateYll && Boolean(dataset.populationTables?.[String(state.year)]);
  if (isAgeSpecific && state.metric === "asr") state.metric = "absolute";
  if (isAgeSpecific && state.metric === "yllAsr") state.metric = "yllRate";
  if (!canCalculateYll && isYllMetric()) state.metric = "absolute";
  if (!canCalculateYllRate && isYllRateMetric()) state.metric = canCalculateYll ? "yll" : "absolute";
  const yllSelected = isYllMetric();
  $$("#metric-control button").forEach((button) => {
    button.classList.toggle(
      "active",
      button.dataset.metric === state.metric || (button.dataset.metric === "yll" && yllSelected),
    );
    button.disabled =
      (isAgeSpecific && button.dataset.metric === "asr") ||
      (!canCalculateYll && button.dataset.metric === "yll");
  });
  $("#yll-mode-control").classList.toggle("hidden", !yllSelected);
  $$("#yll-mode-control button").forEach((button) => {
    button.classList.toggle("active", button.dataset.yllMetric === state.metric);
    button.disabled =
      (!canCalculateYllRate && button.dataset.yllMetric !== "yll") ||
      (isAgeSpecific && button.dataset.yllMetric === "yllAsr");
  });
  $$("#trend-mode-control button").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.disabled) return;
      state.trendMode = button.dataset.trendMode;
      renderAll();
    });
  });
  $("#compare-toggle").addEventListener("click", () => {
    state.compareEnabled = !state.compareEnabled;
    renderAll();
  });
  $("#compare-dimension").addEventListener("change", (event) => {
    state.compareDimension = event.target.value;
    state.compareValue = "";
    renderAll();
  });
  $("#compare-value").addEventListener("change", (event) => {
    state.compareValue = event.target.value;
    renderAll();
  });
  $("#metric-help").textContent = isYllMetric()
    ? state.metric === "yllAsr"
      ? `Direkt standardisiert · ESP 2013 · Sterbetafel ${dataset.lifeTables[String(state.year)].sourceYear}`
      : state.metric === "yllRate"
        ? `Je 100.000 der mittleren Jahresbevölkerung · Sterbetafel ${dataset.lifeTables[String(state.year)].sourceYear}`
        : `Näherung mit Altersgruppen · Sterbetafel ${dataset.lifeTables[String(state.year)].sourceYear}`
    : isAgeSpecific
      ? "Für Altersgruppen werden veröffentlichte Fallzahlen gezeigt"
      : canCalculateYll
        ? "Rate je 100.000 oder geschätzte verlorene Lebensjahre"
        : "Rate je 100.000 · verlorene Jahre ab 2017";
}

function renderCoverageNote() {
  const element = $("#coverage-note");
  if (isYllMetric()) {
    const sourceYear = dataset.lifeTables[String(state.year)]?.sourceYear;
    const rateNote = state.metric === "yllAsr"
      ? " Die Altersraten werden mit der Europäischen Standardbevölkerung 2013 gewichtet."
      : state.metric === "yllRate"
        ? " Der Wert wird auf 100.000 Personen der mittleren Jahresbevölkerung bezogen."
        : "";
    element.innerHTML = `<strong>Berechnete Kennzahl:</strong> Todesfälle je veröffentlichter Altersgruppe × fernere Lebenserwartung e(x) am Mittelpunkt der Altersgruppe. Sterbetafel ${sourceYear}; deshalb ist das Ergebnis eine belastbare Näherung, keine personenbezogene Messung.${rateNote}`;
  } else if (state.ageIndex > 0) {
    element.innerHTML = `<strong>Detailansicht:</strong> Für ${state.year} stehen Alter und Geschlecht gemeinsam zur Verfügung. Im Zeitverlauf erscheinen nur Jahre mit exakt derselben veröffentlichten Altersgruppe.`;
  } else if (hasAgeProfile()) {
    element.innerHTML = `<strong>Vollständige Auswahl:</strong> ${state.year} enthält sowohl die nationale Zeitreihe als auch die veröffentlichte Jahrbuchgliederung nach Alter und Geschlecht.`;
  } else {
    element.innerHTML = `<strong>Zeitreihenansicht:</strong> Für ${state.year} veröffentlicht die verwendete nationale ODS-Reihe Ursache und Geschlecht. Der Altersfilter ist deshalb auf „Alle Altersgruppen“ begrenzt.`;
  }
}

function rankedCauses(level = state.level) {
  const group = selectedGroup();
  const filtered = level === "broad" || !group
    ? causeGroups()
    : group?.children.length
      ? group.children
      : group
        ? [group]
        : [];
  return filtered
    .map((cause) => ({ ...cause, value: getValue(cause.id) || 0 }))
    .sort((a, b) => b.value - a.value);
}

function renderKpis() {
  const allDeaths = getValue("all") || 0;
  const selected = causeById(state.selectedCause);
  const selectedValue = getValue(state.selectedCause) || 0;
  const isYll = isYllMetric();
  const isYllRate = isYllRateMetric();
  const selectedDeaths = getValue(state.selectedCause, state.year, {
    sex: state.sex,
    ageIndex: state.ageIndex,
    metric: "absolute",
  }) || 0;
  const selectedYll = isYll
    ? getYearsLost(state.selectedCause, state.year, { sex: state.sex, ageIndex: state.ageIndex })
    : null;
  const averageYll = isYll && selectedDeaths > 0 ? selectedYll / selectedDeaths : null;
  const isAllGroups = state.selectedGroup === "all";
  const leadingGroup = isAllGroups ? rankedCauses("broad")[0] : null;

  $("#total-kpi-label").textContent =
    isAllGroups && isYll
      ? isYllRate ? "YLL-Rate – alle Ursachen" : "Verlorene Lebensjahre – alle Ursachen"
      : isAllGroups
        ? "Todesfälle – alle Ursachen"
        : isYll
      ? isYllRate ? "YLL-Rate der ausgewählten Ursache" : "Geschätzte verlorene Lebensjahre"
      : state.metric === "asr" && state.ageIndex === 0
      ? "Rate der ausgewählten Ursache"
      : "Todesfälle der ausgewählten Ursache";
  $("#total-kpi").textContent = formatValue(selectedValue);
  $("#total-kpi-note").textContent =
    isYll
      ? `${selectionDescription()} · ${state.metric === "yll" ? "Summe" : state.metric === "yllAsr" ? "altersstandardisiert je 100.000" : "je 100.000"} · Sterbetafel ${dataset.lifeTables[String(state.year)].sourceYear}`
      : state.metric === "asr" && state.ageIndex === 0
      ? `${selectionDescription()} · je 100.000`
      : selectionDescription();

  $("#top-cause-label").textContent = isAllGroups
    ? isYll
      ? isYllRate ? "Höchste YLL-Rate" : "Meiste verlorene Lebensjahre"
      : "Häufigste Hauptgruppe"
    : "Ausgewählte Todesursache";
  $("#top-cause-kpi").textContent = isAllGroups
    ? leadingGroup?.name || "–"
    : selected?.name || "–";
  $("#top-cause-note").textContent = isAllGroups && leadingGroup
    ? `${formatValue(leadingGroup.value)} ${isYllRate ? "YLL je 100.000" : isYll ? "verlorene Jahre" : state.metric === "asr" ? "je 100.000" : "Fälle"}`
    : selected
      ? `${selected.icd || "ohne ICD-Code"} · ${selected.isBroad ? "Hauptgruppe" : "Untergruppe"}`
    : "–";
  const shareValue = isAllGroups ? leadingGroup?.value || 0 : selectedValue;
  $("#top-share-kpi").textContent = selected || leadingGroup
    ? `${percentFormat.format(percent(shareValue, allDeaths))} %`
    : "–";
  $(".kpi-card:nth-child(3) > span").textContent =
    isYll
      ? state.metric === "yllAsr" ? "Relation zur gesamten YLL-Rate" : "Anteil an allen verlorenen Lebensjahren"
      : state.metric === "asr" && state.ageIndex === 0
      ? "Relation zur Gesamt-Rate"
      : "Anteil an allen Todesfällen";
  $(".kpi-card:nth-child(3) > small").textContent =
    isYll
      ? state.metric === "yllAsr" ? "rechnerisches Verhältnis standardisierter YLL-Raten" : "an der geschätzten Summe aller Todesursachen"
      : state.metric === "asr" && state.ageIndex === 0
      ? "rechnerisches Verhältnis standardisierter Raten"
      : "an allen Todesfällen der Auswahl";

  let previousYear = state.year - 1;
  let previousAgeIndex = state.ageIndex;
  if (state.ageIndex > 0) {
    previousAgeIndex = matchingAgeIndex(previousYear);
    if (previousAgeIndex < 0) previousYear = null;
  }
  let previousValue = previousYear
    ? getValue(state.selectedCause, previousYear, { ageIndex: previousAgeIndex })
    : null;
  if (previousValue === null) previousYear = null;
  const change = changePercent(selectedValue, previousValue);
  $("#change-kpi-label").textContent = previousYear
    ? `Veränderung zu ${previousYear}`
    : "Vorjahresvergleich";
  $("#change-kpi").textContent =
    change === null ? "–" : `${change > 0 ? "+" : ""}${percentFormat.format(change)} %`;
  $("#change-kpi").style.color = change > 0 ? "var(--red-dark)" : change < 0 ? "var(--green)" : "";
  $("#change-kpi-note").textContent = `${isAllGroups ? "Alle Todesursachen" : selected?.name || "Ausgewählte Ursache"} · ${sexLabel()} · ${currentAgeLabel()}`;
  $(".kpi-grid").classList.toggle("yll-mode", isYll);
  $("#yll-average-card").classList.toggle("hidden", !isYll);
  $("#yll-average-kpi").textContent = averageYll === null
    ? "–"
    : `${decimalFormat.format(averageYll)} Jahre`;
  $("#yll-average-note").textContent = `${isAllGroups ? "Alle Todesursachen" : selected?.name || "Ausgewählte Ursache"} · ${sexLabel()} · ${currentAgeLabel()}`;
}

function renderRanking() {
  const ranking = rankedCauses().slice(0, 11);
  const max = ranking[0]?.value || 1;
  const chart = $("#ranking-chart");
  $("#ranking-subtitle").textContent = `${selectionDescription()} · ${
    state.metric === "yll"
      ? "geschätzte verlorene Lebensjahre"
      : state.metric === "yllRate"
        ? "verlorene Lebensjahre je 100.000"
        : state.metric === "yllAsr"
          ? "altersstandardisierte YLL-Rate je 100.000"
      : state.metric === "asr" && state.ageIndex === 0
      ? "altersstandardisierte Rate"
      : "absolute Fälle"
  } · ${state.level === "broad" || state.selectedGroup === "all" ? "alle Hauptgruppen" : selectedGroup()?.name || "Untergruppen"}`;

  chart.innerHTML = ranking
    .map(
      (cause) => `
        <button class="rank-row ${cause.id === state.selectedCause || (state.level === "broad" && cause.id === state.selectedGroup) ? "selected" : ""}" type="button" data-cause-id="${cause.id}" title="${escapeHtml(cause.label)}">
          <span class="rank-label">${escapeHtml(cause.name)}</span>
          <span class="rank-bar-track"><i class="rank-bar" style="width:${Math.max(0.7, (cause.value / max) * 100)}%"></i></span>
          <span class="rank-value">${escapeHtml(formatValue(cause.value, state.metric, true))}</span>
        </button>`,
    )
    .join("");

  chart.querySelectorAll("[data-cause-id]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedCause = button.dataset.causeId;
      const parentGroup = groupForCause(state.selectedCause);
      if (parentGroup) state.selectedGroup = parentGroup.id;
      if (causeById(state.selectedCause)?.isBroad) state.level = "detail";
      renderAll();
    });
  });

  $("#ranking-footnote").textContent =
    state.level === "broad" || state.selectedGroup === "all"
      ? "Alle Hauptgruppen im direkten Vergleich. Ein Klick übernimmt die Gruppe in die Auswahl oben."
      : `Untergruppen von ${selectedGroup()?.name || "der gewählten Hauptgruppe"}. Sie sind Teilmengen der Hauptgruppe und dürfen nicht ungeprüft addiert werden.`;
}

function makeTrendPointsFor(config = {
  causeId: state.selectedCause,
  sex: state.sex,
  ageIndex: state.ageIndex,
}) {
  const selectedLabel = ageLabelFor(state.year, config.ageIndex);
  const sourcePoints = config.ageIndex > 0 || isYllMetric()
    ? Object.keys(dataset.ageProfiles)
      .map(Number)
      .sort((a, b) => a - b)
      .map((year) => ({
        year,
        ageIndex: dataset.ageProfiles[String(year)]?.ageGroups.findIndex(
          (group) => group.label === selectedLabel,
        ) ?? -1,
      }))
      .filter((point) => point.ageIndex >= 0)
    : dataset.years.map((year) => ({ year, ageIndex: 0 }));

  const raw = sourcePoints.map((point) => ({
    year: point.year,
    ageIndex: point.ageIndex,
    rawValue: getValue(config.causeId, point.year, {
      sex: config.sex,
      ageIndex: point.ageIndex,
      metric: state.metric,
    }) || 0,
  }));
  const firstNonZero = raw.find((point) => point.rawValue > 0)?.rawValue || 1;

  return raw.map((point) => {
    let value = point.rawValue;
    if (state.trendMode === "share") {
      const total = getValue("all", point.year, {
        sex: config.sex,
        ageIndex: point.ageIndex,
        metric: state.metric,
      }) || 0;
      value = percent(point.rawValue, total);
    } else if (state.trendMode === "index") {
      value = (point.rawValue / firstNonZero) * 100;
    }
    return { ...point, value };
  });
}

function makeTrendPoints() {
  return makeTrendPointsFor();
}

function niceMaximum(value) {
  if (value <= 0) return 1;
  const exponent = 10 ** Math.floor(Math.log10(value));
  const fraction = value / exponent;
  const nice = fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 5 ? 5 : 10;
  return nice * exponent;
}

function renderTrend() {
  const cause = causeById(state.selectedCause);
  const primaryConfig = {
    causeId: state.selectedCause,
    sex: state.sex,
    ageIndex: state.ageIndex,
  };
  const points = makeTrendPointsFor(primaryConfig);
  const compareConfig = comparisonConfig();
  const comparisonPoints = state.compareEnabled ? makeTrendPointsFor(compareConfig) : [];
  const chart = $("#trend-chart");
  $("#trend-selection").innerHTML = cause
    ? `<strong>${escapeHtml(cause.name)}</strong><small>${escapeHtml(cause.icd || "")}${state.compareEnabled ? ` · vs. ${escapeHtml(comparisonLabel(compareConfig))}` : ""}</small>`
    : "–";
  $("#trend-subtitle").textContent = `${cause?.name || "Alle Todesursachen"} · ${sexLabel()} · ${currentAgeLabel()} · ${trendMetricLabel()}`;

  if (!points.length || !cause) {
    chart.innerHTML = '<div class="chart-empty">Für diese Auswahl sind keine Werte verfügbar.</div>';
    return;
  }

  const width = 820;
  const height = 350;
  const margin = { top: 24, right: 24, bottom: 42, left: 65 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const minYear = Math.min(points[0].year, comparisonPoints[0]?.year ?? points[0].year);
  const maxYear = Math.max(points.at(-1).year, comparisonPoints.at(-1)?.year ?? points.at(-1).year);
  const allValues = [...points, ...comparisonPoints].map((point) => point.value);
  const rawMin = Math.min(...allValues);
  const rawMax = Math.max(...allValues);
  const spread = Math.max(1, rawMax - rawMin);
  const padding = spread * 0.08;
  const yStep = niceInterval((spread + padding * 2) / 4);
  const yMin = Math.max(0, Math.floor((rawMin - padding) / yStep) * yStep);
  const yMax = Math.max(yMin + yStep, Math.ceil((rawMax + padding) / yStep) * yStep);
  const x = (year) =>
    margin.left + ((year - minYear) / Math.max(1, maxYear - minYear)) * innerWidth;
  const y = (value) => margin.top + innerHeight - ((value - yMin) / (yMax - yMin)) * innerHeight;
  const linePathFor = (items) => items
    .map((point, index) => `${index ? "L" : "M"}${x(point.year).toFixed(1)},${y(point.value).toFixed(1)}`)
    .join(" ");
  const linePath = linePathFor(points);
  const comparisonPath = linePathFor(comparisonPoints);
  const areaPath = `${linePath} L${x(points.at(-1).year)},${margin.top + innerHeight} L${x(points[0].year)},${margin.top + innerHeight} Z`;
  const yTicks = [];
  for (let value = yMin; value <= yMax + yStep / 2; value += yStep) {
    yTicks.push({ value, position: y(value) });
  }
  const xYears = points.length <= 12
    ? points.map((point) => point.year)
    : [1970, 1980, 1990, 2000, 2010, 2020, 2025].filter(
        (year) => year >= minYear && year <= maxYear,
      );
  const selectedPoint = points.find((point) => point.year === state.year) || points.at(-1);
  const selectedX = x(selectedPoint.year);
  const selectedY = y(selectedPoint.value);
  const comparisonSelected = comparisonPoints.find((point) => point.year === selectedPoint.year);
  const hitYears = [...new Set(points.map((point) => point.year))];
  const hitWidth = innerWidth / Math.max(1, maxYear - minYear);

  $("#trend-primary-legend").textContent = primaryTrendLabel();
  $("#trend-compare-legend").classList.toggle("hidden", !state.compareEnabled);
  if (state.compareEnabled) {
    $("#trend-compare-legend b").textContent = comparisonLabel(compareConfig);
  }
  $("#trend-footnote").textContent = `Jedes Jahr ist mit Maus, Tastatur oder Klick auswählbar. Die Y-Achse ist auf ${formatTrendValue(yMin)} bis ${formatTrendValue(yMax)} verdichtet und beginnt${yMin === 0 ? "" : " nicht"} bei null.`;

  chart.innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Zeitverlauf ${escapeHtml(cause.name)} von ${minYear} bis ${maxYear}">
      <defs>
        <linearGradient id="area-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#d62f2f" stop-opacity="0.18" />
          <stop offset="100%" stop-color="#d62f2f" stop-opacity="0" />
        </linearGradient>
      </defs>
      ${yTicks
        .map(
          (tick) => `
            <line class="chart-grid" x1="${margin.left}" x2="${width - margin.right}" y1="${tick.position}" y2="${tick.position}" />
            <text class="chart-axis-label" x="${margin.left - 10}" y="${tick.position + 3}" text-anchor="end">${escapeHtml(formatTrendValue(tick.value, true))}</text>`,
        )
        .join("")}
      ${xYears
        .map(
          (year) => `<text class="chart-axis-label" x="${x(year)}" y="${height - 12}" text-anchor="middle">${year}</text>`,
        )
        .join("")}
      ${minYear <= 2009 && maxYear >= 2009 ? `<line class="chart-break" x1="${x(2009)}" x2="${x(2009)}" y1="${margin.top}" y2="${margin.top + innerHeight}" />` : ""}
      ${state.compareEnabled ? "" : `<path class="chart-area" d="${areaPath}" />`}
      <path class="chart-line" d="${linePath}" />
      ${state.compareEnabled ? `<path class="chart-compare-line" d="${comparisonPath}" />` : ""}
      ${points.map((point) => `<circle class="chart-point ${point.year === selectedPoint.year ? "selected" : ""}" data-trend-point-year="${point.year}" cx="${x(point.year)}" cy="${y(point.value)}" r="${point.year === selectedPoint.year ? 4.5 : 2.2}"><title>${point.year}: ${escapeHtml(formatTrendValue(point.value))}</title></circle>`).join("")}
      ${comparisonPoints.map((point) => `<circle class="chart-compare-point ${point.year === selectedPoint.year ? "selected" : ""}" data-trend-compare-year="${point.year}" cx="${x(point.year)}" cy="${y(point.value)}" r="${point.year === selectedPoint.year ? 4.5 : 2.2}"><title>${point.year}: ${escapeHtml(formatTrendValue(point.value))}</title></circle>`).join("")}
      <line class="chart-selected" x1="${selectedX}" x2="${selectedX}" y1="${margin.top}" y2="${margin.top + innerHeight}" />
      <circle class="trend-primary-selected" cx="${selectedX}" cy="${selectedY}" r="5" fill="#171715" stroke="#fffefa" stroke-width="2" />
      ${comparisonSelected ? `<circle cx="${selectedX}" cy="${y(comparisonSelected.value)}" r="5" class="chart-compare-selected trend-comparison-selected" />` : ""}
      ${hitYears.map((year) => `<rect class="trend-hit-target" data-trend-year="${year}" x="${x(year) - hitWidth / 2}" y="${margin.top}" width="${hitWidth}" height="${innerHeight}" role="button" tabindex="0" aria-label="${year} auswählen" />`).join("")}
    </svg>`;

  const adoptYear = (year) => {
    const primaryAgeLabel = currentAgeLabel();
    const compareAgeLabel = state.compareEnabled && state.compareDimension === "age"
      ? ageLabelFor(state.year, Number(state.compareValue))
      : null;
    state.year = year;
    const nextAgeIndex = matchingAgeIndex(year, primaryAgeLabel);
    state.ageIndex = nextAgeIndex >= 0 ? nextAgeIndex : 0;
    if (compareAgeLabel) {
      const nextCompareIndex = matchingAgeIndex(year, compareAgeLabel);
      if (nextCompareIndex >= 0) state.compareValue = String(nextCompareIndex);
    }
  };
  const previewYear = (year) => {
    if (year === state.year) return;
    adoptYear(year);
    renderFilterState();
    renderKpis();
    renderInsight();
    renderRanking();
    renderAgeProfile();
    renderComposition();
    renderTable();
    renderStickySelection();
    updateUrlState();

    const primaryPoint = chart.querySelector(`[data-trend-point-year="${year}"]`);
    const comparePoint = chart.querySelector(`[data-trend-compare-year="${year}"]`);
    const cursor = chart.querySelector(".chart-selected");
    const primarySelected = chart.querySelector(".trend-primary-selected");
    const compareSelected = chart.querySelector(".trend-comparison-selected");
    chart.querySelectorAll(".chart-point").forEach((point) => {
      const active = Number(point.dataset.trendPointYear) === year;
      point.classList.toggle("selected", active);
      point.setAttribute("r", active ? "4.5" : "2.2");
    });
    chart.querySelectorAll(".chart-compare-point").forEach((point) => {
      const active = Number(point.dataset.trendCompareYear) === year;
      point.classList.toggle("selected", active);
      point.setAttribute("r", active ? "4.5" : "2.2");
    });
    if (primaryPoint && cursor && primarySelected) {
      const nextX = primaryPoint.getAttribute("cx");
      cursor.setAttribute("x1", nextX);
      cursor.setAttribute("x2", nextX);
      primarySelected.setAttribute("cx", nextX);
      primarySelected.setAttribute("cy", primaryPoint.getAttribute("cy"));
    }
    if (comparePoint && compareSelected) {
      compareSelected.setAttribute("cx", comparePoint.getAttribute("cx"));
      compareSelected.setAttribute("cy", comparePoint.getAttribute("cy"));
    }
  };
  const commitYear = (year) => {
    if (year !== state.year) adoptYear(year);
    renderAll();
  };
  chart.querySelectorAll("[data-trend-year]").forEach((target) => {
    const year = Number(target.dataset.trendYear);
    target.addEventListener("pointerenter", () => previewYear(year));
    target.addEventListener("click", () => commitYear(year));
    target.addEventListener("focus", () => previewYear(year));
    target.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        commitYear(year);
      }
    });
  });
}

function renderCauseControls() {
  const groups = causeGroups();
  const group = selectedGroup();
  const groupSelect = $("#cause-group-select");
  const detailSelect = $("#cause-detail-select");

  groupSelect.innerHTML = `
    <option value="all">Keine Auswahl – alle Hauptgruppen</option>
    ${groups
      .map(
        (item) =>
          `<option value="${item.id}">${escapeHtml(item.name)}</option>`,
      )
      .join("")}`;
  groupSelect.value = state.selectedGroup;

  if (!group) {
    state.selectedCause = "all";
    detailSelect.innerHTML = '<option value="all">Alle Hauptgruppen im Vergleich</option>';
    detailSelect.value = "all";
    detailSelect.disabled = true;
    $("#cause-detail-help").textContent = "Wähle eine Hauptgruppe für ihre Untergruppen";
    return;
  }

  const validCauseIds = new Set([group.id, ...group.children.map((cause) => cause.id)]);
  if (!validCauseIds.has(state.selectedCause)) state.selectedCause = group.id;

  detailSelect.innerHTML = `
    <option value="${group.id}">Gesamte Hauptgruppe</option>
    ${group.children
      .map(
        (cause) =>
          `<option value="${cause.id}">${escapeHtml(cause.name)}</option>`,
      )
      .join("")}`;
  detailSelect.value = state.selectedCause;
  detailSelect.disabled = group.children.length === 0;
  $("#cause-detail-help").textContent = group.children.length
    ? `${group.children.length} veröffentlichte Untergruppen verfügbar`
    : "Keine eigene Untergruppe veröffentlicht";
}

function renderComparisonControls() {
  const toggle = $("#compare-toggle");
  const controls = $("#compare-controls");
  const dimension = $("#compare-dimension");
  const value = $("#compare-value");
  const profile = dataset.ageProfiles[String(state.year)];

  if ((!profile || state.metric === "asr") && state.compareDimension === "age") {
    state.compareDimension = "sex";
  }
  dimension.querySelector('option[value="age"]').disabled = !profile || state.metric === "asr";
  dimension.value = state.compareDimension;
  toggle.setAttribute("aria-pressed", String(state.compareEnabled));
  toggle.textContent = state.compareEnabled ? "Vergleich entfernen" : "Vergleich hinzufügen";
  controls.classList.toggle("hidden", !state.compareEnabled);

  let options = [];
  if (state.compareDimension === "sex") {
    options = [
      { value: "all", label: "Alle Geschlechter" },
      { value: "male", label: "Männer" },
      { value: "female", label: "Frauen" },
    ].filter((option) => option.value !== state.sex);
  } else if (state.compareDimension === "age") {
    options = (profile?.ageGroups || [])
      .map((group, index) => ({ value: String(index), label: group.label }))
      .filter((option) => Number(option.value) !== state.ageIndex);
  } else {
    const broad = causeGroups()
      .map((cause) => ({ ...cause, value: getValue(cause.id) || 0 }))
      .sort((a, b) => b.value - a.value);
    const details = dataset.causes.filter((cause) => !cause.isBroad && cause.id !== "all");
    options = [...broad, ...details]
      .filter((cause) => cause.id !== state.selectedCause)
      .map((cause) => ({
        value: cause.id,
        label: `${cause.isBroad ? "Hauptgruppe · " : ""}${cause.name}`,
      }));
  }

  if (!options.some((option) => option.value === String(state.compareValue))) {
    state.compareValue = options[0]?.value || "";
  }
  value.innerHTML = options
    .map((option) => `<option value="${escapeHtml(option.value)}">${escapeHtml(option.label)}</option>`)
    .join("");
  value.value = String(state.compareValue);
  value.disabled = !options.length;
}

function renderTrendModeControl() {
  if (state.metric === "asr" && state.trendMode === "share") state.trendMode = "value";
  $$("#trend-mode-control button").forEach((button) => {
    button.classList.toggle("active", button.dataset.trendMode === state.trendMode);
    button.disabled = state.metric === "asr" && button.dataset.trendMode === "share";
  });
}

function weeklyValue(point) {
  const values = state.weeklySex === "all" ? point : point[state.weeklySex];
  return values?.[state.weeklyAge] ?? 0;
}

function weeklySelectionLabel() {
  const sex = { all: "Alle Geschlechter", male: "Männer", female: "Frauen" }[
    state.weeklySex
  ];
  const age = { total: "Alle Altersgruppen", under65: "0–64 Jahre", over65: "65 Jahre und älter" }[
    state.weeklyAge
  ];
  return `${sex} · ${age}`;
}

function renderWeekly() {
  const years = [...new Set(dataset.weeklyDeaths.points.map((point) => point.year))];
  const yearSelect = $("#weekly-year-select");
  yearSelect.innerHTML = years
    .map((year) => `<option value="${year}">${year}</option>`)
    .join("");
  yearSelect.value = String(state.weeklyYear);
  $("#weekly-sex-select").value = state.weeklySex;
  $$("#weekly-age-control button").forEach((button) =>
    button.classList.toggle("active", button.dataset.weeklyAge === state.weeklyAge),
  );

  const points = dataset.weeklyDeaths.points.filter(
    (point) => point.year === state.weeklyYear,
  );
  const chart = $("#weekly-chart");
  if (!points.length) {
    chart.innerHTML = '<div class="chart-empty">Für dieses Jahr sind keine Wochenwerte verfügbar.</div>';
    return;
  }

  const values = points.map((point) => ({ ...point, value: weeklyValue(point) }));
  const latest = values.at(-1);
  const average = values.reduce((sum, point) => sum + point.value, 0) / values.length;
  const maximum = values.reduce((highest, point) =>
    point.value > highest.value ? point : highest,
  );
  const previous = dataset.weeklyDeaths.points.find(
    (point) => point.year === state.weeklyYear - 1 && point.week === latest.week,
  );
  const weeklyChange = previous
    ? changePercent(latest.value, weeklyValue(previous))
    : null;

  $("#weekly-latest-label").textContent = `KW ${latest.week} · ${state.weeklyYear}`;
  $("#weekly-latest").textContent = formatValue(latest.value, "absolute");
  $("#weekly-change").textContent = weeklyChange === null
    ? "–"
    : `${weeklyChange > 0 ? "+" : ""}${percentFormat.format(weeklyChange)} %`;
  $("#weekly-change").style.color = weeklyChange > 0
    ? "var(--red-dark)"
    : weeklyChange < 0
      ? "var(--green)"
      : "";
  $("#weekly-average").textContent = formatValue(average, "absolute");
  $("#weekly-maximum").textContent = `${formatValue(maximum.value, "absolute")} · KW ${maximum.week}`;
  $("#weekly-subtitle").textContent = `${weeklySelectionLabel()} · ${state.weeklyYear}${latest.provisional ? " · vorläufig" : " · endgültig"}`;

  const width = 1280;
  const height = 300;
  const margin = { top: 20, right: 24, bottom: 38, left: 62 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const minWeek = values[0].week;
  const maxWeek = values.at(-1).week;
  const yMax = niceMaximum(Math.max(...values.map((point) => point.value)) * 1.05);
  const x = (week) =>
    margin.left + ((week - minWeek) / Math.max(1, maxWeek - minWeek)) * innerWidth;
  const y = (value) => margin.top + innerHeight - (value / yMax) * innerHeight;
  const linePath = values
    .map((point, index) => `${index ? "L" : "M"}${x(point.week).toFixed(1)},${y(point.value).toFixed(1)}`)
    .join(" ");
  const areaPath = `${linePath} L${x(maxWeek)},${margin.top + innerHeight} L${x(minWeek)},${margin.top + innerHeight} Z`;
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((ratio) => ({
    value: yMax * ratio,
    position: y(yMax * ratio),
  }));
  const weekTicks = [1, 13, 26, 39, 52].filter(
    (week) => week >= minWeek && week <= maxWeek,
  );

  chart.innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Wöchentliche Sterbefälle ${state.weeklyYear}">
      <defs>
        <linearGradient id="weekly-area-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#d62f2f" stop-opacity="0.16" />
          <stop offset="100%" stop-color="#d62f2f" stop-opacity="0" />
        </linearGradient>
      </defs>
      ${yTicks.map((tick) => `
        <line class="chart-grid" x1="${margin.left}" x2="${width - margin.right}" y1="${tick.position}" y2="${tick.position}" />
        <text class="chart-axis-label" x="${margin.left - 10}" y="${tick.position + 3}" text-anchor="end">${escapeHtml(formatValue(tick.value, "absolute", true))}</text>
      `).join("")}
      ${weekTicks.map((week) => `
        <text class="chart-axis-label" x="${x(week)}" y="${height - 12}" text-anchor="middle">KW ${week}</text>
      `).join("")}
      <path class="weekly-area" d="${areaPath}" />
      <path class="chart-line" d="${linePath}" />
      ${values.filter((_, index) => index % 4 === 0 || index === values.length - 1).map((point) => `
        <circle class="chart-point" cx="${x(point.week)}" cy="${y(point.value)}" r="3">
          <title>KW ${point.week}: ${escapeHtml(formatValue(point.value, "absolute"))}</title>
        </circle>
      `).join("")}
      <circle cx="${x(latest.week)}" cy="${y(latest.value)}" r="5" fill="#171715" stroke="#fffefa" stroke-width="2" />
    </svg>`;
}

function rawTrendPointsForInsight() {
  const selectedLabel = currentAgeLabel();
  const years = state.ageIndex > 0 || isYllMetric()
    ? Object.keys(dataset.ageProfiles).map(Number).sort((a, b) => a - b)
    : dataset.years;
  return years
    .map((year) => {
      const ageIndex = state.ageIndex > 0 ? matchingAgeIndex(year, selectedLabel) : 0;
      if (state.ageIndex > 0 && ageIndex < 0) return null;
      return {
        year,
        value: getValue(state.selectedCause, year, {
          sex: state.sex,
          ageIndex,
          metric: state.metric,
        }),
      };
    })
    .filter((point) => point && point.value !== null && point.value !== undefined);
}

function renderInsight() {
  const cause = causeById(state.selectedCause);
  const name = state.selectedCause === "all" ? "Alle Todesursachen" : cause?.name || "Die Auswahl";
  const current = getValue(state.selectedCause) || 0;
  const total = getValue("all") || 0;
  const points = rawTrendPointsForInsight();
  const first = points[0];
  const previous = points.find((point) => point.year === state.year - 1);
  const previousChange = changePercent(current, previous?.value);
  const longChange = first && first.year !== state.year ? changePercent(current, first.value) : null;
  const previousSentence = previous
    ? `Gegenüber ${previous.year} entspricht das einer Veränderung von ${signedPercent(previousChange)}.`
    : "Ein direkter Vorjahresvergleich ist für diese Auswahl nicht verfügbar.";
  const longSentence = longChange === null
    ? ""
    : `Seit ${first.year} beträgt die Veränderung ${signedPercent(longChange)}.`;

  let opening;
  if (isYllMetric()) {
    const yllName = state.selectedCause === "all" ? "alle Todesursachen" : name;
    if (state.metric === "yllAsr") {
      opening = `Für ${yllName} ergibt sich ${state.year} eine altersstandardisierte YLL-Rate von ${decimalFormat.format(current)} verlorenen Jahren je 100.000 Personen.`;
    } else if (state.metric === "yllRate") {
      opening = `Für ${yllName} ergeben sich ${state.year} ${decimalFormat.format(current)} verlorene Lebensjahre je 100.000 Personen.`;
    } else {
      opening = `Für ${yllName} ergeben sich im Jahr ${state.year} schätzungsweise ${formatValue(current)} verlorene Lebensjahre${state.selectedCause === "all" ? "." : ` – ${percentFormat.format(percent(current, total))} % der geschätzten Summe.`}`;
    }
  } else if (state.metric === "asr" && state.ageIndex === 0) {
    opening = `${name} erreicht ${state.year} eine altersstandardisierte Rate von ${decimalFormat.format(current)} je 100.000 Einwohner:innen.`;
  } else {
    opening = state.selectedCause === "all"
      ? `Im Jahr ${state.year} wurden für ${sexLabel()} und ${currentAgeLabel()} insgesamt ${formatValue(current)} Todesfälle registriert.`
      : `${name} umfasst ${state.year} ${formatValue(current)} Todesfälle – ${percentFormat.format(percent(current, total))} % aller Todesfälle dieser Auswahl.`;
  }
  $("#dynamic-insight").textContent = `${opening} ${previousSentence} ${longSentence}`.trim();
}

function renderAgeProfile() {
  const chart = $("#age-profile-chart");
  const profile = dataset.ageProfiles[String(state.year)];
  const cause = causeById(state.selectedCause);
  if (!profile) {
    chart.innerHTML = `<div class="chart-empty">Für ${state.year} ist kein gemeinsames Alters- und Geschlechtsprofil veröffentlicht.</div>`;
    $("#age-profile-subtitle").textContent = "Verfügbar für die Jahrgänge 2017–2025";
    return;
  }

  const metric = isYllMetric() ? "yll" : "absolute";
  const rows = profile.ageGroups.slice(1).map((group, offset) => {
    const ageIndex = offset + 1;
    return {
      ageIndex,
      label: group.label,
      male: getValue(state.selectedCause, state.year, { sex: "male", ageIndex, metric }) || 0,
      female: getValue(state.selectedCause, state.year, { sex: "female", ageIndex, metric }) || 0,
    };
  });
  const maximum = Math.max(1, ...rows.flatMap((row) => [row.male, row.female]));
  $("#age-profile-subtitle").textContent = `${cause?.name || "Alle Todesursachen"} · ${state.year} · ${metric === "yll" ? "verlorene Lebensjahre" : "Todesfälle"}`;
  chart.innerHTML = `
    <div class="age-profile-axis" aria-hidden="true"><span>Männer</span><span>Alter</span><span>Frauen</span></div>
    ${rows.map((row) => `
      <button class="age-profile-row ${row.ageIndex === state.ageIndex ? "selected" : ""}" type="button" data-age-index="${row.ageIndex}" aria-label="${escapeHtml(row.label)} auswählen">
        <span class="age-side male-side"><b>${escapeHtml(formatValue(row.male, metric, true))}</b><i style="--bar-size:${(row.male / maximum) * 100}%"></i></span>
        <strong>${escapeHtml(row.label.replace(" Jahre", ""))}</strong>
        <span class="age-side female-side"><i style="--bar-size:${(row.female / maximum) * 100}%"></i><b>${escapeHtml(formatValue(row.female, metric, true))}</b></span>
      </button>
    `).join("")}`;
  chart.querySelectorAll("[data-age-index]").forEach((button) => {
    button.addEventListener("click", () => {
      state.ageIndex = Number(button.dataset.ageIndex);
      renderAll();
    });
  });
}

function renderComposition() {
  const chart = $("#composition-chart");
  const legend = $("#composition-legend");
  const groups = causeGroups();
  const valueAt = (causeId, year) => getValue(causeId, year, {
    sex: state.sex,
    ageIndex: 0,
    metric: "absolute",
  }) || 0;
  const ranked = groups
    .map((group) => ({ ...group, current: valueAt(group.id, state.year) }))
    .sort((a, b) => b.current - a.current);
  const selectedBroad = state.selectedGroup === "all" ? null : selectedGroup();
  const chosen = ranked.slice(0, 6);
  if (selectedBroad && !chosen.some((group) => group.id === selectedBroad.id)) {
    chosen[5] = ranked.find((group) => group.id === selectedBroad.id);
  }
  const uniqueGroups = chosen.filter(Boolean).filter(
    (group, index, array) => array.findIndex((candidate) => candidate.id === group.id) === index,
  );
  const accentId = selectedBroad?.id || uniqueGroups[0]?.id;
  const years = dataset.years;
  const layers = uniqueGroups.map((group, index) => ({
    id: group.id,
    label: group.name,
    className: group.id === accentId ? "composition-accent" : `composition-tone-${index + 1}`,
    values: years.map((year) => {
      const total = valueAt("all", year);
      return percent(valueAt(group.id, year), total);
    }),
  }));
  layers.push({
    id: "remainder",
    label: "Übrige Hauptgruppen",
    className: "composition-remainder",
    values: years.map((_, yearIndex) => Math.max(0, 100 - layers.reduce((sum, layer) => sum + layer.values[yearIndex], 0))),
  });

  const width = 1280;
  const height = 340;
  const margin = { top: 22, right: 24, bottom: 42, left: 56 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const x = (year) => margin.left + ((year - years[0]) / (years.at(-1) - years[0])) * innerWidth;
  const y = (value) => margin.top + innerHeight - (value / 100) * innerHeight;
  const bottoms = years.map(() => 0);
  const paths = layers.map((layer) => {
    const lower = [...bottoms];
    const upper = bottoms.map((value, index) => value + layer.values[index]);
    upper.forEach((value, index) => { bottoms[index] = value; });
    const topPath = years.map((year, index) => `${index ? "L" : "M"}${x(year).toFixed(1)},${y(upper[index]).toFixed(1)}`).join(" ");
    const bottomPath = [...years].reverse().map((year, reverseIndex) => {
      const index = years.length - 1 - reverseIndex;
      return `L${x(year).toFixed(1)},${y(lower[index]).toFixed(1)}`;
    }).join(" ");
    return `<path class="composition-layer ${layer.className}" d="${topPath} ${bottomPath} Z"><title>${escapeHtml(layer.label)}</title></path>`;
  }).join("");
  const xTicks = [1970, 1980, 1990, 2000, 2010, 2020, years.at(-1)];
  chart.innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Anteile der Todesursachen-Hauptgruppen von ${years[0]} bis ${years.at(-1)}">
      ${[0, 25, 50, 75, 100].map((tick) => `
        <line class="chart-grid" x1="${margin.left}" x2="${width - margin.right}" y1="${y(tick)}" y2="${y(tick)}" />
        <text class="chart-axis-label" x="${margin.left - 9}" y="${y(tick) + 3}" text-anchor="end">${tick} %</text>
      `).join("")}
      ${paths}
      ${xTicks.map((year) => `<text class="chart-axis-label" x="${x(year)}" y="${height - 12}" text-anchor="middle">${year}</text>`).join("")}
      <line class="chart-selected" x1="${x(state.year)}" x2="${x(state.year)}" y1="${margin.top}" y2="${margin.top + innerHeight}" />
    </svg>`;
  const selectedYearIndex = yearIndex(state.year);
  legend.innerHTML = layers.map((layer) => `
    <span><i class="${layer.className}"></i><b>${escapeHtml(layer.label)}</b><small>${percentFormat.format(layer.values[selectedYearIndex])} %</small></span>
  `).join("");
  $("#composition-subtitle").textContent = `${sexLabel()} · alle Altersgruppen · ${state.year} markiert`;
}

function renderStickySelection() {
  const cause = causeById(state.selectedCause);
  $("#sticky-selection-text").textContent = `${state.year} · ${sexLabel()} · ${currentAgeLabel()} · ${cause?.name || "Alle Todesursachen"} · ${trendMetricLabel()}`;
}

function renderTable() {
  const total = getValue("all") || 0;
  const search = state.search.trim().toLocaleLowerCase("de-AT");
  const group = selectedGroup();
  const groupCauseIds = group
    ? new Set([group.id, ...group.children.map((cause) => cause.id)])
    : new Set(causeGroups().map((cause) => cause.id));
  if (!isYllMetric() && state.tableSortKey === "averageYll") {
    state.tableSortKey = "value";
    state.tableSortDirection = "desc";
  }
  const rows = dataset.causes
    .filter((cause) => groupCauseIds.has(cause.id))
    .filter((cause) =>
      !search || `${cause.name} ${cause.icd}`.toLocaleLowerCase("de-AT").includes(search),
    )
    .map((cause) => {
      const value = getValue(cause.id) || 0;
      const deaths = getValue(cause.id, state.year, {
        sex: state.sex,
        ageIndex: state.ageIndex,
        metric: "absolute",
      }) || 0;
      return {
        ...cause,
        value,
        deaths,
        averageYll: isYllMetric() && deaths > 0
          ? getYearsLost(cause.id, state.year, { sex: state.sex, ageIndex: state.ageIndex }) / deaths
          : null,
        share: percent(value, total),
      };
    });
  const direction = state.tableSortDirection === "asc" ? 1 : -1;
  rows.sort((a, b) => {
    if (state.tableSortKey === "name") {
      return direction * a.name.localeCompare(b.name, "de");
    }
    const aValue = a[state.tableSortKey] ?? Number.NEGATIVE_INFINITY;
    const bValue = b[state.tableSortKey] ?? Number.NEGATIVE_INFINITY;
    return direction * (aValue - bValue);
  });
  const visibleRows = rows.slice(0, state.tableLimit);
  const body = $("#cause-table-body");

  $("#cause-table-title").textContent = group
    ? "Ursachen der ausgewählten Gruppe"
    : "Alle Hauptgruppen";
  $("#cause-table-description").textContent = group
    ? "Die Hauptgruppe und ihre veröffentlichten Untergruppen."
    : "Überschneidungsfreie ICD-Hauptgruppen im direkten Vergleich.";

  $("#value-column-label").textContent =
    state.metric === "yll"
      ? "Verlorene Jahre"
      : state.metric === "yllRate"
        ? "YLL je 100.000"
        : state.metric === "yllAsr"
          ? "YLL standardisiert"
      : state.metric === "asr" && state.ageIndex === 0
        ? "Rate je 100.000"
        : "Fälle";
  $("#yll-average-column").classList.toggle("hidden-column", !isYllMetric());
  $("#share-column-label").textContent = state.metric === "asr" || state.metric === "yllAsr"
    ? "Relation"
    : "Anteil";
  $$(".sort-button").forEach((button) => {
    const active = button.dataset.sort === state.tableSortKey;
    button.classList.toggle("active", active);
    button.closest("th")?.setAttribute(
      "aria-sort",
      active ? (state.tableSortDirection === "asc" ? "ascending" : "descending") : "none",
    );
  });
  body.innerHTML = visibleRows
    .map(
      (cause) => `
        <tr data-cause-id="${cause.id}" class="${cause.id === state.selectedCause ? "selected" : ""}" tabindex="0">
          <td class="cause-name-cell"><strong>${escapeHtml(cause.name)}</strong></td>
          <td>${escapeHtml(cause.icd || "–")}</td>
          <td class="numeric">${escapeHtml(formatValue(cause.value))}</td>
          <td class="numeric average-yll-cell ${isYllMetric() ? "" : "hidden-column"}">${cause.averageYll === null ? "–" : `${decimalFormat.format(cause.averageYll)} Jahre`}</td>
          <td class="numeric">${percentFormat.format(cause.share)} %</td>
          <td><span class="type-pill ${cause.isBroad ? "broad" : ""}">${cause.isBroad ? "Hauptgruppe" : "Detail"}</span></td>
        </tr>`,
    )
    .join("");

  const selectRow = (row) => {
    state.selectedCause = row.dataset.causeId;
    const parentGroup = groupForCause(state.selectedCause);
    if (parentGroup) state.selectedGroup = parentGroup.id;
    if (causeById(state.selectedCause)?.isBroad) state.level = "detail";
    renderAll();
  };
  body.querySelectorAll("tr").forEach((row) => {
    row.addEventListener("click", () => selectRow(row));
    row.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") selectRow(row);
    });
  });

  $("#table-count").textContent = `${Math.min(rows.length, state.tableLimit)} von ${rows.length} Ursachen`;
  $("#show-more").classList.toggle("hidden", state.tableLimit >= rows.length);
}

function renderStaticMetadata() {
  $("#method-notes").innerHTML = dataset.meta.notes
    .map(
      (note, index) => `
        <div class="method-note">
          <span>${String(index + 1).padStart(2, "0")}</span>
          <p>${escapeHtml(note)}</p>
        </div>`,
    )
    .join("");
  $("#source-links").innerHTML = dataset.meta.sources
    .map(
      (source) =>
        `<a href="${escapeHtml(source.url)}" target="_blank" rel="noreferrer">${escapeHtml(source.label)} ↗</a>`,
    )
    .join("");
}

function renderFilterState() {
  renderCauseControls();
  $("#year-output").textContent = state.year;
  $("#year-range").value = String(state.year);
  const progress = ((state.year - dataset.years[0]) / (dataset.years.at(-1) - dataset.years[0])) * 100;
  $("#year-range").style.setProperty("--range-progress", `${progress}%`);
  $("#year-ticks").innerHTML = dataset.years
    .map((year, index) => {
      const left = (index / Math.max(1, dataset.years.length - 1)) * 100;
      const major = year % 10 === 0 || index === dataset.years.length - 1;
      return `<span class="year-tick ${major ? "major" : ""} ${year === state.year ? "active" : ""}" style="left:${left}%" title="${year}">${major ? `<i>${year}</i>` : ""}</span>`;
    })
    .join("");
  $("#sex-select").value = state.sex;
  renderAgeOptions();
  syncMetricControl();
  renderComparisonControls();
  renderTrendModeControl();
  $$("#level-control button").forEach((button) => {
    button.classList.toggle("active", button.dataset.level === state.level);
    button.disabled = state.selectedGroup === "all" && button.dataset.level === "detail";
  });
  renderCoverageNote();
}

function renderAll() {
  renderFilterState();
  renderKpis();
  renderInsight();
  renderRanking();
  renderTrend();
  renderAgeProfile();
  renderComposition();
  renderTable();
  renderStickySelection();
  updateUrlState();
}

function bindEvents() {
  $$(".sort-button").forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.dataset.sort;
      if (key === "averageYll" && !isYllMetric()) return;
      if (state.tableSortKey === key) {
        state.tableSortDirection = state.tableSortDirection === "desc" ? "asc" : "desc";
      } else {
        state.tableSortKey = key;
        state.tableSortDirection = key === "name" ? "asc" : "desc";
      }
      renderTable();
    });
  });
  $("#cause-group-select").addEventListener("change", (event) => {
    state.selectedGroup = event.target.value;
    state.selectedCause = state.selectedGroup === "all" ? "all" : state.selectedGroup;
    state.level = state.selectedGroup === "all" ? "broad" : "detail";
    state.tableLimit = 14;
    state.search = "";
    $("#cause-search").value = "";
    renderAll();
  });
  $("#cause-detail-select").addEventListener("change", (event) => {
    state.selectedCause = event.target.value;
    renderAll();
  });
  $("#year-range").addEventListener("input", (event) => {
    const selectedAgeLabel = currentAgeLabel();
    state.year = Number(event.target.value);
    const preservedIndex = matchingAgeIndex(state.year, selectedAgeLabel);
    state.ageIndex = preservedIndex >= 0 ? preservedIndex : 0;
    renderAll();
  });
  $("#sex-select").addEventListener("change", (event) => {
    state.sex = event.target.value;
    renderAll();
  });
  $("#age-select").addEventListener("change", (event) => {
    state.ageIndex = Number(event.target.value);
    renderAll();
  });
  $$("#metric-control button").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.disabled) return;
      state.metric = button.dataset.metric;
      renderAll();
    });
  });
  $$("#yll-mode-control button").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.disabled) return;
      state.metric = button.dataset.yllMetric;
      renderAll();
    });
  });
  $$("#level-control button").forEach((button) => {
    button.addEventListener("click", () => {
      state.level = button.dataset.level;
      renderAll();
    });
  });
  $("#cause-search").addEventListener("input", (event) => {
    state.search = event.target.value;
    state.tableLimit = 14;
    renderTable();
  });
  $("#show-more").addEventListener("click", () => {
    state.tableLimit += 20;
    renderTable();
  });
  $("#edit-selection").addEventListener("click", () => {
    document.querySelector(".filter-panel").scrollIntoView({ behavior: "smooth", block: "start" });
  });
  $("#copy-selection-link").addEventListener("click", async () => {
    const status = $("#copy-selection-status");
    try {
      await navigator.clipboard.writeText(location.href);
      status.textContent = "Link kopiert";
    } catch {
      status.textContent = "Link steht in der Adresszeile";
    }
    window.setTimeout(() => { status.textContent = ""; }, 2200);
  });
  $("#reset-filters").addEventListener("click", () => {
    Object.assign(state, {
      year: 2025,
      sex: "all",
      ageIndex: 0,
      metric: "absolute",
      level: "broad",
      selectedGroup: "all",
      selectedCause: "all",
      compareEnabled: false,
      compareDimension: "sex",
      compareValue: "female",
      trendMode: "value",
      search: "",
      tableLimit: 14,
      tableSortKey: "value",
      tableSortDirection: "desc",
    });
    $("#cause-search").value = "";
    renderAll();
  });
}

async function init() {
  try {
    const response = await fetch(DATA_URL);
    if (!response.ok) throw new Error(`Datendatei konnte nicht geladen werden (${response.status}).`);
    dataset = await response.json();
    state.year = dataset.years.at(-1);
    applyUrlState();
    renderStaticMetadata();
    bindEvents();
    renderAll();
  } catch (error) {
    console.error(error);
    document.querySelector("main").innerHTML = `
      <div class="error-state">
        <strong>Die Statistik konnte nicht geladen werden.</strong>
        <p>${escapeHtml(error.message)}</p>
      </div>`;
  }
}

init();
