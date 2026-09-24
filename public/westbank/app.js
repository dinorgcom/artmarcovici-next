(() => {
  "use strict";

  const population = [
    [2016, 2803411],
    [2017, 2856691],
    [2018, 2921170],
    [2019, 2986714],
    [2020, 3053183],
    [2021, 3120448],
    [2022, 3188387],
    [2023, 3256906],
    [2024, 3325905],
    [2025, 3395260],
    [2026, 3464858],
  ];

  const caseRows = [...document.querySelectorAll("#cases tbody tr")];
  const searchInput = document.querySelector("#q");
  const kindSelect = document.querySelector("#kind");
  const resultCount = document.querySelector("#result-count");

  const categoryLabels = {
    Siedlerangriff: "Siedlerangriff",
    Konfrontation: "Konfrontation",
    Angreifer: "Aktiver Angreifer",
    unklar: "Unklar",
  };

  const categoryOrder = ["Siedlerangriff", "Konfrontation", "Angreifer", "unklar"];

  function renderCategoryChart() {
    const chart = document.querySelector("#category-chart");
    const counts = Object.fromEntries(categoryOrder.map((kind) => [kind, 0]));

    caseRows.forEach((row) => {
      const kind = row.dataset.kind;
      if (kind in counts) counts[kind] += 1;
    });

    const max = Math.max(...Object.values(counts));
    chart.innerHTML = categoryOrder
      .map(
        (kind) => `
          <div class="category-row">
            <span>${categoryLabels[kind]}</span>
            <span class="category-track" aria-hidden="true">
              <i class="category-fill" style="width:${(counts[kind] / max) * 100}%"></i>
            </span>
            <strong>${counts[kind]}</strong>
          </div>`,
      )
      .join("");

    chart.setAttribute(
      "aria-label",
      categoryOrder.map((kind) => `${categoryLabels[kind]}: ${counts[kind]}`).join(", "),
    );
  }

  function filterCases() {
    const query = searchInput.value.trim().toLocaleLowerCase("de");
    const kind = kindSelect.value;
    let visible = 0;

    caseRows.forEach((row) => {
      const matchesQuery = !query || row.textContent.toLocaleLowerCase("de").includes(query);
      const matchesKind = !kind || row.dataset.kind === kind;
      const show = matchesQuery && matchesKind;
      row.hidden = !show;
      if (show) visible += 1;
    });

    resultCount.textContent = `${visible} von ${caseRows.length} Fällen`;
  }

  function renderPopulationTable() {
    const tableBody = document.querySelector("#population-table");
    tableBody.innerHTML = population
      .map(
        ([year, value]) =>
          `<tr><td>${year}</td><td>${value.toLocaleString("de-DE")}</td></tr>`,
      )
      .join("");
  }

  function renderPopulationChart() {
    const chart = document.querySelector("#population-chart");
    const width = 900;
    const height = 340;
    const plot = { left: 74, right: 25, top: 42, bottom: 52 };
    const floor = 2700000;
    const ceiling = 3500000;
    const innerWidth = width - plot.left - plot.right;
    const innerHeight = height - plot.top - plot.bottom;
    const x = (index) => plot.left + (index / (population.length - 1)) * innerWidth;
    const y = (value) => plot.top + ((ceiling - value) / (ceiling - floor)) * innerHeight;
    const baseline = height - plot.bottom;
    const points = population.map(([, value], index) => [x(index), y(value)]);
    const linePath = points
      .map(([pointX, pointY], index) => `${index === 0 ? "M" : "L"}${pointX.toFixed(1)},${pointY.toFixed(1)}`)
      .join(" ");
    const areaPath = `${linePath} L${points.at(-1)[0].toFixed(1)},${baseline} L${points[0][0].toFixed(1)},${baseline} Z`;
    const ticks = [2800000, 3000000, 3200000, 3400000];

    const grid = ticks
      .map((tick) => {
        const tickY = y(tick);
        return `
          <line class="chart-grid-line" x1="${plot.left}" y1="${tickY}" x2="${width - plot.right}" y2="${tickY}" />
          <text class="chart-axis-label" x="${plot.left - 12}" y="${tickY + 4}" text-anchor="end">${(tick / 1000000).toLocaleString("de-DE", { maximumFractionDigits: 1 })} Mio.</text>`;
      })
      .join("");

    const years = population
      .map(([year], index) => {
        if (index % 2 !== 0 && index !== population.length - 1) return "";
        return `<text class="chart-year-label" x="${x(index)}" y="${height - 17}" text-anchor="middle">${year}</text>`;
      })
      .join("");

    const markers = population
      .map(([year, value], index) => {
        const pointX = x(index);
        const pointY = y(value);
        const labelClass = index === 0 ? " chart-label-first" : index === population.length - 1 ? " chart-label-last" : "";
        const label = index === 0 || index === population.length - 1 || index % 2 === 0
          ? `<text class="chart-point-label${labelClass}" x="${pointX}" y="${pointY - 15}" text-anchor="middle">${(value / 1000000).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</text>`
          : "";
        return `${label}<circle class="chart-point" cx="${pointX}" cy="${pointY}" r="5"><title>${year}: ${value.toLocaleString("de-DE")}</title></circle>`;
      })
      .join("");

    chart.innerHTML = `
      <svg viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="population-chart-title population-chart-desc">
        <title id="population-chart-title">Palästinensische Bevölkerung im Westjordanland 2016 bis 2026</title>
        <desc id="population-chart-desc">Die PCBS-Reihe steigt von 2,80 Millionen im Jahr 2016 auf 3,46 Millionen in der Projektion für 2026.</desc>
        ${grid}
        <path class="chart-area" d="${areaPath}" />
        <path class="chart-line" d="${linePath}" />
        ${markers}
        ${years}
      </svg>`;
  }

  renderCategoryChart();
  renderPopulationTable();
  renderPopulationChart();
  filterCases();

  searchInput.addEventListener("input", filterCases);
  kindSelect.addEventListener("change", filterCases);
})();
