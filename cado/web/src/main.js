import './style.css';
import { Builder } from './builder/Builder.js';
import { MATERIALS, MATERIAL, GROUPS, FAMILIES, NAMES, designItems, MIN_ORDER, isAvailable, unitPrice } from './builder/catalog.js';
import { TEMPLATES } from './builder/templates.js';

const $ = (id) => document.getElementById(id);
const eur = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' });
const weight = (g) => (g < 1000 ? `${Math.round(g)} g` : `${(g / 1000).toLocaleString('de-DE', { maximumFractionDigits: 2 })} kg`);
const matName = (id) => MATERIAL[id]?.name ?? id;

const builder = new Builder($('viewport'));
if (import.meta.env.DEV) window.cado = builder; // Konsole: cado.getState(), cado.camera ...
let thumbs = { shapes: {}, materials: {} };

function renderPalette() {
  $('materials').innerHTML = GROUPS.filter((g) => g !== 'Design').map((group) => `
    <h3>${group}</h3>
    <div class="tiles swatches">${MATERIALS.filter((m) => m.group === group).map((m) => `
      <button class="tile" data-mat="${m.id}" title="${m.name} · ${eur.format(m.price)} je Stein">
        <img src="${thumbs.materials[m.id] ?? ''}" alt="${m.name}" /></button>`).join('')}</div>`).join('');
  shapesFor = null;
  syncTool();
}

// Unter dem Material stehen genau die Formen, die es in diesem Material gibt - im Material gerendert
let shapesFor = null, showAll = false, query = '';
const matsWith = (code) => MATERIALS.filter((m) => isAvailable(m.id, code));
function renderShapes() {
  const mat = builder.activeMat, key = [mat, showAll, query].join('|');
  if (shapesFor === key || !Object.keys(builder.shapes).length) return;
  shapesFor = key;
  const own = builder.makeThumbs(128, mat);
  const pics = { ...thumbs.shapes, ...own };
  const wanted = (c) => (showAll || query ? !query || c.toLowerCase().includes(query) || NAMES[c].toLowerCase().includes(query) : isAvailable(mat, c));
  let count = 0;
  $('shapes').innerHTML = FAMILIES.filter((fam) => fam.name !== 'Design').map((fam) => {
    const codes = fam.codes.filter((c) => builder.shapes[c] && wanted(c));
    count += codes.length;
    return !codes.length ? '' : `<h3>${fam.name}</h3><div class="tiles">${codes.map((c) => {
      const d = builder.meta[c]?.dims_mm ?? [];
      const guess = builder.meta[c]?.form_unsicher ? ' · Maße geschätzt' : '';
      const na = isAvailable(mat, c) ? '' : ' na';
      const where = na ? ` · gibt es in: ${matsWith(c).map((m) => m.name).join(', ') || '–'}` : '';
      return `<button class="tile${na}" data-code="${c}" title="${c} · ${NAMES[c]} · ${d.map((v) => Math.round(v)).join(' × ')} mm${guess}${where}">
        <img src="${pics[c] ?? ''}" alt="${NAMES[c]}" /></button>`;
    }).join('')}</div>`;
  }).join('');
  // Design & Sonderteile: eine Kategorie, unabhaengig vom gewaehlten Material immer sichtbar, jedes Teil in seinem Material
  const design = designItems().filter(([c, m, name]) => builder.shapes[c]
    && (!query || c.toLowerCase().includes(query) || name.toLowerCase().includes(query) || matName(m).toLowerCase().includes(query)));
  if (design.length) {
    $('shapes').innerHTML += `<h3>Design & Sonderteile · ${design.length} Teile</h3><div class="tiles">${design.map(([c, m, name]) => {
      const d = builder.meta[c]?.dims_mm ?? [];
      return `<button class="tile" data-code="${c}" data-mat="${m}" title="${c} · ${name} · ${d.map((v) => Math.round(v)).join(' × ')} mm">
        <img src="${builder.makeThumbs(128, m)[c] ?? ''}" alt="${name}" /></button>`;
    }).join('')}</div>`;
  }
  $('shapes-title').textContent = showAll || query ? `${count} Formen (alle Materialien)` : `${count} Formen in ${matName(mat)}`;
}

// zur gewaehlten Form: in welchen Materialien gibt es sie?
function renderShapeMats() {
  const code = builder.activeCode;
  $('shape-mats').innerHTML = !code ? '' : `<small>${code} gibt es in</small>` + matsWith(code).map((m) =>
    `<button class="chip${m.id === builder.activeMat ? ' on' : ''}" data-chip="${m.id}">${m.name}</button>`).join('');
}

// Hinweiszeile: erscheint bei jeder neuen Situation und blendet nach einigen Sekunden aus
let hintTimer = 0;
function showHint(text) {
  if ($('hint').textContent === text) return;
  $('hint').textContent = text;
  $('hint').classList.remove('faded');
  clearTimeout(hintTimer);
  hintTimer = setTimeout(() => $('hint').classList.add('faded'), 7000);
}
window.addEventListener('keydown', (e) => {
  if (e.key === '?' && !/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) $('help').open ? $('help').close() : $('help').showModal();
});

// Steuerkreuz: beim Begehen auf Touch-Geraeten (gedrueckt halten = gehen bzw. drehen)
const coarse = window.matchMedia?.('(pointer: coarse)').matches;
for (const btn of document.querySelectorAll('#dpad [data-key]')) {
  const key = btn.dataset.key;
  btn.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    builder._keys.add(key);
    try { btn.setPointerCapture(e.pointerId); } catch { /* Finger nicht festzuhalten - Loslassen kommt trotzdem */ }
  });
  for (const ev of ['pointerup', 'pointercancel', 'lostpointercapture']) btn.addEventListener(ev, () => builder._keys.delete(key));
  btn.addEventListener('contextmenu', (e) => e.preventDefault());
}

function syncTool() {
  $('dpad').hidden = !(coarse && builder.walking);
  renderShapes();
  renderShapeMats();
  document.querySelector('[data-act="dark"] span').textContent = builder.dark ? 'Hell' : 'Dunkel';
  $('stage').classList.toggle('dark', !!builder.dark);
  $('stage').classList.toggle('dim', !builder.dark && builder.studio.ambient < 0.7);
  document.querySelector('[data-act="light"]').classList.toggle('on', !$('lightpanel').hidden);
  document.querySelector('[data-act="photo"]').classList.toggle('on', builder.photo);
  $('photopanel').hidden = !builder.photo;
  $('photo-aperture').value = builder.aperture * 1000;
  for (const act of ['rotate', 'tip', 'select']) document.querySelector(`[data-act="${act}"]`).disabled = builder.photo;
  const walkBtn = document.querySelector('[data-act="walk"]');
  walkBtn.querySelector('span').textContent = builder.walking ? '\u00dcbersicht' : 'Begehen';
  walkBtn.classList.toggle('on', builder.walking);
  for (const el of document.querySelectorAll('[data-mat]')) el.classList.toggle('active', el.dataset.mat === builder.activeMat);
  for (const el of document.querySelectorAll('[data-code]')) {
    if (el.dataset.mat) { el.classList.toggle('active', el.dataset.code === builder.activeCode && el.dataset.mat === builder.activeMat); continue; }
    el.classList.toggle('active', el.dataset.code === builder.activeCode);
  }
  $('shape-info').textContent = builder.activeCode ? NAMES[builder.activeCode] : '';
  $('mat-info').textContent = `${matName(builder.activeMat)} · ${eur.format(MATERIAL[builder.activeMat].price)}`;
  const n = builder.photo ? 0 : builder.selection.size;
  for (const act of ['dup', 'move', 'del']) document.querySelector(`[data-act="${act}"]`).disabled = !n;
  showHint(builder.photo
    ? 'Foto-Modus · Klick stellt scharf · Ziehen dreht, Pfeiltasten gehen · im Stillstand rechnet das Bild nach · Esc beendet'
    : builder.stamp
    ? `${builder.stamp.items.length} Steine am Cursor · Klick setzt${builder.stamp.moving ? '' : ' (beliebig oft)'} · R dreht die Gruppe · Esc / Rechtsklick beendet`
    : n ? `${n} ausgewählt · Strg+D duplizieren · M verschieben · Entf löschen · Material anklicken färbt um · Shift/Strg+Klick erweitert · Shift+Ziehen = Rahmen`
    : builder.activeCode
    ? 'Klick setzt den Stein · R dreht · T kippt · Rechtsklick entfernt · Esc beendet'
    : 'Form links wählen und bauen – oder Steine anklicken und bearbeiten · ? zeigt alle Tastenkürzel');
  document.querySelector('[data-act="undo"]').disabled = !builder.canUndo;
  document.querySelector('[data-act="redo"]').disabled = !builder.canRedo;
}

function renderOrder() {
  const { rows, pieces, price, weight: grams } = builder.bom();
  let html = '', group = null;
  for (const r of rows) {
    if (r.mat !== group) {
      group = r.mat;
      html += `<tr class="group"><td colspan="4">${matName(r.mat)} · ${eur.format(r.unit)}</td></tr>`;
    }
    html += `<tr><td class="n">${r.count} ×</td><td style="width:38px"><img src="${thumbs.shapes[r.code] ?? ''}" alt="" /></td>
      <td>${NAMES[r.code]} <span class="m">${r.code}</span></td><td class="p">${eur.format(r.total)}</td></tr>`;
  }
  $('bom').innerHTML = rows.length
    ? `<table>${html}</table>`
    : '<p class="empty">Noch leer. Wähle links ein Material und eine Form und setze den ersten Stein auf das Raster.</p>';
  $('totals').innerHTML = `<dl>
      <dt>Steine</dt><dd>${pieces}</dd>
      <dt>Gewicht</dt><dd>${weight(grams)}</dd>
      <dt class="sum">Summe netto</dt><dd class="sum">${eur.format(price)}</dd>
    </dl>${pieces && price < MIN_ORDER ? `<p>Mindestbestellwert ${eur.format(MIN_ORDER)} – es fehlen noch ${eur.format(MIN_ORDER - price)}.</p>` : ''}`;
  $('to-cart').disabled = !pieces;
  syncTool();
}

function orderText() {
  const { rows, pieces, price, weight: grams } = builder.bom();
  const lines = rows.map((r) => `${String(r.count).padStart(3)} × ${NAMES[r.code]} (${r.code}) · ${matName(r.mat)} – ${eur.format(r.total)}`);
  return `${lines.join('\n')}\n\n${pieces} Steine · ${weight(grams)} · ${eur.format(price)} netto`;
}

function download(name, href) {
  const a = Object.assign(document.createElement('a'), { download: name, href });
  a.click();
}

// --------------------------------------------------------------------------- Ereignisse

$('materials').addEventListener('mouseover', (e) => {
  const m = MATERIAL[e.target.closest('[data-mat]')?.dataset.mat];
  if (m) $('mat-info').textContent = `${m.name} · ${eur.format(m.price)}`;
});
$('materials').addEventListener('mouseleave', () => { $('mat-info').textContent = `${matName(builder.activeMat)} · ${eur.format(MATERIAL[builder.activeMat].price)}`; });
$('materials').addEventListener('click', (e) => {
  const el = e.target.closest('[data-mat]');
  if (!el) return;
  builder.setMaterial(el.dataset.mat);
  if (builder.selection.size) builder.paintSelection(el.dataset.mat); // Auswahl umfaerben
});
function pickShape(code, mat = null) {
  if (mat) builder.setMaterial(mat);
  else if (!isAvailable(builder.activeMat, code)) {
    const first = matsWith(code)[0];
    if (!first) return;
    builder.setMaterial(first.id); // Form gibt es im aktuellen Material nicht -> erstes passendes Material
  }
  builder.setShape(code);
}
$('shapes').addEventListener('click', (e) => {
  const el = e.target.closest('[data-code]');
  if (!el) return;
  if (el.dataset.code === builder.activeCode && (!el.dataset.mat || el.dataset.mat === builder.activeMat)) builder.setShape(null);
  else pickShape(el.dataset.code, el.dataset.mat || null);
});
$('shape-mats').addEventListener('click', (e) => {
  const el = e.target.closest('[data-chip]');
  if (el) pickShape(builder.activeCode, el.dataset.chip);
});
$('shape-search').addEventListener('input', (e) => { query = e.target.value.trim().toLowerCase(); syncTool(); });
$('shape-all').addEventListener('click', (e) => { showAll = !showAll; e.currentTarget.classList.toggle('on', showAll); syncTool(); });
$('stage').addEventListener('click', (e) => {
  const act = e.target.closest('[data-act]')?.dataset.act;
  if (act === 'rotate') builder.rotate();
  else if (act === 'tip') builder.tip();
  else if (act === 'select') { builder.cancelStamp(); builder.setShape(null); }
  else if (act === 'dup') builder.duplicateSelection();
  else if (act === 'move') builder.moveSelection();
  else if (act === 'del') builder.deleteSelection();
  else if (act === 'undo') builder.undo();
  else if (act === 'redo') builder.redo();
  else if (act === 'view') builder.fitView();
  else if (act === 'dark') { builder.setDark(!builder.dark); syncTool(); }
  else if (act === 'light') { $('lightpanel').hidden = !$('lightpanel').hidden; syncLight(); syncTool(); }
  else if (act === 'walk') { builder.setWalkMode(!builder.walking); syncTool(); }
  else if (act === 'help') $('help').showModal();
  else if (act === 'photo') builder.setPhotoMode(!builder.photo);
});

const tplInfo = (t) => {
  const price = t.bricks.reduce((sum, b) => sum + unitPrice(b[1], b[0]), 0);
  return `${t.bricks.length} Steine · ${eur.format(price)}`;
};
// Vorlagen als Kacheln mit Vorschaubild, gruppiert und einklappbar (Vorschaubilder entstehen nach dem Laden nach und nach)
$('templates').innerHTML = [...new Set(TEMPLATES.map((t) => t.group))].map((group, g) => `
  <details${g < 2 ? ' open' : ''}><summary>${group}</summary><div class="tpl-grid">${TEMPLATES.map((t, i) => (t.group !== group ? '' : `
  <button class="tpl" data-tpl="${i}" title="${t.note}"><i></i><span>${t.name}</span><em>${tplInfo(t)}</em></button>`)).join('')}</div></details>`).join('')
  + '<button class="tpl clear" data-tpl="clear"><span>Leeres Raster</span></button>';
function renderTemplateThumbs() {
  const todo = TEMPLATES.map((t, i) => i);
  const next = () => {
    const i = todo.shift();
    if (i === undefined) return;
    const el = document.querySelector(`[data-tpl="${i}"] i`);
    if (el) el.style.backgroundImage = `url(${builder.templateThumb(i, 240, 180)})`;
    (window.requestIdleCallback ?? setTimeout)(next);
  };
  next();
}
$('templates').addEventListener('click', (e) => {
  const tpl = e.target.closest('[data-tpl]')?.dataset.tpl;
  if (tpl === 'clear') builder.clear();
  else if (tpl !== undefined) builder.loadTemplate(Number(tpl));
});

$('shot').addEventListener('click', () => download('cado-entwurf.png', builder.screenshot()));
$('photo-shot').addEventListener('click', () => download('cado-foto.png', builder.screenshot()));
$('photo-aperture').addEventListener('input', (e) => builder.setAperture(Number(e.target.value)));
$('export').addEventListener('click', () => {
  const data = { version: 1, created: new Date().toISOString(), ...builder.getState(), order: builder.bom().rows };
  download('cado-entwurf.json', URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })));
});
$('import').addEventListener('click', () => $('import-file').click());

// "Als Vorlage speichern": nur im lokalen Entwicklungsserver (schreibt src/builder/saved/<name>.json)
if (import.meta.env.DEV) {
  $('save-tpl').hidden = false;
  $('save-tpl').addEventListener('click', () => {
    const cur = TEMPLATES[builder.currentTemplate];
    $('tpl-name').value = cur?.name ?? '';
    $('tpl-group').value = cur?.group ?? 'Eigene';
    $('tpl-note').value = cur?.note ?? '';
    $('tpl-groups').innerHTML = [...new Set([...TEMPLATES.map((t) => t.group), 'Eigene'])].map((g) => `<option value="${g}">`).join('');
    const sync = () => {
      const hit = TEMPLATES.find((t) => t.name === $('tpl-name').value.trim());
      $('tpl-revert').hidden = !hit?.saved;
      $('tpl-info').textContent = `${builder.bricks.length} Steine${builder.walking ? ' · Kamerastandpunkt wird als Foto-Ansicht gespeichert' : ' · ohne Foto-Ansicht (dafür vorher „Begehen“)'}. `
        + (hit?.saved ? 'Überschreibt deine gespeicherte Fassung.' : hit ? 'Ersetzt die eingebaute Vorlage gleichen Namens.' : 'Wird als neue Vorlage angelegt.');
    };
    $('tpl-name').oninput = sync;
    sync();
    $('savetpl').showModal();
  });
  $('tpl-cancel').addEventListener('click', () => $('savetpl').close());
  $('tpl-save').addEventListener('click', () => submitTemplate('save'));
  $('tpl-revert').addEventListener('click', () => submitTemplate('revert'));
  async function submitTemplate(action) {
    const name = $('tpl-name').value.trim();
    if (!name) { $('tpl-name').focus(); return; }
    $('savetpl').close();
    const body = action === 'save'
      ? { name, group: $('tpl-group').value.trim() || 'Eigene', note: $('tpl-note').value.trim(), ...builder.toTemplate() }
      : { name };
    const res = await fetch(`/__templates/${action === 'save' ? 'save' : 'delete'}`, { method: 'POST', body: JSON.stringify(body) });
    const out = await res.json();
    const msg = res.ok ? (action === 'save' ? `Gespeichert: ${out.file} – wird beim Deployen mit ausgeliefert` : `Eigene Fassung verworfen: ${out.deleted}`) : `Fehler: ${out.error}`;
    try { sessionStorage.setItem('cado-hint', msg); } catch { /* privater Modus */ } // Vite laedt nach dem Speichern neu
    showHint(msg);
  }
}
$('import-file').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    if (!Array.isArray(data.bricks)) throw new Error('keine Steine');
    builder.loadState({ bricks: data.bricks });
  } catch (err) {
    alert(`Diese Datei ist kein CADO-Entwurf (${err.message}).`);
  }
  e.target.value = '';
});

$('to-cart').addEventListener('click', () => {
  const { price } = builder.bom();
  $('cart-text').textContent = orderText();
  $('cart-note').textContent = (price < MIN_ORDER ? `Mindestbestellwert ${eur.format(MIN_ORDER)}. ` : '')
    + 'Prototyp: Im Shop wird diese Liste direkt in den Warenkorb gelegt und gegen den Lagerbestand geprüft.';
  $('cart').showModal();
});
$('cart-close').addEventListener('click', () => $('cart').close());
$('cart-copy').addEventListener('click', async () => {
  await navigator.clipboard.writeText(orderText());
  $('cart-copy').textContent = 'Kopiert';
  setTimeout(() => ($('cart-copy').textContent = 'Stückliste kopieren'), 1500);
});

// --------------------------------------------------------------------------- Lichtstudio

// Farbtemperatur in Kelvin -> Lichtfarbe (Naeherung nach Tanner Helland)
function kelvinRaw(k) {
  const t = k / 100;
  const r = t <= 66 ? 255 : 329.698727446 * (t - 60) ** -0.1332047592;
  const g = t <= 66 ? 99.4708025861 * Math.log(t) - 161.1195681661 : 288.1221695283 * (t - 60) ** -0.0755148492;
  const b = t >= 66 ? 255 : t <= 19 ? 0 : 138.5177312231 * Math.log(t - 10) - 305.0447927307;
  return [r, g, b].map((v) => Math.min(255, Math.max(0, v)));
}
const WHITE = kelvinRaw(6500);
function kelvinToHex(k) {
  return '#' + kelvinRaw(k).map((v, i) => Math.round(Math.min(255, (v / WHITE[i]) * 255)).toString(16).padStart(2, '0')).join('');
}

// Lichtfarbe gilt fuer das Grundlicht und alle Strahler; einzelne Strahler lassen sich danach umfaerben
const look = (kelvin, brightness, ambient, on) => {
  const color = kelvinToHex(kelvin);
  return { kelvin, tint: color, brightness, ambient, lamps: builder.studio.lamps.map((l, i) => ({ on: on(i), color })) };
};
const PRESETS = {
  day: () => look(6500, 1, 1, () => false),
  studio: () => look(6500, 1, 0.45, () => true),
  warm: () => look(3100, 1.1, 0.3, () => true),
  night: () => look(3400, 1.6, 0.18, (i) => i % 3 === 0),
};

function syncLight() {
  const s = builder.studio;
  $('light-bright').value = Math.round(s.brightness * 100);
  $('light-ambient').value = Math.round(s.ambient * 100);
  $('light-kelvin').value = s.kelvin;
  $('light-lamps').innerHTML = s.lamps.map((l, i) => `<div class="lamp">
    <button data-lamp="${i}" class="${l.on ? 'on' : ''}" title="Strahler ${i + 1} an / aus">${i + 1} ${l.on ? 'an' : 'aus'}</button>
    <input type="color" data-lampcolor="${i}" value="${l.color}" title="Lichtfarbe von Strahler ${i + 1}" /></div>`).join('');
}
$('light-presets').addEventListener('click', (e) => {
  const preset = PRESETS[e.target.closest('[data-preset]')?.dataset.preset];
  if (!preset) return;
  const name = e.target.closest('[data-preset]').dataset.preset;
  if (name === 'night' !== builder.dark && (name === 'night' || name === 'day')) builder.setDark(name === 'night');
  builder.setStudio(preset());
  syncLight();
  syncTool();
});
$('light-bright').addEventListener('input', (e) => builder.setStudio({ brightness: e.target.value / 100 }));
$('light-ambient').addEventListener('input', (e) => {
  builder.setStudio({ ambient: e.target.value / 100 });
  $('stage').classList.toggle('dim', !builder.dark && builder.studio.ambient < 0.7);
});
$('light-kelvin').addEventListener('input', (e) => {
  const kelvin = Number(e.target.value), color = kelvinToHex(kelvin);
  builder.setStudio({ kelvin, tint: color, lamps: builder.studio.lamps.map((l) => ({ ...l, color })) });
  for (const el of document.querySelectorAll('[data-lampcolor]')) el.value = color;
});
$('light-lamps').addEventListener('click', (e) => {
  const el = e.target.closest('[data-lamp]');
  if (!el) return;
  const i = Number(el.dataset.lamp);
  builder.setLamp(i, { on: !builder.studio.lamps[i].on });
  syncLight();
});
$('light-lamps').addEventListener('input', (e) => {
  const el = e.target.closest('[data-lampcolor]');
  if (el) builder.setLamp(Number(el.dataset.lampcolor), { color: el.value });
});

// Darstellungsqualitaet: ?q=niedrig in der Adresse, sonst gemerkt, sonst automatisch
{
  const q = new URLSearchParams(location.search).get('q');
  let saved = 'auto';
  try { saved = localStorage.getItem('cado-quality') ?? 'auto'; } catch { /* privater Modus */ }
  builder.setQuality(['hoch', 'mittel', 'niedrig', 'auto'].includes(q) ? q : saved, false);
  $('quality').value = builder.qualitySetting;
  $('quality').addEventListener('change', (e) => { builder.setQuality(e.target.value); if (e.target.value === 'auto') builder.benchmark(); });
  builder.addEventListener('quality', () => { $('quality-now').textContent = builder.qualitySetting === 'auto' ? `(derzeit ${builder.quality})` : ''; });
}

builder.addEventListener('ready', () => {
  thumbs = builder.makeThumbs();
  renderPalette();
  renderOrder();
  renderTemplateThumbs();
  setTimeout(() => builder.benchmark(), 600);
  try { const msg = sessionStorage.getItem('cado-hint'); if (msg) { sessionStorage.removeItem('cado-hint'); showHint(msg); } } catch { /* privater Modus */ }
});
builder.addEventListener('change', renderOrder);
builder.addEventListener('tool', syncTool);
builder.load();
