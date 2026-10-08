#!/usr/bin/env node
// Pflege der Falllisten für biest.com/js (Judäa und Samaria).
// Datenquelle: public/js/data/cases.json – die Seite rechnet alle Zahlen daraus.
//
//   npm run js -- stats            Übersicht nach Kategorie, Jahr und Quellenlage
//   npm run js -- check            Daten prüfen (Pflichtfelder, Datum, Kategorien, Links)
//   npm run js -- check --links    zusätzlich jeden Link abrufen (dauert etwas)
//   npm run js -- add              neuen Fall abfragen und einsortieren
//   npm run js -- date [JJJJ-MM-TT] Stand und Zeitraumende setzen (Standard: heute)
//
// Englisch: jedes Textfeld hat ein Gegenstück <feld>_en (place_en, context_en, flags_en …).
// „add“ fragt es optional ab, „check“ meldet Fälle ohne englische Fassung als Hinweis.

import fs from "node:fs";
import path from "node:path";
import readline from "node:readline";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const FILE = path.join(ROOT, "public/js/data/cases.json");

const CATS = {
  K1: "Anschlag gestoppt – Angriff des Getöteten von keiner Seite bestritten",
  K2: "Angriff behauptet, bestritten – israelische Seite: Angriff; palästinensische Seite bestreitet",
  K3: "Konfrontation – Steinwürfe/Handgemenge berichtet, Schütze beruft sich auf Gefahr",
  K4: "Überfall – keine Quelle (auch keine israelische) berichtet Gewalt des Getöteten",
  U: "Schütze unklar – ob Siedler oder Armee geschossen haben, ist ungeklärt",
};
const SRC = {
  A: "Israelische Behörde (IDF, Polizei, Shin Bet, Justiz) äußert sich",
  M: "Israelische Medien berichten",
  N: "Israelische NGO (B'Tselem, Yesh Din)",
  I: "Internationale Medien (Reuters, AP, BBC, Guardian, CNN …)",
  P: "Nur UN, palästinensische oder arabische Quellen",
};
const LISTS = {
  A: "Anschläge in Judäa und Samaria (ohne Ost-Jerusalem)",
  B: "Sicherheitskräfte bei Militäreinsätzen",
  C: "Ost-Jerusalem",
  D: "Allenby-Übergang (jordanische Täter)",
  E: "In Israel, Täter aus Judäa und Samaria",
};
// Englische Fassung (biest.com/js?lang=en): parallele Felder <feld>_en je Fall, z. B. context_en.
// Fehlt ein _en-Feld, zeigt die englische Seite den deutschen Text; „check“ meldet das als Hinweis.
const EN_PAL = ["place", "victims", "shooter", "context", "legal"];
const EN_ISR = ["place", "type", "perp", "affiliation", "outcome"];
const EN_DEFAULTS = { "keine bekannt": "none known", unbekannt: "unknown", "nicht bekannt": "not known", unklar: "unclear", "–": "–" };
const missingEn = (c, fields) => {
  const miss = fields.filter((f) => c[f] && !(typeof c[f + "_en"] === "string" && c[f + "_en"].trim()));
  if (c.flags?.length && !(Array.isArray(c.flags_en) && c.flags_en.length === c.flags.length && c.flags_en.every((x) => x && String(x).trim()))) miss.push("flags");
  return miss;
};
// _en-Felder direkt hinter das deutsche Feld stellen (lesbarere JSON-Datei)
const orderEn = (c) => {
  const out = {};
  for (const [k, v] of Object.entries(c)) {
    if (k.endsWith("_en") && k.slice(0, -3) in c) continue;
    out[k] = v;
    if (k + "_en" in c) out[k + "_en"] = c[k + "_en"];
  }
  return out;
};

// Domains für den Vorschlag der Quellenlage
const DOMAINS = {
  A: ["t.me", "idf.il", "police.gov.il", "shabak.gov.il", "gov.il"],
  M: ["timesofisrael.com", "haaretz.com", "ynetnews.com", "ynet.co.il", "jpost.com", "jns.org", "israelnationalnews.com", "israelhayom.com", "tps.co.il", "i24news.tv", "kan.org.il", "walla.co.il", "maariv.co.il", "mako.co.il"],
  N: ["btselem.org", "statistics.btselem.org", "yesh-din.org", "972mag.com", "peacenow.org.il"],
  I: ["reuters.com", "apnews.com", "bbc.com", "bbc.co.uk", "theguardian.com", "cnn.com", "edition.cnn.com", "npr.org", "nbcnews.com", "washingtonpost.com", "nytimes.com", "afp.com"],
};

const load = () => JSON.parse(fs.readFileSync(FILE, "utf8"));
function save(data) {
  delete data.israeliCounts; // wird nicht mehr gebraucht, die Seite zählt selbst
  data.palestinians.sort((a, b) => a.date.localeCompare(b.date));
  data.israelis.sort((a, b) => a.list.localeCompare(b.list) || a.date.localeCompare(b.date));
  fs.writeFileSync(FILE, JSON.stringify(data, null, 1) + "\n");
  console.log(`\n✔ gespeichert: ${path.relative(ROOT, FILE)}`);
}
const today = () => new Date().toISOString().slice(0, 10);
const host = (u) => { try { return new URL(u).hostname.replace(/^www\./, ""); } catch { return ""; } };
const suggestSrc = (links) => {
  const hs = links.map(host);
  for (const lvl of ["A", "M", "N", "I"]) if (hs.some((h) => DOMAINS[lvl].some((d) => h === d || h.endsWith("." + d)))) return lvl;
  return "P";
};

// ---------------------------------------------------------------- stats
function stats() {
  const d = load();
  const pal = d.palestinians;
  const years = [...new Set(pal.map((c) => c.date.slice(0, 4)))].sort();
  const sum = (arr) => arr.reduce((t, c) => t + c.n, 0);
  console.log(`Stand ${d.updated} · Zeitraum ${d.period[0]} bis ${d.period[1]}\n`);
  console.log(`PALÄSTINENSER (von israelischen Zivilisten getötet): ${pal.length} Vorfälle, ${sum(pal)} Tote`);
  const rows = Object.keys(CATS).map((k) => {
    const r = { Kategorie: CATS[k].split(" – ")[0] };
    years.forEach((y) => (r[y] = sum(pal.filter((c) => c.cat === k && c.date.startsWith(y)))));
    r.Summe = sum(pal.filter((c) => c.cat === k));
    return r;
  });
  console.table(rows);
  console.table(Object.keys(SRC).map((k) => ({ Quellenlage: SRC[k], Vorfälle: pal.filter((c) => c.src === k).length, Tote: sum(pal.filter((c) => c.src === k)) })));
  const isr = d.israelis;
  console.log("ISRAELIS (von Palästinensern getötet)");
  console.table(Object.keys(LISTS).map((k) => {
    const v = isr.filter((c) => c.list === k).flatMap((c) => c.victims);
    return { Liste: `${k} ${LISTS[k]}`, Tote: v.length, Zivilisten: v.filter((x) => x.status === "Z").length, Sicherheitskräfte: v.filter((x) => x.status === "S").length };
  }));
}

// ---------------------------------------------------------------- check
async function check(withLinks) {
  const d = load();
  const errors = [];
  const warn = [];
  const isDate = (s) => /^\d{4}-\d{2}-\d{2}$/.test(s) && !Number.isNaN(Date.parse(s));
  for (const k of ["updated"]) if (!isDate(d[k])) errors.push(`Feld ${k} ist kein Datum`);
  if (!Array.isArray(d.period) || !d.period.every(isDate)) errors.push("period ist ungültig");
  const seen = new Set();
  d.palestinians.forEach((c, i) => {
    const id = `Palästinenser #${i + 1} (${c.date} ${c.place})`;
    for (const f of ["date", "place", "victims", "shooter", "cat", "context", "legal", "src"]) if (!c[f]) errors.push(`${id}: Feld „${f}“ fehlt`);
    if (!isDate(c.date)) errors.push(`${id}: Datum ungültig`);
    if (c.date > d.period[1]) warn.push(`${id}: liegt nach dem Zeitraumende ${d.period[1]} (npm run js -- date)`);
    if (!(c.cat in CATS)) errors.push(`${id}: Kategorie „${c.cat}“ unbekannt`);
    if (!(c.src in SRC)) errors.push(`${id}: Quellenlage „${c.src}“ unbekannt`);
    if (!Number.isInteger(c.n) || c.n < 1) errors.push(`${id}: Zahl der Toten ungültig`);
    if (!c.links?.length) errors.push(`${id}: keine Links`);
    c.links?.forEach((u) => { if (!host(u)) errors.push(`${id}: Link ungültig: ${u}`); });
    const s = suggestSrc(c.links || []);
    if (c.src !== s && "AMNIP".indexOf(c.src) > "AMNIP".indexOf(s)) warn.push(`${id}: Quellenlage „${c.src}“, die Links deuten auf „${s}“ – prüfen`);
    if (c.src === "P") warn.push(`${id}: nur UN/palästinensische Quellen`);
    const key = `${c.date}|${c.place}|${c.victims}`;
    if (seen.has(key)) warn.push(`${id}: Datum, Ort und Getötete doppelt – Duplikat?`);
    seen.add(key);
    const miss = missingEn(c, EN_PAL);
    if (miss.length) warn.push(`${id}: englische Fassung fehlt (${miss.map((f) => f + "_en").join(", ")})`);
  });
  d.israelis.forEach((c, i) => {
    const id = `Israelis ${c.id || "#" + (i + 1)} (${c.date})`;
    for (const f of ["id", "list", "date", "place", "type"]) if (!c[f]) errors.push(`${id}: Feld „${f}“ fehlt`);
    if (!isDate(c.date)) errors.push(`${id}: Datum ungültig`);
    if (!(c.list in LISTS)) errors.push(`${id}: Liste „${c.list}“ unbekannt`);
    if (!c.victims?.length) errors.push(`${id}: keine Opfer`);
    c.victims?.forEach((v) => { if (!["Z", "S"].includes(v.status)) errors.push(`${id}: Status von ${v.name} muss Z oder S sein`); });
    if (!c.links?.length) warn.push(`${id}: keine Links`);
    const miss = missingEn(c, EN_ISR);
    c.victims?.forEach((v) => { if (/[a-zäöüß]/i.test(String(v.age ?? "")) && !v.age_en) miss.push(`age_en (${v.name})`); });
    if (miss.length) warn.push(`${id}: englische Fassung fehlt (${miss.map((f) => (f.includes("_en") ? f : f + "_en")).join(", ")})`);
  });
  const ids = d.israelis.map((c) => c.id);
  ids.forEach((x, i) => { if (ids.indexOf(x) !== i) errors.push(`Israelis: ID ${x} doppelt`); });

  if (withLinks) {
    const urls = [...new Set([...d.palestinians, ...d.israelis].flatMap((c) => c.links || []))];
    console.log(`Prüfe ${urls.length} Links …`);
    const bad = [];
    for (let i = 0; i < urls.length; i += 8) {
      await Promise.all(urls.slice(i, i + 8).map(async (u) => {
        try {
          const r = await fetch(u, { method: "GET", redirect: "follow", signal: AbortSignal.timeout(15000), headers: { "user-agent": "Mozilla/5.0 (biest.com link check)" } });
          if (r.status >= 400 && ![401, 403, 429].includes(r.status)) bad.push(`${r.status} ${u}`);
        } catch (e) { bad.push(`FEHLER ${u} (${e.name})`); }
      }));
    }
    bad.forEach((b) => warn.push(`Link: ${b}`));
    console.log("(403/429 = Seite blockt automatische Abrufe, gilt nicht als Fehler)");
  }
  warn.forEach((w) => console.log("⚠ " + w));
  errors.forEach((e) => console.log("✖ " + e));
  console.log(`\n${errors.length} Fehler, ${warn.length} Hinweise`);
  if (errors.length) process.exitCode = 1;
}

// ---------------------------------------------------------------- add
async function add() {
  // Eigene Zeilenwarteschlange: funktioniert im Terminal und mit umgeleiteter Eingabe
  const rl = readline.createInterface({ input: process.stdin, terminal: Boolean(process.stdin.isTTY) });
  const queue = [];
  let waiting = null;
  let closed = false;
  rl.on("line", (l) => { if (waiting) { const w = waiting; waiting = null; w(l); } else queue.push(l); });
  rl.on("close", () => { closed = true; if (waiting) waiting(null); });
  const line = (q) => {
    process.stdout.write(q);
    if (queue.length) return Promise.resolve(queue.shift());
    if (closed) return Promise.resolve(null);
    return new Promise((r) => (waiting = r));
  };
  rl.question = async (q) => {
    const a = await line(q);
    if (a === null) { console.log("\nEingabe beendet – nichts gespeichert."); process.exit(1); }
    if (!process.stdin.isTTY) process.stdout.write(a + "\n");
    return a;
  };
  const ask = async (q, def = "") => {
    const a = (await rl.question(`${q}${def ? ` [${def}]` : ""}: `)).trim();
    return a || def;
  };
  const askReq = async (q, def = "") => {
    for (;;) { const a = await ask(q, def); if (a) return a; console.log("  Pflichtfeld."); }
  };
  const askChoice = async (q, opts, def) => {
    Object.entries(opts).forEach(([k, v]) => console.log(`  ${k}  ${v}`));
    for (;;) { const a = (await ask(q, def)).toUpperCase(); if (a in opts) return a; console.log("  Bitte einen der Codes eingeben."); }
  };
  const askDate = async (q) => {
    for (;;) { const a = await askReq(q, today()); if (/^\d{4}-\d{2}-\d{2}$/.test(a) && !Number.isNaN(Date.parse(a))) return a; console.log("  Format JJJJ-MM-TT."); }
  };
  const askLinks = async () => {
    console.log("Links (je Zeile einer, leere Zeile = fertig; möglichst eine israelische Quelle dabei):");
    const out = [];
    for (;;) { const a = (await rl.question("  > ")).trim(); if (!a) break; if (host(a)) out.push(a); else console.log("  keine gültige URL"); }
    return out;
  };
  // optional: englische Fassung je Textfeld (leer = später nachtragen; Namen/Orte: Enter übernimmt den deutschen Wert)
  const askEnglish = async (c, fields) => {
    if (!(await ask("Englische Fassung jetzt erfassen (für biest.com/js?lang=en)? j/n", "j")).toLowerCase().startsWith("j")) {
      console.log("  → später nachtragen: Felder …_en in cases.json (npm run js -- check zeigt, was fehlt)");
      return c;
    }
    for (const [f, label, same] of fields) {
      const def = same ? c[f] : EN_DEFAULTS[c[f]] || "";
      const v = await ask(`  EN ${label}`, def);
      if (v) c[f + "_en"] = v;
    }
    if (c.flags?.length) {
      const en = [];
      for (const fl of c.flags) en.push(await ask(`  EN Hinweis „${fl}“`));
      if (en.every(Boolean)) c.flags_en = en;
    }
    return orderEn(c);
  };

  const data = load();
  const side = await askChoice("Wer wurde getötet? P = Palästinenser (durch israelische Zivilisten), I = Israelis (durch Palästinenser)", { P: "Palästinenser", I: "Israelis" }, "P");

  if (side === "P") {
    const c = {};
    c.date = await askDate("Datum (JJJJ-MM-TT)");
    c.place = await askReq("Ort (z. B. „Sinjil (Ramallah)“)");
    c.victims = await askReq("Getötete (Name und Alter, mehrere mit Komma)");
    c.n = Number(await askReq("Zahl der Toten", String(c.victims.split(",").length)));
    c.shooter = await askReq("Schütze (z. B. Siedler, Wachmann der Siedlung, Soldat außer Dienst, Siedler-Reservist, unklar)");
    c.cat = await askChoice("Kategorie", CATS);
    c.context = await askReq("Hergang nach beiden Seiten (israelische UND palästinensische Darstellung)");
    c.legal = await ask("Schütze / Verfahren: Festnahme, Ermittlung, Anklage", "keine bekannt");
    c.links = await askLinks();
    if (!c.links.length) console.log("  ⚠ ohne Links – bitte später nachtragen");
    c.src = await askChoice("Quellenlage", SRC, suggestSrc(c.links));
    const e = await askEnglish(c, [["place", "Ort", true], ["victims", "Getötete", true], ["shooter", "Schütze (z. B. Settler, Settlement security guard, Off-duty soldier, Settler reservist, unclear)"], ["context", "Hergang nach beiden Seiten"], ["legal", "Verfahren"]]);
    console.log("\n" + JSON.stringify(e, null, 2));
    if ((await ask("Speichern? j/n", "j")).toLowerCase().startsWith("j")) data.palestinians.push(e);
    else { console.log("Verworfen."); rl.close(); return; }
  } else {
    const c = {};
    c.list = await askChoice("Liste", LISTS, "A");
    const next = Math.max(0, ...data.israelis.filter((x) => x.list === c.list).map((x) => Number(String(x.id).slice(1)) || 0)) + 1;
    c.id = `${c.list}${String(next).padStart(2, "0")}`;
    c.date = await askDate("Datum (JJJJ-MM-TT)");
    c.place = await askReq("Ort (Siedlung/Kreuzung)");
    c.victims = [];
    for (;;) {
      const name = await ask(`Opfer ${c.victims.length + 1}: Name (leer = fertig)`);
      if (!name) { if (c.victims.length) break; console.log("  mindestens ein Opfer"); continue; }
      const age = await ask("  Alter");
      const status = await askChoice("  Status", { Z: "Zivilist", S: "Sicherheitskraft (auch außer Dienst)" });
      const role = await ask("  Rolle/Wohnort (optional)");
      c.victims.push({ name, age: age ? Number(age) : null, status, role });
    }
    c.type = await askReq("Tat (z. B. Schusswaffe, Messer, Ramming)");
    c.perp = await ask("Täter", "unbekannt");
    c.affiliation = await ask("Zugehörigkeit/Bekennung", "nicht bekannt");
    c.outcome = await ask("Ausgang für den Täter (getötet, festgenommen …)", "unklar");
    c.links = await askLinks();
    const flags = await ask("Hinweise/Grenzfall (optional, mehrere mit ;)");
    c.flags = flags ? flags.split(";").map((s) => s.trim()).filter(Boolean) : [];
    const e = await askEnglish(c, [["place", "Ort", true], ["type", "Tat (z. B. Firearm, Knife, Ramming)"], ["perp", "Täter"], ["affiliation", "Zugehörigkeit/Bekennung"], ["outcome", "Ausgang für den Täter"]]);
    console.log("\n" + JSON.stringify(e, null, 2));
    if ((await ask("Speichern? j/n", "j")).toLowerCase().startsWith("j")) data.israelis.push(e);
    else { console.log("Verworfen."); rl.close(); return; }
  }
  const newest = [...data.palestinians, ...data.israelis].map((c) => c.date).sort().at(-1);
  if (newest > data.period[1]) data.period[1] = newest;
  if ((await ask(`Stand auf heute (${today()}) setzen? j/n`, "j")).toLowerCase().startsWith("j")) {
    data.updated = today();
    if (data.period[1] < today()) data.period[1] = today();
  }
  rl.close();
  save(data);
  console.log("Nächste Schritte: npm run js -- check, dann committen und pushen (Push auf master geht live).");
}

// ---------------------------------------------------------------- date
function setDate(arg) {
  const d = load();
  const day = arg || today();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) { console.log("Format JJJJ-MM-TT"); process.exitCode = 1; return; }
  d.updated = day;
  d.period[1] = day;
  save(d);
}

// ---------------------------------------------------------------- main
const [cmd, ...rest] = process.argv.slice(2);
if (cmd === "stats") stats();
else if (cmd === "check") await check(rest.includes("--links"));
else if (cmd === "add") await add();
else if (cmd === "date") setDate(rest[0]);
else {
  console.log(`Falllisten für biest.com/js pflegen

  npm run js -- stats               Übersicht
  npm run js -- check [--links]     Daten (und Links) prüfen
  npm run js -- add                 neuen Fall erfassen
  npm run js -- date [JJJJ-MM-TT]   Stand/Zeitraumende setzen`);
}
