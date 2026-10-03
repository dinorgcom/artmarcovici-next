(() => {
  "use strict";

  // ---------------------------------------------------------------- data
  // DEPP NI 26.42 (Sept. 2026), "Figure 7": Ausgaben pro Kopf, konstante Euro (Preise 2025)
  const YEARS = Array.from({ length: 46 }, (_, i) => 1980 + i);
  const REAL = {
    all: [5590,5810,6120,6170,6290,6380,6320,6390,6550,6740,6990,7280,7640,7890,8060,8260,8400,8600,8840,9150,9330,9400,9460,9560,9590,9560,9660,9720,9830,10110,10150,10070,10020,10150,10200,10130,10130,10320,10350,10450,10150,10560,10750,10850,11050,11140],
    p1: [3850,4050,4300,4350,4510,4580,4450,4510,4630,4750,4820,5000,5200,5400,5580,5750,5860,6030,6250,6520,6640,6670,6620,6840,6900,6830,6870,6850,6770,7000,7050,7080,7190,7430,7480,7490,7530,7880,8000,8170,7950,8310,8580,8760,9200,9440],
    p2: [6980,7190,7520,7510,7510,7490,7460,7510,7720,8020,8400,8720,9210,9480,9650,9900,10050,10270,10500,10840,11060,11180,11300,11330,11340,11330,11540,11520,11700,12000,12050,11770,11610,11590,11640,11580,11590,11700,11630,11640,11210,11600,11660,11670,11780,11780],
    ter: [9950,10020,10260,10200,10280,10670,10640,10690,10740,10590,10980,11160,11260,11290,11180,11350,11520,11810,12130,12530,12710,12760,13000,12910,12920,12960,13090,13640,14160,14570,14470,14510,14200,14320,14320,13960,13820,13660,13600,13610,13230,13490,13610,13620,13450,13350],
  };
  // Laufende Euro: bis 2023 abgeleitet (DEPP-Reihe Preise 2024 × BIP-Deflator INSEE), 2024/2025 DEPP
  const NOMINAL = {
    all: [1810,2090,2470,2740,2990,3190,3330,3440,3650,3870,4130,4400,4710,4940,5090,5280,5440,5620,5830,6050,6250,6420,6600,6790,6920,7030,7250,7470,7720,7950,8070,8070,8120,8290,8370,8410,8460,8660,8790,8980,8980,9460,9920,10510,10920,11140],
    p1: [1250,1460,1740,1930,2140,2290,2340,2430,2580,2720,2840,3020,3200,3380,3530,3670,3790,3940,4130,4300,4450,4550,4620,4850,4980,5020,5150,5260,5320,5500,5600,5670,5830,6070,6140,6220,6280,6610,6790,7020,7040,7440,7920,8480,9080,9440],
    p2: [2260,2590,3040,3330,3560,3750,3930,4050,4300,4610,4960,5270,5680,5940,6100,6330,6510,6710,6930,7160,7410,7640,7870,8040,8170,8330,8650,8840,9190,9440,9570,9440,9410,9460,9560,9610,9670,9820,9880,10000,9920,10390,10760,11310,11660,11780],
    ter: [3220,3610,4150,4520,4880,5340,5610,5770,5980,6080,6480,6740,6940,7070,7070,7250,7460,7720,7990,8280,8520,8710,9060,9160,9320,9530,9820,10470,11130,11460,11510,11630,11510,11690,11760,11600,11530,11470,11550,11690,11700,12080,12560,13200,13300,13350],
  };
  // DEPP NI 26.42, "Figure 1": DIE in % des BIP
  const GDP = [6.6,6.7,6.9,6.9,6.9,7.0,6.8,6.7,6.6,6.6,6.7,7.0,7.4,7.7,7.7,7.8,7.8,7.7,7.6,7.5,7.3,7.2,7.2,7.2,7.0,6.9,6.8,6.7,6.7,7.1,7.0,6.8,6.7,6.8,6.8,6.7,6.7,6.7,6.7,6.6,6.9,6.8,6.8,6.7,6.7,6.7];

  const LEVELS = [
    { key: "ter", label: "Hochschule", color: "var(--s5)" },
    { key: "p2", label: "Sekundarstufe", color: "var(--s2)" },
    { key: "all", label: "Alle Stufen", color: "var(--ink)" },
    { key: "p1", label: "Grundschule", color: "var(--s1)" },
  ];

  // PISA: Frankreich / OECD-Schnitt wie im jeweiligen Zyklus publiziert
  const PISA = {
    read: { fr: [[2000,505],[2003,496],[2006,488],[2009,496],[2012,505],[2015,499],[2018,493],[2022,474],[2025,456]], oecd: [[2000,500],[2003,494],[2006,492],[2009,493],[2012,496],[2015,493],[2018,487],[2022,476],[2025,461]] },
    math: { fr: [[2003,511],[2006,496],[2009,497],[2012,495],[2015,493],[2018,495],[2022,474],[2025,458]], oecd: [[2003,500],[2006,498],[2009,496],[2012,494],[2015,490],[2018,489],[2022,472],[2025,463]] },
    sci: { fr: [[2006,495],[2009,498],[2012,499],[2015,495],[2018,493],[2022,487],[2025,483]], oecd: [[2006,500],[2009,501],[2012,501],[2015,493],[2018,489],[2022,485],[2025,482]] },
  };

  // Rohwerte + Standardabweichung der Skala -> Veränderung in SD seit erster Messung
  const EFFECT = [
    { key: "calc", label: "Rechnen CM2 (DEPP)", short: "Rechnen CM2", color: "var(--s1)", sd: 50, raw: [[1987,250],[1999,210],[2007,202],[2017,176]] },
    { key: "timss", label: "TIMSS Mathe 8. Klasse", short: "TIMSS 8. Kl.", color: "var(--s5)", sd: 100, raw: [[1995,530],[2019,483],[2023,479]] },
    { key: "pmath", label: "PISA Mathematik", short: "PISA Mathe", color: "var(--s2)", sd: 100, raw: PISA.math.fr },
    { key: "pread", label: "PISA Lesen", short: "PISA Lesen", color: "var(--s3)", sd: 100, raw: PISA.read.fr },
    { key: "psci", label: "PISA Naturwissenschaften", short: "PISA Nawi", color: "var(--s4)", sd: 100, raw: PISA.sci.fr },
  ];
  EFFECT.forEach((s) => {
    const base = s.raw[0][1];
    s.data = s.raw.map(([x, v]) => [x, (v - base) / s.sd]);
  });

  // ---------------------------------------------------------------- helpers
  const de0 = (v) => v.toLocaleString("de-DE", { maximumFractionDigits: 0 });
  const de1 = (v) => v.toLocaleString("de-DE", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
  const de2 = (v) => v.toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const euro = (v) => `${de0(v)} €`;
  const pct = (v) => `${v > 0 ? "+" : v < 0 ? "−" : "±"}${de0(Math.abs(v))} %`;
  const sdFmt = (v) => (Math.abs(v) < 0.005 ? "0" : `${v > 0 ? "+" : "−"}${de2(Math.abs(v))}`);
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);

  // ---------------------------------------------------------------- line chart
  function lineChart(el, o) {
    const W = Math.max(280, el.clientWidth);
    const mobile = W < 520;
    const H = o.height ? o.height(W) : Math.round(Math.min(440, Math.max(260, W * 0.46)));
    const compact = W < 760;
    const m = { top: 16, right: o.endLabels ? (mobile ? 84 : compact ? 104 : 150) : 14, bottom: 28, left: o.left || 48 };
    const iw = W - m.left - m.right;
    const ih = H - m.top - m.bottom;
    const [x0, x1] = o.x;
    const [y0, y1] = o.y;
    const X = (v) => m.left + ((v - x0) / (x1 - x0)) * iw;
    const Y = (v) => m.top + (1 - (v - y0) / (y1 - y0)) * ih;

    let g = "";
    o.yTicks.forEach((t) => {
      g += `<line class="${t === 0 && o.zero ? "ax-zero" : "ax-grid"}" x1="${m.left}" x2="${m.left + iw}" y1="${Y(t)}" y2="${Y(t)}"/>`;
      g += `<text class="ax-label" x="${m.left - 8}" y="${Y(t) + 4}" text-anchor="end">${o.fmtAxis(t)}</text>`;
    });
    const xt = mobile && o.xTicksMobile ? o.xTicksMobile : o.xTicks;
    xt.forEach((t) => {
      g += `<text class="ax-label" x="${X(t)}" y="${H - 8}" text-anchor="middle">${t}</text>`;
    });
    (o.marks || []).forEach((mk) => {
      g += `<line class="ax-mark" x1="${X(mk.x)}" x2="${X(mk.x)}" y1="${m.top}" y2="${m.top + ih}"/>`;
      g += `<text class="ax-mark-label" x="${X(mk.x) + 5}" y="${m.top + 10}">${esc(mk.label)}</text>`;
    });

    let lines = "";
    let dots = "";
    o.series.forEach((s) => {
      const d = s.data.map(([x, y], i) => `${i ? "L" : "M"}${X(x).toFixed(1)},${Y(y).toFixed(1)}`).join("");
      lines += `<path class="series-line${s.dashed ? " dashed" : ""}" d="${d}" style="stroke:${s.color}"/>`;
      if (s.dots) {
        s.data.forEach(([x, y]) => {
          dots += `<circle class="series-dot" cx="${X(x)}" cy="${Y(y)}" r="${s.dashed ? 3 : 4.5}" style="fill:${s.color}"/>`;
        });
      }
    });

    // direct end labels with simple collision avoidance
    let labels = "";
    if (o.endLabels) {
      const items = o.series
        .filter((s) => !s.noLabel)
        .map((s) => {
          const [lx, ly] = s.data[s.data.length - 1];
          return { s, x: X(lx), y: Y(ly), v: ly };
        })
        .sort((a, b) => a.y - b.y);
      const gap = 30;
      for (let i = 1; i < items.length; i++) {
        if (items[i].y - items[i - 1].y < gap) items[i].y = items[i - 1].y + gap;
      }
      const overflow = items.length ? items[items.length - 1].y - (m.top + ih) : 0;
      if (overflow > 0) items.forEach((it) => (it.y -= overflow));
      items.forEach((it) => {
        const lx = m.left + iw + 10;
        labels += `<text class="end-label" x="${lx}" y="${it.y}" style="fill:${it.s.color}">${esc(compact && it.s.short ? it.s.short : it.s.label)}</text>`;
        labels += `<text class="end-value" x="${lx}" y="${it.y + 13}">${o.fmtTip(it.v)}</text>`;
      });
    }

    el.innerHTML = `
      <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(o.aria || "")}">
        ${g}${lines}${dots}${labels}
        <line class="hover-line" x1="0" x2="0" y1="${m.top}" y2="${m.top + ih}" style="display:none"/>
        <g class="hover-dots"></g>
        <rect class="hit" x="${m.left}" y="${m.top}" width="${iw}" height="${ih}"/>
      </svg>
      <div class="tooltip" role="status"></div>`;

    // hover layer: crosshair + tooltip on nearest x
    const svg = el.querySelector("svg");
    const hit = el.querySelector(".hit");
    const hl = el.querySelector(".hover-line");
    const hd = el.querySelector(".hover-dots");
    const tip = el.querySelector(".tooltip");
    const xs = [...new Set(o.series.flatMap((s) => s.data.map((p) => p[0])))].sort((a, b) => a - b);

    function show(evt) {
      const r = svg.getBoundingClientRect();
      const scale = W / r.width;
      const px = (evt.clientX - r.left) * scale;
      const xv = x0 + ((px - m.left) / iw) * (x1 - x0);
      let best = xs[0];
      xs.forEach((x) => { if (Math.abs(x - xv) < Math.abs(best - xv)) best = x; });
      const cx = X(best);
      hl.setAttribute("x1", cx); hl.setAttribute("x2", cx); hl.style.display = "";
      let rows = "";
      let circ = "";
      o.series.forEach((s) => {
        const p = s.data.find((d) => d[0] === best);
        if (!p) return;
        circ += `<circle cx="${cx}" cy="${Y(p[1])}" r="5" style="fill:${s.color}" stroke="var(--white)" stroke-width="2"/>`;
        rows += `<div class="row"><span><i style="background:${s.color}"></i>${esc(s.label)}</span><span>${o.fmtTip(p[1], s, best)}</span></div>`;
      });
      hd.innerHTML = circ;
      tip.innerHTML = `<b>${o.tipTitle ? o.tipTitle(best) : best}</b>${rows}`;
      const left = (cx / W) * r.width;
      const tw = tip.offsetWidth || 160;
      const clamped = Math.min(Math.max(left, tw / 2 + 2), r.width - tw / 2 - 2);
      tip.style.left = `${clamped}px`;
      tip.style.top = `${(m.top / H) * r.height + 4}px`;
      tip.style.transform = "translate(-50%, 0)";
      tip.classList.add("on");
    }
    function hide() {
      hl.style.display = "none"; hd.innerHTML = ""; tip.classList.remove("on");
    }
    hit.addEventListener("pointermove", show);
    hit.addEventListener("pointerdown", show);
    hit.addEventListener("pointerleave", hide);
  }

  // ---------------------------------------------------------------- spending
  let basis = "real";
  function spendSeries() {
    const src = basis === "real" ? REAL : NOMINAL;
    return LEVELS.map((l) => ({ ...l, data: YEARS.map((y, i) => [y, src[l.key][i]]) }));
  }
  function drawSpend() {
    const el = document.getElementById("spend-chart");
    lineChart(el, {
      series: spendSeries(),
      x: [1980, 2025], y: [0, 15000],
      yTicks: [0, 3000, 6000, 9000, 12000, 15000],
      xTicks: [1980, 1985, 1990, 1995, 2000, 2005, 2010, 2015, 2020, 2025],
      xTicksMobile: [1980, 1990, 2000, 2010, 2025],
      fmtAxis: (t) => (t ? `${de0(t / 1000)} Tsd.` : "0"),
      left: 56,
      fmtTip: (v) => euro(v),
      marks: [{ x: 1990, label: "1990" }],
      endLabels: true,
      aria: "Bildungsausgaben pro Kopf in Frankreich 1980 bis 2025 nach Bildungsstufe",
    });
    document.getElementById("spend-sub").textContent =
      basis === "real" ? "Konstante Euro, Preise 2025" : "Laufende Euro (bis 2023 abgeleitet)";
  }
  document.getElementById("spend-legend").innerHTML = LEVELS.slice().reverse()
    .map((l) => `<li style="color:${l.color}"><i></i><span>${l.label}</span></li>`).join("");
  document.querySelectorAll("[data-basis]").forEach((b) => {
    b.addEventListener("click", () => {
      basis = b.dataset.basis;
      document.querySelectorAll("[data-basis]").forEach((o) => o.setAttribute("aria-pressed", String(o === b)));
      drawSpend();
    });
  });

  function drawGdp() {
    lineChart(document.getElementById("gdp-chart"), {
      series: [{ key: "gdp", label: "DIE / BIP", color: "var(--s2)", data: YEARS.map((y, i) => [y, GDP[i]]) }],
      x: [1980, 2025], y: [6, 8],
      yTicks: [6, 6.5, 7, 7.5, 8],
      xTicks: [1980, 1990, 2000, 2010, 2025],
      fmtAxis: (t) => `${de1(t)} %`,
      fmtTip: (v) => `${de1(v)} %`,
      height: (w) => Math.round(Math.min(260, Math.max(200, w * 0.42))),
      left: 52,
      aria: "Bildungsausgaben in Prozent des BIP, 1980 bis 2025",
    });
  }

  // change bars
  (function changeBars() {
    const i90 = YEARS.indexOf(1990), i10 = YEARS.indexOf(2010), iL = YEARS.length - 1;
    const rows = [
      ["Grundschule", "p1"], ["Sekundarstufe", "p2"], ["Hochschule", "ter"], ["Alle Stufen", "all"],
    ];
    const max = 100;
    document.getElementById("change-bars").innerHTML = rows.map(([lab, k]) => {
      const a = (REAL[k][iL] / REAL[k][i90] - 1) * 100;
      const b = (REAL[k][iL] / REAL[k][i10] - 1) * 100;
      const w = (v) => `${Math.max(0, (v / max) * 100)}%`;
      return `<li style="grid-template-columns:96px minmax(0,1fr)">
        <span>${lab}</span>
        <span>
          <span class="bars-line"><span class="track"><span class="fill alt" style="width:${w(a)}"></span></span><span class="val">${pct(a)}</span></span>
          <span class="bars-line"><span class="track"><span class="fill" style="width:${w(b)}"></span></span><span class="val">${pct(b)}</span></span>
        </span></li>`;
    }).join("") + `<li class="bars-key" style="grid-template-columns:1fr"><span><i style="background:var(--s2)"></i>1990 → 2025 <i style="background:var(--s1);margin-left:14px"></i>2010 → 2025</span></li>`;
  })();

  // spend table
  (function spendTable() {
    let h = "<table><thead><tr><th>Jahr</th><th>Grundschule</th><th>Sekundar</th><th>Hochschule</th><th>Alle</th><th>Alle, laufende €</th><th>DIE % BIP</th></tr></thead><tbody>";
    YEARS.forEach((y, i) => {
      h += `<tr${y === 1990 ? ' class="hl"' : ""}><td>${y}${y === 2025 ? " (vorl.)" : ""}</td><td>${de0(REAL.p1[i])}</td><td>${de0(REAL.p2[i])}</td><td>${de0(REAL.ter[i])}</td><td>${de0(REAL.all[i])}</td><td>${de0(NOMINAL.all[i])}</td><td>${de1(GDP[i])}</td></tr>`;
    });
    document.getElementById("spend-table").innerHTML = h + "</tbody></table>";
  })();

  // ---------------------------------------------------------------- pupils
  // DEPP RERS 2026: 1.02 (Stichjahre), 3.01 Fig. 2 (1. Stufe 2011–2025), 4.01 Fig. 1 (2. Stufe ab 1994); Tausend
  const P1 = [[1980,7396.3],[1990,6953.4],[2000,6552.0],[2010,6648.6],[2011,6690.4],[2015,6776.4],[2016,6772.3],[2017,6744.0],[2018,6704.3],[2019,6653.5],[2020,6565.8],[2021,6481.5],[2022,6422.8],[2023,6339.9],[2024,6261.8],[2025,6154.9]];
  const P2 = [[1980,5309.2],[1990,5725.8],[1994,5773.5],[1995,5732.9],[1996,5708.4],[1997,5691.3],[1998,5662.5],[1999,5635.1],[2000,5588.4],[2001,5573.6],[2002,5569.5],[2003,5551.6],[2004,5510.8],[2005,5454.9],[2006,5387.2],[2007,5339.4],[2008,5308.0],[2009,5301.1],[2010,5322.1],[2011,5383.9],[2012,5391.4],[2013,5443.0],[2014,5468.9],[2015,5508.9],[2016,5551.9],[2017,5602.9],[2018,5616.4],[2019,5646.9],[2020,5657.0],[2021,5654.8],[2022,5653.8],[2023,5656.7],[2024,5635.7],[2025,5621.0]];
  const P3 = [[1980,1181.1],[1990,1717.1],[2000,2160.3],[2010,2349.2],[2015,2569.9],[2016,2617.3],[2017,2689.8],[2019,2807.0],[2020,2895.5],[2021,2979.2],[2022,2937.1],[2023,2971.7],[2024,3017.6],[2025,3049.6]];
  const PTOT = P1.map(([y, v]) => [y, +(v + P2.find((d) => d[0] === y)[1]).toFixed(1)]);
  const PUPILS = [
    { key: "tot", label: "Schule gesamt", color: "var(--ink)", dots: true, data: PTOT },
    { key: "p1", label: "Grundschule inkl. Vorschule", short: "Grundschule", color: "var(--s1)", dots: true, data: P1 },
    { key: "p2", label: "Sekundarstufe", color: "var(--s2)", data: P2 },
    { key: "p3", label: "Hochschule", color: "var(--s5)", dots: true, data: P3 },
  ];
  const mio = (v) => `${de2(v / 1000)} Mio.`;
  function drawPupils() {
    lineChart(document.getElementById("pup-chart"), {
      series: PUPILS.map((s) => ({ ...s, data: s.data.map(([y, v]) => [y, v]) })),
      x: [1979, 2026], y: [0, 14000],
      yTicks: [0, 2000, 4000, 6000, 8000, 10000, 12000, 14000],
      xTicks: [1980, 1985, 1990, 1995, 2000, 2005, 2010, 2015, 2020, 2025],
      xTicksMobile: [1980, 1990, 2000, 2010, 2025],
      fmtAxis: (t) => (t ? `${de0(t / 1000)} Mio.` : "0"),
      fmtTip: (v) => mio(v),
      marks: [{ x: 1990, label: "1990" }],
      endLabels: true, left: 54,
      aria: "Schüler und Studierende in Frankreich 1980 bis 2025",
    });
  }
  document.getElementById("pup-legend").innerHTML = PUPILS
    .map((s) => `<li style="color:${s.color}"><i></i><span>${s.label}</span></li>`).join("");
  (function pupilTable() {
    const years = [...new Set([...P2, ...P3].map((d) => d[0]))].sort((a, b) => a - b);
    const get = (arr, y) => { const p = arr.find((d) => d[0] === y); return p ? de0(p[1] * 1000) : "–"; };
    let h = "<table><thead><tr><th>Schuljahr ab</th><th>Grundschule</th><th>Sekundarstufe</th><th>Schule gesamt</th><th>Hochschule</th></tr></thead><tbody>";
    years.forEach((y) => {
      h += `<tr${y === 1990 ? ' class="hl"' : ""}><td>${y}</td><td>${get(P1, y)}</td><td>${get(P2, y)}</td><td>${get(PTOT, y)}</td><td>${get(P3, y)}</td></tr>`;
    });
    document.getElementById("pup-table").innerHTML = h + "</tbody></table>";
  })();

  // Insee via RERS 2026 3.01 Fig. 3 (Tausend; ohne Mayotte vor 2014)
  const BIRTHS = [[2007,818.7],[2008,828.4],[2009,824.6],[2010,832.8],[2011,823.4],[2012,821.0],[2013,811.5],[2014,818.6],[2015,798.9],[2016,783.6],[2017,769.6],[2018,758.6],[2019,753.4],[2020,735.2],[2021,742.1],[2022,726.0],[2023,677.8]];
  function drawBirths() {
    lineChart(document.getElementById("birth-chart"), {
      series: [{ key: "b", label: "Geburten", color: "var(--s3)", dots: true, data: BIRTHS }],
      x: [2006.5, 2023.5], y: [600, 860],
      yTicks: [600, 650, 700, 750, 800, 850],
      xTicks: [2007, 2011, 2015, 2019, 2023],
      fmtAxis: (t) => String(t),
      fmtTip: (v) => `${de1(v)} Tsd.`,
      height: (w) => Math.round(Math.min(260, Math.max(200, w * 0.45))),
      left: 40,
      aria: "Geburten in Frankreich 2007 bis 2023",
    });
  }

  // ---------------------------------------------------------------- staffing
  // Ministerium, Antwort QE 95037 (2011): Köpfe, öffentlich + privat unter Vertrag (1970/1981 nur Festland)
  const RATIO_OLD = {
    p1: [[1970,25.56],[1981,20.85],[1990,19.74],[2000,18.17],[2007,18.02],[2008,18.06],[2009,18.02]],
    p2: [[1970,16.40],[1981,14.25],[1990,13.07],[2000,11.27],[2007,11.21],[2008,11.42],[2009,11.55]],
  };
  // DEPP "Les taux d'encadrement" (Juli 2026): Vollzeitäquivalente, öffentlich; 2015 neue Definition
  const FTE_YEARS = Array.from({ length: 18 }, (_, i) => 2008 + i);
  const RATIO_FTE = {
    p1: [20.44,20.38,20.26,20.74,20.88,20.84,20.85,20.77,20.45,20.14,19.73,19.49,19.16,18.98,18.81,18.63,18.4,18.2],
    p2: [12.07,12.17,12.25,12.52,12.67,12.67,12.68,12.71,12.68,12.64,12.63,12.78,12.77,12.91,12.92,12.90,12.8,12.8],
  };
  const RATIO_SERIES = [
    { key: "p1old", label: "Grundschule (Köpfe)", color: "var(--s1)", dashed: true, dots: true, noLabel: true, data: RATIO_OLD.p1 },
    { key: "p2old", label: "Sekundarstufe (Köpfe)", color: "var(--s2)", dashed: true, dots: true, noLabel: true, data: RATIO_OLD.p2 },
    { key: "p1", label: "Grundschule", color: "var(--s1)", data: FTE_YEARS.map((y, i) => [y, RATIO_FTE.p1[i]]) },
    { key: "p2", label: "Sekundarstufe", color: "var(--s2)", data: FTE_YEARS.map((y, i) => [y, RATIO_FTE.p2[i]]) },
  ];
  function drawRatio() {
    lineChart(document.getElementById("ratio-chart"), {
      series: RATIO_SERIES,
      x: [1968, 2026], y: [8, 28],
      yTicks: [8, 12, 16, 20, 24, 28],
      xTicks: [1970, 1981, 1990, 2000, 2008, 2015, 2025],
      xTicksMobile: [1970, 1990, 2008, 2025],
      fmtAxis: (t) => String(t),
      fmtTip: (v) => de1(v),
      marks: [{ x: 2008, label: "Vollzeit-Zählung" }],
      endLabels: true, left: 36,
      height: (w) => Math.round(Math.min(380, Math.max(240, w * 0.4))),
      aria: "Schüler pro Lehrkraft in Frankreich 1970 bis 2025, Grund- und Sekundarstufe",
    });
  }
  (function ratioTable() {
    let h = "<table><thead><tr><th>Jahr</th><th>Grundschule</th><th>Sekundarstufe</th><th>Zählweise</th></tr></thead><tbody>";
    RATIO_OLD.p1.forEach(([y, v], i) => {
      h += `<tr><td>${y}</td><td>${de1(v)}</td><td>${de1(RATIO_OLD.p2[i][1])}</td><td>Köpfe, öff. + privat</td></tr>`;
    });
    FTE_YEARS.forEach((y, i) => {
      h += `<tr${y === 2008 ? ' class="hl"' : ""}><td>${y}</td><td>${de1(RATIO_FTE.p1[i])}</td><td>${de1(RATIO_FTE.p2[i])}</td><td>Vollzeit, öffentlich</td></tr>`;
    });
    document.getElementById("ratio-table").innerHTML = h + "</tbody></table>";
  })();

  // Klassengrößen: RERS 2013 (2.2) bis 2012, RERS 2026 (2.02, 2.05) ab 2013
  const CLASS = [
    { key: "pre", label: "Vorschule", color: "var(--s3)", parts: [
      [[1980,30.1],[1990,27.8],[1999,25.5],[2006,26.1],[2007,25.9],[2008,25.9],[2009,25.7],[2010,25.8],[2011,26.0],[2012,25.9]],
      [[2013,24.8],[2015,24.7],[2017,24.3],[2019,24.0],[2020,23.2],[2022,22.4],[2023,22.1],[2024,21.9],[2025,21.7]],
    ] },
    { key: "ele", label: "Grundschule", color: "var(--s1)", parts: [
      [[1980,23.9],[1990,22.8],[1999,22.5],[2006,22.6],[2007,22.7],[2008,22.7],[2009,22.7],[2010,22.7],[2011,22.8],[2012,22.9]],
      [[2013,23.5],[2015,23.7],[2017,23.3],[2019,22.1],[2020,21.9],[2022,21.6],[2023,21.4],[2024,21.3],[2025,21.1]],
    ] },
    { key: "col", label: "Collège", color: "var(--s2)", parts: [
      [[1994,24.6],[1995,24.6],[2000,24.3],[2005,24.2],[2010,24.5],[2015,25.2],[2020,25.8],[2022,25.9],[2024,25.8],[2025,25.7]],
    ] },
    { key: "lgt", label: "Lycée (allg./techn.)", short: "Lycée", color: "var(--s5)", parts: [
      [[1994,28.9],[1995,28.8],[2000,27.9],[2005,28.1],[2010,27.9],[2015,29.4],[2020,30.3],[2022,30.3],[2024,30.1],[2025,30.2]],
    ] },
  ];
  function drawClass() {
    const series = CLASS.flatMap((c) => c.parts.map((d, i) => ({
      key: `${c.key}${i}`, label: c.label, short: c.short, color: c.color, dots: true,
      noLabel: i < c.parts.length - 1, data: d,
    })));
    lineChart(document.getElementById("class-chart"), {
      series,
      x: [1978, 2026], y: [16, 32],
      yTicks: [16, 20, 24, 28, 32],
      xTicks: [1980, 1990, 2000, 2012, 2025],
      fmtAxis: (t) => String(t),
      fmtTip: (v) => de1(v),
      marks: [{ x: 2012.5, label: "" }],
      endLabels: true, left: 30,
      height: (w) => Math.round(Math.min(330, Math.max(240, w * 0.62))),
      aria: "Durchschnittliche Klassengröße nach Schulform, 1980 bis 2025",
    });
  }
  document.getElementById("class-legend").innerHTML = CLASS
    .map((c) => `<li style="color:${c.color}"><i></i><span>${c.label}</span></li>`).join("");
  (function oecdRatio() {
    const d = [["Vorschule", 21.6, 13.1], ["Grundschule", 17.9, 13.9], ["Sekundarstufe I (collège)", 14.7, 12.8], ["Sekundarstufe II (lycée)", 11.5, 12.9]];
    document.getElementById("oecd-ratio-rows").innerHTML = d.map(([lab, fr, oe]) => {
      const diff = fr - oe;
      return `<li><div class="lbl"><span>${lab}</span><b>${diff > 0 ? "+" : "−"}${de1(Math.abs(diff))} ggü. OECD</b></div>
        <div class="line"><span class="k">Frankreich</span><span class="track"><span class="fill" style="width:${(fr / 24) * 100}%;background:var(--s1)"></span></span><span>${de1(fr)}</span></div>
        <div class="line"><span class="k">OECD</span><span class="track"><span class="fill" style="width:${(oe / 24) * 100}%;background:var(--s2)"></span></span><span>${de1(oe)}</span></div>
      </li>`;
    }).join("");
  })();

  // ---------------------------------------------------------------- PISA small multiples
  function drawPisa() {
    const panels = [["pisa-read", "read", "Lesen"], ["pisa-math", "math", "Mathematik"], ["pisa-sci", "sci", "Naturwissenschaften"]];
    panels.forEach(([id, k, name]) => {
      lineChart(document.getElementById(id), {
        series: [
          { key: "oecd", label: "OECD", color: "var(--muted)", dashed: true, dots: true, data: PISA[k].oecd },
          { key: "fr", label: "Frankreich", color: "var(--s1)", dots: true, data: PISA[k].fr },
        ],
        x: [1999, 2026], y: [440, 530],
        yTicks: [440, 460, 480, 500, 520],
        xTicks: [2000, 2006, 2012, 2018, 2025],
        fmtAxis: (t) => String(t),
        fmtTip: (v) => String(v),
        height: (w) => Math.round(Math.min(300, Math.max(220, w * 0.72))),
        left: 38,
        aria: `PISA ${name}: Frankreich und OECD-Durchschnitt`,
      });
    });
  }
  (function pisaTable() {
    const cycles = [2000, 2003, 2006, 2009, 2012, 2015, 2018, 2022, 2025];
    const get = (arr, y) => { const p = arr.find((d) => d[0] === y); return p ? p[1] : "–"; };
    let h = "<table><thead><tr><th>Zyklus</th><th>Lesen FR</th><th>OECD</th><th>Mathe FR</th><th>OECD</th><th>Nawi FR</th><th>OECD</th></tr></thead><tbody>";
    cycles.forEach((y) => {
      h += `<tr><td>${y}</td><td>${get(PISA.read.fr, y)}</td><td>${get(PISA.read.oecd, y)}</td><td>${get(PISA.math.fr, y)}</td><td>${get(PISA.math.oecd, y)}</td><td>${get(PISA.sci.fr, y)}</td><td>${get(PISA.sci.oecd, y)}</td></tr>`;
    });
    h += "</tbody></table><p class='chart-note'>Mathematik 2000 (517) und Naturwissenschaften 2000/2003 (500/511) nicht trendfähig und daher nicht dargestellt.</p>";
    document.getElementById("pisa-table").innerHTML = h;
  })();

  // ---------------------------------------------------------------- effect chart
  function drawEffect() {
    lineChart(document.getElementById("effect-chart"), {
      series: EFFECT.map((s) => ({ ...s, dots: true })),
      x: [1985, 2026], y: [-1.6, 0.2],
      yTicks: [0, -0.4, -0.8, -1.2, -1.6],
      xTicks: [1987, 1995, 2000, 2006, 2012, 2018, 2025],
      xTicksMobile: [1987, 2000, 2012, 2025],
      fmtAxis: (t) => sdFmt(t),
      fmtTip: (v, s, x) => {
        if (!s) return `${sdFmt(v)} SD`;
        const raw = s.raw.find((d) => d[0] === x);
        return `${raw ? raw[1] : ""} · ${sdFmt(v)} SD`;
      },
      zero: true, endLabels: true, left: 44,
      aria: "Leistungsveränderung französischer Schüler seit der ersten Messung in Standardabweichungen",
    });
  }
  document.getElementById("effect-legend").innerHTML = EFFECT
    .map((s) => `<li style="color:${s.color}"><i></i><span>${s.label}</span></li>`).join("");
  (function effectTable() {
    let h = "<table><thead><tr><th>Studie</th><th>Jahr</th><th>Wert</th><th>Skala-SD</th><th>Veränderung (SD)</th></tr></thead><tbody>";
    EFFECT.forEach((s) => s.raw.forEach(([y, v], i) => {
      h += `<tr><td>${i ? "" : s.label}</td><td>${y}</td><td>${v}</td><td>${s.sd}</td><td>${sdFmt(s.data[i][1])}</td></tr>`;
    }));
    document.getElementById("effect-table").innerHTML = h + "</tbody></table>";
  })();

  // ---------------------------------------------------------------- html bars
  (function dictee() {
    const d = [[1987, 10.7], [2007, 14.7], [2015, 18.0], [2021, 19.4]];
    document.getElementById("dictee-bars").innerHTML = d.map(([y, v]) =>
      `<li><span>${y}</span><span class="track"><span class="fill" style="width:${(v / 20) * 100}%"></span></span><span class="val">${de1(v)}</span></li>`).join("");
  })();
  (function calc() {
    // Punktdiagramm statt Balken: die Skala (1987 = 250) hat keinen natürlichen Nullpunkt
    const d = [[1987, 250], [1999, 210], [2007, 202], [2017, 176]];
    const lo = 150, hi = 260;
    const pos = (v) => ((v - lo) / (hi - lo)) * 100;
    document.getElementById("calc-bars").innerHTML = d.map(([y, v]) =>
      `<li><span>${y}</span><span class="track dot-track"><span class="ref" style="left:${pos(250)}%"></span><span class="dot" style="left:${pos(v)}%"></span></span><span class="val">${v}</span></li>`).join("") +
      `<li class="bars-key" style="grid-template-columns:76px minmax(0,1fr) 54px"><span></span><span class="axis-row"><span style="left:0">150</span><span style="left:${pos(200)}%">200</span><span style="left:${pos(250)}%">250</span></span><span></span></li>`;
  })();
  (function gaps() {
    const d = [["Lesen", 91, 77], ["Mathematik", 95, 83], ["Naturwissenschaften", 100, 85]];
    document.getElementById("gap-rows").innerHTML = d.map(([lab, fr, oe]) => `
      <li><div class="lbl"><span>${lab}</span><b>+${fr - oe} Punkte mehr als OECD</b></div>
        <div class="line"><span class="k">Frankreich</span><span class="track"><span class="fill" style="width:${(fr / 110) * 100}%;background:var(--s1)"></span></span><span>${fr}</span></div>
        <div class="line"><span class="k">OECD</span><span class="track"><span class="fill" style="width:${(oe / 110) * 100}%;background:var(--s2)"></span></span><span>${oe}</span></div>
      </li>`).join("");
  })();

  // ---------------------------------------------------------------- render + resize
  function drawAll() { drawSpend(); drawGdp(); drawPupils(); drawBirths(); drawRatio(); drawClass(); drawPisa(); drawEffect(); }
  drawAll();
  let lastW = window.innerWidth;
  let t;
  window.addEventListener("resize", () => {
    if (window.innerWidth === lastW) return;
    lastW = window.innerWidth;
    clearTimeout(t);
    t = setTimeout(drawAll, 120);
  });
})();
