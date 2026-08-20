(() => {
  "use strict";

  const visual = document.querySelector(".visual");
  const errorMessage = document.querySelector(".viz-error");

  requestAnimationFrame(() => {
    document.body.classList.add("is-ready");
  });

  if (
    !window.d3 ||
    !Array.isArray(window.VIENNA_CLIMATE_ROWS) ||
    !Array.isArray(window.VIENNA_ANNUAL_TEMPERATURE_SUMS) ||
    !Array.isArray(window.VIENNA_CO2_ROWS)
  ) {
    if (errorMessage) errorMessage.hidden = false;
    return;
  }

  const d3 = window.d3;
  const temperatureSumByYear = new Map(window.VIENNA_ANNUAL_TEMPERATURE_SUMS);
  const co2ByYear = new Map(
    window.VIENNA_CO2_ROWS.map((row) => [row[0], { ppm: row[1], uncertainty: row[2] }])
  );
  const data = window.VIENNA_CLIMATE_ROWS.map((row) => {
    const temperatureSum = temperatureSumByYear.get(row[0]);
    const co2 = co2ByYear.get(row[0]);
    return {
      year: row[0],
      days: row[1],
      expected: row[2],
      complete: row[3],
      sunshine: row[4],
      temperatureSum,
      temperatureSunshineRatio: row[3] ? temperatureSum / row[4] : null,
      temperature: row[5],
      maxDate: row[6],
      co2: co2 ? co2.ppm : null,
      co2Uncertainty: co2 ? co2.uncertainty : null,
    };
  });
  const complete = data.filter((item) => item.complete);
  const co2Data = complete.filter((item) => item.co2 !== null);
  const co2Stats = (() => {
    const meanCo2 = d3.mean(co2Data, (item) => item.co2);
    const meanRatio = d3.mean(co2Data, (item) => item.temperatureSunshineRatio);
    let covariance = 0;
    let co2Variance = 0;
    let ratioVariance = 0;

    co2Data.forEach((item) => {
      const co2Delta = item.co2 - meanCo2;
      const ratioDelta = item.temperatureSunshineRatio - meanRatio;
      covariance += co2Delta * ratioDelta;
      co2Variance += co2Delta * co2Delta;
      ratioVariance += ratioDelta * ratioDelta;
    });

    const slope = covariance / co2Variance;
    return {
      correlation: covariance / Math.sqrt(co2Variance * ratioVariance),
      slope,
      intercept: meanRatio - slope * meanCo2,
    };
  })();
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
  let co2TimelineRuntime = null;
  let correlationRuntime = null;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const integerFormat = new Intl.NumberFormat("de-AT", { maximumFractionDigits: 0 });
  const decimalFormat = new Intl.NumberFormat("de-AT", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
  const ratioFormat = new Intl.NumberFormat("de-AT", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const ppmFormat = new Intl.NumberFormat("de-AT", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
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
    temperatureLabel: document.getElementById("reader-temperature-label"),
    temperature: document.getElementById("reader-temperature"),
    date: document.getElementById("reader-date"),
    sunshineLabel: document.getElementById("reader-sunshine-label"),
    sunshine: document.getElementById("reader-sunshine"),
    status: document.getElementById("reader-status"),
  };
  const co2Reader = {
    year: document.getElementById("co2-reader-year"),
    value: document.getElementById("co2-reader-value"),
    ratio: document.getElementById("co2-reader-ratio"),
  };
  const correlationValue = document.getElementById("co2-correlation-value");
  if (correlationValue) {
    correlationValue.textContent = `r = ${ratioFormat.format(co2Stats.correlation)}`;
  }

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

  function updateReader(item, source) {
    const combined = source === "combined";
    reader.year.textContent = item.year;
    reader.temperatureLabel.textContent = combined ? "Summe Tagesmaxima" : "Höchster Tageswert";
    reader.sunshineLabel.textContent = "Sonnenscheindauer";

    if (!item.complete) {
      reader.temperature.textContent = "keine Angabe";
      reader.date.textContent = `${integerFormat.format(item.days)} von ${integerFormat.format(item.expected)} Tagen vorhanden`;
      reader.sunshine.textContent = "keine Angabe";
      reader.status.textContent = "unvollständiges Kalenderjahr";
      return;
    }

    if (combined) {
      reader.temperature.textContent = `${integerFormat.format(item.temperatureSum)} °C-Tage`;
      reader.date.textContent = `Quotient ${ratioFormat.format(item.temperatureSunshineRatio)} °C-Tage/h`;
    } else {
      reader.temperature.textContent = `${decimalFormat.format(item.temperature)} °C`;
      reader.date.textContent = dateFormat.format(new Date(`${item.maxDate}T12:00:00Z`));
    }
    reader.sunshine.textContent = `${integerFormat.format(item.sunshine)} h`;
    reader.status.textContent = "vollständiges Kalenderjahr";
  }

  function updateCo2Selection(item) {
    if (co2Reader.year) co2Reader.year.textContent = item.year;
    if (co2Reader.value) {
      co2Reader.value.textContent = item.co2 === null ? "keine direkte Messung" : `${ppmFormat.format(item.co2)} ppm`;
    }
    if (co2Reader.ratio) {
      co2Reader.ratio.textContent = item.complete
        ? ratioFormat.format(item.temperatureSunshineRatio)
        : "keine Angabe";
    }

    if (co2TimelineRuntime) {
      if (item.co2 === null) {
        co2TimelineRuntime.guide.attr("display", "none");
        co2TimelineRuntime.marker.attr("display", "none");
      } else {
        const xPosition = co2TimelineRuntime.x(item.year);
        co2TimelineRuntime.guide
          .attr("display", null)
          .attr("x1", xPosition)
          .attr("x2", xPosition);
        co2TimelineRuntime.marker
          .attr("display", null)
          .attr("cx", xPosition)
          .attr("cy", co2TimelineRuntime.y(item.co2));
      }
    }

    if (correlationRuntime) {
      correlationRuntime.points.classed("is-selected", (point) => point.year === item.year);
      if (item.co2 === null || !item.complete) {
        correlationRuntime.marker.attr("display", "none");
      } else {
        correlationRuntime.marker
          .attr("display", null)
          .attr("cx", correlationRuntime.x(item.co2))
          .attr("cy", correlationRuntime.y(item.temperatureSunshineRatio));
      }
    }
  }

  function updateSelection(item, source = "combined") {
    selectedYear = item.year;
    updateReader(item, source);

    runtimes.forEach((runtime) => {
      const xPosition = runtime.x(item.year);
      runtime.guide
        .attr("display", null)
        .attr("x1", xPosition)
        .attr("x2", xPosition);

      if (item.complete && (activeModes.has("raw") || runtime.alwaysRaw)) {
        runtime.marker
          .attr("display", null)
          .attr("cx", xPosition)
          .attr("cy", runtime.y(item[runtime.config.field]));
      } else {
        runtime.marker.attr("display", "none");
      }

      if (runtime.bars) {
        runtime.bars.classed("is-selected", (bar) => bar.year === item.year);
      }

      if (runtime.ratioMarker) {
        if (item.complete) {
          runtime.ratioMarker
            .attr("display", null)
            .attr("cx", xPosition)
            .attr("cy", runtime.yRatio(item.temperatureSunshineRatio));
        } else {
          runtime.ratioMarker.attr("display", "none");
        }
      }
    });
    updateCo2Selection(item);
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
        updateSelection(item, series);
      });
  }

  function drawCombinedPanel(panel) {
    const svg = d3.select(panel.querySelector("svg"));
    const node = svg.node();
    const width = Math.max(300, Math.round(node.getBoundingClientRect().width));
    const compact = width < 620;
    const height = compact ? 390 : 460;
    const margin = {
      top: 28,
      right: compact ? 43 : 58,
      bottom: 42,
      left: compact ? 48 : 60,
    };
    const innerWidth = width - margin.left - margin.right;
    const ratioHeight = compact ? 62 : 72;
    const ratioGap = compact ? 28 : 32;
    const ratioBottom = height - margin.bottom;
    const ratioTop = ratioBottom - ratioHeight;
    const mainBottom = ratioTop - ratioGap;
    const mainHeight = mainBottom - margin.top;
    const hoverHeight = ratioBottom - margin.top;
    const temperatureExtent = d3.extent(complete, (item) => item.temperatureSum);
    const temperatureSpan = temperatureExtent[1] - temperatureExtent[0] || 1;
    const ratioExtent = d3.extent(complete, (item) => item.temperatureSunshineRatio);
    const ratioSpan = ratioExtent[1] - ratioExtent[0] || 1;
    const maximumSunshine = d3.max(complete, (item) => item.sunshine) || 1;
    const x = d3
      .scaleLinear()
      .domain(d3.extent(data, (item) => item.year))
      .range([margin.left, width - margin.right]);
    const yTemperature = d3
      .scaleLinear()
      .domain([
        temperatureExtent[0] - temperatureSpan * 0.08,
        temperatureExtent[1] + temperatureSpan * 0.1,
      ])
      .nice()
      .range([mainBottom, margin.top]);
    const ySunshine = d3
      .scaleLinear()
      .domain([0, maximumSunshine * 1.14])
      .nice()
      .range([mainBottom, margin.top]);
    const yRatio = d3
      .scaleLinear()
      .domain([
        ratioExtent[0] - ratioSpan * 0.08,
        ratioExtent[1] + ratioSpan * 0.1,
      ])
      .nice()
      .range([ratioBottom, ratioTop]);
    const barWidth = Math.max(1, Math.min(7, (innerWidth / data.length) * 0.68));
    const xTickValues = compact
      ? [1880, 1920, 1960, 2000, 2025]
      : [1880, 1900, 1920, 1940, 1960, 1980, 2000, 2025];
    const mainClipId = "wien-annual-combined-main-clip";
    const ratioClipId = "wien-annual-combined-ratio-clip";

    svg.selectAll("*").remove();
    svg.attr("viewBox", `0 0 ${width} ${height}`);
    const defs = svg.append("defs");
    defs
      .append("clipPath")
      .attr("id", mainClipId)
      .append("rect")
      .attr("x", margin.left)
      .attr("y", margin.top)
      .attr("width", innerWidth)
      .attr("height", mainHeight);
    defs
      .append("clipPath")
      .attr("id", ratioClipId)
      .append("rect")
      .attr("x", margin.left)
      .attr("y", ratioTop)
      .attr("width", innerWidth)
      .attr("height", ratioHeight);

    svg
      .append("g")
      .attr("class", "grid")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yTemperature).ticks(5).tickSize(-innerWidth).tickFormat(""));

    svg
      .append("g")
      .attr("class", "grid ratio-grid")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yRatio).ticks(compact ? 2 : 3).tickSize(-innerWidth).tickFormat(""));

    const mainMarks = svg.append("g").attr("clip-path", `url(#${mainClipId})`);
    const bars = mainMarks
      .selectAll("rect.annual-sun-bar")
      .data(complete)
      .join("rect")
      .attr("class", "annual-sun-bar")
      .attr("x", (item) => x(item.year) - barWidth / 2)
      .attr("y", (item) => ySunshine(item.sunshine))
      .attr("width", barWidth)
      .attr("height", (item) => ySunshine(0) - ySunshine(item.sunshine));

    const temperaturePath = mainMarks
      .append("path")
      .datum(data)
      .attr("class", "annual-temperature-path")
      .attr(
        "d",
        d3
          .line()
          .defined((item) => item.complete)
          .x((item) => x(item.year))
          .y((item) => yTemperature(item.temperatureSum))
      );

    const ratioPath = svg
      .append("g")
      .attr("clip-path", `url(#${ratioClipId})`)
      .append("path")
      .datum(data)
      .attr("class", "annual-ratio-path")
      .attr(
        "d",
        d3
          .line()
          .defined((item) => item.complete)
          .x((item) => x(item.year))
          .y((item) => yRatio(item.temperatureSunshineRatio))
      );

    animatePath(temperaturePath);
    animatePath(ratioPath);

    svg
      .append("g")
      .selectAll("circle.annual-missing-mark")
      .data(data.filter((item) => !item.complete))
      .join("circle")
      .attr("class", "annual-missing-mark")
      .attr("cx", (item) => x(item.year))
      .attr("cy", ratioBottom - 3)
      .attr("r", 3.5);

    svg
      .append("g")
      .attr("class", "axis")
      .attr("transform", `translate(0,${ratioBottom})`)
      .call(d3.axisBottom(x).tickValues(xTickValues).tickFormat(d3.format("d")).tickSize(0).tickPadding(12));

    svg
      .append("g")
      .attr("class", "axis")
      .attr("transform", `translate(${margin.left},0)`)
      .call(
        d3
          .axisLeft(yTemperature)
          .ticks(5)
          .tickSize(0)
          .tickPadding(9)
          .tickFormat((value) => integerFormat.format(value))
      );

    svg
      .append("g")
      .attr("class", "axis")
      .attr("transform", `translate(${width - margin.right},0)`)
      .call(
        d3
          .axisRight(ySunshine)
          .ticks(5)
          .tickSize(0)
          .tickPadding(9)
          .tickFormat((value) => integerFormat.format(value))
      );

    svg
      .append("g")
      .attr("class", "axis ratio-axis")
      .attr("transform", `translate(${margin.left},0)`)
      .call(
        d3
          .axisLeft(yRatio)
          .ticks(compact ? 2 : 3)
          .tickSize(0)
          .tickPadding(9)
          .tickFormat((value) => ratioFormat.format(value))
      );

    svg
      .append("text")
      .attr("class", "axis-title")
      .attr("fill", configs.temperature.color)
      .attr("x", margin.left)
      .attr("y", 12)
      .attr("text-anchor", "start")
      .text("Σ Tagesmaxima / °C-Tage");

    svg
      .append("text")
      .attr("class", "axis-title")
      .attr("fill", configs.sunshine.color)
      .attr("x", width - margin.right)
      .attr("y", 12)
      .attr("text-anchor", "end")
      .text("Σ Sonne / h");

    svg
      .append("text")
      .attr("class", "axis-title ratio-title")
      .attr("fill", "#bdc5cf")
      .attr("x", margin.left)
      .attr("y", ratioTop - 8)
      .attr("text-anchor", "start")
      .text("Quotient / °C-Tage je h");

    const guide = svg
      .append("line")
      .attr("class", "annual-combined-guide")
      .attr("y1", margin.top)
      .attr("y2", ratioBottom)
      .attr("display", "none");
    const marker = svg
      .append("circle")
      .attr("class", "annual-temperature-point")
      .attr("r", 4.5)
      .attr("display", "none");
    const ratioMarker = svg
      .append("circle")
      .attr("class", "annual-ratio-point")
      .attr("r", 4)
      .attr("display", "none");

    runtimes.set("combined", {
      x,
      y: yTemperature,
      guide,
      marker,
      config: { field: "temperatureSum" },
      bars,
      ratioMarker,
      yRatio,
      alwaysRaw: true,
    });

    const bisector = d3.bisector((item) => item.year).center;
    svg
      .append("rect")
      .attr("x", margin.left)
      .attr("y", margin.top)
      .attr("width", innerWidth)
      .attr("height", hoverHeight)
      .attr("fill", "transparent")
      .style("cursor", "crosshair")
      .on("pointermove pointerdown", function (event) {
        const [pointerX] = d3.pointer(event, node);
        const item = data[bisector(data, x.invert(pointerX))];
        updateSelection(item, "combined");
      });
  }

  function drawCo2Timeline(panel) {
    const svg = d3.select(panel.querySelector("svg"));
    const node = svg.node();
    const width = Math.max(300, Math.round(node.getBoundingClientRect().width));
    const compact = width < 620;
    const height = compact ? 260 : 300;
    const margin = {
      top: 26,
      right: compact ? 14 : 24,
      bottom: 42,
      left: compact ? 46 : 58,
    };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const co2Extent = d3.extent(co2Data, (item) => item.co2);
    const co2Span = co2Extent[1] - co2Extent[0] || 1;
    const x = d3
      .scaleLinear()
      .domain(d3.extent(co2Data, (item) => item.year))
      .range([margin.left, width - margin.right]);
    const y = d3
      .scaleLinear()
      .domain([co2Extent[0] - co2Span * 0.06, co2Extent[1] + co2Span * 0.07])
      .nice()
      .range([height - margin.bottom, margin.top]);
    const xTickValues = compact
      ? [1959, 1980, 2000, 2025]
      : [1959, 1970, 1980, 1990, 2000, 2010, 2025];

    svg.selectAll("*").remove();
    svg.attr("viewBox", `0 0 ${width} ${height}`);

    svg
      .append("g")
      .attr("class", "grid")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(5).tickSize(-innerWidth).tickFormat(""));

    svg
      .append("path")
      .datum(co2Data)
      .attr("class", "co2-area")
      .attr(
        "d",
        d3
          .area()
          .x((item) => x(item.year))
          .y0(height - margin.bottom)
          .y1((item) => y(item.co2))
      );

    const path = svg
      .append("path")
      .datum(co2Data)
      .attr("class", "co2-path")
      .attr(
        "d",
        d3
          .line()
          .x((item) => x(item.year))
          .y((item) => y(item.co2))
      );
    animatePath(path);

    svg
      .append("g")
      .attr("class", "axis")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x).tickValues(xTickValues).tickFormat(d3.format("d")).tickSize(0).tickPadding(12));

    svg
      .append("g")
      .attr("class", "axis")
      .attr("transform", `translate(${margin.left},0)`)
      .call(
        d3
          .axisLeft(y)
          .ticks(5)
          .tickSize(0)
          .tickPadding(9)
          .tickFormat((value) => integerFormat.format(value))
      );

    svg
      .append("text")
      .attr("class", "axis-title")
      .attr("fill", "#78a98f")
      .attr("x", margin.left)
      .attr("y", 11)
      .attr("text-anchor", "start")
      .text("CO₂ / ppm");

    const guide = svg
      .append("line")
      .attr("class", "co2-guide")
      .attr("y1", margin.top)
      .attr("y2", height - margin.bottom)
      .attr("display", "none");
    const marker = svg
      .append("circle")
      .attr("class", "co2-marker")
      .attr("r", 4.5)
      .attr("display", "none");

    co2TimelineRuntime = { x, y, guide, marker };
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
        const [pointerX] = d3.pointer(event, node);
        const item = co2Data[bisector(co2Data, x.invert(pointerX))];
        updateSelection(item, "combined");
      });
  }

  function drawCo2Correlation(panel) {
    const svg = d3.select(panel.querySelector("svg"));
    const node = svg.node();
    const width = Math.max(300, Math.round(node.getBoundingClientRect().width));
    const compact = width < 620;
    const height = compact ? 330 : 380;
    const margin = {
      top: 32,
      right: compact ? 14 : 26,
      bottom: 52,
      left: compact ? 50 : 62,
    };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const co2Extent = d3.extent(co2Data, (item) => item.co2);
    const ratioExtent = d3.extent(co2Data, (item) => item.temperatureSunshineRatio);
    const co2Span = co2Extent[1] - co2Extent[0] || 1;
    const ratioSpan = ratioExtent[1] - ratioExtent[0] || 1;
    const x = d3
      .scaleLinear()
      .domain([co2Extent[0] - co2Span * 0.05, co2Extent[1] + co2Span * 0.05])
      .nice()
      .range([margin.left, width - margin.right]);
    const y = d3
      .scaleLinear()
      .domain([ratioExtent[0] - ratioSpan * 0.09, ratioExtent[1] + ratioSpan * 0.1])
      .nice()
      .range([height - margin.bottom, margin.top]);

    svg.selectAll("*").remove();
    svg.attr("viewBox", `0 0 ${width} ${height}`);

    svg
      .append("g")
      .attr("class", "grid")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y).ticks(5).tickSize(-innerWidth).tickFormat(""));

    const points = svg
      .append("g")
      .selectAll("circle.co2-scatter-point")
      .data(co2Data)
      .join("circle")
      .attr("class", "co2-scatter-point")
      .attr("cx", (item) => x(item.co2))
      .attr("cy", (item) => y(item.temperatureSunshineRatio))
      .attr("r", compact ? 2.5 : 3);

    const regressionStart = co2Extent[0];
    const regressionEnd = co2Extent[1];
    svg
      .append("line")
      .attr("class", "co2-regression-line")
      .attr("x1", x(regressionStart))
      .attr("y1", y(co2Stats.intercept + co2Stats.slope * regressionStart))
      .attr("x2", x(regressionEnd))
      .attr("y2", y(co2Stats.intercept + co2Stats.slope * regressionEnd));

    svg
      .append("g")
      .attr("class", "axis")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(
        d3
          .axisBottom(x)
          .ticks(compact ? 4 : 6)
          .tickSize(0)
          .tickPadding(12)
          .tickFormat((value) => integerFormat.format(value))
      );

    svg
      .append("g")
      .attr("class", "axis")
      .attr("transform", `translate(${margin.left},0)`)
      .call(
        d3
          .axisLeft(y)
          .ticks(5)
          .tickSize(0)
          .tickPadding(9)
          .tickFormat((value) => ratioFormat.format(value))
      );

    svg
      .append("text")
      .attr("class", "axis-title")
      .attr("fill", "#bdc5cf")
      .attr("x", margin.left)
      .attr("y", 12)
      .attr("text-anchor", "start")
      .text("Quotient / °C-Tage je h");

    svg
      .append("text")
      .attr("class", "axis-title")
      .attr("fill", "#78a98f")
      .attr("x", width - margin.right)
      .attr("y", height - 7)
      .attr("text-anchor", "end")
      .text("CO₂ / ppm");

    svg
      .append("text")
      .attr("class", "co2-correlation-stat")
      .attr("fill", "#f06d4f")
      .attr("x", width - margin.right)
      .attr("y", 12)
      .attr("text-anchor", "end")
      .text(`r = ${ratioFormat.format(co2Stats.correlation)}`);

    const marker = svg
      .append("circle")
      .attr("class", "co2-correlation-marker")
      .attr("r", 5)
      .attr("display", "none");

    correlationRuntime = { x, y, points, marker };
    const delaunay = d3.Delaunay.from(
      co2Data,
      (item) => x(item.co2),
      (item) => y(item.temperatureSunshineRatio)
    );
    svg
      .append("rect")
      .attr("x", margin.left)
      .attr("y", margin.top)
      .attr("width", innerWidth)
      .attr("height", innerHeight)
      .attr("fill", "transparent")
      .style("cursor", "crosshair")
      .on("pointermove pointerdown", function (event) {
        const [pointerX, pointerY] = d3.pointer(event, node);
        const item = co2Data[delaunay.find(pointerX, pointerY)];
        updateSelection(item, "combined");
      });
  }

  function renderAll() {
    runtimes.clear();
    co2TimelineRuntime = null;
    correlationRuntime = null;
    const combinedPanel = document.querySelector(".annual-combined-panel");
    if (combinedPanel) drawCombinedPanel(combinedPanel);
    const co2TimelinePanel = document.querySelector(".co2-timeline-panel");
    if (co2TimelinePanel) drawCo2Timeline(co2TimelinePanel);
    const co2CorrelationPanel = document.querySelector(".co2-correlation-panel");
    if (co2CorrelationPanel) drawCo2Correlation(co2CorrelationPanel);
    document.querySelectorAll(".chart-panel").forEach(drawPanel);
    updateSelection(getYear(selectedYear), "combined");
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
  document
    .querySelectorAll(".annual-combined-panel, .co2-panel, .chart-panel")
    .forEach((panel) => resizeObserver.observe(panel));
})();
