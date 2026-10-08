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

Die Seite ist zweisprachig (`/js/?lang=de` bzw. `?lang=en`). Jedes Textfeld eines Falls hat ein englisches
Gegenstück mit der Endung `_en` direkt dahinter (`place_en`, `victims_en`, `shooter_en`, `context_en`, `legal_en`;
bei Israelis `type_en`, `perp_en`, `affiliation_en`, `outcome_en`, `flags_en` und bei Bedarf `name_en`/`age_en`
je Opfer). Fehlt ein `_en`-Feld, zeigt die englische Seite den deutschen Text. `add` fragt die englische Fassung
optional ab, `check` meldet Fälle ohne englische Fassung als Hinweis. Kategorien und Zählungen richten sich
weiterhin nur nach den deutschen bzw. Code-Feldern (`cat`, `src`, `legal` mit „angeklagt“).

Danach committen und auf `master` pushen – das geht direkt live.

## Femizide (/femizide) – englische Übersetzung

Das Dossier [biest.com/femizide](https://biest.com/femizide/) liegt hier nur als fertiger Vite-Build
(`public/femizide/index.html`, `assets/index-*.js`); der Quellcode wird anderswo gebaut. Deshalb wird das Bundle
für Englisch **nicht** verändert. Stattdessen übersetzt eine Sprachschicht die fertig gerenderte Seite, wenn
Englisch gewählt ist (`?lang=en`, Umschalter DE | EN im Kopf):

- `public/femizide/i18n/en-ui.js` – Oberfläche, Diagramm- und Kartenbeschriftungen, Regeln für zusammengesetzte
  Texte („203 von 203 Fällen angezeigt“, Tooltips, Datum 08.01.2019 → 08/01/2019, Dezimalkomma → Punkt) und die
  Absätze mit Hervorhebungen als Ganzes.
- `public/femizide/i18n/en-cases-JJJJ-JJJJ.js` – alle Falltexte: Schlüssel ist der deutsche Text genau wie im
  Bundle, Wert die englische Fassung; `keep` enthält Namen, die gleich bleiben.
- `public/femizide/i18n/translate.js` – ersetzt beim Laden und bei jedem Neu-Rendern (Filter, Fallarchiv,
  Umschalter) nur Texte, die im Wörterbuch stehen. Fehlt ein Eintrag, bleibt der deutsche Text stehen.
  Deutsch ist davon nicht betroffen (die Schicht ist dann inaktiv).

Nach einem **Neu-Build** des Dossiers (neue Fälle, neue `index.html`):

```bash
node scripts/femizide-i18n.mjs inject     # Script-Tags, Sprachumschalter und CSS wieder in index.html einsetzen
node scripts/femizide-i18n.mjs extract    # deutsche Texte ohne Englisch auflisten (Falltexte, Oberfläche, index.html)
node scripts/femizide-i18n.mjs extract --json fehlend.json   # dasselbe zusätzlich als Vorlage {"Deutsch": ""}
```

`extract` gibt fehlende Falltexte gleich im Format für `en-cases-*.js` aus (Fall-ID und Feld als Kommentar);
Englisch ergänzen und in die Datei des passenden Jahres einfügen (für 2027 ggf. neue Datei `en-cases-2027.js`
anlegen, `inject` bindet sie ein). Geänderte deutsche Texte erscheinen ebenfalls als fehlend – der alte Eintrag
kann dann gelöscht werden. Bei geänderten Dateien den `?v=`-Parameter der Script-Tags erhöhen. Prüfen im Browser:
`/femizide/?lang=en&i18n-debug=1` – `window.__femizideMissing` listet übrig gebliebene deutsche Texte.
