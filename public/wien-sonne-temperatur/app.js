(() => {
  "use strict";

  const visual = document.querySelector(".visual");
  const errorMessage = document.querySelector(".viz-error");

  requestAnimationFrame(() => {
    document.body.classList.add("is-ready");
  });

  if (!window.d3 || !Array.isArray(window.VIENNA_CLIMATE_ROWS)) {
    if (errorMessage) errorMessage.hidden = false;
    return;
  }

  const d3 = window.d3;
  const data = window.VIENNA_CLIMATE_ROWS.map((row) => ({
    year: row[0],
    days: row[1],
    expected: row[2],
    complete: row[3],
    sunshine: row[4],
    temperature: row[5],
    maxDate: row[6],
  }));
  const complete = data.filter((item) => item.complete);
  const trend = complete.slice(9).map((item, index) => {
    const windowData = complete.slice(index, index + 10);
    return {
      year: item.year,
      sunshine: d3.mean(windowData, (value) => value.sunshine),
      temperature: d3.mean(windowData, (value) => value.temperature),
    };
  });

  const activeModes = new Set(["raw", "mean"]);
  const runtimes = new Map();
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const integerFormat = new Intl.NumberFormat("de-AT", { maximumFractionDigits: 0 });
  const decimalFormat = new Intl.NumberFormat("de-AT", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
  const dateFormat = new Intl.DateTimeFormat("de-AT", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  let selectedYear = 2025;
  let hasAnimated = false;
  let resizeFrame = 0;

  const reader = {
    year: document.getElementById("reader-year"),
    temperature: document.getElementById("reader-temperature"),
    date: document.getElementById("reader-date"),
    sunshine: document.getElementById("reader-sunshine"),
    status: document.getElementById("reader-status"),
  };

  const configs = {
    temperature: {
      field: "temperature",
      color: "#f06d4f",
      label: "Temperaturspitze",
      value: (number) => `${decimalFormat.format(number)} °C`,
    },
    sunshine: {
      field: "sunshine",
      color: "#d4a853",
      label: "Sonnenscheindauer",
      value: (number) => `${integerFormat.format(number)} h`,
    },
  };

  function getYear(year) {
    return data.find((item) => item.year === year) || data[data.length - 1];
  }

  function updateReader(item) {
    reader.year.textContent = item.year;

    if (!item.complete) {
      reader.temperature.textContent = "keine Angabe";
      reader.date.textContent = `${integerFormat.format(item.days)} von ${integerFormat.format(item.expected)} Tagen vorhanden`;
      reader.sunshine.textContent = "keine Angabe";
      reader.status.textContent = "unvollständiges Kalenderjahr";
      return;
    }

    reader.temperature.textContent = `${decimalFormat.format(item.temperature)} °C`;
    reader.date.textContent = dateFormat.format(new Date(`${item.maxDate}T12:00:00Z`));
    reader.sunshine.textContent = `${integerFormat.format(item.sunshine)} h`;
    reader.status.textContent = "vollständiges Kalenderjahr";
  }

  function updateSelection(item) {
    selectedYear = item.year;
    updateReader(item);

    runtimes.forEach((runtime) => {
      const xPosition = runtime.x(item.year);
      runtime.guide
        .attr("display", null)
        .attr("x1", xPosition)
        .attr("x2", xPosition);

      if (item.complete && activeModes.has("raw")) {
        runtime.marker
          .attr("display", null)
          .attr("cx", xPosition)
          .attr("cy", runtime.y(item[runtime.config.field]));
      } else {
        runtime.marker.attr("display", "none");
      }
    });
  }

  function paddedDomain(field) {
    const values = [
      ...complete.map((item) => item[field]),
      ...trend.map((item) => item[field]),
    ];
    const [minimum, maximum] = d3.extent(values);
    const span = maximum - minimum || 1;
    return [minimum - span * 0.09, maximum + span * 0.14];
  }

  function animatePath(path) {
    if (reduceMotion || hasAnimated) return;
    const node = path.node();
    if (!node) return;
    const length = node.getTotalLength();
    path
      .attr("stroke-dasharray", `${length} ${length}`)
      .attr("stroke-dashoffset", length)
      .transition()
      .duration(950)
      .ease(d3.easeCubicOut)
      .attr("stroke-dashoffset", 0)
      .on("end", () => {
        path.attr("stroke-dasharray", null).attr("stroke-dashoffset", null);
      });
  }

  function drawPanel(panel) {
    const series = panel.dataset.series;
    const config = configs[series];
    const svg = d3.select(panel.querySelector("svg"));
    const width = Math.max(300, Math.round(svg.node().getBoundingClientRect().width));
    const compact = width < 620;
    const height = compact ? 280 : 330;
    const margin = {
      top: 24,
      right: compact ? 8 : 18,
      bottom: 38,
      left: compact ? 40 : 52,
    };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const x = d3.scaleLinear().domain([1880, 2025]).range([margin.left, width - margin.right]);
    const y = d3
      .scaleLinear()
      .domain(paddedDomain(config.field))
      .nice()
      .range([height - margin.bottom, margin.top]);
    const clipId = `wien-${series}-clip`;
    const xTickValues = compact
      ? [1880, 1920, 1960, 2000, 2025]
      : [1880, 1900, 1920, 1940, 1960, 1980, 2000, 2025];

    svg.selectAll("*").remove();
    svg.attr("viewBox", `0 0 ${width} ${height}`);
    svg
      .append("defs")
      .append("clipPath")
      .attr("id", clipId)
      .append("rect")
      .attr("x", margin.left)
      .attr("y", margin.top)
      .attr("width", innerWidth)
      .attr("height", innerHeight);

    svg
      .append("g")
      .attr("class", "grid")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(5).tickSize(-innerWidth).tickFormat(""));

    const marks = svg.append("g").attr("clip-path", `url(#${clipId})`);

    if (activeModes.has("raw")) {
      marks
        .append("path")
        .datum(data)
        .attr("class", "raw-line")
        .attr("stroke", config.color)
        .attr(
          "d",
          d3
            .line()
            .defined((item) => item.complete)
            .x((item) => x(item.year))
            .y((item) => y(item[config.field]))
        );

      marks
        .selectAll("circle.raw-point")
        .data(complete)
        .join("circle")
        .attr("class", "raw-point")
        .attr("cx", (item) => x(item.year))
        .attr("cy", (item) => y(item[config.field]))
        .attr("r", compact ? 1.45 : 1.85)
        .attr("fill", config.color);
    }

    if (activeModes.has("mean")) {
      const meanPath = marks
        .append("path")
        .datum(trend)
        .attr("class", "mean-line")
        .attr("stroke", config.color)
        .attr(
          "d",
          d3
            .line()
            .curve(d3.curveMonotoneX)
            .x((item) => x(item.year))
            .y((item) => y(item[config.field]))
        );
      animatePath(meanPath);
    }

    const missingYears = data.filter((item) => !item.complete);
    svg
      .append("g")
      .selectAll("circle.missing-mark")
      .data(missingYears)
      .join("circle")
      .attr("class", "missing-mark")
      .attr("cx", (item) => x(item.year))
      .attr("cy", height - margin.bottom - 4)
      .attr("r", 3.5);

    svg
      .append("g")
      .attr("class", "axis")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickValues(xTickValues).tickFormat(d3.format("d")).tickSize(0).tickPadding(12));

    svg
      .append("g")
      .attr("class", "axis")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(5).tickSize(0).tickPadding(9).tickFormat((value) => integerFormat.format(value)));

    if (activeModes.has("raw")) {
      const peak = d3.greatest(complete, (item) => item[config.field]);
      const peakX = x(peak.year);
      const peakY = y(peak[config.field]);
      const placeRight = peakX < width - 155;
      const labelX = placeRight ? peakX + 10 : peakX - 10;
      const anchor = placeRight ? "start" : "end";

      svg
        .append("line")
        .attr("class", "peak-hairline")
        .attr("stroke", config.color)
        .attr("x1", peakX)
        .attr("x2", peakX)
        .attr("y1", peakY - 3)
        .attr("y2", Math.max(margin.top, peakY - 19));

      svg
        .append("text")
        .attr("class", "peak-label")
        .attr("fill", config.color)
        .attr("x", labelX)
        .attr("y", Math.max(margin.top + 8, peakY - 12))
        .attr("text-anchor", anchor)
        .text(`REKORD · ${config.value(peak[config.field])} · ${peak.year}`);
    }

    const guide = svg
      .append("line")
      .attr("class", "hover-guide")
      .attr("y1", margin.top)
      .attr("y2", height - margin.bottom)
      .attr("display", "none");

    const marker = svg
      .append("circle")
      .attr("class", "hover-marker")
      .attr("stroke", config.color)
      .attr("r", 4.5)
      .attr("display", "none");

    runtimes.set(series, { x, y, guide, marker, config });

    const bisector = d3.bisector((item) => item.year).center;
    svg
      .append("rect")
      .attr("x", margin.left)
      .attr("y", margin.top)
      .attr("width", innerWidth)
      .attr("height", innerHeight)
      .attr("fill", "transparent")
      .style("cursor", "crosshair")
      .on("pointermove pointerdown", function (event) {
        const [pointerX] = d3.pointer(event, svg.node());
        const item = data[bisector(data, x.invert(pointerX))];
        updateSelection(item);
      });
  }

  function renderAll() {
    runtimes.clear();
    document.querySelectorAll(".chart-panel").forEach(drawPanel);
    updateSelection(getYear(selectedYear));
    hasAnimated = true;
  }

  document.querySelectorAll("[data-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      const mode = button.dataset.mode;
      if (activeModes.has(mode) && activeModes.size === 1) return;

      if (activeModes.has(mode)) {
        activeModes.delete(mode);
      } else {
        activeModes.add(mode);
      }

      button.setAttribute("aria-pressed", String(activeModes.has(mode)));
      renderAll();
    });
  });

  renderAll();

  const resizeObserver = new ResizeObserver(() => {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(renderAll);
  });
  document.querySelectorAll(".chart-panel").forEach((panel) => resizeObserver.observe(panel));
})();
