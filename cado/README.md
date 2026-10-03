# CADO Builder

3D-Baukasten für die CADO ELEMENTS (biest.com) – ca. 40.000 Luxus-Bausteine im 30-mm-Raster.

- `blender/cado_bricks.py` – baut alle Formen und Materialien parametrisch in Blender, exportiert
  `web/public/models/cado_elements_all.glb`, `web/public/catalog.json` und Produkt-Renders.
  Aufruf aus diesem Ordner: `blender -b -P blender/cado_bricks.py -- [--cpu] [--shots lineup,materials,hero,all,design,detail]`
- `web/` – Builder (Vite + three.js). Materialien in `web/src/builder/materials.json` (gilt auch für Blender),
  Vorlagen in `web/src/builder/templates.js` und `large*.js`, eigene Fassungen in `web/src/builder/saved/`.

```bash
cd web
npm install
npm run dev          # lokal: http://localhost:5183 (mit "Als Vorlage speichern")
npm run build:site   # baut nach artmarcovici-next/public/cado-builder und spiegelt die Quellen nach artmarcovici-next/cado
```

## Updates auf biest.com

```bash
cd web
npm run release                 # Vorschau: sichern, bauen, auf Branch cado-builder pushen (biest.com unverändert)
npm run release -- --live       # zusätzlich in master übernehmen -> live auf biest.com/cado-builder
npm run release -- -m "Text"    # eigene Beschreibung
```

Der Befehl holt vorher den neuesten Stand von master (andere arbeiten parallel an der Website),
prüft bei --live den Produktions-Build und bricht bei jedem Fehler ab, ohne zu pushen.
Vorschau (Vercel-Login nötig): https://artmarcovici-next-git-cado-builder-wave-2d0496e2.vercel.app/cado-builder

Live: [biest.com/cado-builder](https://biest.com/cado-builder) (Website-Repository `dinorgcom/artmarcovici-next`).
