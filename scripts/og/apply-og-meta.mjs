// Schreibt einheitliche Open-Graph-/Twitter-Angaben in die Dossier-Seiten (Bilder aus build-og.mjs).
// Aufruf: node scripts/og/apply-og-meta.mjs
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const PUB = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../../public");
const V = "20261004"; // Cache-Bust für Plattformen, die alte Vorschaubilder zwischenspeichern

const pages = [
  { file: "femizide/index.html", url: "https://biest.com/femizide/", image: "og-femizide.jpg",
    title: "Femizide in Österreich 2019–2026",
    desc: "Falldatenbank: alle dokumentierten Femizide seit 2019 – Opfer, Täter, Motive, Verfahren und Quellen. Mit Karte und Rückblick bis 1970.",
    alt: "Dokumentierte Femizide in Österreich pro Jahr seit 2019" },
  { file: "westbank/index.html", url: "https://biest.com/westbank/", image: "og-westbank.jpg",
    title: "Siedlergewalt, Tötungen & Demografie im Westjordanland",
    alt: "Siedlerangriffe pro Woche im Westjordanland laut OCHA, 2023 bis 2026" },
  { file: "frankreich-bildung/index.html", url: "https://biest.com/frankreich-bildung/", image: "og-frankreich-bildung.jpg",
    alt: "Bildungsausgaben pro Schüler in Frankreich seit 1980 und PISA-Mathematik im Vergleich" },
  { file: "mortality/index.html", url: "https://biest.com/mortality/", image: "og-mortality.jpg",
    title: "Woran Österreich stirbt",
    desc: "56 Jahre amtliche Todesursachen-Statistik (1970–2025) nach Ursache, Alter und Geschlecht – interaktiv, mit verlorenen Lebensjahren und Wochenanalyse.",
    alt: "Häufigste Todesursachen in Österreich 2025" },
  { file: "mortality/weekly.html", url: "https://biest.com/mortality/weekly.html", image: "og-mortality-weekly.jpg",
    title: "Sterblichkeit trifft Wetter",
    desc: "Jede Kalenderwoche seit 2016: Sterbefälle in Österreich neben Temperatur, Niederschlag und Sonnenschein der neun Landeshauptstädte.",
    alt: "Wöchentliche Sterbefälle in Österreich seit 2016 mit Wochentemperaturen" },
  { file: "wien-sonne-temperatur/index.html", url: "https://biest.com/wien-sonne-temperatur", image: "og-wien-sonne-temperatur.jpg",
    title: "146 Jahre Sonne & Temperatur in Wien",
    alt: "Wärmestreifen für Wien seit 1880, von kühl (blau) bis warm (rot)" },
  { file: "gaza/familien.html", url: "https://biest.com/gaza/familien.html", image: "og-gaza-familien.jpg",
    alt: "Familiennamen mit den meisten Toten in der Gaza-Opferliste, nach Männern und Frauen" },
];

const attr = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
const unattr = (s) => s.replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
// Inhalt eines (ggf. mehrzeiligen) meta-Tags lesen
function metaContent(html, key) {
  const m = html.match(new RegExp(`<meta\\s[^>]*(?:property|name)="${key}"[^>]*>`, "s"));
  const c = m && m[0].match(/content="([^"]*)"/s);
  return c ? unattr(c[1].replace(/\s+/g, " ").trim()) : null;
}

for (const p of pages) {
  const file = path.join(PUB, p.file);
  const raw = fs.readFileSync(file, "utf8");
  const crlf = raw.includes("\r\n");
  let html = raw.replace(/\r\n/g, "\n");
  const title = p.title || metaContent(html, "og:title") || html.match(/<title>([^<]*)<\/title>/)[1];
  const desc = p.desc || metaContent(html, "og:description") || metaContent(html, "description");
  // alte og:/twitter:-Tags entfernen (auch mehrzeilige)
  html = html.replace(/[ \t]*<meta\s[^>]*(?:property="og:|name="twitter:)[^>]*>[ \t]*\n/gs, "");
  const indent = (html.match(/^([ \t]*)<link rel="stylesheet" href="\/shared\/biest-brand\.css">/m) || [, ""])[1];
  const img = `https://biest.com/og/${p.image}?v=${V}`;
  const tags = [
    ["property", "og:type", "website"], ["property", "og:site_name", "biest.com"], ["property", "og:locale", "de_AT"],
    ["property", "og:title", title], ["property", "og:description", desc], ["property", "og:url", p.url],
    ["property", "og:image", img], ["property", "og:image:type", "image/jpeg"],
    ["property", "og:image:width", "1200"], ["property", "og:image:height", "630"], ["property", "og:image:alt", p.alt],
    ["name", "twitter:card", "summary_large_image"], ["name", "twitter:title", title],
    ["name", "twitter:description", desc], ["name", "twitter:image", img], ["name", "twitter:image:alt", p.alt],
  ].map(([k, n, v]) => `${indent}<meta ${k}="${n}" content="${attr(v)}">`).join("\n");
  const anchor = `${indent}<link rel="stylesheet" href="/shared/biest-brand.css">`;
  if (!html.includes(anchor)) throw new Error("Anker fehlt: " + p.file);
  html = html.replace(anchor, `${tags}\n${anchor}`);
  fs.writeFileSync(file, crlf ? html.replace(/\n/g, "\r\n") : html);
  console.log("✓", p.file, "—", title);
}
