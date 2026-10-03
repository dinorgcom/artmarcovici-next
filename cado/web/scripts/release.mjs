// Ein Befehl fuer Updates des CADO Builders auf biest.com.
//
//   npm run release                  Vorschau: CADO-Stand sichern, bauen, auf Branch cado-builder pushen
//                                    -> Vercel baut eine geschuetzte Vorschau, biest.com bleibt unveraendert
//   npm run release -- --live        wie oben, danach in master uebernehmen und pushen -> geht live auf biest.com
//   npm run release -- -m "Text"     eigene Beschreibung fuer die Commits
//
// Ablauf: (1) offene Aenderungen im CADO-Projekt committen, (2) Website-Repo auf den neuesten Stand von master
// bringen (andere arbeiten parallel daran), (3) npm run build:site, (4) committen + pushen, (5) bei --live: master
// aktualisieren, Branch einmischen, Produktions-Build lokal pruefen, pushen. Bricht bei jedem Fehler ab, ohne zu pushen.
import { execSync } from 'node:child_process';
import path from 'node:path';

const args = process.argv.slice(2);
const live = args.includes('--live');
const msgIndex = args.indexOf('-m');
const note = msgIndex >= 0 ? args[msgIndex + 1] : `CADO Builder Update ${new Date().toISOString().slice(0, 10)}`;
const CADO = path.resolve('..');
const SITE = path.resolve('../../artmarcovici-next');
const BRANCH = 'cado-builder';
const env = { ...process.env, GIT_TERMINAL_PROMPT: '0' };

const sh = (cmd, cwd, quiet = false) => execSync(cmd, { cwd, env, encoding: 'utf8', stdio: quiet ? 'pipe' : ['ignore', 'pipe', 'inherit'] }).trim();
const step = (text) => console.log(`\n▸ ${text}`);
const commitMsg = (text) => `${text}\n\nCo-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`;
const commit = (cwd, text) => execSync('git commit -q -F -', { cwd, env, input: commitMsg(text), stdio: ['pipe', 'inherit', 'inherit'] });

try {
  step('CADO-Projekt sichern');
  if (sh('git status --porcelain', CADO)) {
    sh('git add -A', CADO);
    commit(CADO, note);
    console.log(`  committet: ${sh('git log --oneline -1', CADO)}`);
  } else console.log(`  nichts Neues (${sh('git log --oneline -1', CADO)})`);

  step('Website-Repository aktualisieren');
  if (sh('git status --porcelain', SITE)) throw new Error(`Im Website-Ordner gibt es ungesicherte Aenderungen:\n${sh('git status --short', SITE)}\nBitte erst klaeren (committen oder verwerfen).`);
  sh('git fetch origin --depth 50', SITE);
  sh(`git checkout -q ${BRANCH}`, SITE);
  sh(`git merge -q --ff-only origin/${BRANCH}`, SITE);
  sh('git merge -q --no-edit origin/master', SITE); // neueste Seite einmischen, damit die Vorschau aktuell ist
  console.log(`  ${BRANCH} enthaelt jetzt master ${sh('git log --oneline -1 origin/master', SITE)}`);

  step('Builder bauen (build:site)');
  execSync('npm run build:site', { cwd: path.resolve('.'), env, stdio: 'inherit' });

  step('Website-Commit');
  sh('git add -A cado public/cado-builder', SITE);
  if (sh('git diff --cached --name-only', SITE)) {
    commit(SITE, `${note} (CADO ${sh('git rev-parse --short HEAD', CADO)})`);
    console.log(`  committet: ${sh('git log --oneline -1', SITE)}`);
  } else console.log('  Build unveraendert');
  sh(`git push -q origin ${BRANCH}`, SITE);
  console.log(`  gepusht -> Vorschau: https://artmarcovici-next-git-${BRANCH}-wave-2d0496e2.vercel.app/cado-builder`);

  if (live) {
    step('Live schalten: in master uebernehmen');
    sh('git checkout -q master', SITE);
    sh('git merge -q --ff-only origin/master', SITE);
    sh(`git merge -q --no-edit ${BRANCH}`, SITE);
    step('Produktions-Build pruefen (next build)');
    execSync('npx next build', { cwd: SITE, env, stdio: ['ignore', 'ignore', 'inherit'] });
    sh('git push -q origin master', SITE);
    sh(`git checkout -q ${BRANCH}`, SITE);
    console.log('  gepusht -> Vercel deployt jetzt biest.com/cado-builder (1-2 Minuten)');
  }
  console.log('\nFertig.');
} catch (e) {
  console.error(`\n✗ Abgebrochen: ${e.message}`);
  console.error('  Es wurde nichts weiter gepusht. Website-Ordner: ' + SITE);
  process.exit(1);
}
