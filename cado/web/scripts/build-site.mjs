// Baut den Builder fuer biest.com und legt alles ins Website-Repository (artmarcovici-next):
//   public/cado-builder/  fertige App (dort per Rewrite unter biest.com/cado-builder erreichbar)
//   cado/                 kompletter Quellstand dieses Projekts (Blender-Skript, Builder, Vorlagen),
//                         damit alles, was auf der Seite laeuft, auch im Git liegt
// Aufruf: npm run build:site   (Ziel aenderbar: npm run build:site -- <pfad zu public/cado-builder>)
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const target = path.resolve(process.argv[2] ?? '../../artmarcovici-next/public/cado-builder');
const siteRoot = path.resolve(target, '..', '..');
const projectRoot = path.resolve('..');
const run = (cmd) => execSync(cmd, { stdio: 'inherit' });

// 1. App bauen
run('npx --yes @gltf-transform/cli meshopt public/models/cado_elements_all.glb public/models/cado_elements_all.min.glb --level medium');
run(`npx vite build --base=/cado-builder/ --outDir "${target}" --emptyOutDir`);
fs.rmSync(path.join(target, 'models', 'cado_elements_all.glb'), { force: true }); // nur die komprimierte Fassung ausliefern

// 2. Quellstand spiegeln: alle Dateien, die Git hier verfolgt oder verfolgen wuerde (.gitignore gilt)
const files = execSync('git ls-files --cached --others --exclude-standard', { cwd: projectRoot, encoding: 'utf8' })
  .split('\n').filter(Boolean).filter((f) => fs.existsSync(path.join(projectRoot, f)));
const mirror = path.join(siteRoot, 'cado');
fs.rmSync(mirror, { recursive: true, force: true });
for (const f of files) {
  const dest = path.join(mirror, f);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(path.join(projectRoot, f), dest);
}
const commit = execSync('git rev-parse --short HEAD', { cwd: projectRoot, encoding: 'utf8' }).trim();
const dirty = execSync('git status --porcelain', { cwd: projectRoot, encoding: 'utf8' }).trim() ? ' (mit nicht eingecheckten Änderungen)' : '';
fs.writeFileSync(path.join(mirror, 'QUELLSTAND.txt'),
  `Gespiegelt aus dem CADO-Projekt, Stand ${commit}${dirty}, ${new Date().toISOString()}.\n`
  + 'Nicht hier bearbeiten: Quelle ist das CADO-Projekt, dieser Ordner wird von npm run build:site ueberschrieben.\n');

console.log(`\nFertig: App -> ${target}\n        Quellen (${files.length} Dateien) -> ${mirror}`);
