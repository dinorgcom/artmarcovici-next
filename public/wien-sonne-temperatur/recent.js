(() => {
  "use strict";

  const errorMessage = document.querySelector(".recent-error");
  if (!window.d3 || !Array.isArray(window.VIENNA_RECENT_DAILY)) {
    if (errorMessage) errorMessage.hidden = false;
    return;
  }

  const d3 = window.d3;
  const svg = d3.select(".recent-chart svg");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const parseDate = d3.utcParse("%Y-%m-%d");
  const numberOne = new Intl.NumberFormat("de-AT", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
  const numberZero = new Intl.NumberFormat("de-AT", { maximumFractionDigits: 0 });
  const fullDate = new Intl.DateTimeFormat("de-AT", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  const dayMonth = new Intl.DateTimeFormat("de-AT", {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  });
  const monthYear = new Intl.DateTimeFormat("de-AT", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
  const shortDate = new Intl.DateTimeFormat("de-AT", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

  const elements = {
    peakTemperature: document.getElementById("recent-peak-temperature"),
    peakDate: document.getElementById("recent-peak-date"),
    sun2025: document.getElementById("recent-sun-2025"),
    latestDate: document.getElementById("recent-latest-date"),
    liveStatus: document.getElementById("recent-live-status"),
    freshness: document.getElementById("recent-freshness"),
    periodLabel: document.getElementById("recent-period-label"),
    period: document.getElementById("recent-period"),
    temperatureLabel: document.getElementById("recent-temperature-label"),
    temperature: document.getElementById("recent-temperature"),
    temperatureDetail: document.getElementById("recent-temperature-detail"),
    sunshineLabel: document.getElementById("recent-sunshine-label"),
    sunshine: document.getElementById("recent-sunshine"),
    sunshineDetail: document.getElementById("recent-sunshine-detail"),
  };

  let daily = normaliseRows(window.VIENNA_RECENT_DAILY);
  let mode = "week";
  let selectedDate = daily.at(-1).date;
  let resizeFrame = 0;
  let runtime = null;

  function normaliseRows(rows) {
    return rows
      .map((row) => ({
        date: parseDate(row[0]),
        dateKey: row[0],
        temperature: row[1],
        sunshine: row[2],
      }))
      .filter((row) => row.date && (row.temperature !== null || row.sunshine !== null));
  }

  function aggregateWeeks(rows) {
    const groups = d3.group(rows, (row) => +d3.utcMonday.floor(row.date));
    return Array.from(groups, ([timestamp, values]) => {
      const temperatureValues = values.filter((row) => row.temperature !== null);
      const sunshineValues = values.filter((row) => row.sunshine !== null);
      const hottest = temperatureValues.length
        ? d3.greatest(temperatureValues, (row) => row.temperature)
        : null;
      const start = new Date(Number(timestamp));
      const end = d3.utcDay.offset(start, 6);

      return {
        date: start,
        end,
        temperature: hottest ? hottest.temperature : null,
        temperatureDate: hottest ? hottest.date : null,
        sunshine: sunshineValues.length ? d3.sum(sunshineValues, (row) => row.sunshine) : null,
        temperatureCount: temperatureValues.length,
        sunshineCount: sunshineValues.length,
      };
    }).sort((a, b) => a.date - b.date);
  }

  function currentSeries() {
    return mode === "day" ? daily : aggregateWeeks(daily);
  }

  function formatWeek(start, end) {
    const sameMonth = start.getUTCFullYear() === end.getUTCFullYear()
      && start.getUTCMonth() === end.getUTCMonth();
    const sameYear = start.getUTCFullYear() === end.getUTCFullYear();

    if (sameMonth) {
      const month = new Intl.DateTimeFormat("de-AT", { month: "long", timeZone: "UTC" }).format(end);
      return `${start.getUTCDate()}. bis ${end.getUTCDate()}. ${month} ${end.getUTCFullYear()}`;
    }

    if (sameYear) {
      return `${dayMonth.format(start)} bis ${fullDate.format(end)}`;
    }

    return `${fullDate.format(start)} bis ${fullDate.format(end)}`;
  }

  function availableText(count) {
    if (count === 7) return "7 Tageswerte verfügbar";
    if (count === 1) return "1 von 7 Tageswerten verfügbar";
    return `${count} von 7 Tageswerten verfügbar`;
  }

  function updateSummary() {
    const temperatureRows = daily.filter((row) => row.temperature !== null);
    const sunshineRows = daily.filter((row) => row.sunshine !== null);
    const peak = d3.greatest(temperatureRows, (row) => row.temperature);
    const sun2025 = d3.sum(
      sunshineRows.filter((row) => row.date.getUTCFullYear() === 2025),
      (row) => row.sunshine
    );
    const lastTemperature = temperatureRows.at(-1);
    const lastSunshine = sunshineRows.at(-1);
    const latest = lastTemperature.date > lastSunshine.date ? lastTemperature : lastSunshine;

    elements.peakTemperature.textContent = `${numberOne.format(peak.temperature)} °C`;
    elements.peakDate.textContent = fullDate.format(peak.date);
    elements.sun2025.textContent = `${numberZero.format(sun2025)} h`;
    elements.latestDate.textContent = shortDate.format(latest.date);
    elements.freshness.textContent = `Temperatur bis ${fullDate.format(lastTemperature.date)}, Sonne bis ${fullDate.format(lastSunshine.date)}`;
  }

  function updateReader(item) {
    selectedDate = item.date;

    if (mode === "day") {
      elements.periodLabel.textContent = "Ausgewählter Tag";
      elements.period.textContent = fullDate.format(item.date);
      elements.temperatureLabel.textContent = "Tagesmaximum";
      elements.temperature.textContent = item.temperature === null
        ? "in Prüfung"
        : `${numberOne.format(item.temperature)} °C`;
      elements.temperatureDetail.textContent = item.temperature === null
        ? "noch nicht verfügbar"
        : "Maximaltemperatur in 2 m Höhe";
      elements.sunshineLabel.textContent = "Sonnenstunden";
      elements.sunshine.textContent = item.sunshine === null
        ? "in Prüfung"
        : `${numberOne.format(item.sunshine)} h`;
      elements.sunshineDetail.textContent = item.sunshine === null
        ? "noch nicht verfügbar"
        : "Tagessumme";
      return;
    }

    elements.periodLabel.textContent = "Ausgewählte Woche";
    elements.period.textContent = formatWeek(item.date, item.end);
    elements.temperatureLabel.textContent = "Wochenmaximum";
    elements.temperature.textContent = item.temperature === null
      ? "in Prüfung"
      : `${numberOne.format(item.temperature)} °C`;
    elements.temperatureDetail.textContent = item.temperatureDate
      ? `am ${dayMonth.format(item.temperatureDate)}`
      : availableText(item.temperatureCount);
    elements.sunshineLabel.textContent = "Sonne in der Woche";
    elements.sunshine.textContent = item.sunshine === null
      ? "in Prüfung"
      : `${numberOne.format(item.sunshine)} h`;
    elements.sunshineDetail.textContent = availableText(item.sunshineCount);
  }

  function updateSelection(item, index) {
    updateReader(item);
    if (!runtime) return;

    const xPosition = runtime.x(item.date);
    runtime.guide
      .attr("display", null)
      .attr("x1", xPosition)
      .attr("x2", xPosition);

    if (item.temperature !== null) {
      runtime.marker
        .attr("display", null)
        .attr("cx", xPosition)
        .attr("cy", runtime.yTemperature(item.temperature));
    } else {
      runtime.marker.attr("display", "none");
    }

    runtime.bars.classed("is-selected", (_, barIndex) => barIndex === index);
  }

  function render() {
    const values = currentSeries();
    const node = svg.node();
    const width = Math.max(300, Math.round(node.getBoundingClientRect().width));
    const compact = width < 620;
    const height = compact ? 340 : 410;
    const margin = {
      top: 28,
      right: compact ? 41 : 56,
      bottom: 43,
      left: compact ? 42 : 56,
    };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const temperatureValues = values.filter((item) => item.temperature !== null);
    const sunshineValues = values.filter((item) => item.sunshine !== null);
    const temperatureExtent = d3.extent(temperatureValues, (item) => item.temperature);
    const temperatureSpan = temperatureExtent[1] - temperatureExtent[0] || 1;
    const maximumSunshine = d3.max(sunshineValues, (item) => item.sunshine) || 1;
    const x = d3
      .scaleUtc()
      .domain([
        values[0].date,
        mode === "week" ? values.at(-1).end : values.at(-1).date,
      ])
      .range([margin.left, width - margin.right]);
    const yTemperature = d3
      .scaleLinear()
      .domain([
        temperatureExtent[0] - temperatureSpan * 0.08,
        temperatureExtent[1] + temperatureSpan * 0.1,
      ])
      .nice()
      .range([height - margin.bottom, margin.top]);
    const ySunshine = d3
      .scaleLinear()
      .domain([0, maximumSunshine * 1.14])
      .nice()
      .range([height - margin.bottom, margin.top]);
    const barWidth = Math.max(
      1,
      Math.min(mode === "day" ? 3 : 13, (innerWidth / values.length) * 0.68)
    );

    svg.selectAll("*").remove();
    svg.attr("viewBox", `0 0 ${width} ${height}`);

    svg
      .append("g")
      .attr("class", "grid")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yTemperature).ticks(6).tickSize(-innerWidth).tickFormat(""));

    const bars = svg
      .append("g")
      .selectAll("rect.sun-bar")
      .data(values)
      .join("rect")
      .attr("class", "sun-bar")
      .attr("x", (item) => x(item.date) - barWidth / 2)
      .attr("y", (item) => item.sunshine === null ? ySunshine(0) : ySunshine(item.sunshine))
      .attr("width", barWidth)
      .attr("height", (item) => item.sunshine === null ? 0 : ySunshine(0) - ySunshine(item.sunshine));

    svg
      .append("path")
      .datum(values)
      .attr("class", "temperature-path")
      .attr(
        "d",
        d3
          .line()
          .defined((item) => item.temperature !== null)
          .curve(mode === "week" ? d3.curveMonotoneX : d3.curveLinear)
          .x((item) => x(item.date))
          .y((item) => yTemperature(item.temperature))
      );

    const xAxis = svg
      .append("g")
      .attr("class", "axis")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(compact ? 5 : 9)
          .tickSize(0)
          .tickPadding(12)
          .tickFormat((date) => monthYear.format(date))
      );
    xAxis.selectAll("text").attr("text-anchor", compact ? "middle" : "middle");

    svg
      .append("g")
      .attr("class", "axis")
      .attr("transform", `translate(${margin.left},0)`)
      .call(
        d3
          .axisLeft(yTemperature)
          .ticks(6)
          .tickSize(0)
          .tickPadding(9)
          .tickFormat((value) => numberZero.format(value))
      );

    svg
      .append("g")
      .attr("class", "axis")
      .attr("transform", `translate(${width - margin.right},0)`)
      .call(
        d3
          .axisRight(ySunshine)
          .ticks(6)
          .tickSize(0)
          .tickPadding(9)
          .tickFormat((value) => numberZero.format(value))
      );

    svg
      .append("text")
      .attr("class", "axis-title")
      .attr("fill", "#f06d4f")
      .attr("x", margin.left)
      .attr("y", 12)
      .attr("text-anchor", "start")
      .text("°C");

    svg
      .append("text")
      .attr("class", "axis-title")
      .attr("fill", "#d4a853")
      .attr("x", width - margin.right)
      .attr("y", 12)
      .attr("text-anchor", "end")
      .text(mode === "day" ? "h pro Tag" : "h pro Woche");

    const guide = svg
      .append("line")
      .attr("class", "recent-guide")
      .attr("y1", margin.top)
      .attr("y2", height - margin.bottom)
      .attr("display", "none");
    const marker = svg
      .append("circle")
      .attr("class", "temperature-point")
      .attr("r", 4.5)
      .attr("display", "none");

    runtime = { x, yTemperature, guide, marker, bars };
    const bisector = d3.bisector((item) => item.date).center;
    svg
      .append("rect")
      .attr("x", margin.left)
      .attr("y", margin.top)
      .attr("width", innerWidth)
      .attr("height", innerHeight)
      .attr("fill", "transparent")
      .style("cursor", "crosshair")
      .on("pointermove pointerdown", function (event) {
        const [pointerX] = d3.pointer(event, node);
        const index = bisector(values, x.invert(pointerX));
        updateSelection(values[index], index);
      });

    const selectedIndex = bisector(values, selectedDate);
    updateSelection(values[selectedIndex], selectedIndex);

    if (!reduceMotion) {
      svg
        .style("opacity", 0.45)
        .style("transform", "translateY(4px)")
        .transition()
        .duration(220)
        .style("opacity", 1)
        .style("transform", "translateY(0)");
    }
  }

  function rowsFromApi(payload) {
    const feature = payload.features && payload.features[0];
    const parameters = feature && feature.properties && feature.properties.parameters;
    if (!parameters || !parameters.tlmax || !parameters.so_h) return [];

    return payload.timestamps.map((stamp, index) => [
      stamp.slice(0, 10),
      parameters.tlmax.data[index],
      parameters.so_h.data[index],
    ]);
  }

  function localIsoDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  async function refreshFromGeoSphere() {
    const query = new URLSearchParams({
      parameters: "tlmax,so_h",
      start: "2025-01-01",
      end: localIsoDate(),
      station_ids: "105",
      output_format: "geojson",
    });
    const url = `https://dataset.api.hub.geosphere.at/v1/station/historical/klima-v2-1d?${query}`;

    try {
      const response = await fetch(url, { cache: "no-store" });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const payload = await response.json();
      const rows = rowsFromApi(payload);
      const refreshed = normaliseRows(rows);
      if (!refreshed.length) throw new Error("Keine Messwerte");

      const previousLatest = daily.at(-1).date;
      daily = refreshed;
      if (daily.at(-1).date > previousLatest) selectedDate = daily.at(-1).date;
      elements.liveStatus.textContent = "aktuell aus GeoSphere geladen";
      updateSummary();
      render();
    } catch {
      const updated = parseDate(window.VIENNA_RECENT_UPDATED);
      elements.liveStatus.textContent = updated
        ? `Datenstand vom ${fullDate.format(updated)}`
        : "eingebetteter Datenstand";
    }
  }

  document.querySelectorAll("[data-recent-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      const nextMode = button.dataset.recentMode;
      if (nextMode === mode) return;
      mode = nextMode;
      document.querySelectorAll("[data-recent-mode]").forEach((candidate) => {
        candidate.setAttribute("aria-pressed", String(candidate.dataset.recentMode === mode));
      });
      render();
    });
  });

  updateSummary();
  render();
  refreshFromGeoSphere();

  const resizeObserver = new ResizeObserver(() => {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(render);
  });
  const chart = document.querySelector(".recent-chart");
  if (chart) resizeObserver.observe(chart);
})();
