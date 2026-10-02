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
