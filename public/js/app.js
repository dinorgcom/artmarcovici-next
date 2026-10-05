(() => {
  "use strict";

  // ---------------------------------------------------------------- constants
  const CATS = {
    K1: { label: "Anschlag gestoppt", short: "Anschlag", color: "#2a6fb0", desc: "Der Getötete verübte einen Anschlag (Schüsse, Messer, Rammen, Sprengsatz). Keine Seite bestreitet das. Notwehr ist eindeutig." },
    K2: { label: "Angriff behauptet, bestritten", short: "behauptet", color: "#c98a12", desc: "Israelische Seite: Angriff mit Messer, Molotowcocktail oder bei einem Raub. Palästinensische Seite bestreitet den Angriff." },
    K3: { label: "Konfrontation", short: "Konfrontation", color: "#7a4fa8", desc: "Mindestens eine Seite berichtet Steinwürfe oder ein Handgemenge; der Schütze beruft sich auf Gefahr. Ob Lebensgefahr bestand, ist offen." },
    K4: { label: "Überfall", short: "Überfall", color: "#d6493d", desc: "Keine Quelle, auch keine israelische, berichtet Gewalt des Getöteten. Er wurde bei einem Angriff von Siedlern getötet." },
    U: { label: "Schütze unklar", short: "unklar", color: "#a9a49a", desc: "Ungeklärt, ob Siedler oder Soldaten geschossen haben. Darstellungen und UN-Zuordnung widersprechen sich." },
  };
  const SRC = {
    A: { label: "Israelische Behörde äußert sich", short: "IDF/Polizei", cls: "src-a" },
    M: { label: "Israelische Medien", short: "israel. Medien", cls: "src-m" },
    N: { label: "Israelische NGO", short: "israel. NGO", cls: "src-n" },
    I: { label: "Internationale Medien", short: "international", cls: "src-i" },
    P: { label: "Nur UN, palästinensische oder arabische Quellen", short: "nur UN/palästinensisch", cls: "src-p" },
  };
  const SRC_ORDER = ["A", "M", "N", "I", "P"];
  let UNTIL = "4. Oktober";
  const CAT_ORDER = ["K1", "K2", "K3", "K4", "U"];
  const YEARS = ["2023", "2024", "2025", "2026"];
  const STATUS = { Z: "Zivilist", S: "Sicherheitskraft" };
  const STATUS_COLOR = { Z: "#2a6fb0", S: "#c98a12" };

  const population = [
    [2016, 2803411], [2017, 2856691], [2018, 2921170], [2019, 2986714], [2020, 3053183], [2021, 3120448],
    [2022, 3188387], [2023, 3256906], [2024, 3325905], [2025, 3395260], [2026, 3464858],
  ];

  // Vorfälle (siehe Quellenangaben unter den Diagrammen)
  const SETTLER_INC = [
    { label: "IDF/Shin Bet", color: "#2a6fb0", values: [1045, 682, 867, 660], notes: ["ganzes Jahr", "", "", "nur 1. Halbjahr"] },
    { label: "OCHA", color: "#c98a12", values: [1291, 1449, 1828, 1600], notes: ["ganzes Jahr", "", "", "Jan.–Aug., „über 1.600“"] },
  ];
  const PAL_ATTACKS = [
    { label: "IDF „Terroranschläge“", color: "#2a6fb0", values: [847, 258, 57, null], notes: ["", "", "", "keine Jahreszahl"] },
    { label: "Shin Bet „bedeutende Anschläge“", color: "#c98a12", values: [414, null, 68, 21], notes: ["", "nicht belegt", "", "nur 1. Halbjahr"] },
  ];

  // ---------------------------------------------------------------- helpers
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const de = (v) => v.toLocaleString("de-DE");
  const fmtDate = (iso) => { const [y, m, d] = iso.split("-"); return `${+d}.${+m}.${y}`; };
  const HOSTS = {
    "timesofisrael.com": "Times of Israel", "haaretz.com": "Haaretz", "ynetnews.com": "Ynet", "ynet.co.il": "Ynet",
    "jpost.com": "Jerusalem Post", "jns.org": "JNS", "israelnationalnews.com": "Arutz 7", "israelhayom.com": "Israel Hayom",
    "tps.co.il": "TPS", "t.me": "IDF (Telegram)", "terrorism-info.org.il": "ITIC", "jewishpress.com": "Jewish Press",
    "algemeiner.com": "Algemeiner", "thejc.com": "Jewish Chronicle", "jewishvirtuallibrary.org": "JVL", "themedialine.org": "Media Line",
    "i24news.tv": "i24", "longwarjournal.org": "Long War Journal",
    "statistics.btselem.org": "B’Tselem", "btselem.org": "B’Tselem", "yesh-din.org": "Yesh Din",
    "ochaopt.org": "OCHA", "unocha.org": "OCHA", "un.org": "OHCHR", "reliefweb.int": "B’Tselem/ReliefWeb", "hrw.org": "HRW",
    "english.wafa.ps": "WAFA", "pchrgaza.org": "PCHR", "imemc.org": "IMEMC", "aljazeera.com": "Al Jazeera",
    "reuters.com": "Reuters", "theguardian.com": "Guardian", "npr.org": "NPR", "bbc.com": "BBC", "edition.cnn.com": "CNN",
    "middleeasteye.net": "MEE", "972mag.com": "+972", "ccrjustice.org": "CCR (FOIA)", "en.wikipedia.org": "Wikipedia",
    "nbcnews.com": "NBC", "abc17news.com": "CNN (Syndikation)", "arabnews.com": "Arab News", "gulfnews.com": "Gulf News", "stgmobile.jpost.com": "Jerusalem Post",
  };
  const hostLabel = (url) => {
    try {
      const h = new URL(url).hostname.replace(/^www\./, "");
      return HOSTS[h] || h;
    } catch { return "Quelle"; }
  };
  const linkList = (urls) => urls.map((u) => `<a href="${esc(u)}" target="_blank" rel="noopener">${esc(hostLabel(u))} ↗</a>`).join("<br />");

  // shared hover tooltip
  const tip = document.createElement("div");
  tip.className = "wb-tip";
  tip.setAttribute("role", "status");
  document.body.appendChild(tip);
  function bindTips(root) {
    root.querySelectorAll("[data-tip]").forEach((el) => {
      const show = (e) => {
        tip.innerHTML = el.dataset.tip;
        tip.classList.add("on");
        const x = e.clientX ?? el.getBoundingClientRect().left;
        const y = e.clientY ?? el.getBoundingClientRect().top;
        const w = tip.offsetWidth;
        tip.style.left = `${Math.min(Math.max(x - w / 2, 8), window.innerWidth - w - 8)}px`;
        tip.style.top = `${y - tip.offsetHeight - 12}px`;
      };
      el.addEventListener("pointermove", show);
      el.addEventListener("pointerdown", show);
      el.addEventListener("pointerleave", () => tip.classList.remove("on"));
      el.addEventListener("focus", (e) => { const r = el.getBoundingClientRect(); show({ clientX: r.left + r.width / 2, clientY: r.top }); });
      el.addEventListener("blur", () => tip.classList.remove("on"));
    });
  }

  // ---------------------------------------------------------------- category overview
  function renderCats(pal) {
    const tot = Object.fromEntries(CAT_ORDER.map((k) => [k, 0]));
    pal.forEach((c) => (tot[c.cat] += c.n));
    $("#cat-grid").innerHTML = CAT_ORDER.map((k, i) => `
      <article class="cat-card" style="--cat:${CATS[k].color}">
        <span class="cat-num">${k === "U" ? "?" : i + 1}</span>
        <h3>${CATS[k].label}</h3>
        <strong>${tot[k]}</strong>
        <p>${CATS[k].desc}</p>
      </article>`).join("");

    // stacked bars per year
    const byYear = YEARS.map((y) => {
      const row = Object.fromEntries(CAT_ORDER.map((k) => [k, 0]));
      pal.filter((c) => c.date.startsWith(y)).forEach((c) => (row[c.cat] += c.n));
      return row;
    });
    const max = Math.max(...byYear.map((r) => CAT_ORDER.reduce((a, k) => a + r[k], 0)));
    $("#cat-year-chart").innerHTML = `
      <ul class="wb-legend">${CAT_ORDER.map((k) => `<li><i style="background:${CATS[k].color}"></i>${CATS[k].label}</li>`).join("")}</ul>
      <div class="stack-rows">
      ${YEARS.map((y, i) => {
        const r = byYear[i];
        const sum = CAT_ORDER.reduce((a, k) => a + r[k], 0);
        const segs = CAT_ORDER.filter((k) => r[k]).map((k) =>
          `<span class="stack-seg" tabindex="0" style="width:${(r[k] / max) * 100}%;background:${CATS[k].color}"
            data-tip="<b>${y} · ${CATS[k].label}</b>${r[k]} ${r[k] === 1 ? "Toter" : "Tote"}"
            aria-label="${y}, ${CATS[k].label}: ${r[k]}">${r[k] / max > 0.045 ? r[k] : ""}</span>`).join("");
        return `<div class="stack-row"><span class="stack-year">${y}${y === "2023" ? "*" : y === "2026" ? "**" : ""}</span><span class="stack-track">${segs}</span><strong>${sum}</strong></div>`;
      }).join("")}
      </div>
      <p class="chart-source">* ab 7. Oktober · ** bis ${UNTIL}</p>`;
    bindTips($("#cat-year-chart"));
  }

  // ---------------------------------------------------------------- palestinian cases
  function renderPal(pal) {
    const sel = $("#pal-cat");
    sel.insertAdjacentHTML("beforeend", CAT_ORDER.map((k) => `<option value="${k}">${CATS[k].label}</option>`).join(""));
    const tbody = $("#pal-cases tbody");
    tbody.innerHTML = pal.map((c) => `
      <tr data-cat="${c.cat}" data-year="${c.date.slice(0, 4)}" data-src="${c.src}" class="${c.src === "P" ? "row-weak" : ""}">
        <td data-label="Datum / Ort"><div><strong>${fmtDate(c.date)}</strong><br />${esc(c.place)}</div></td>
        <td data-label="Getötete"><div>${esc(c.victims)}${c.n > 1 ? `<br /><span class="wb-n">${c.n} Tote</span>` : ""}</div></td>
        <td data-label="Kategorie"><div><span class="cat-badge" style="--cat:${CATS[c.cat].color}">${CATS[c.cat].label}</span></div></td>
        <td data-label="Hergang"><div>${esc(c.context)}</div></td>
        <td data-label="Schütze / Verfahren"><div><b>${esc(c.shooter)}</b><br />${esc(c.legal)}</div></td>
        <td data-label="Belege"><div><span class="src-badge ${SRC[c.src].cls}" title="${SRC[c.src].label}">${SRC[c.src].short}</span><br />${linkList(c.links)}</div></td>
      </tr>`).join("");
    const rows = [...tbody.rows];
    const filter = () => {
      const q = $("#pal-q").value.trim().toLocaleLowerCase("de");
      const cat = sel.value;
      const year = $("#pal-year").value;
      const src = $("#pal-src").value;
      let cases = 0, dead = 0;
      rows.forEach((row, i) => {
        const show = (!q || row.textContent.toLocaleLowerCase("de").includes(q)) && (!cat || row.dataset.cat === cat) && (!year || row.dataset.year === year) && (!src || (src === "IL" ? "AMN".includes(row.dataset.src) : row.dataset.src === src));
        row.hidden = !show;
        if (show) { cases += 1; dead += pal[i].n; }
      });
      $("#pal-count").textContent = `${cases} von ${rows.length} Vorfällen · ${dead} Tote`;
    };
    ["#pal-q", "#pal-cat", "#pal-year", "#pal-src"].forEach((s) => $(s).addEventListener(s === "#pal-q" ? "input" : "change", filter));
    filter();

    const tot = Object.fromEntries(SRC_ORDER.map((k) => [k, { f: 0, t: 0 }]));
    pal.forEach((c) => { tot[c.src].f += 1; tot[c.src].t += c.n; });
    $("#src-summary").innerHTML = SRC_ORDER.map((k) =>
      `<li><span class="src-badge ${SRC[k].cls}">${SRC[k].short}</span> ${SRC[k].label}: <b>${tot[k].f} Vorfälle, ${tot[k].t} Tote</b></li>`).join("");
  }

  // ---------------------------------------------------------------- israeli cases
  function renderIsr(isr) {
    // year chart, list A – direkt aus der Fallliste gezählt
    const a = {};
    isr.filter((c) => c.list === "A").forEach((c) => {
      const y = c.date.slice(0, 4);
      a[y] = a[y] || { total: 0, Z: 0, S: 0 };
      c.victims.forEach((v) => { a[y].total += 1; a[y][v.status] = (a[y][v.status] || 0) + 1; });
    });
    const max = Math.max(...YEARS.map((y) => (a[y] ? a[y].total : 0)));
    $("#isr-year-chart").innerHTML = `
      <ul class="wb-legend"><li><i style="background:${STATUS_COLOR.Z}"></i>Zivilisten</li><li><i style="background:${STATUS_COLOR.S}"></i>Sicherheitskräfte</li></ul>
      <div class="stack-rows">
      ${YEARS.map((y) => {
        const r = a[y] || { total: 0, Z: 0, S: 0 };
        const segs = ["Z", "S"].filter((k) => r[k]).map((k) =>
          `<span class="stack-seg" tabindex="0" style="width:${(r[k] / max) * 100}%;background:${STATUS_COLOR[k]}"
            data-tip="<b>${y} · ${k === "Z" ? "Zivilisten" : "Sicherheitskräfte"}</b>${r[k]} Tote"
            aria-label="${y}, ${k === "Z" ? "Zivilisten" : "Sicherheitskräfte"}: ${r[k]}">${r[k] / max > 0.06 ? r[k] : ""}</span>`).join("");
        return `<div class="stack-row"><span class="stack-year">${y}${y === "2023" ? "*" : y === "2026" ? "**" : ""}</span><span class="stack-track">${segs}</span><strong>${r.total}</strong></div>`;
      }).join("")}
      </div>
      <p class="chart-source">* ab 7. Oktober · ** bis ${UNTIL} · ohne Ost-Jerusalem, Allenby, Militäreinsätze und Anschläge in Israel</p>`;
    bindTips($("#isr-year-chart"));

    const tbody = $("#isr-cases tbody");
    tbody.innerHTML = isr.map((c) => {
      const names = c.victims.map((v) => `${esc(v.name)}${v.age ? ` (${v.age})` : ""}`).join("<br />");
      const statuses = [...new Set(c.victims.map((v) => v.status))];
      const statusTxt = statuses.map((s) => STATUS[s] || s).join(" / ");
      const flags = c.flags.length ? `<br /><span class="wb-flag">${esc(c.flags.join(" · "))}</span>` : "";
      return `
      <tr data-list="${c.list}" data-status="${statuses.join(" ")}">
        <td data-label="Datum / Ort"><div><strong>${fmtDate(c.date)}</strong><br />${esc(c.place)}</div></td>
        <td data-label="Getötete"><div>${names}${c.victims.length > 1 ? `<br /><span class="wb-n">${c.victims.length} Tote</span>` : ""}</div></td>
        <td data-label="Status"><div>${statusTxt}</div></td>
        <td data-label="Tat"><div>${esc(c.type)}${flags}</div></td>
        <td data-label="Täter / Ausgang"><div>${esc(c.perp)}${c.affiliation ? `<br /><i>${esc(c.affiliation)}</i>` : ""}<br />${esc(c.outcome)}</div></td>
        <td data-label="Belege"><div>${linkList(c.links)}</div></td>
      </tr>`;
    }).join("");
    const rows = [...tbody.rows];
    const filter = () => {
      const q = $("#isr-q").value.trim().toLocaleLowerCase("de");
      const list = $("#isr-list").value;
      const st = $("#isr-status").value;
      let cases = 0, dead = 0;
      rows.forEach((row, i) => {
        const show = (!q || row.textContent.toLocaleLowerCase("de").includes(q)) && (!list || row.dataset.list === list) && (!st || row.dataset.status.includes(st));
        row.hidden = !show;
        if (show) { cases += 1; dead += st ? isr[i].victims.filter((v) => v.status === st).length : isr[i].victims.length; }
      });
      $("#isr-count").textContent = `${cases} Vorfälle · ${dead} Tote`;
    };
    ["#isr-q", "#isr-list", "#isr-status"].forEach((s) => $(s).addEventListener(s === "#isr-q" ? "input" : "change", filter));
    filter();
  }

  // ---------------------------------------------------------------- kennzahlen aus den daten
  function renderStats(data) {
    const pal = data.palestinians;
    const isrA = data.israelis.filter((c) => c.list === "A").flatMap((c) => c.victims);
    const sum = (arr) => arr.reduce((t, c) => t + c.n, 0);
    const [y, m, d] = data.updated.split("-");
    const [uy, um, ud] = data.period[1].split("-");
    const months = ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"];
    UNTIL = `${+ud}. ${months[+um - 1]}`;
    const stats = {
      updated: `${d}.${m}.${y}`,
      until: `${+ud}.${+um}.${uy}`,
      "isr-total": isrA.length,
      "isr-z": isrA.filter((v) => v.status === "Z").length,
      "isr-s": isrA.filter((v) => v.status === "S").length,
      "pal-cases": pal.length,
      "pal-dead": sum(pal),
      "pal-clear": sum(pal.filter((c) => c.cat !== "U")),
      "pal-u": sum(pal.filter((c) => c.cat === "U")),
      "pal-k1": sum(pal.filter((c) => c.cat === "K1")),
      indicted: pal.filter((c) => /angeklagt/i.test(c.legal)).length,
    };
    document.querySelectorAll("[data-stat]").forEach((el) => {
      if (el.dataset.stat in stats) el.textContent = String(stats[el.dataset.stat]);
    });
  }

  // ---------------------------------------------------------------- grouped bars
  function groupedBars(el, legendEl, series) {
    legendEl.innerHTML = series.map((s) => `<li><i style="background:${s.color}"></i>${esc(s.label)}</li>`).join("");
    const max = Math.max(...series.flatMap((s) => s.values.filter((v) => v != null)));
    el.innerHTML = `<div class="gbars">${YEARS.map((y, i) => `
      <div class="gbar-group">
        <div class="gbar-cols">
          ${series.map((s) => {
            const v = s.values[i];
            const note = s.notes[i] ? ` · ${s.notes[i]}` : "";
            if (v == null) return `<span class="gbar gbar-empty" tabindex="0" data-tip="<b>${y} · ${esc(s.label)}</b>keine Zahl${note}" aria-label="${y}, ${esc(s.label)}: keine Zahl">–</span>`;
            return `<span class="gbar" tabindex="0" style="height:${(v / max) * 100}%;background:${s.color}" data-tip="<b>${y} · ${esc(s.label)}</b>${de(v)}${note}" aria-label="${y}, ${esc(s.label)}: ${de(v)}${note}"><em>${de(v)}${s.notes[i] && /Halbjahr|Aug/.test(s.notes[i]) ? "*" : ""}</em></span>`;
          }).join("")}
        </div>
        <span class="gbar-year">${y}</span>
      </div>`).join("")}</div>
      <p class="chart-source">* Teiljahr</p>`;
    bindTips(el);
  }

  // ---------------------------------------------------------------- population (unverändert)
  function renderPopulationTable() {
    $("#population-table").innerHTML = population
      .map(([year, value]) => `<tr><td>${year}</td><td>${value.toLocaleString("de-DE")}</td></tr>`)
      .join("");
  }

  function renderPopulationChart() {
    const chart = $("#population-chart");
    const mobile = window.matchMedia("(max-width: 760px)").matches;
    const width = mobile ? 390 : 900;
    const height = mobile ? 300 : 340;
    const plot = mobile ? { left: 52, right: 25, top: 42, bottom: 48 } : { left: 74, right: 25, top: 42, bottom: 52 };
    const floor = 2700000;
    const ceiling = 3500000;
    const innerWidth = width - plot.left - plot.right;
    const innerHeight = height - plot.top - plot.bottom;
    const x = (index) => plot.left + (index / (population.length - 1)) * innerWidth;
    const y = (value) => plot.top + ((ceiling - value) / (ceiling - floor)) * innerHeight;
    const baseline = height - plot.bottom;
    const points = population.map(([, value], index) => [x(index), y(value)]);
    const linePath = points.map(([px, py], i) => `${i === 0 ? "M" : "L"}${px.toFixed(1)},${py.toFixed(1)}`).join(" ");
    const areaPath = `${linePath} L${points.at(-1)[0].toFixed(1)},${baseline} L${points[0][0].toFixed(1)},${baseline} Z`;
    const ticks = [2800000, 3000000, 3200000, 3400000];
    const grid = ticks.map((tick) => {
      const tickY = y(tick);
      return `<line class="chart-grid-line" x1="${plot.left}" y1="${tickY}" x2="${width - plot.right}" y2="${tickY}" />
        <text class="chart-axis-label" x="${plot.left - (mobile ? 8 : 12)}" y="${tickY + 4}" text-anchor="end">${(tick / 1000000).toLocaleString("de-DE", { maximumFractionDigits: 1 })}${mobile ? "" : " Mio."}</text>`;
    }).join("");
    const years = population.map(([year], index) => {
      if (index % 2 !== 0 && index !== population.length - 1) return "";
      return `<text class="chart-year-label" x="${x(index)}" y="${height - 17}" text-anchor="middle">${year}</text>`;
    }).join("");
    const markers = population.map(([year, value], index) => {
      const px = x(index);
      const py = y(value);
      const labelClass = index === 0 ? " chart-label-first" : index === population.length - 1 ? " chart-label-last" : "";
      const showLabel = index === 0 || index === population.length - 1 || (!mobile && index % 2 === 0);
      const labelX = mobile && index === 0 ? px + 7 : mobile && index === population.length - 1 ? px - 2 : px;
      const anchor = mobile && index === 0 ? "start" : mobile && index === population.length - 1 ? "end" : "middle";
      const label = showLabel
        ? `<text class="chart-point-label${labelClass}" x="${labelX}" y="${py - 15}" text-anchor="${anchor}">${(value / 1000000).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</text>`
        : "";
      return `${label}<circle class="chart-point" cx="${px}" cy="${py}" r="${mobile ? 4 : 5}"><title>${year}: ${value.toLocaleString("de-DE")}</title></circle>`;
    }).join("");
    chart.innerHTML = `
      <svg viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="population-chart-title population-chart-desc">
        <title id="population-chart-title">Palästinensische Bevölkerung in Judäa und Samaria 2016 bis 2026</title>
        <desc id="population-chart-desc">Die PCBS-Reihe steigt von 2,80 Millionen im Jahr 2016 auf 3,46 Millionen in der Projektion für 2026.</desc>
        ${mobile ? '<text class="chart-unit-label" x="9" y="25">Mio.</text>' : ""}
        ${grid}
        <path class="chart-area" d="${areaPath}" />
        <path class="chart-line" d="${linePath}" />
        ${markers}
        ${years}
      </svg>`;
  }

  // ---------------------------------------------------------------- video: Hochformat auf schmalen Bildschirmen
  (function chooseVideo() {
    const v = document.getElementById("js-video");
    if (!v || !window.matchMedia("(max-width: 760px) and (orientation: portrait)").matches) return;
    v.poster = v.dataset.posterPortrait;
    v.querySelector("source").src = v.dataset.srcPortrait;
    v.classList.add("is-portrait");
    v.load();
  })();

  // ---------------------------------------------------------------- boot
  renderPopulationTable();
  renderPopulationChart();
  window.matchMedia("(max-width: 760px)").addEventListener("change", renderPopulationChart);
  groupedBars($("#settler-chart"), $("#settler-legend"), SETTLER_INC);
  groupedBars($("#attack-chart"), $("#attack-legend"), PAL_ATTACKS);

  fetch("/js/data/cases.json?v=20261004")
    .then((r) => r.json())
    .then((data) => {
      renderStats(data);
      renderCats(data.palestinians);
      renderPal(data.palestinians);
      renderIsr(data.israelis);
    })
    .catch(() => {
      $("#pal-count").textContent = "Fallliste konnte nicht geladen werden.";
    });
})();
