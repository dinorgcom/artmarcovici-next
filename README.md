# Art Marcovici — biest.com

Contemporary Art by Michael Marcovici. Migrated from [Google Sites](https://sites.google.com/site/artmarcovici/) to Next.js.

## Development

```bash
npm install
npm run dev
```

All page content (navigation + pages) lives in `src/data/siteData.json`.

## Deployment

Deployed on Vercel (project `artmarcovici-next`, production domain [biest.com](https://biest.com)).
Connected to this GitHub repo — every push to `master` deploys to production automatically.

## CADO Builder

3D-Baukasten für die CADO ELEMENTS unter [biest.com/cado-builder](https://biest.com/cado-builder) (Menü CADO → CADO BUILDER).
Die App wird nicht hier entwickelt, sondern im CADO-Projekt (Vite + three.js) und als fertige Dateien nach
`public/cado-builder/` gebaut; `next.config.ts` leitet `/cado-builder` per Rewrite auf deren `index.html`.

```bash
cd cado/web
npm run build:site   # komprimiert die Steinformen und schreibt nach artmarcovici-next/public/cado-builder
```

## Judäa und Samaria (/js) – Falllisten pflegen

Die Datenseite unter [biest.com/js](https://biest.com/js) liest alles aus `public/js/data/cases.json`
(Tötungen zwischen israelischen Zivilisten und Palästinensern seit dem 7. Oktober 2023). Alle Zahlen auf
der Seite werden daraus berechnet; `/westbank` leitet dauerhaft auf `/js` weiter.

```bash
npm run js -- add               # neuen Fall abfragen (Kategorie, beide Darstellungen, Links, Quellenlage)
npm run js -- check             # Pflichtfelder, Datumsangaben, Duplikate, Fälle nur mit UN/palästinensischen Quellen
npm run js -- check --links     # zusätzlich alle Links abrufen
npm run js -- stats             # Übersicht nach Kategorie, Jahr und Quellenlage
npm run js -- date 2026-10-31   # Stand und Zeitraumende setzen
```

Danach committen und auf `master` pushen – das geht direkt live.
