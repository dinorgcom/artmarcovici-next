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

Live: [biest.com/cado-builder](https://biest.com/cado-builder) (Website-Repository `dinorgcom/artmarcovici-next`).
