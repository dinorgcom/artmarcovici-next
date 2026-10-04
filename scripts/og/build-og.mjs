// Erzeugt die Share-Vorschaubilder (1200×630) der Dossiers aus deren echten Daten.
// Ablauf: Daten lesen → HTML mit Inline-SVG je Dossier → Chrome headless Screenshot → JPEG (sharp) nach public/og/.
// Aufruf:  node scripts/og/build-og.mjs [slug …]      (ohne Argument: alle)
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import vm from "node:vm";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const PUB = path.join(ROOT, "public");
const OUT = path.join(PUB, "og");
const TMP = fs.mkdtempSync(path.join(os.tmpdir(), "biest-og-"));
const require = createRequire(import.meta.url);
const sharp = require(fs.existsSync(path.join(ROOT, "node_modules/sharp")) ? "sharp"
  : path.join(ROOT, "../artmarcovici-next/node_modules/sharp"));
const CHROME = ["C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe", "/usr/bin/google-chrome"].find((p) => fs.existsSync(p));

const W = 1200, H = 630;
const nf = (n, d = 0) => n.toLocaleString("de-AT", { minimumFractionDigits: d, maximumFractionDigits: d });
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const read = (p) => fs.readFileSync(path.join(PUB, p), "utf8");
// window.X = …-Dateien auswerten
function windowVars(file) {
  const ctx = { window: {} };
  vm.runInNewContext(read(file), ctx);
  return ctx.window;
}
// Farbskala blau → hell → rot für t ∈ [0,1]
function diverge(t) {
  const stops = [[0, [33, 102, 172]], [0.25, [103, 169, 207]], [0.5, [247, 247, 247]], [0.75, [239, 138, 98]], [1, [178, 24, 43]]];
  t = Math.max(0, Math.min(1, t));
  for (let i = 1; i < stops.length; i++) {
    if (t <= stops[i][0]) {
      const [t0, c0] = stops[i - 1], [t1, c1] = stops[i], k = (t - t0) / (t1 - t0);
      return `rgb(${c0.map((c, j) => Math.round(c + (c1[j] - c) * k)).join(",")})`;
    }
  }
  return "rgb(178,24,43)";
}

// ------------------------------------------------------------------ Rahmen
function frame({ kicker, title, sub, chart, url, source, accent }) {
  return `<!doctype html><html lang="de"><head><meta charset="utf-8">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@600&display=block" rel="stylesheet">
<style>
*{box-sizing:border-box;margin:0;padding:0}
html,body{width:${W}px;height:${H}px;overflow:hidden}
body{background:#f7f5f0;color:#1a1a18;font-family:Inter,"Segoe UI",Arial,sans-serif;position:relative}
.grid{position:absolute;inset:0;background-image:linear-gradient(#e6e2d9 1px,transparent 1px),linear-gradient(90deg,#e6e2d9 1px,transparent 1px);background-size:30px 30px;opacity:.55}
.page{position:absolute;inset:34px 44px;border:1px solid #cfc9bd;background:rgba(247,245,240,.9)}
.top{position:absolute;left:36px;right:36px;top:26px;display:flex;align-items:baseline;justify-content:space-between}
.brand{display:flex;align-items:baseline;gap:12px}
.brand b{font-family:"Playfair Display",Georgia,serif;font-weight:600;font-size:25px;letter-spacing:.08em;color:#dc2626}
.brand i{font-style:normal;font-size:12px;font-weight:600;letter-spacing:.2em;text-transform:uppercase;color:#77736a;padding-left:12px;border-left:1px solid #a8a296}
.kicker{font-size:13px;font-weight:600;letter-spacing:.16em;text-transform:uppercase;color:${accent}}
.text{position:absolute;left:36px;top:92px;width:440px}
h1{font-family:"Playfair Display",Georgia,serif;font-weight:600;font-size:${title.length > 34 ? 46 : 54}px;line-height:1.04;letter-spacing:-.01em;color:#141413}
.rule{width:64px;height:3px;background:${accent};margin:26px 0 22px}
p.sub{font-size:20px;line-height:1.42;color:#3e3c37}
.chart{position:absolute;right:30px;top:84px;width:590px;height:380px}
.foot{position:absolute;left:36px;right:36px;bottom:22px;display:flex;justify-content:space-between;align-items:baseline;border-top:1px solid #cfc9bd;padding-top:14px}
.url{font-size:19px;font-weight:600;color:#1a1a18;letter-spacing:.01em}
.src{font-size:13px;color:#77736a}
svg text{font-family:Inter,"Segoe UI",Arial,sans-serif}
</style></head><body><div class="grid"></div><div class="page">
<div class="top"><div class="brand"><b>BIEST.COM</b><i>Dossier</i></div><div class="kicker">${esc(kicker)}</div></div>
<div class="text"><h1>${title}</h1><div class="rule"></div><p class="sub">${sub}</p></div>
<div class="chart">${chart}</div>
<div class="foot"><div class="url">${esc(url)}</div><div class="src">${esc(source)}</div></div>
</div></body></html>`;
}

// Horizontale Balken (optional zweigeteilt)
function hbars(rows, { cw = 590, ch = 380, color, color2, labelW = 230, fmt = (v) => nf(v), note }) {
  const max = Math.max(...rows.map((r) => r.v));
  const rowH = Math.min(rows.length <= 4 ? 74 : 46, (ch - (note ? 30 : 6)) / rows.length);
  const bw = cw - labelW - 70;
  let s = `<svg width="${cw}" height="${ch}" viewBox="0 0 ${cw} ${ch}">`;
  rows.forEach((r, i) => {
    const y = i * rowH, w = (r.v / max) * bw, w2 = r.v2 != null ? (r.v2 / max) * bw : 0;
    s += `<text x="${labelW - 14}" y="${y + rowH / 2 + 6}" text-anchor="end" font-size="16" fill="#2b2a26">${esc(r.label)}</text>`;
    s += `<rect x="${labelW}" y="${y + rowH * 0.2}" width="${w.toFixed(1)}" height="${(rowH * 0.6).toFixed(1)}" fill="${color}"/>`;
    if (w2) s += `<rect x="${labelW}" y="${y + rowH * 0.2}" width="${w2.toFixed(1)}" height="${(rowH * 0.6).toFixed(1)}" fill="${color2}"/>`;
    s += `<text x="${labelW + w + 10}" y="${y + rowH / 2 + 6}" font-size="16" font-weight="600" fill="#1a1a18">${fmt(r.v)}</text>`;
  });
  s += `<line x1="${labelW}" y1="0" x2="${labelW}" y2="${rows.length * rowH}" stroke="#1a1a18" stroke-width="1"/>`;
  if (note) s += `<text x="${cw}" y="${ch - 6}" text-anchor="end" font-size="13" fill="#77736a">${note}</text>`;
  return s + "</svg>";
}

// ------------------------------------------------------------------ Dossiers
const dossiers = {
  femizide() {
    const js = fs.readdirSync(path.join(PUB, "femizide/assets")).find((f) => /^index-.*\.js$/.test(f));
    const src = read("femizide/assets/" + js);
    const counts = {};
    for (const m of src.matchAll(/year:(20\d\d)\}/g)) counts[m[1]] = (counts[m[1]] || 0) + 1;
    const dates = [...src.matchAll(/date:"(20\d\d-\d\d-\d\d)"/g)].map((m) => m[1]).sort();
    const last = dates[dates.length - 1];
    const years = Object.keys(counts).sort();
    const total = years.reduce((a, y) => a + counts[y], 0);
    const cw = 590, ch = 380, max = Math.max(...Object.values(counts)), bw = cw / years.length;
    let svg = `<svg width="${cw}" height="${ch}" viewBox="0 0 ${cw} ${ch}">`;
    years.forEach((y, i) => {
      const h = (counts[y] / max) * 270, x = i * bw + 10, partial = y === last.slice(0, 4);
      svg += `<rect x="${x}" y="${330 - h}" width="${bw - 20}" height="${h}" fill="${partial ? "none" : "#8c1d40"}" stroke="#8c1d40" stroke-width="${partial ? 1.5 : 0}" ${partial ? 'stroke-dasharray="5 4"' : ""}/>`;
      svg += `<text x="${x + (bw - 20) / 2}" y="${322 - h}" text-anchor="middle" font-size="22" font-weight="700" fill="#1a1a18">${counts[y]}</text>`;
      svg += `<text x="${x + (bw - 20) / 2}" y="356" text-anchor="middle" font-size="15" fill="#3e3c37">${y}</text>`;
    });
    const d = new Date(last);
    svg += `<line x1="0" y1="330.5" x2="${cw}" y2="330.5" stroke="#1a1a18"/>`;
    svg += `<text x="${cw - 4}" y="${ch - 2}" text-anchor="end" font-size="13" fill="#77736a">dokumentierte Fälle pro Jahr · ${last.slice(0, 4)} bis ${d.getDate()}.${d.getMonth() + 1}.</text></svg>`;
    return {
      file: "og-femizide.jpg", accent: "#8c1d40",
      kicker: `Falldatenbank · ${years[0]}–${years[years.length - 1]}`,
      title: "Femizide in Österreich",
      sub: `${nf(total)} dokumentierte Fälle – Opfer, Täter, Motive, Verfahren und Quellen. Mit Karte und Rückblick bis 1970.`,
      url: "biest.com/femizide", source: "Quellen: AÖF-Zählung, Medienberichte",
      chart: svg,
      alt: `Balkendiagramm der dokumentierten Femizide in Österreich pro Jahr, ${years[0]} bis ${years[years.length - 1]}`,
    };
  },

  mortality() {
    const d = JSON.parse(read("mortality/data/mortality.json"));
    const i = d.years.length - 1, S = d.series.all.absolute, year = d.years[i];
    const short = { "Krankheiten des Herz-Kreislauf-Systems": "Herz-Kreislauf", "Neubildungen": "Krebs (Neubildungen)",
      "Krankheiten der Atmungsorgane": "Atmungsorgane", "Verletzungen und Vergiftungen": "Verletzungen, Vergiftungen",
      "Psychische Krankheiten": "Psychische Krankheiten", "Endokrine, Ernährungs- und Stoffwechselkrankheiten": "Stoffwechsel",
      "Krankheiten des Nervensystems und der Sinnesorgane": "Nervensystem", "Krankheiten der Verdauungsorgane": "Verdauungsorgane" };
    const rows = d.causes.filter((c) => c.isBroad && short[c.name]).map((c) => ({ label: short[c.name], v: S[c.id][i] }))
      .sort((a, b) => b.v - a.v).slice(0, 7);
    return {
      file: "og-mortality.jpg", accent: "#b3261e",
      kicker: `Todesursachen · ${d.years[0]}–${year}`,
      title: "Woran Österreich stirbt",
      sub: `${nf(S.all[i])} Sterbefälle im Jahr ${year}. ${d.years.length} Jahre amtliche Daten nach Ursache, Alter und Geschlecht.`,
      url: "biest.com/mortality", source: "Daten: Statistik Austria",
      chart: hbars(rows, { color: "#b3261e", note: `Sterbefälle ${year} nach Todesursachengruppe` }),
      alt: `Häufigste Todesursachen in Österreich ${year}: Herz-Kreislauf vor Krebs`,
    };
  },

  "mortality-weekly"() {
    const d = JSON.parse(read("mortality/data/mortality.json"));
    const pts = d.weeklyDeaths.points.filter((p) => p.total != null);
    const cw = 590, ch = 380, top = 10, bottom = 250, n = pts.length;
    const vals = pts.map((p) => p.total), lo = Math.min(...vals) * 0.95, hi = Math.max(...vals) * 1.02;
    const x = (k) => (k / (n - 1)) * cw, y = (v) => bottom - ((v - lo) / (hi - lo)) * (bottom - top);
    const line = pts.map((p, k) => `${k ? "L" : "M"}${x(k).toFixed(1)},${y(p.total).toFixed(1)}`).join("");
    const temps = pts.map((p) => p.weather?.temperatureMean).filter((t) => t != null);
    const tlo = Math.min(...temps), thi = Math.max(...temps);
    let svg = `<svg width="${cw}" height="${ch}" viewBox="0 0 ${cw} ${ch}">`;
    const sw = cw / n + 0.6;
    pts.forEach((p, k) => {
      const t = p.weather?.temperatureMean;
      if (t != null) svg += `<rect x="${x(k).toFixed(1)}" y="272" width="${sw.toFixed(2)}" height="52" fill="${diverge((t - tlo) / (thi - tlo))}"/>`;
    });
    svg += `<path d="${line}" fill="none" stroke="#1a1a18" stroke-width="1.6" stroke-linejoin="round"/>`;
    const peak = pts.reduce((a, p) => (p.total > a.total ? p : a));
    const pk = pts.indexOf(peak);
    svg += `<circle cx="${x(pk)}" cy="${y(peak.total)}" r="4" fill="#b3261e"/><text x="${x(pk) + 10}" y="${y(peak.total) + 5}" font-size="14" fill="#b3261e" font-weight="600">${nf(peak.total)} Tote · KW ${peak.week}/${peak.year}</text>`;
    const y0 = pts[0].year, y1 = pts[n - 1].year;
    for (let yy = y0; yy <= y1; yy += 2) {
      const k = pts.findIndex((p) => p.year === yy);
      if (k >= 0 && x(k) < cw - 40) svg += `<text x="${x(k).toFixed(1)}" y="344" font-size="13" fill="#3e3c37">${yy}</text>`;
    }
    svg += `<text x="0" y="370" font-size="13" fill="#77736a">Sterbefälle pro Woche (Linie) · Wochenmitteltemperatur: kalt</text>`;
    svg += `<rect x="402" y="360" width="60" height="10" fill="url(#g)"/><text x="468" y="370" font-size="13" fill="#77736a">heiß</text>`;
    svg += `<defs><linearGradient id="g"><stop offset="0" stop-color="${diverge(0)}"/><stop offset=".5" stop-color="${diverge(.5)}"/><stop offset="1" stop-color="${diverge(1)}"/></linearGradient></defs></svg>`;
    const last = pts[n - 1];
    return {
      file: "og-mortality-weekly.jpg", accent: "#b3261e",
      kicker: `Wochen & Wetter · ${y0}–${y1}`,
      title: "Sterblichkeit trifft Wetter",
      sub: `${nf(n)} Kalenderwochen: registrierte Sterbefälle neben Temperatur, Niederschlag und Sonnenschein – bis KW ${last.week}/${last.year}.`,
      url: "biest.com/mortality/weekly.html", source: "Daten: Statistik Austria, GeoSphere Austria",
      chart: svg,
      alt: `Wöchentliche Sterbefälle in Österreich ${y0} bis ${y1} über einem Streifen der Wochentemperaturen`,
    };
  },

  wien() {
    const w = windowVars("wien-sonne-temperatur/annual-index-data.js");
    const rows = w.VIENNA_ANNUAL_TEMPERATURE_SUMS;
    const recent = windowVars("wien-sonne-temperatur/recent-data.js");
    const vals = rows.map((r) => r[1]).sort((a, b) => a - b);
    const lo = vals[Math.floor(vals.length * 0.03)], hi = vals[Math.floor(vals.length * 0.97)];
    const cw = 590, ch = 380, sw = cw / rows.length;
    let svg = `<svg width="${cw}" height="${ch}" viewBox="0 0 ${cw} ${ch}">`;
    rows.forEach(([yr, v], k) => {
      svg += `<rect x="${(k * sw).toFixed(2)}" y="0" width="${(sw + 0.5).toFixed(2)}" height="320" fill="${diverge((v - lo) / (hi - lo))}"/>`;
    });
    for (const yy of [1880, 1920, 1960, 2000, rows[rows.length - 1][0]]) {
      const k = rows.findIndex((r) => r[0] === yy);
      svg += `<text x="${(k * sw).toFixed(1)}" y="344" font-size="14" fill="#3e3c37" ${yy > 2020 ? 'text-anchor="end" dx="' + sw + '"' : ""}>${yy}</text>`;
    }
    svg += `<text x="0" y="370" font-size="13" fill="#77736a">Jeder Streifen ein Jahr · Summe der Tageshöchsttemperaturen, kühl → warm</text></svg>`;
    const upd = recent.VIENNA_RECENT_DAILY.filter((r) => r[1] != null).pop()[0];
    const [uy, um, ud] = upd.split("-").map(Number);
    const months = ["Jän.", "Feb.", "März", "Apr.", "Mai", "Juni", "Juli", "Aug.", "Sept.", "Okt.", "Nov.", "Dez."];
    return {
      file: "og-wien-sonne-temperatur.jpg", accent: "#c2410c",
      kicker: `Wien, Hohe Warte · ${rows[0][0]}–${rows[rows.length - 1][0]}`,
      title: `${rows.length} Jahre Sonne &amp; Temperatur in Wien`,
      sub: `Tägliche Messungen seit ${rows[0][0]}: Sonnenstunden, Höchstwerte und ihr Verhältnis – Tageswerte bis ${ud}. ${months[um - 1]} ${uy}.`,
      url: "biest.com/wien-sonne-temperatur", source: "Daten: GeoSphere Austria, NOAA",
      chart: svg,
      alt: `Wärmestreifen für Wien ${rows[0][0]} bis ${rows[rows.length - 1][0]}: jedes Jahr ein Streifen von blau (kühl) bis rot (warm)`,
    };
  },

  js() {
    // Fälle aus public/js/data/cases.json; Kategorien und Farben wie in public/js/app.js
    const data = JSON.parse(read("js/data/cases.json"));
    const app = read("js/app.js");
    const cats = Object.fromEntries([...app.matchAll(/(K1|K2|K3|K4|U): \{ label: "([^"]+)", short: "([^"]+)", color: "(#[0-9a-fA-F]+)"/g)]
      .map((m) => [m[1], { label: m[2], color: m[4] }]));
    const order = ["K1", "K2", "K3", "K4", "U"];
    const pal = Object.fromEntries(order.map((k) => [k, 0]));
    for (const c of data.palestinians) pal[c.cat] = (pal[c.cat] || 0) + c.n;
    const palTotal = order.reduce((a, k) => a + pal[k], 0);
    const isr = data.israelis.filter((c) => c.list === "A").flatMap((c) => c.victims);
    const isrZ = isr.filter((v) => v.status === "Z").length, isrS = isr.length - isrZ;
    const cw = 590, ch = 380, bw = 520, unit = bw / Math.max(palTotal, isr.length);
    let svg = `<svg width="${cw}" height="${ch}" viewBox="0 0 ${cw} ${ch}">`;
    // Israelis
    svg += `<text x="0" y="22" font-size="16" fill="#2b2a26">Israelis bei Anschlägen getötet</text>`;
    svg += `<rect x="0" y="34" width="${(isrZ * unit).toFixed(1)}" height="46" fill="#1f2a44"/>`;
    svg += `<rect x="${(isrZ * unit).toFixed(1)}" y="34" width="${(isrS * unit).toFixed(1)}" height="46" fill="#55617d"/>`;
    svg += `<text x="${(isr.length * unit + 10).toFixed(1)}" y="65" font-size="22" font-weight="700" fill="#1a1a18">${isr.length}</text>`;
    svg += `<rect x="0" y="92" width="12" height="12" fill="#1f2a44"/><text x="18" y="103" font-size="13.5" fill="#2b2a26">${isrZ} Zivilisten</text><rect x="120" y="92" width="12" height="12" fill="#55617d"/><text x="138" y="103" font-size="13.5" fill="#2b2a26">${isrS} Sicherheitskräfte</text>`;
    // Palästinenser nach Kategorie
    svg += `<text x="0" y="152" font-size="16" fill="#2b2a26">Palästinenser von israelischen Zivilisten getötet</text>`;
    let x = 0;
    for (const k of order) {
      const w = pal[k] * unit;
      svg += `<rect x="${x.toFixed(1)}" y="164" width="${w.toFixed(1)}" height="46" fill="${cats[k]?.color || "#999"}"/>`;
      if (w > 22) svg += `<text x="${(x + w / 2).toFixed(1)}" y="193" text-anchor="middle" font-size="14" font-weight="700" fill="#fff">${pal[k]}</text>`;
      x += w;
    }
    svg += `<text x="${(x + 10).toFixed(1)}" y="195" font-size="22" font-weight="700" fill="#1a1a18">${palTotal}</text>`;
    order.forEach((k, i) => {
      const lx = (i % 2) * 290, ly = 238 + Math.floor(i / 2) * 25;
      svg += `<rect x="${lx}" y="${ly}" width="12" height="12" fill="${cats[k]?.color}"/><text x="${lx + 18}" y="${ly + 11}" font-size="13.5" fill="#2b2a26">${esc(cats[k]?.label || k)}</text>`;
    });
    const [y0, y1] = data.period.map((d) => d.split("-").reverse().map(Number).join("."));
    svg += `<text x="0" y="${ch - 8}" font-size="13" fill="#77736a">${y0} bis ${y1} · ohne Ost-Jerusalem</text></svg>`;
    return {
      file: "og-js.jpg", accent: "#2a6fb0",
      kicker: "Judäa und Samaria · 2023–2026",
      title: "Getötet in Judäa und Samaria",
      sub: "Angriff, Notwehr, Überfall: jede Tötung zwischen israelischen Zivilisten und Palästinensern seit dem 7. Oktober 2023, Fall für Fall.",
      url: "biest.com/js", source: "Quellen: israelische, palästinensische, UN-Angaben",
      chart: svg,
      alt: `Getötete in Judäa und Samaria seit 7.10.2023: ${isr.length} Israelis bei Anschlägen, ${palTotal} Palästinenser durch israelische Zivilisten, nach Angriff, Notwehr und Überfall eingeordnet`,
    };
  },

  frankreich() {
    const src = read("frankreich-bildung/app.js");
    const real = vm.runInNewContext("(" + src.match(/const REAL = (\{[\s\S]*?\});/)[1] + ")");
    const pisa = vm.runInNewContext("(" + src.match(/const PISA = (\{[\s\S]*?\n  \});/)[1] + ")");
    const years = real.all.map((_, i) => 1980 + i);
    const cw = 590, ch = 380, L = 54, R = cw - 54, T = 20, B = 300;
    const x = (yr) => L + ((yr - 1980) / (years[years.length - 1] - 1980)) * (R - L);
    const eMin = 5000, eMax = 12000, yE = (v) => B - ((v - eMin) / (eMax - eMin)) * (B - T);
    const pMin = 450, pMax = 520, yP = (v) => B - ((v - pMin) / (pMax - pMin)) * (B - T);
    let svg = `<svg width="${cw}" height="${ch}" viewBox="0 0 ${cw} ${ch}">`;
    for (const v of [6000, 8000, 10000, 12000]) svg += `<line x1="${L}" x2="${R}" y1="${yE(v)}" y2="${yE(v)}" stroke="#ddd8cd"/><text x="${L - 8}" y="${yE(v) + 5}" text-anchor="end" font-size="13" fill="#1f4e9c">${nf(v / 1000)}k €</text>`;
    for (const v of [470, 490, 510]) svg += `<text x="${R + 8}" y="${yP(v) + 5}" font-size="13" fill="#c0392b">${v}</text>`;
    svg += `<path d="${real.all.map((v, i) => `${i ? "L" : "M"}${x(years[i]).toFixed(1)},${yE(v).toFixed(1)}`).join("")}" fill="none" stroke="#1f4e9c" stroke-width="3"/>`;
    const math = pisa.math.fr.filter(([yr]) => yr >= 2003);
    svg += `<path d="${math.map(([yr, v], i) => `${i ? "L" : "M"}${x(yr).toFixed(1)},${yP(v).toFixed(1)}`).join("")}" fill="none" stroke="#c0392b" stroke-width="2.5" stroke-dasharray="7 5"/>`;
    for (const [yr, v] of math) svg += `<rect x="${x(yr) - 4}" y="${yP(v) - 4}" width="8" height="8" fill="#c0392b"/>`;
    const lastE = real.all[real.all.length - 1], lastM = math[math.length - 1];
    svg += `<text x="${x(2025) - 6}" y="${yE(lastE) - 12}" text-anchor="end" font-size="15" font-weight="700" fill="#1f4e9c">${nf(lastE)} € pro Schüler</text>`;
    svg += `<text x="${x(lastM[0]) - 6}" y="${yP(lastM[1]) + 26}" text-anchor="end" font-size="15" font-weight="700" fill="#c0392b">PISA Mathe ${lastM[1]}</text>`;
    for (const yr of [1980, 1990, 2000, 2010, 2025]) svg += `<text x="${x(yr)}" y="${B + 24}" text-anchor="middle" font-size="13" fill="#3e3c37">${yr}</text>`;
    svg += `<line x1="${L}" x2="${R}" y1="${B}" y2="${B}" stroke="#1a1a18"/>`;
    svg += `<text x="${L}" y="${ch - 10}" font-size="13" fill="#77736a">Ausgaben pro Schüler (Preise 2025) · PISA Mathematik Frankreich</text></svg>`;
    const growth = Math.round((lastE / real.all[0] - 1) * 100);
    return {
      file: "og-frankreich-bildung.jpg", accent: "#1f4e9c",
      kicker: "Frankreich · 1980–2025",
      title: "Mehr Geld pro Kind, weniger Können?",
      sub: `Die Ausgaben pro Schüler stiegen real um ${growth} %, die Testergebnisse sanken. Daten zu Lehrkräften, Klassen und PISA.`,
      url: "biest.com/frankreich-bildung", source: "Daten: DEPP, OECD PISA",
      chart: svg,
      alt: "Liniendiagramm: steigende Bildungsausgaben pro Schüler in Frankreich seit 1980 gegenüber sinkenden PISA-Mathematikwerten",
    };
  },

  "gaza-familien"() {
    const fam = JSON.parse(read("gaza/data/families.json"));
    const list = Array.isArray(fam) ? fam : Object.values(fam);
    const pretty = (k) => k.split("-").map((p, i) => (i === 0 && p === "al" ? "al" : p[0].toUpperCase() + p.slice(1))).join("-");
    const rows = list.slice().sort((a, b) => b.n - a.n).slice(0, 8).map((f) => ({ label: pretty(f.k), v: f.n, v2: f.m }));
    const meta = JSON.parse(read("gaza/data/meta.json"));
    const total = list.length;
    const svg = hbars(rows, { color: "#e0592a", color2: "#3d85d8", labelW: 170,
      note: "Tote je Familienname · <tspan fill=\"#3d85d8\">■</tspan> Männer  <tspan fill=\"#e0592a\">■</tspan> Frauen" });
    return {
      file: "og-gaza-familien.jpg", accent: "#b8862f",
      kicker: "Gaza · Namensliste",
      title: "Gaza: Familien &amp; Namenssuche",
      sub: `${nf(total)} Familiennamen der namentlichen Opferliste – Tote, Männer, Frauen, Kinder, Geschwistergruppen. Durchsuchbar.`,
      url: "biest.com/gaza/familien.html", source: `Daten: Gesundheitsministerium Gaza / IBC`,
      chart: svg,
      alt: "Balkendiagramm der Familiennamen mit den meisten Toten in der Gaza-Opferliste, aufgeteilt nach Männern und Frauen",
      _meta: meta,
    };
  },
};

// ------------------------------------------------------------------ Rendern
const want = process.argv.slice(2);
const manifest = {};
for (const [slug, build] of Object.entries(dossiers)) {
  if (want.length && !want.includes(slug)) continue;
  const o = build();
  const html = path.join(TMP, slug + ".html"), png = path.join(TMP, slug + ".png");
  fs.writeFileSync(html, frame(o));
  execFileSync(CHROME, ["--headless=new", "--disable-gpu", "--hide-scrollbars", "--force-device-scale-factor=1",
    `--window-size=${W},${H}`, "--virtual-time-budget=8000", `--screenshot=${png}`, "file:///" + html.replace(/\\/g, "/")], { stdio: "ignore" });
  await sharp(png).resize(W, H).jpeg({ quality: 88, mozjpeg: true }).toFile(path.join(OUT, o.file));
  manifest[slug] = { file: "og/" + o.file, alt: o.alt };
  console.log("✓", o.file);
}
fs.writeFileSync(path.join(TMP, "manifest.json"), JSON.stringify(manifest, null, 2));
console.log(JSON.stringify(manifest, null, 2));
