const DATA_URL = "/mortality/data/mortality.json?v=20260807-2";

const numberFormat = new Intl.NumberFormat("de-AT");
const decimalFormat = new Intl.NumberFormat("de-AT", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});
const percentFormat = new Intl.NumberFormat("de-AT", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const state = {
  year: 2026,
  sex: "all",
  age: "total",
  week: 28,
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

function formatNumber(value) {
  return value === null || value === undefined ? "–" : numberFormat.format(Math.round(value));
}

function formatDecimal(value, suffix = "") {
  return value === null || value === undefined ? "–" : `${decimalFormat.format(value)}${suffix}`;
}

function compactNumber(value) {
  return Math.abs(value) >= 1000
    ? `${decimalFormat.format(value / 1000)} Tsd.`
    : formatNumber(value);
}

function changePercent(current, previous) {
  return previous ? ((current - previous) / previous) * 100 : null;
}

function niceMaximum(value) {
  if (value <= 0) return 1;
  const exponent = 10 ** Math.floor(Math.log10(value));
  const fraction = value / exponent;
  const nice = fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 5 ? 5 : 10;
  return nice * exponent;
}

function niceInterval(value) {
  if (value <= 0) return 1;
  const exponent = 10 ** Math.floor(Math.log10(value));
  const fraction = value / exponent;
  const nice = fraction <= 1 ? 1 : fraction <= 2 ? 2 : fraction <= 2.5 ? 2.5 : fraction <= 5 ? 5 : 10;
  return nice * exponent;
}

function pointsForYear(year = state.year) {
  return dataset.weeklyDeaths.points.filter((point) => point.year === year);
}

function valueFor(point) {
  const source = state.sex === "all" ? point : point[state.sex];
  return source?.[state.age] ?? 0;
}

function selectedPoint() {
  const points = pointsForYear();
  return points.find((point) => point.week === state.week) || points.at(-1);
}

function previousPoint(point = selectedPoint()) {
  return dataset.weeklyDeaths.points.find(
    (candidate) => candidate.year === state.year - 1 && candidate.week === point.week,
  );
}

function referenceForWeek(week) {
  const values = [];
  const years = [];
  for (let year = state.year - 5; year < state.year; year += 1) {
    const point = dataset.weeklyDeaths.points.find(
      (candidate) => candidate.year === year && candidate.week === week,
    );
    if (!point) continue;
    values.push(valueFor(point));
    years.push(year);
  }
  if (!values.length) return null;
  return {
    week,
    mean: values.reduce((sum, value) => sum + value, 0) / values.length,
    min: Math.min(...values),
    max: Math.max(...values),
    count: values.length,
    years,
  };
}

function cumulativeReferenceBalance(week = state.week) {
  return pointsForYear()
    .filter((point) => point.week <= week)
    .reduce((sum, point) => {
      const reference = referenceForWeek(point.week);
      return reference ? sum + valueFor(point) - reference.mean : sum;
    }, 0);
}

function signedNumber(value) {
  if (value === null || value === undefined) return "–";
  const rounded = Math.round(value);
  return `${rounded > 0 ? "+" : ""}${formatNumber(rounded)}`;
}

function sexLabel() {
  return { all: "Alle Geschlechter", male: "Männer", female: "Frauen" }[state.sex];
}

function ageLabel() {
  return { total: "Alle Altersgruppen", under65: "0–64 Jahre", over65: "65 Jahre und älter" }[
    state.age
  ];
}

function periodLabel(point) {
  const match = point.label.match(/Woche von\s+(.+?)\s+bis\s+(.+?)\)/);
  return match ? `${match[1]} – ${match[2]}` : point.label;
}

function renderControls() {
  const years = [...new Set(dataset.weeklyDeaths.points.map((point) => point.year))];
  $("#weekly-year-select").innerHTML = years
    .map((year) => `<option value="${year}">${year}</option>`)
    .join("");
  $("#weekly-year-select").value = String(state.year);
  $("#weekly-sex-select").value = state.sex;
  $$("#weekly-age-control button").forEach((button) =>
    button.classList.toggle("active", button.dataset.weeklyAge === state.age),
  );

  const points = pointsForYear();
  const firstWeek = points[0].week;
  const lastWeek = points.at(-1).week;
  if (!points.some((point) => point.week === state.week)) state.week = lastWeek;
  const range = $("#weekly-week-range");
  range.min = String(firstWeek);
  range.max = String(lastWeek);
  range.value = String(state.week);
  const progress = ((state.week - firstWeek) / Math.max(1, lastWeek - firstWeek)) * 100;
  range.style.setProperty("--range-progress", `${progress}%`);

  const point = selectedPoint();
  $("#weekly-week-output").textContent = `KW ${point.week}`;
  $("#weekly-week-dates").textContent = periodLabel(point);
  $("#weekly-year-help").textContent = point.provisional
    ? "Vorläufige Ergebnisse"
    : "Endgültige Ergebnisse";
}

function renderKpis() {
  const point = selectedPoint();
  const previous = previousPoint(point);
  const currentValue = valueFor(point);
  const previousValue = previous ? valueFor(previous) : null;
  const change = changePercent(currentValue, previousValue);
  const weather = point.weather;

  $("#weekly-selected-label").textContent = `Sterbefälle · KW ${point.week}`;
  $("#weekly-selected-deaths").textContent = formatNumber(currentValue);
  $("#weekly-selected-note").textContent = `${sexLabel()} · ${ageLabel()} · ${state.year}`;
  $("#weekly-selected-change").textContent = change === null
    ? "–"
    : `${change > 0 ? "+" : ""}${percentFormat.format(change)} %`;
  $("#weekly-selected-change").style.color = change > 0
    ? "var(--red-dark)"
    : change < 0
      ? "var(--green)"
      : "";
  $("#weekly-change-note").textContent = previous
    ? `${formatNumber(previousValue)} Sterbefälle in KW ${previous.week}/${previous.year}`
    : "Kein Vorjahreswert verfügbar";
  $("#weekly-temperature").textContent = formatDecimal(weather?.temperatureMean, " °C");
  $("#weekly-temperature-range").textContent = weather
    ? `${decimalFormat.format(weather.temperatureMin)} bis ${decimalFormat.format(weather.temperatureMax)} °C`
    : "–";
  $("#weekly-weather-note").textContent = weather
    ? `${decimalFormat.format(weather.precipitation)} mm Niederschlag · ${decimalFormat.format(weather.sunshineHours)} h Sonne`
    : "Keine Wetterdaten verfügbar";
}

function renderReferenceSummary() {
  const point = selectedPoint();
  const currentValue = valueFor(point);
  const reference = referenceForWeek(point.week);
  const balance = reference ? currentValue - reference.mean : null;
  const balancePercent = reference ? changePercent(currentValue, reference.mean) : null;
  const cumulative = reference ? cumulativeReferenceBalance(point.week) : null;

  $("#reference-expected").textContent = reference ? formatNumber(reference.mean) : "–";
  $("#reference-expected-note").textContent = reference
    ? `Spannweite ${formatNumber(reference.min)}–${formatNumber(reference.max)} · ${reference.count} Vorjahre`
    : "Für dieses Jahr fehlt eine historische Referenz";
  $("#reference-weekly-balance").textContent = balance === null
    ? "–"
    : `${signedNumber(balance)} · ${balancePercent > 0 ? "+" : ""}${percentFormat.format(balancePercent)} %`;
  $("#reference-weekly-balance").classList.toggle("negative", balance < 0);
  $("#reference-weekly-balance").classList.toggle("positive", balance > 0);
  $("#reference-weekly-note").textContent = reference
    ? `Beobachtet: ${formatNumber(currentValue)} in KW ${point.week}`
    : "Keine Berechnung möglich";
  $("#reference-cumulative").textContent = signedNumber(cumulative);
  $("#reference-cumulative").classList.toggle("negative", cumulative < 0);
  $("#reference-cumulative").classList.toggle("positive", cumulative > 0);
  $("#reference-cumulative-note").textContent = reference
    ? `Summe der Abweichungen von KW 1 bis KW ${point.week}`
    : "Keine Berechnung möglich";

  $("#weather-deaths").textContent = formatNumber(currentValue);
  $("#weather-reference").textContent = reference ? formatNumber(reference.mean) : "–";
  $("#weather-balance").textContent = signedNumber(balance);
  $("#weather-balance").classList.toggle("negative", balance < 0);
  $("#weather-balance").classList.toggle("positive", balance > 0);
}

function renderDeathsChart() {
  const current = pointsForYear().map((point) => ({ ...point, value: valueFor(point) }));
  const reference = current
    .map((point) => referenceForWeek(point.week))
    .filter(Boolean);
  const chart = $("#weekly-deaths-chart");
  const width = 1280;
  const height = 350;
  const margin = { top: 26, right: 26, bottom: 42, left: 68 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;
  const maxWeek = current.at(-1).week;
  const allValues = [
    ...current.map((point) => point.value),
    ...reference.flatMap((point) => [point.min, point.max]),
  ];
  const rawMin = Math.min(...allValues);
  const rawMax = Math.max(...allValues);
  const spread = Math.max(1, rawMax - rawMin);
  const padding = Math.max(1, spread * 0.08);
  const yStep = niceInterval((spread + padding * 2) / 4);
  const yMin = Math.max(0, Math.floor((rawMin - padding) / yStep) * yStep);
  const yMax = Math.max(yMin + yStep, Math.ceil((rawMax + padding) / yStep) * yStep);
  const x = (week) => margin.left + ((week - 1) / Math.max(1, maxWeek - 1)) * innerWidth;
  const y = (value) => margin.top + innerHeight - ((value - yMin) / (yMax - yMin)) * innerHeight;
  const pathFor = (points) => points
    .map((point, index) => `${index ? "L" : "M"}${x(point.week).toFixed(1)},${y(point.value).toFixed(1)}`)
    .join(" ");
  const referencePath = reference
    .map((point, index) => `${index ? "L" : "M"}${x(point.week).toFixed(1)},${y(point.mean).toFixed(1)}`)
    .join(" ");
  const referenceBand = [
    ...reference.map((point) => `${x(point.week).toFixed(1)},${y(point.max).toFixed(1)}`),
    ...[...reference].reverse().map((point) => `${x(point.week).toFixed(1)},${y(point.min).toFixed(1)}`),
  ].join(" ");
  const yTicks = [];
  for (let value = yMin; value <= yMax + yStep / 2; value += yStep) {
    yTicks.push({ value, position: y(value) });
  }
  const weekTicks = [1, 13, 26, 39, 52].filter((week) => week <= maxWeek);
  const selected = selectedPoint();

  $("#weekly-chart-subtitle").textContent = `${sexLabel()} · ${ageLabel()} · ${state.year}${selected.provisional ? " · vorläufig" : " · endgültig"}`;
  $("#weekly-chart-footnote").textContent = reference.length
    ? `Über eines der beiden Diagramme fahren: Beide Ansichten folgen derselben Woche. Referenz: Mittelwert und beobachtete Spannweite der bis zu fünf Vorjahre. Die Y-Achse ist auf ${formatNumber(yMin)} bis ${formatNumber(yMax)} Fälle verdichtet und beginnt nicht bei null.`
    : `Über eines der beiden Diagramme fahren: Beide Ansichten folgen derselben Woche. Für ${state.year} liegt noch keine historische Referenz vor. Die Y-Achse ist auf ${formatNumber(yMin)} bis ${formatNumber(yMax)} Fälle verdichtet und beginnt nicht bei null.`;
  chart.innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Wöchentliche Sterbefälle ${state.year}, Skala ${formatNumber(yMin)} bis ${formatNumber(yMax)}">
      ${yTicks.map((tick) => `
        <line class="chart-grid" x1="${margin.left}" x2="${width - margin.right}" y1="${tick.position}" y2="${tick.position}" />
        <text class="chart-axis-label" x="${margin.left - 11}" y="${tick.position + 3}" text-anchor="end">${escapeHtml(compactNumber(tick.value))}</text>
      `).join("")}
      ${weekTicks.map((week) => `<text class="chart-axis-label" x="${x(week)}" y="${height - 12}" text-anchor="middle">KW ${week}</text>`).join("")}
      ${reference.length ? `<polygon class="week-reference-band" points="${referenceBand}" />` : ""}
      ${reference.length ? `<path class="week-reference-line" d="${referencePath}" />` : ""}
      <path class="chart-line" d="${pathFor(current)}" />
      <line class="chart-selected shared-week-cursor" x1="${x(selected.week)}" x2="${x(selected.week)}" y1="${margin.top}" y2="${margin.top + innerHeight}" />
      ${current.map((point) => `
        <circle
          class="week-data-point ${point.week === state.week ? "selected" : ""}"
          data-week="${point.week}"
          cx="${x(point.week)}"
          cy="${y(point.value)}"
          r="${point.week === state.week ? 5 : 2.8}"
        ><title>KW ${point.week}: ${formatNumber(point.value)} Sterbefälle${referenceForWeek(point.week) ? ` · Referenz ${formatNumber(referenceForWeek(point.week).mean)}` : ""}</title></circle>
      `).join("")}
      ${current.map((point) => `
        <rect
          class="week-hit-target"
          data-week-selector
          data-week="${point.week}"
          x="${x(point.week) - innerWidth / Math.max(1, maxWeek - 1) / 2}"
          y="${margin.top}"
          width="${innerWidth / Math.max(1, maxWeek - 1)}"
          height="${innerHeight}"
          role="button"
          tabindex="0"
          aria-label="KW ${point.week}: ${formatNumber(point.value)} Sterbefälle"
        />
      `).join("")}
    </svg>`;
  bindWeekSelectors(chart);
}

function renderWeatherChart() {
  const points = pointsForYear().filter((point) => point.weather);
  const chart = $("#weekly-weather-chart");
  if (!points.length) {
    chart.innerHTML = '<div class="chart-empty">Für dieses Jahr sind keine Wetterwerte verfügbar.</div>';
    return;
  }

  const width = 920;
  const height = 430;
  const margin = { top: 24, right: 24, bottom: 40, left: 60 };
  const innerWidth = width - margin.left - margin.right;
  const tempTop = margin.top;
  const tempHeight = 245;
  const rainTop = 315;
  const rainHeight = 70;
  const maxWeek = points.at(-1).week;
  const tempMin = Math.floor(Math.min(...points.map((point) => point.weather.temperatureMin)) / 5) * 5;
  const tempMax = Math.ceil(Math.max(...points.map((point) => point.weather.temperatureMax)) / 5) * 5;
  const rainMax = niceMaximum(Math.max(...points.map((point) => point.weather.precipitation)));
  const x = (week) => margin.left + ((week - 1) / Math.max(1, maxWeek - 1)) * innerWidth;
  const yTemp = (value) => tempTop + tempHeight - ((value - tempMin) / Math.max(1, tempMax - tempMin)) * tempHeight;
  const yRain = (value) => rainTop + rainHeight - (value / rainMax) * rainHeight;
  const meanPath = points
    .map((point, index) => `${index ? "L" : "M"}${x(point.week).toFixed(1)},${yTemp(point.weather.temperatureMean).toFixed(1)}`)
    .join(" ");
  const bandPath = [
    ...points.map((point) => `${x(point.week).toFixed(1)},${yTemp(point.weather.temperatureMax).toFixed(1)}`),
    ...[...points].reverse().map((point) => `${x(point.week).toFixed(1)},${yTemp(point.weather.temperatureMin).toFixed(1)}`),
  ];
  const barWidth = Math.max(2, (innerWidth / maxWeek) * 0.62);
  const tempTicks = [tempMin, (tempMin + tempMax) / 2, tempMax];
  const weekTicks = [1, 13, 26, 39, 52].filter((week) => week <= maxWeek);

  chart.innerHTML = `
    <svg viewBox="0 0 ${width} ${height}" role="img" aria-label="Wetterindikatoren ${state.year}">
      ${tempTicks.map((tick) => `
        <line class="chart-grid" x1="${margin.left}" x2="${width - margin.right}" y1="${yTemp(tick)}" y2="${yTemp(tick)}" />
        <text class="chart-axis-label" x="${margin.left - 10}" y="${yTemp(tick) + 3}" text-anchor="end">${decimalFormat.format(tick)} °C</text>
      `).join("")}
      <polygon class="temperature-band" points="${bandPath.join(" ")}" />
      <path class="temperature-line" d="${meanPath}" />
      ${points.map((point) => `<circle class="temperature-point ${point.week === state.week ? "selected" : ""}" data-week="${point.week}" cx="${x(point.week)}" cy="${yTemp(point.weather.temperatureMean)}" r="${point.week === state.week ? 4.5 : 2.2}"><title>KW ${point.week}: ${decimalFormat.format(point.weather.temperatureMean)} °C</title></circle>`).join("")}
      <line class="weather-divider" x1="${margin.left}" x2="${width - margin.right}" y1="${rainTop - 17}" y2="${rainTop - 17}" />
      <text class="chart-axis-label" x="${margin.left}" y="${rainTop - 24}">Niederschlag · ${decimalFormat.format(rainMax)} mm Skala</text>
      ${points.map((point) => `
        <rect class="rain-bar ${point.week === state.week ? "selected" : ""}" data-week="${point.week}" x="${x(point.week) - barWidth / 2}" y="${yRain(point.weather.precipitation)}" width="${barWidth}" height="${rainTop + rainHeight - yRain(point.weather.precipitation)}"><title>KW ${point.week}: ${decimalFormat.format(point.weather.precipitation)} mm</title></rect>
      `).join("")}
      ${weekTicks.map((week) => `<text class="chart-axis-label" x="${x(week)}" y="${height - 12}" text-anchor="middle">KW ${week}</text>`).join("")}
      <line class="chart-selected shared-week-cursor" x1="${x(state.week)}" x2="${x(state.week)}" y1="${tempTop}" y2="${rainTop + rainHeight}" />
      ${points.map((point) => `
        <rect
          class="week-hit-target"
          data-week-selector
          data-week="${point.week}"
          x="${x(point.week) - innerWidth / Math.max(1, maxWeek - 1) / 2}"
          y="${tempTop}"
          width="${innerWidth / Math.max(1, maxWeek - 1)}"
          height="${rainTop + rainHeight - tempTop}"
          role="button"
          tabindex="0"
          aria-label="KW ${point.week}: ${decimalFormat.format(point.weather.temperatureMean)} °C, ${decimalFormat.format(point.weather.precipitation)} mm Niederschlag"
        />
      `).join("")}
    </svg>`;
  bindWeekSelectors(chart);
}

function renderWeatherDetail() {
  const point = selectedPoint();
  const weather = point.weather;
  $("#weather-detail-title").textContent = `KW ${point.week} · ${point.year}`;
  $("#weather-detail-dates").textContent = periodLabel(point);
  $("#weather-rain").textContent = formatDecimal(weather?.precipitation, " mm");
  $("#weather-sun").textContent = formatDecimal(weather?.sunshineHours, " Stunden");
  $("#weather-min").textContent = formatDecimal(weather?.temperatureMin, " °C");
  $("#weather-max").textContent = formatDecimal(weather?.temperatureMax, " °C");
}

function renderTable() {
  const points = pointsForYear();
  const body = $("#weekly-table-body");
  body.innerHTML = points.map((point) => {
    const weather = point.weather;
    return `
      <tr data-week-selector data-week="${point.week}" class="${point.week === state.week ? "selected" : ""}" tabindex="0">
        <td><strong>KW ${point.week}</strong></td>
        <td>${escapeHtml(periodLabel(point))}</td>
        <td class="numeric">${formatNumber(valueFor(point))}</td>
        <td class="numeric">${formatDecimal(weather?.temperatureMean, " °C")}</td>
        <td class="numeric">${weather ? `${decimalFormat.format(weather.temperatureMin)}–${decimalFormat.format(weather.temperatureMax)} °C` : "–"}</td>
        <td class="numeric">${formatDecimal(weather?.precipitation, " mm")}</td>
        <td class="numeric">${formatDecimal(weather?.sunshineHours, " h")}</td>
      </tr>`;
  }).join("");
  bindWeekSelectors(body);
  $("#weekly-table-count").textContent = `${points.length} veröffentlichte Kalenderwochen`;
}

function bindWeekSelectors(container) {
  container.querySelectorAll("[data-week-selector]").forEach((element) => {
    const select = () => {
      state.week = Number(element.dataset.week);
      renderWeekSelection();
    };
    element.addEventListener("click", select);
    element.addEventListener("pointerenter", select);
    element.addEventListener("focus", select);
    element.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        select();
      }
    });
  });
}

function renderWeekSelection() {
  const point = selectedPoint();
  const range = $("#weekly-week-range");
  range.value = String(point.week);
  const progress = ((point.week - Number(range.min)) / Math.max(1, Number(range.max) - Number(range.min))) * 100;
  range.style.setProperty("--range-progress", `${progress}%`);
  $("#weekly-week-output").textContent = `KW ${point.week}`;
  $("#weekly-week-dates").textContent = periodLabel(point);

  renderKpis();
  renderReferenceSummary();
  renderWeatherDetail();

  $$(".week-data-point").forEach((element) => {
    const selected = Number(element.dataset.week) === point.week;
    element.classList.toggle("selected", selected);
    element.setAttribute("r", selected ? "5" : "2.8");
  });
  $$(".temperature-point").forEach((element) => {
    const selected = Number(element.dataset.week) === point.week;
    element.classList.toggle("selected", selected);
    element.setAttribute("r", selected ? "4.5" : "2.2");
  });
  $$(".rain-bar").forEach((element) =>
    element.classList.toggle("selected", Number(element.dataset.week) === point.week),
  );
  $$("#weekly-table-body tr").forEach((element) =>
    element.classList.toggle("selected", Number(element.dataset.week) === point.week),
  );

  const deathsPoint = $(`#weekly-deaths-chart .week-data-point[data-week="${point.week}"]`);
  const weatherPoint = $(`#weekly-weather-chart .temperature-point[data-week="${point.week}"]`);
  const deathsCursor = $("#weekly-deaths-chart .shared-week-cursor");
  const weatherCursor = $("#weekly-weather-chart .shared-week-cursor");
  if (deathsPoint && deathsCursor) {
    deathsCursor.setAttribute("x1", deathsPoint.getAttribute("cx"));
    deathsCursor.setAttribute("x2", deathsPoint.getAttribute("cx"));
  }
  if (weatherPoint && weatherCursor) {
    weatherCursor.setAttribute("x1", weatherPoint.getAttribute("cx"));
    weatherCursor.setAttribute("x2", weatherPoint.getAttribute("cx"));
  }
}

function renderAll() {
  renderControls();
  renderKpis();
  renderDeathsChart();
  renderWeatherChart();
  renderReferenceSummary();
  renderWeatherDetail();
  renderTable();
}

function bindEvents() {
  $("#weekly-year-select").addEventListener("change", (event) => {
    state.year = Number(event.target.value);
    state.week = pointsForYear().at(-1).week;
    renderAll();
  });
  $("#weekly-sex-select").addEventListener("change", (event) => {
    state.sex = event.target.value;
    renderAll();
  });
  $$("#weekly-age-control button").forEach((button) => {
    button.addEventListener("click", () => {
      state.age = button.dataset.weeklyAge;
      renderAll();
    });
  });
  $("#weekly-week-range").addEventListener("input", (event) => {
    state.week = Number(event.target.value);
    renderWeekSelection();
  });
  $("#weekly-reset").addEventListener("click", () => {
    state.year = dataset.weeklyDeaths.coverage[1];
    state.sex = "all";
    state.age = "total";
    state.week = pointsForYear(state.year).at(-1).week;
    renderAll();
  });
}

async function init() {
  try {
    const response = await fetch(DATA_URL);
    if (!response.ok) throw new Error(`Datendatei konnte nicht geladen werden (${response.status}).`);
    dataset = await response.json();
    $("#weekly-count-display").textContent = numberFormat.format(
      dataset.weeklyDeaths.points.length,
    );
    state.year = dataset.weeklyDeaths.coverage[1];
    state.week = pointsForYear().at(-1).week;
    bindEvents();
    renderAll();
  } catch (error) {
    console.error(error);
    document.querySelector("main").innerHTML = `
      <div class="error-state">
        <strong>Die Wochenanalyse konnte nicht geladen werden.</strong>
        <p>${escapeHtml(error.message)}</p>
      </div>`;
  }
}

init();
