(() => {
  "use strict";

  // ---------------------------------------------------------------- language (/shared/biest-lang.js)
  const EN = window.BIEST_LANG === "en";
  const L = typeof window.L === "function" ? window.L : (d) => d;
  // Falltexte: englisches Parallelfeld <feld>_en, sonst Deutsch
  const tx = (o, k) => (EN && o[k + "_en"] != null && o[k + "_en"] !== "" ? o[k + "_en"] : o[k]);
  const MONTHS_EN = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const MON_EN = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  // ---------------------------------------------------------------- constants
  const CATS = {
    K1: { label: L("Anschlag gestoppt", "Attack stopped"), short: L("Anschlag", "attack"), color: "#2a6fb0", desc: L("Der Getötete verübte einen Anschlag (Schüsse, Messer, Rammen, Sprengsatz). Keine Seite bestreitet das. Notwehr ist eindeutig.", "The person killed was carrying out an attack (shooting, knife, ramming, explosive device). Neither side disputes this. Self-defence is clear-cut.") },
    K2: { label: L("Angriff behauptet, bestritten", "Attack alleged, disputed"), short: L("behauptet", "alleged"), color: "#c98a12", desc: L("Israelische Seite: Angriff mit Messer, Molotowcocktail oder bei einem Raub. Palästinensische Seite bestreitet den Angriff.", "Israeli side: attack with a knife, a Molotov cocktail or during a robbery. Palestinian side denies the attack.") },
    K3: { label: L("Konfrontation", "Confrontation"), short: L("Konfrontation", "confrontation"), color: "#7a4fa8", desc: L("Mindestens eine Seite berichtet Steinwürfe oder ein Handgemenge; der Schütze beruft sich auf Gefahr. Ob Lebensgefahr bestand, ist offen.", "At least one side reports stone-throwing or a scuffle; the shooter cites danger. Whether there was a danger to life remains open.") },
    K4: { label: L("Überfall", "Assault"), short: L("Überfall", "assault"), color: "#d6493d", desc: L("Keine Quelle, auch keine israelische, berichtet Gewalt des Getöteten. Er wurde bei einem Angriff von Siedlern getötet.", "No source, not even an Israeli one, reports violence by the person killed. The person was killed during an attack by settlers.") },
    U: { label: L("Schütze unklar", "Shooter unclear"), short: L("unklar", "unclear"), color: "#a9a49a", desc: L("Ungeklärt, ob Siedler oder Soldaten geschossen haben. Darstellungen und UN-Zuordnung widersprechen sich.", "Unresolved whether settlers or soldiers fired. The accounts and the UN attribution contradict each other.") },
  };
  const SRC = {
    A: { label: L("Israelische Behörde äußert sich", "Israeli authority has commented"), short: L("IDF/Polizei", "IDF/police"), cls: "src-a" },
    M: { label: L("Israelische Medien", "Israeli media"), short: L("israel. Medien", "Israeli media"), cls: "src-m" },
    N: { label: L("Israelische NGO", "Israeli NGO"), short: L("israel. NGO", "Israeli NGO"), cls: "src-n" },
    I: { label: L("Internationale Medien", "International media"), short: "international", cls: "src-i" },
    P: { label: L("Nur UN, palästinensische oder arabische Quellen", "UN, Palestinian or Arab sources only"), short: L("nur UN/palästinensisch", "UN/Palestinian only"), cls: "src-p" },
  };
  const SRC_ORDER = ["A", "M", "N", "I", "P"];
  const BIEST_LC = EN ? "en" : "de";
  let UNTIL = L("4. Oktober", "4 October");
  const CAT_ORDER = ["K1", "K2", "K3", "K4", "U"];
  const YEARS = ["2023", "2024", "2025", "2026"];
  const STATUS = { Z: L("Zivilist", "Civilian"), S: L("Sicherheitskraft", "Security personnel") };
  const STATUS_PL = { Z: L("Zivilisten", "Civilians"), S: L("Sicherheitskräfte", "Security personnel") };
  const DEAD = (n) => L(`${n} Tote`, `${n} dead`);
  const STATUS_COLOR = { Z: "#2a6fb0", S: "#c98a12" };

  const population = [
    [2016, 2803411], [2017, 2856691], [2018, 2921170], [2019, 2986714], [2020, 3053183], [2021, 3120448],
    [2022, 3188387], [2023, 3256906], [2024, 3325905], [2025, 3395260], [2026, 3464858],
  ];

  // Vorfälle (siehe Quellenangaben unter den Diagrammen)
  const SETTLER_INC = [
    { label: "IDF/Shin Bet", color: "#2a6fb0", values: [1045, 682, 867, 660], notes: ["ganzes Jahr", "", "", "nur 1. Halbjahr"], notes_en: ["full year", "", "", "first half only"] },
    { label: "OCHA", color: "#c98a12", values: [1291, 1449, 1828, 1600], notes: ["ganzes Jahr", "", "", "Jan.–Aug., „über 1.600“"], notes_en: ["full year", "", "", "Jan–Aug, ‘over 1,600’"] },
  ];
  const PAL_ATTACKS = [
    { label: L("IDF „Terroranschläge“", "IDF ‘terror attacks’"), color: "#2a6fb0", values: [847, 258, 57, null], notes: ["", "", "", "keine Jahreszahl"], notes_en: ["", "", "", "no annual figure"] },
    { label: L("Shin Bet „bedeutende Anschläge“", "Shin Bet ‘significant attacks’"), color: "#c98a12", values: [414, null, 68, 21], notes: ["", "nicht belegt", "", "nur 1. Halbjahr"], notes_en: ["", "not documented", "", "first half only"] },
  ];

  // ---------------------------------------------------------------- helpers
  const $ = (s) => document.querySelector(s);
  const esc = (s) => String(s ?? "").replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
  const NUM_LOCALE = EN ? "en-GB" : "de-DE";
  const de = (v) => v.toLocaleString(NUM_LOCALE);
  const fmtDate = (iso) => { const [y, m, d] = iso.split("-"); return EN ? `${+d} ${MON_EN[+m - 1]} ${y}` : `${+d}.${+m}.${y}`; };
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
    "nbcnews.com": "NBC", "abc17news.com": L("CNN (Syndikation)", "CNN (syndication)"), "arabnews.com": "Arab News", "gulfnews.com": "Gulf News", "stgmobile.jpost.com": "Jerusalem Post",
  };
  const hostLabel = (url) => {
    try {
      const h = new URL(url).hostname.replace(/^www\./, "");
      return HOSTS[h] || h;
    } catch { return L("Quelle", "Source"); }
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
            data-tip="<b>${y} · ${CATS[k].label}</b>${r[k]} ${r[k] === 1 ? L("Toter", "dead") : L("Tote", "dead")}"
            aria-label="${y}, ${CATS[k].label}: ${r[k]}">${r[k] / max > 0.045 ? r[k] : ""}</span>`).join("");
        return `<div class="stack-row"><span class="stack-year">${y}${y === "2023" ? "*" : y === "2026" ? "**" : ""}</span><span class="stack-track">${segs}</span><strong>${sum}</strong></div>`;
      }).join("")}
      </div>
      <p class="chart-source">${L(`* ab 7. Oktober · ** bis ${UNTIL}`, `* from 7 October · ** to ${UNTIL}`)}</p>`;
    bindTips($("#cat-year-chart"));
  }

  // ---------------------------------------------------------------- palestinian cases
  function renderPal(pal) {
    const sel = $("#pal-cat");
    sel.insertAdjacentHTML("beforeend", CAT_ORDER.map((k) => `<option value="${k}">${CATS[k].label}</option>`).join(""));
    const tbody = $("#pal-cases tbody");
    tbody.innerHTML = pal.map((c) => `
      <tr data-cat="${c.cat}" data-year="${c.date.slice(0, 4)}" data-src="${c.src}" class="${c.src === "P" ? "row-weak" : ""}">
        <td data-label="${L("Datum / Ort", "Date / place")}"><div><strong>${fmtDate(c.date)}</strong><br />${esc(tx(c, "place"))}</div></td>
        <td data-label="${L("Getötete", "Killed")}"><div>${esc(tx(c, "victims"))}${c.n > 1 ? `<br /><span class="wb-n">${DEAD(c.n)}</span>` : ""}</div></td>
        <td data-label="${L("Kategorie", "Category")}"><div><span class="cat-badge" style="--cat:${CATS[c.cat].color}">${CATS[c.cat].label}</span></div></td>
        <td data-label="${L("Hergang", "What happened")}"><div>${esc(tx(c, "context"))}</div></td>
        <td data-label="${L("Schütze / Verfahren", "Shooter / proceedings")}"><div><b>${esc(tx(c, "shooter"))}</b><br />${esc(tx(c, "legal"))}</div></td>
        <td data-label="${L("Belege", "Sources")}"><div><span class="src-badge ${SRC[c.src].cls}" title="${SRC[c.src].label}">${SRC[c.src].short}</span><br />${linkList(c.links)}</div></td>
      </tr>`).join("");
    const rows = [...tbody.rows];
    const filter = () => {
      const q = $("#pal-q").value.trim().toLocaleLowerCase(BIEST_LC);
      const cat = sel.value;
      const year = $("#pal-year").value;
      const src = $("#pal-src").value;
      let cases = 0, dead = 0;
      rows.forEach((row, i) => {
        const show = (!q || row.textContent.toLocaleLowerCase(BIEST_LC).includes(q)) && (!cat || row.dataset.cat === cat) && (!year || row.dataset.year === year) && (!src || (src === "IL" ? "AMN".includes(row.dataset.src) : row.dataset.src === src));
        row.hidden = !show;
        if (show) { cases += 1; dead += pal[i].n; }
      });
      $("#pal-count").textContent = L(`${cases} von ${rows.length} Vorfällen · ${dead} Tote`, `${cases} of ${rows.length} incidents · ${dead} dead`);
    };
    ["#pal-q", "#pal-cat", "#pal-year", "#pal-src"].forEach((s) => $(s).addEventListener(s === "#pal-q" ? "input" : "change", filter));
    filter();

    const tot = Object.fromEntries(SRC_ORDER.map((k) => [k, { f: 0, t: 0 }]));
    pal.forEach((c) => { tot[c.src].f += 1; tot[c.src].t += c.n; });
    $("#src-summary").innerHTML = SRC_ORDER.map((k) =>
      `<li><span class="src-badge ${SRC[k].cls}">${SRC[k].short}</span> ${SRC[k].label}: <b>${L(`${tot[k].f} Vorfälle, ${tot[k].t} Tote`, `${tot[k].f} ${tot[k].f === 1 ? "incident" : "incidents"}, ${tot[k].t} dead`)}</b></li>`).join("");
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
      <ul class="wb-legend"><li><i style="background:${STATUS_COLOR.Z}"></i>${STATUS_PL.Z}</li><li><i style="background:${STATUS_COLOR.S}"></i>${STATUS_PL.S}</li></ul>
      <div class="stack-rows">
      ${YEARS.map((y) => {
        const r = a[y] || { total: 0, Z: 0, S: 0 };
        const segs = ["Z", "S"].filter((k) => r[k]).map((k) =>
          `<span class="stack-seg" tabindex="0" style="width:${(r[k] / max) * 100}%;background:${STATUS_COLOR[k]}"
            data-tip="<b>${y} · ${STATUS_PL[k]}</b>${DEAD(r[k])}"
            aria-label="${y}, ${STATUS_PL[k]}: ${r[k]}">${r[k] / max > 0.06 ? r[k] : ""}</span>`).join("");
        return `<div class="stack-row"><span class="stack-year">${y}${y === "2023" ? "*" : y === "2026" ? "**" : ""}</span><span class="stack-track">${segs}</span><strong>${r.total}</strong></div>`;
      }).join("")}
      </div>
      <p class="chart-source">${L(`* ab 7. Oktober · ** bis ${UNTIL} · ohne Ost-Jerusalem, Allenby, Militäreinsätze und Anschläge in Israel`, `* from 7 October · ** to ${UNTIL} · excluding East Jerusalem, Allenby, military operations and attacks inside Israel`)}</p>`;
    bindTips($("#isr-year-chart"));

    const tbody = $("#isr-cases tbody");
    tbody.innerHTML = isr.map((c) => {
      const names = c.victims.map((v) => `${esc(tx(v, "name"))}${v.age ? ` (${esc(tx(v, "age"))})` : ""}`).join("<br />");
      const statuses = [...new Set(c.victims.map((v) => v.status))];
      const statusTxt = statuses.map((s) => STATUS[s] || s).join(" / ");
      const flagTxt = c.flags.map((f, i) => (EN && Array.isArray(c.flags_en) && c.flags_en[i]) || f);
      const flags = c.flags.length ? `<br /><span class="wb-flag">${esc(flagTxt.join(" · "))}</span>` : "";
      return `
      <tr data-list="${c.list}" data-status="${statuses.join(" ")}">
        <td data-label="${L("Datum / Ort", "Date / place")}"><div><strong>${fmtDate(c.date)}</strong><br />${esc(tx(c, "place"))}</div></td>
        <td data-label="${L("Getötete", "Killed")}"><div>${names}${c.victims.length > 1 ? `<br /><span class="wb-n">${DEAD(c.victims.length)}</span>` : ""}</div></td>
        <td data-label="Status"><div>${statusTxt}</div></td>
        <td data-label="${L("Tat", "Attack")}"><div>${esc(tx(c, "type"))}${flags}</div></td>
        <td data-label="${L("Täter / Ausgang", "Perpetrator / outcome")}"><div>${esc(tx(c, "perp"))}${c.affiliation ? `<br /><i>${esc(tx(c, "affiliation"))}</i>` : ""}<br />${esc(tx(c, "outcome"))}</div></td>
        <td data-label="${L("Belege", "Sources")}"><div>${linkList(c.links)}</div></td>
      </tr>`;
    }).join("");
    const rows = [...tbody.rows];
    const filter = () => {
      const q = $("#isr-q").value.trim().toLocaleLowerCase(BIEST_LC);
      const list = $("#isr-list").value;
      const st = $("#isr-status").value;
      let cases = 0, dead = 0;
      rows.forEach((row, i) => {
        const show = (!q || row.textContent.toLocaleLowerCase(BIEST_LC).includes(q)) && (!list || row.dataset.list === list) && (!st || row.dataset.status.includes(st));
        row.hidden = !show;
        if (show) { cases += 1; dead += st ? isr[i].victims.filter((v) => v.status === st).length : isr[i].victims.length; }
      });
      $("#isr-count").textContent = L(`${cases} Vorfälle · ${dead} Tote`, `${cases} ${cases === 1 ? "incident" : "incidents"} · ${dead} dead`);
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
    UNTIL = EN ? `${+ud} ${MONTHS_EN[+um - 1]}` : `${+ud}. ${months[+um - 1]}`;
    const stats = {
      updated: EN ? `${+d} ${MON_EN[+m - 1]} ${y}` : `${d}.${m}.${y}`,
      until: EN ? `${+ud} ${MON_EN[+um - 1]} ${uy}` : `${+ud}.${+um}.${uy}`,
      "isr-total": isrA.length,
      "isr-z": isrA.filter((v) => v.status === "Z").length,
      "isr-s": isrA.filter((v) => v.status === "S").length,
      "pal-cases": pal.length,
      "pal-dead": sum(pal),
      "pal-clear": sum(pal.filter((c) => c.cat !== "U")),
      "pal-u": sum(pal.filter((c) => c.cat === "U")),
      "pal-k1": sum(pal.filter((c) => c.cat === "K1")),
      indicted: pal.filter((c) => /angeklagt/i.test(c.legal)).length, // deutsches Feld ist maßgeblich
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
            const noteTxt = EN && s.notes_en ? s.notes_en[i] : s.notes[i];
            const note = noteTxt ? ` · ${noteTxt}` : "";
            if (v == null) return `<span class="gbar gbar-empty" tabindex="0" data-tip="<b>${y} · ${esc(s.label)}</b>${L("keine Zahl", "no figure")}${note}" aria-label="${y}, ${esc(s.label)}: ${L("keine Zahl", "no figure")}">–</span>`;
            return `<span class="gbar" tabindex="0" style="height:${(v / max) * 100}%;background:${s.color}" data-tip="<b>${y} · ${esc(s.label)}</b>${de(v)}${note}" aria-label="${y}, ${esc(s.label)}: ${de(v)}${note}"><em>${de(v)}${s.notes[i] && /Halbjahr|Aug/.test(s.notes[i]) ? "*" : ""}</em></span>`;
          }).join("")}
        </div>
        <span class="gbar-year">${y}</span>
      </div>`).join("")}</div>
      <p class="chart-source">${L("* Teiljahr", "* part of year")}</p>`;
    bindTips(el);
  }

  // ---------------------------------------------------------------- population (unverändert)
  function renderPopulationTable() {
    $("#population-table").innerHTML = population
      .map(([year, value]) => `<tr><td>${year}</td><td>${value.toLocaleString(NUM_LOCALE)}</td></tr>`)
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
        <text class="chart-axis-label" x="${plot.left - (mobile ? 8 : 12)}" y="${tickY + 4}" text-anchor="end">${(tick / 1000000).toLocaleString(NUM_LOCALE, { maximumFractionDigits: 1 })}${mobile ? "" : L(" Mio.", "m")}</text>`;
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
        ? `<text class="chart-point-label${labelClass}" x="${labelX}" y="${py - 15}" text-anchor="${anchor}">${(value / 1000000).toLocaleString(NUM_LOCALE, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</text>`
        : "";
      return `${label}<circle class="chart-point" cx="${px}" cy="${py}" r="${mobile ? 4 : 5}"><title>${year}: ${value.toLocaleString(NUM_LOCALE)}</title></circle>`;
    }).join("");
    chart.innerHTML = `
      <svg viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="population-chart-title population-chart-desc">
        <title id="population-chart-title">${L("Palästinensische Bevölkerung in Judäa und Samaria 2016 bis 2026", "Palestinian population in Judea and Samaria, 2016 to 2026")}</title>
        <desc id="population-chart-desc">${L("Die PCBS-Reihe steigt von 2,80 Millionen im Jahr 2016 auf 3,46 Millionen in der Projektion für 2026.", "The PCBS series rises from 2.80 million in 2016 to 3.46 million in the projection for 2026.")}</desc>
        ${mobile ? `<text class="chart-unit-label" x="9" y="25">${L("Mio.", "million")}</text>` : ""}
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

  // ---------------------------------------------------------------- video: englische Untertitel (Sprecherstimme bleibt deutsch)
  (function englishSubtitles() {
    const v = document.getElementById("js-video");
    if (!v || !EN) return;
    const t = document.createElement("track");
    t.kind = "subtitles";
    t.srclang = "en";
    t.label = "English";
    t.src = "/js/video/untertitel_en.vtt?v=20261008";
    v.insertBefore(t, v.querySelector("track"));
    [...v.textTracks].forEach((tt) => { tt.mode = tt.language === "en" ? "showing" : "disabled"; });
    // Chromium schaltet bei der automatischen Spurwahl zusätzlich die deutsche Spur ein; zwei gleichzeitig
    // sichtbare Spuren kann das Video-Menü nicht erzeugen, eine Auswahl der Nutzer bleibt also unberührt
    v.textTracks.addEventListener("change", () => {
      const tr = [...v.textTracks];
      if (tr.filter((tt) => tt.mode === "showing").length > 1) tr.forEach((tt) => { if (tt.language !== "en") tt.mode = "disabled"; });
    });
  })();

  // ---------------------------------------------------------------- boot
  renderPopulationTable();
  renderPopulationChart();
  window.matchMedia("(max-width: 760px)").addEventListener("change", renderPopulationChart);
  groupedBars($("#settler-chart"), $("#settler-legend"), SETTLER_INC);
  groupedBars($("#attack-chart"), $("#attack-legend"), PAL_ATTACKS);

  fetch("/js/data/cases.json?v=20261008")
    .then((r) => r.json())
    .then((data) => {
      renderStats(data);
      renderCats(data.palestinians);
      renderPal(data.palestinians);
      renderIsr(data.israelis);
    })
    .catch(() => {
      $("#pal-count").textContent = L("Fallliste konnte nicht geladen werden.", "Case list could not be loaded.");
    });
})();
