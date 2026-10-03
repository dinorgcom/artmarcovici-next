// Grosse Modelle, Teil 5: zeitgenoessisches Japan (Quellen: Spoon & Tamago, Wallpaper*, Instagram).
// Regeln wie in large.js: ein Stein = [Code, Material, x, y, z, Lage], x/y/z = Mitte der Standflaeche in mm.
// Stab 016 = 10 x 10 x 180 (laengster Stab): Lage 0 = laengs y, 90 = laengs x. 053 / 043 / 042 stehend als Stuetzen.
// Platten 007/006/004: Lage 0 = laengs y, 90 = laengs x, 'T' = Wand laengs x, 'TR' = Wand laengs y.
import { range, plant } from './rooms.js';

const hash = (a, b = 0, c = 0) => (((Math.sin(a * 127.1 + b * 311.7 + c * 74.7) * 43758.5453) % 1) + 1) % 1;

// ------------------------------------------------------------- Junya Ishigami: KAIT Kobo (Kanagawa, 2008)
// Glashalle 540 x 360 mit einem Wald aus duennen Stuetzen: jeder 180er Deckentraeger liegt auf zwei bis drei
// zufaellig gesetzten Stuetzen (je eine links und rechts seiner Mitte). Darueber die weisse Decke mit Oberlichtern,
// dazwischen Pflanzen. Rund 330 Steine.
export function kaitKobo() {
  const b = [], A = 'aluminium', G = 'acrylic';
  for (const x of range(-240, 240, 60)) for (const y of range(-150, 150, 60)) b.push(['040', 'granite_white', x, y, 0]);
  const cols = [];
  range(-165, 165, 30).forEach((y, li) => {
    for (const c of [-180, 0, 180]) {
      const left = c - 15 - 5 * Math.floor(hash(li, c, 1) * 13), right = Math.min(255, c + 15 + 5 * Math.floor(hash(li, c, 2) * 13));
      const xs = [left, right];
      if (hash(li, c, 3) > 0.5) xs.push(c + (hash(li, c, 4) > 0.5 ? 1 : -1) * (40 + 5 * Math.floor(hash(li, c, 5) * 8)));
      for (const x of xs) if (Math.abs(x) <= 255 && !cols.some(([cx, cy]) => cy === y && Math.abs(cx - x) < 15)) cols.push([x, y]);
      b.push(['016', A, c, y, 95, 90]);
    }
  });
  for (const [x, y] of cols) b.push(['053', A, x, y, 5, 'T']);
  for (const x of range(-255, 255, 30)) for (const y of [-135, -45, 45, 135]) {
    b.push(['007', hash(x, y, 7) < 0.14 ? G : 'lacquer_white', x, y, 105, 0]); // Decke mit Oberlichtern
  }
  for (const y of [-175, 175]) for (const x of range(-255, 255, 30)) b.push(['007', G, x, y, 5, 'T']);
  for (const x of [-265, 265]) for (const y of range(-150, 150, 30)) b.push(['007', G, x, y, 5, 'TR']);
  // Pflanzen zwischen den Stuetzenreihen, nur wo Platz ist
  for (const [x, y] of [[-200, -150], [-110, -90], [-20, 30], [70, -150], [150, 90], [220, -30], [-230, 90], [30, 150], [120, -60], [-150, 150]]) {
    if (cols.some(([cx, cy]) => Math.abs(cx - x) < 22 && Math.abs(cy - y) < 22)) continue;
    plant(b, x, y, 5, hash(x, y) > 0.5);
  }
  return b;
}

// ------------------------------------------------------------- kooo architects: House in Narutaki (Kyoto)
// Langer Holzraum: Pfosten und Rahmen aus Ahorn, Decke aus 180er Balken quer zum Raum und Deckenbrettern,
// Tatami aus Filz, Shoji aus Acryl, Lehmputz (Sandstein hell), zur Mitte offen zum Moosgarten mit Engawa. Rund 290 Steine.
export function narutaki() {
  const b = [], A = 'maple', N = 'walnut', P = 'sandstone_white', G = 'acrylic';
  const POSTS = range(-270, 270, 90), BAYS = range(-225, 225, 90);
  for (const y of range(-60, 60, 30)) for (const x of [-225, -135, -45, 45, 135, 225]) {
    if (x < -90) b.push(['006', 'felt_white', x - 15, y, 0, 90], ['004', 'felt_white', x + 30, y, 0]); // Tatami
    else b.push(['007', N, x, y, 0, 90]); // Dielen
  }
  for (const y of [-90, 90]) for (const x of POSTS) b.push(['003', A, x, y, 0]); // Pfosten
  for (const x of BAYS) {
    for (const dx of [-15, 15]) b.push(['007', P, x + dx, 90, 0, 'T']); // Rueckwand Lehmputz
    if (Math.abs(x) > 100) for (const dx of [-15, 15]) b.push(['007', G, x + dx, -90, 0, 'T']); // Shoji, Mitte offen
  }
  for (const x of [-275, 275]) for (const y of range(-60, 60, 30)) b.push(['007', P, x, y, 0, 'TR']);
  for (const y of [-90, 90]) for (const x of BAYS) b.push(['003', A, x, y, 90, 'TR']); // Rahmen laengs
  for (const x of [-275, 275]) b.push(['002', A, x, -45, 90, 'T'], ['003', A, x, 30, 90, 'T']); // Rahmen quer
  for (const x of range(-255, 255, 30)) b.push(['016', A, x, 0, 120, 0]); // lange Deckenbalken quer zum Raum
  for (const y of range(-75, 75, 30)) for (const x of [-225, -135, -45, 45, 135, 225]) b.push(['007', A, x, y, 130, 90]); // Deckenbretter
  // Einrichtung: niedriger Tisch, Kissen, Vase in der Nische
  b.push(['004', N, 60, 0, 10], ['004', N, 120, 0, 10], ['007', N, 90, 0, 20, 90]);
  b.push(['004', 'felt_red', 90, -40, 10], ['004', 'felt_red', 90, 40, 10], ['010', 'onyx', -240, 60, 10]);
  // Engawa und Moosgarten
  for (const x of [-225, -135, -45, 45, 135, 225]) b.push(['007', 'wenge', x, -120, 0, 90]);
  for (const x of range(-240, 240, 60)) for (const y of [-180, -240]) b.push(['040', 'sandstone_white', x, y, 0]);
  for (const [x, y] of [[-200, -190], [-140, -250], [-60, -200], [30, -250], [110, -190], [180, -250], [240, -200], [-20, -170]]) b.push(['MOO001', 'moss', x, y, 5]);
  for (const [x, y] of [[-100, -250], [70, -215]]) b.push(['004', 'granite_black', x, y, 5]);
  plant(b, 230, -250, 5, true);
  return b;
}

// ------------------------------------------------------------- Ryue Nishizawa: SSH No.03 (Karuizawa)
// Schwarze Boxen auf Stelzen im Wald, verbunden durch Stege, eine Seite jeweils verglast; Baeume aus Nussbaum-
// Staemmen mit Moos-Kronen, Moos am Boden. Rund 260 Steine.
export function waldhaeuser() {
  const b = [], K = 'aluminium_black', G = 'acrylic';
  const box = (c, d, glass) => {
    for (const x of [c - 40, c + 40]) for (const y of [d - 40, d + 40]) b.push(['043', K, x, y, 0]); // Stelzen
    for (const y of [d - 40, d + 40]) b.push(['015', K, c, y, 60, 90]); // Traeger
    for (const x of [c - 30, c, c + 30]) b.push(['007', K, x, d, 70, 0]); // Boden
    for (const x of [c - 30, c, c + 30]) b.push(['006', glass ? G : K, x, d - 40, 80, 'T'], ['006', K, x, d + 40, 80, 'T']);
    for (const y of [d - 15, d + 15]) for (const x of [c - 40, c + 40]) b.push(['006', K, x, y, 80, 'TR']);
    for (const x of [c - 30, c, c + 30]) b.push(['007', K, x, d, 140, 0]); // Dach
  };
  box(-200, 0, true);
  box(0, 0, true);
  box(200, 0, false);
  box(-100, -190, true);
  box(100, 190, true);
  for (const c of [-100, 100]) b.push(['043', K, c - 40, 0, 0], ['043', K, c + 40, 0, 0], ['007', 'wenge', c, 0, 60, 90]); // Stege
  // Wald
  const boxes = [[-200, 0], [0, 0], [200, 0], [-100, -190], [100, 190], [-100, 0], [100, 0]];
  const free = (x, y, r) => boxes.every(([c, d]) => Math.abs(x - c) > 45 + r || Math.abs(y - d) > 45 + r);
  let n = 0;
  for (let k = 0; k < 90 && n < 22; k++) {
    const x = -270 + 10 * Math.round(hash(k, 1) * 54), y = -270 + 10 * Math.round(hash(k, 2) * 54);
    if (!free(x, y, 20) || b.some((p) => p[4] === 0 && p[0] === '043' && p[1] === 'walnut' && Math.hypot(p[2] - x, p[3] - y) < 40)) continue;
    const h = 2 + Math.floor(hash(k, 3) * 2);
    for (let i = 0; i < h; i++) b.push(['043', 'walnut', x, y, 60 * i]);
    b.push([hash(k, 4) > 0.5 ? 'MOO012' : 'MOO011', 'moss', x, y, 60 * h]);
    n++;
  }
  for (let k = 0; k < 40; k++) {
    const x = -270 + 10 * Math.round(hash(k, 11) * 54), y = -270 + 10 * Math.round(hash(k, 12) * 54);
    if (free(x, y, 25) && !b.some((p) => p[4] === 0 && Math.abs(p[2] - x) < 30 && Math.abs(p[3] - y) < 30)) b.push(['MOO001', 'moss', x, y, 0]);
  }
  return b;
}

// ------------------------------------------------------------- Tokioter Gasse (Mikrohaeuser, nach Instagram)
// Sechs schmale Haeuser (je 90 breit, 150 tief) mit grossen Fenstern, Glas-Erdgeschoss, Dachgarten; davor Gehweg
// und Strasse, Strommasten mit 180er Leitungen. Rund 380 Steine.
export function tokioGasse() {
  const b = [], G = 'acrylic';
  for (const x of range(-240, 240, 60)) {
    for (const y of [-150, -90]) b.push(['040', 'granite_black', x, y, 0]);
    b.push(['040', 'granite_white', x, -30, 0]);
  }
  // Haus: Raster 3 x 5 Stuetzen aus stehenden 90ern je Geschoss; Fenster = Acryl in der Frontreihe
  const HOUSES = [
    { mat: 'concrete', floors: 3, win: { 1: [1], 2: [0, 1, 2] }, roof: 'moss' },
    { mat: 'aluminium_black', floors: 4, win: { 0: [1], 2: [0, 1], 3: [1, 2] } },
    { mat: 'lacquer_white', floors: 3, win: { 0: [0, 1, 2], 1: [2], 2: [0, 1] }, setback: true },
    { mat: 'walnut', floors: 3, win: { 0: [1], 1: [0, 1, 2], 2: [1] } },
    { mat: 'concrete', floors: 2, win: { 0: [0, 1], 1: [1, 2] }, roof: 'moss' },
    { mat: 'sandstone_white', floors: 4, win: { 1: [1], 2: [1], 3: [0, 1, 2] } },
  ];
  HOUSES.forEach((h, i) => {
    const x0 = -270 + 90 * i;
    for (let f = 0; f < h.floors; f++) for (let cx = 0; cx < 3; cx++) for (let cy = 0; cy < 5; cy++) {
      if (h.setback && f === h.floors - 1 && cy === 0) continue; // oberstes Geschoss zurueckgesetzt
      const glass = cy === 0 && (h.win[f] ?? []).includes(cx);
      b.push(['003', glass ? G : h.mat, x0 + 15 + 30 * cx, 15 + 30 * cy, 90 * f]);
    }
    const top = 90 * h.floors;
    if (h.roof) for (const cx of [0, 2]) b.push(['MOO001', 'moss', x0 + 15 + 30 * cx, 105, top]);
    if (h.setback) b.push(['010', 'lacquer_white', x0 + 45, 15, top - 90], ['MOO010', 'moss', x0 + 45, 15, top - 60]);
  });
  b.push(['043', 'aluminium', -165, 135, 360], ['002', 'lacquer_red', -120, -20, 5]); // Antenne, Getraenkeautomat
  // Strommasten und Leitungen
  for (const x of [-270, -90, 90, 270]) b.push(['012', 'aluminium', x, -50, 5], ['012', 'aluminium', x, -50, 95]);
  for (const c of [-180, 0, 180]) for (const dy of [-10, 10]) b.push(['016', 'aluminium_black', c, -50 + dy, 185, 90]);
  for (const x of [-200, 20, 200]) plant(b, x, -45, 5, true);
  return b;
}
