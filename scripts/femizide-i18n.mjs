#!/usr/bin/env node
// Englische Fassung des Dossiers biest.com/femizide pflegen.
//
// Das Dossier liegt nur als fertiger Vite-Build vor (public/femizide/index.html + assets/index-*.js).
// Englisch kommt aus einer Übersetzungsschicht, die einen Neu-Build übersteht – das Bundle wird nie geändert:
//   public/femizide/i18n/en-ui.js          Oberfläche, Regeln für zusammengesetzte Texte, Absätze
//   public/femizide/i18n/en-cases-*.js     Falltexte (deutscher Text → Englisch)
//   public/femizide/i18n/translate.js      übersetzt die Seite zur Laufzeit (nur bei ?lang=en)
//
//   node scripts/femizide-i18n.mjs extract                 deutsche Texte ohne englischen Eintrag auflisten
//   node scripts/femizide-i18n.mjs extract --json F.json   fehlende Texte zusätzlich als {"Deutsch": ""} speichern
//   node scripts/femizide-i18n.mjs inject [--v=JJJJMMTT]   nach einem Neu-Build: Script-Tags, Sprachumschalter
//                                                          und CSS wieder in public/femizide/index.html einsetzen
//
// „extract“ prüft die Falldaten im Bundle (alle sichtbaren Felder), die Texte im übrigen Bundle-Code und
// die index.html. Rückgabewert 1, wenn etwas fehlt. Neue Falltexte in die passende en-cases-*.js
// (Objekt „d“) eintragen; Orts-/Personennamen, die gleich bleiben, in „I.keep“.
// Benötigt acorn (kommt mit den devDependencies: npm install).

import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIR = path.join(ROOT, "public/femizide");
const I18N = path.join(DIR, "i18n");
const INDEX = path.join(DIR, "index.html");

const [cmd, ...rest] = process.argv.slice(2);
const opt = Object.fromEntries(rest.map((a, i) => a.startsWith("--") ? [a.replace(/^--/, "").split("=")[0], a.includes("=") ? a.split("=").slice(1).join("=") : (rest[i + 1] && !rest[i + 1].startsWith("--") ? rest[i + 1] : true)] : null).filter(Boolean));

const LOOKS_GERMAN = /[äöüßÄÖÜ]|\b(der|die|das|dem|den|des|und|oder|nicht|mit|von|für|pro|nach|bei|zum|zur|im|am|ein|eine|keine?|Fälle?|Fall|Jahre?|Opfer|Täter|alle|unbekannt|Annahme|Gesamt|Quelle|laut|wurde)\b/;

// Wörterbuch-Dateien in Ladereihenfolge: en-ui.js zuerst, dann die übrigen en-*.js
function dictFiles() {
  const all = fs.readdirSync(I18N).filter(f => /^en-.*\.js$/.test(f));
  return all.sort((a, b) => (a === "en-ui.js" ? -1 : b === "en-ui.js" ? 1 : a.localeCompare(b)));
}

// Wörterbücher + Übersetzungskern aus translate.js laden (gleiche Logik wie im Browser)
function loadEngine() {
  const sandbox = { BIEST_LANG: "en", console };
  sandbox.window = sandbox;
  vm.createContext(sandbox);
  for (const f of [...dictFiles(), "translate.js"]) vm.runInContext(fs.readFileSync(path.join(I18N, f), "utf8"), sandbox, { filename: f });
  return { E: sandbox.FEMIZIDE_I18N_ENGINE(sandbox.FEMIZIDE_I18N), I: sandbox.FEMIZIDE_I18N };
}

function loadAcorn() {
  try {
    return createRequire(path.join(ROOT, "package.json"))("acorn");
  } catch {
    console.error("acorn fehlt – bitte im Repo „npm install“ ausführen.");
    process.exit(2);
  }
}

// AST-Literal → JS-Wert (nur für die Daten-Arrays/-Objekte im Bundle)
function lit(n) {
  switch (n.type) {
    case "Literal": return n.value;
    case "ArrayExpression": return n.elements.map(lit);
    case "ObjectExpression": { const o = {}; for (const p of n.properties) o[p.key.type === "Identifier" ? p.key.name : p.key.value] = lit(p.value); return o; }
    case "UnaryExpression": return n.operator === "!" ? !lit(n.argument) : n.operator === "-" ? -lit(n.argument) : undefined;
    case "TemplateLiteral": return n.expressions.length ? undefined : n.quasis[0].value.cooked;
    default: return undefined;
  }
}

// sichtbare Felder der Fälle (siehe Detailansicht im Fallarchiv)
const CASE_FIELDS = [
  "location.city", "location.district", "location.state",
  "victim.name", "victim.residence", "victim.birthplace", "victim.citizenship", "victim.origin", "victim.religion", "victim.age",
  "perpetrator.name", "perpetrator.relationship", "perpetrator.citizenship", "perpetrator.origin", "perpetrator.religion",
  "perpetrator.age", "perpetrator.outcome",
  "method", "motive", "children_affected", "trial.court", "trial.verdict", "notes",
  "analysis.motive_detail", "analysis.religion_context",
];
const get = (o, p) => p.split(".").reduce((a, k) => (a == null ? a : a[k]), o);

const ENT = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", shy: "­" };
const decode = s => s.replace(/&(#\d+|#x[0-9a-f]+|\w+);/gi, (m, e) => e[0] === "#" ? String.fromCodePoint(e[1] === "x" || e[1] === "X" ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10)) : (ENT[e] ?? m));
const ATTRS = ["title", "aria-label", "alt", "placeholder"];

function extract() {
  const { E, I } = loadEngine();
  const acorn = loadAcorn();
  const html = fs.readFileSync(INDEX, "utf8");
  const m = html.match(/<script[^>]*type="module"[^>]*src="\/femizide\/([^"]+)"/);
  if (!m) { console.error("Modul-Script (assets/index-*.js) in index.html nicht gefunden."); process.exit(2); }
  const bundleFile = path.join(DIR, m[1]);
  const src = fs.readFileSync(bundleFile, "utf8");
  const ast = acorn.parse(src, { ecmaVersion: "latest", sourceType: "module" });

  const known = (s) => { const k = E.norm(s); return !k || !E.hasWork(k) || E.lookup(k) != null; };
  const report = { cases: { n: 0, missing: [] }, ui: { n: 0, missing: [] }, html: { n: 0, missing: [] } };

  // 1) Falldaten: Array mit Objekten {id, date, victim, perpetrator …}
  let caseNode = null;
  (function find(n) {
    if (!n || typeof n !== "object" || caseNode) return;
    if (n.type === "ArrayExpression" && n.elements.length > 20 && n.elements[0] && n.elements[0].type === "ObjectExpression") {
      const keys = n.elements[0].properties.map(p => p.key && (p.key.name || p.key.value));
      if (keys.includes("victim") && keys.includes("perpetrator")) { caseNode = n; return; }
    }
    for (const k in n) if (k !== "loc" && n[k] && typeof n[k] === "object") find(n[k]);
  })(ast);
  if (!caseNode) { console.error("Fall-Array im Bundle nicht gefunden – Struktur geändert?"); process.exit(2); }
  const cases = lit(caseNode);
  const seen = new Set();
  const checkCase = (c, field, v) => {
    if (typeof v !== "string") return;
    const k = E.norm(v);
    if (!k || seen.has(k) || !E.hasWork(k)) return;
    seen.add(k);
    report.cases.n++;
    if (E.lookup(k) == null) report.cases.missing.push({ id: c.id, field, de: k });
  };
  for (const c of cases) {
    for (const f of CASE_FIELDS) checkCase(c, f, get(c, f));
    for (const u of (c.analysis && c.analysis.ungepruefte_angaben) || []) { checkCase(c, "ungepruefte_angaben.claim", u.claim); checkCase(c, "ungepruefte_angaben.source", u.source); }
    for (const p of c.photos || []) { checkCase(c, "photos.caption", p.caption); checkCase(c, "photos.source", p.source); }
  }

  // 2) übriger Bundle-Code: Zeichenketten und Template-Teile (HTML-Tags entfernt, Attribute einzeln)
  // Abdeckung von Textstücken zusammengesetzter Texte: Wortfolge kommt in einem Eintrag/einer Regel vor
  const words = s => s.replace(/\\[dswb]/g, " ").replace(/[^A-Za-zÄÖÜäöüß]+/g, " ").trim();
  const corpus = [...Object.keys(I.dict), ...Object.keys(I.blocks), ...I.patterns.map(p => p[0].source)].map(words).join("\n");
  // Datenfelder, die die Seite nicht anzeigt
  const CODE_WORDS = new Set(["Enter", "Escape", "Tab", "Space"]); // Tastennamen u. Ä. im Code
  const SKIP_KEYS = new Set(["path", "population_source", "source", "sources", "url", "file", "color", "key", "note", "bevoelkerungsdaten_status"]);
  const uiSeen = new Set();
  const checkPiece = (piece) => {
    const k = E.norm(piece.replace(/\u0000/g, " "));
    // Text, kein Code: deutsch aussehend, mit Großbuchstaben beginnend oder mehrere Wörter
    if (!k || k.length < 2 || uiSeen.has(k) || !/[A-Za-zÄÖÜäöüß]/.test(k) || /[{}=;<>]|=>/.test(k)) return;
    if (!LOOKS_GERMAN.test(k) && !/^[A-ZÄÖÜ][a-zäöüß]/.test(k) && !/[a-zäöüß]{2,} [A-Za-zÄÖÜäöüß]{2,}/.test(k)) return;
    if (CODE_WORDS.has(k)) return;
    uiSeen.add(k);
    report.ui.n++;
    if (known(k)) return;
    const core = words(k);
    if (core.length >= 3 && corpus.includes(core)) return;
    report.ui.missing.push(k);
  };
  const checkMarkup = (s) => {
    const attrRe = /\b(title|aria-label|alt|placeholder)="([^"]*)"/g;
    let a; while ((a = attrRe.exec(s))) decode(a[2]).split("\u0000").forEach(checkPiece);
    decode(s.replace(/<[^>]*>/g, "\u0000")).split(/\u0000|\n/).forEach(checkPiece);
  };
  (function walk(n, parentKey, inConsole) {
    if (!n || typeof n !== "object" || n === caseNode) return;
    if (Array.isArray(n)) { n.forEach(x => walk(x, parentKey, inConsole)); return; }
    if (n.type === "CallExpression" && n.callee && n.callee.type === "MemberExpression" && n.callee.object && n.callee.object.name === "console") inConsole = true;
    if (n.type === "Property") { const key = n.key && (n.key.name || n.key.value); walk(n.value, key, inConsole); return; }
    if (n.type === "Literal" && typeof n.value === "string" && !n.regex) { if (!inConsole && !SKIP_KEYS.has(parentKey)) checkMarkup(n.value); return; }
    if (n.type === "TemplateLiteral") {
      if (!inConsole) checkMarkup(n.quasis.map(q => q.value.cooked).join("\u0000"));
      n.expressions.forEach(x => walk(x, parentKey, inConsole));
      return;
    }
    for (const k in n) if (k !== "loc" && k !== "start" && k !== "end" && n[k] && typeof n[k] === "object") walk(n[k], parentKey, inConsole);
  })(ast, null, false);

  // 3) index.html: Texte, Attribute, Absätze mit Markup
  const body = parseHtml(html);
  const htmlCheck = (s, what) => {
    const k = E.norm(s);
    if (!k || !E.hasWork(k) || !/[A-Za-zÄÖÜäöüß]/.test(k)) return;
    report.html.n++;
    if (E.lookup(k) == null) report.html.missing.push({ what, de: k });
  };
  const titleEl = findAll(body, n => n.tag === "title")[0];
  if (titleEl) htmlCheck(textOf(titleEl), "<title>");
  for (const meta of findAll(body, n => n.tag === "meta" && n.attrs.name === "description")) htmlCheck(meta.attrs.content || "", "meta description");
  const bodyEl = findAll(body, n => n.tag === "body")[0] || body;
  (function walk(n) {
    if (n.text != null) { htmlCheck(n.text); return; }
    if (["script", "style", "code"].includes(n.tag)) return;
    for (const a of ATTRS) if (n.attrs && n.attrs[a]) htmlCheck(n.attrs[a], a);
    const mixed = n.children.some(c => c.text != null && /\S/.test(c.text)) && n.children.some(c => c.tag);
    if (mixed) {
      const k = E.norm(textOf(n));
      report.html.n++;
      if (E.block(k) != null) return;
    }
    n.children.forEach(walk);
  })(bodyEl);

  // Ausgabe
  const total = report.cases.n + report.ui.n + report.html.n;
  const miss = report.cases.missing.length + report.ui.missing.length + report.html.missing.length;
  console.log(`Femizide – englische Übersetzung (Bundle: ${path.relative(ROOT, bundleFile)}, ${cases.length} Fälle)`);
  console.log(`  Falltexte (sichtbare Felder):  ${report.cases.n} deutsche Texte, ${report.cases.missing.length} ohne Englisch`);
  console.log(`  Oberfläche im Bundle-Code:     ${report.ui.n} Textstücke, ${report.ui.missing.length} nicht erkennbar abgedeckt`);
  console.log(`  index.html:                    ${report.html.n} Texte/Absätze, ${report.html.missing.length} ohne Englisch`);
  console.log(`  gesamt: ${total - miss} von ${total} abgedeckt` + (I.keep ? ` (davon bewusst unverändert: ${I.keep.length} Namen u. Ä.)` : ""));
  if (report.cases.missing.length) {
    console.log("\nFehlende Falltexte – zum Einfügen in i18n/en-cases-*.js (Objekt d), Englisch ergänzen;");
    console.log("bleibt ein Text gleich (Ortsname …), stattdessen in I.keep eintragen:\n");
    for (const x of report.cases.missing) console.log(`    // ${x.id} · ${x.field}\n    ${JSON.stringify(x.de)}:\n      "",`);
  }
  if (report.ui.missing.length) {
    console.log("\nOberflächentexte im Bundle ohne erkennbaren Eintrag (in en-ui.js als dict-Eintrag oder Regel ergänzen;");
    console.log("Teile zusammengesetzter Texte brauchen eine Regel in I.patterns):\n");
    for (const k of report.ui.missing) console.log("    " + JSON.stringify(k));
  }
  if (report.html.missing.length) {
    console.log("\nindex.html – fehlende Texte (Absätze mit <strong>/<code> … als I.blocks-Eintrag):\n");
    for (const x of report.html.missing) console.log("    " + (x.what ? x.what + ": " : "") + JSON.stringify(x.de));
  }
  if (opt.json && typeof opt.json === "string") {
    const out = {};
    for (const x of report.cases.missing) out[x.de] = "";
    for (const k of report.ui.missing) out[k] = "";
    for (const x of report.html.missing) out[x.de] = "";
    fs.writeFileSync(opt.json, JSON.stringify(out, null, 2) + "\n");
    console.log(`\n${Object.keys(out).length} Einträge als Vorlage nach ${opt.json} geschrieben.`);
  }
  if (!miss) console.log("\nAlles abgedeckt.");
  process.exitCode = miss ? 1 : 0;
}

// sehr kleiner HTML-Parser (für die eigene, wohlgeformte index.html)
function parseHtml(html) {
  const VOID = new Set(["meta", "link", "input", "br", "img", "hr", "source", "area", "base", "col", "embed", "wbr"]);
  const root = { tag: "#root", attrs: {}, children: [] };
  const stack = [root];
  const re = /<!--[\s\S]*?-->|<!doctype[^>]*>|<(\/?)([a-zA-Z][\w-]*)((?:"[^"]*"|'[^']*'|[^'">])*)>|([^<]+)/gi;
  let m;
  while ((m = re.exec(html))) {
    const top = stack[stack.length - 1];
    if (m[4] != null) { top.children.push({ text: decode(m[4]) }); continue; }
    if (!m[2]) continue;
    const tag = m[2].toLowerCase();
    if (m[1]) { // schließendes Tag
      const i = stack.map(n => n.tag).lastIndexOf(tag);
      if (i > 0) stack.length = i;
      continue;
    }
    const attrs = {};
    m[3].replace(/([\w:-]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g, (_, k, a, b, c) => { attrs[k.toLowerCase()] = decode(a ?? b ?? c ?? ""); });
    const el = { tag, attrs, children: [] };
    top.children.push(el);
    if (tag === "script" || tag === "style") { // Inhalt überspringen
      const end = html.toLowerCase().indexOf("</" + tag, re.lastIndex);
      re.lastIndex = end < 0 ? html.length : end;
      continue;
    }
    if (!VOID.has(tag) && !/\/\s*$/.test(m[3])) stack.push(el);
  }
  return root;
}
const textOf = n => n.text != null ? n.text : n.children.map(textOf).join("");
const findAll = (n, f, out = []) => { if (n.tag && f(n)) out.push(n); (n.children || []).forEach(c => findAll(c, f, out)); return out; };

// nach einem Neu-Build: Sprachschicht wieder in index.html einsetzen (idempotent)
function inject() {
  let html = fs.readFileSync(INDEX, "utf8");
  const v = typeof opt.v === "string" ? opt.v : new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const added = [];
  const mod = html.match(/[ \t]*<script[^>]*type="module"[^>]*><\/script>\n?/);
  if (!mod) { console.error("Modul-Script in index.html nicht gefunden."); process.exit(2); }
  let tags = "";
  if (!html.includes("/shared/biest-lang.js")) { tags += '  <script src="/shared/biest-lang.js"></script>\n'; added.push("biest-lang.js"); }
  if (!html.includes("femizide-i18n:")) tags += "  <!-- femizide-i18n: englische Übersetzungsschicht (siehe i18n/translate.js, scripts/femizide-i18n.mjs) -->\n";
  for (const f of dictFiles()) {
    if (html.includes(`/femizide/i18n/${f}`)) continue;
    tags += `  <script src="/femizide/i18n/${f}?v=${v}" defer></script>\n`;
    added.push(f);
  }
  if (!html.includes("/femizide/i18n/translate.js")) { tags += `  <script src="/femizide/i18n/translate.js?v=${v}"></script>\n`; added.push("translate.js"); }
  if (tags.trim()) html = html.replace(mod[0], tags + mod[0]);

  if (!html.includes("data-biest-lang-switch")) {
    const brand = html.match(/<a class="biest-brand"[\s\S]*?<\/a>\n?/);
    if (brand) { html = html.replace(brand[0], brand[0].replace(/\n?$/, "\n") + '      <div class="fz-lang" data-biest-lang-switch></div>\n'); added.push("Sprachumschalter-Platz"); }
  }
  if (!html.includes(".fz-lang")) {
    const css = "    /* femizide-i18n: Sprachumschalter DE | EN oben rechts im Kopf */\n" +
      "    .site-header .wrap { position: relative; }\n" +
      "    .site-header .fz-lang { position: absolute; top: -4px; right: 20px; }\n";
    const close = html.indexOf("</style>");
    if (close > 0 && close < html.indexOf("</head>")) html = html.slice(0, close).replace(/[ \t]*$/, "") + css + "  " + html.slice(close);
    else html = html.replace("</head>", "  <style>\n" + css + "  </style>\n</head>");
    added.push("CSS");
  }
  if (!added.length) { console.log("index.html enthält die Sprachschicht bereits – nichts zu tun."); return; }
  if (opt.dry) { console.log("Würde einsetzen: " + added.join(", ")); return; }
  fs.writeFileSync(INDEX, html);
  console.log("In public/femizide/index.html eingesetzt: " + added.join(", ") + ` (?v=${v})`);
  console.log("Danach prüfen: node scripts/femizide-i18n.mjs extract");
}

if (cmd === "extract") extract();
else if (cmd === "inject") inject();
else {
  console.log(fs.readFileSync(fileURLToPath(import.meta.url), "utf8").split("\n").filter(l => l.startsWith("//")).map(l => l.slice(3)).join("\n"));
  process.exitCode = cmd ? 2 : 0;
}
