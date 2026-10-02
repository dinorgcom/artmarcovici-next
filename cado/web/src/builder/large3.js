// Grosse Modelle, Teil 3: moderne Klassiker. Regeln wie in large.js / large2.js:
// ein Stein = [Code, Material, x, y, z, Lage], x/y/z = Mitte der Standflaeche in mm, nur lieferbare Formen.
// Platten 004/006/007: Lage 0 = laengs y, 90 = laengs x, 'T' = stehende Wand laengs x, 'TR' = stehende Wand laengs y.
// Staebe 014/015/016 liegen flach (Lage 0 = laengs y, 90 = laengs x), 053 'T' = stehender Stab 10 x 10 x 90.
import { range } from './rooms.js';

// ------------------------------------------------------------- Mies van der Rohe: Barcelona-Pavillon (1929)
// Travertin-Podest mit grossem und kleinem Wasserbecken, Flachdach auf acht Stuetzen, frei stehende Onyx-Wand,
// Waende aus gruenem Marmor, Glaswand, Travertinmauern und Georg Kolbes Figur im kleinen Becken. Rund 280 Steine.
export function barcelona() {
  const b = [], T = 'sandstone_white', G = 'acrylic', K = 'granite_black';
  const inBig = (x, y) => x < -90 && y < -30, inSmall = (x, y) => x > 150 && y > 30;
  // Podest aus Travertin, Becken: dunkler Grund unter Acryl, buendig mit dem Podest
  for (const x of range(-255, 255, 30)) for (const y of range(-135, 135, 30)) {
    if (inBig(x, y) || inSmall(x, y)) b.push(['005', G, x, y, 5]);
    else b.push(['004', T, x, y, 0]);
  }
  for (const x of [-240, -180, -120]) for (const y of [-120, -60]) b.push(['040', K, x, y, 0]);
  for (const x of [180, 240]) for (const y of [60, 120]) b.push(['040', K, x, y, 0]);
  // Stuetzen, Traeger, Dach
  for (const x of [-120, -40, 40, 120]) for (const y of [-40, 40]) b.push(['053', 'aluminium', x, y, 10, 'T']);
  for (const y of [-40, 40]) for (const x of [-90, 90]) b.push(['016', 'aluminium', x, y, 100, 90]);
  for (const x of range(-180, 180, 60)) b.push(['016', 'aluminium', x, 0, 110, 0]);
  for (const y of range(-75, 75, 30)) for (const x of [-135, -45, 45, 135]) b.push(['007', 'lacquer_white', x, y, 120, 90]);
  // Onyx-Wand frei unter dem Dach
  for (const x of range(-60, 60, 30)) b.push(['007', 'onyx', x, 10, 10, 'T']);
  // gruener Marmor (India Oscuro): 60 + 30 hoch
  const green = (x, y, along) => b.push(['006', 'india_oscuro', x, y, 10, along], ['004', 'india_oscuro', x, y, 70, along]);
  for (const y of [-45, -15, 15, 45]) green(-150, y, 'TR');
  for (const y of [45, 75, 105, 135]) green(140, y, 'TR');
  // Travertinmauern und Glaswand
  for (const x of range(-255, -75, 30)) b.push(['007', T, x, 140, 10, 'T']);
  for (const y of [45, 75, 105]) b.push(['007', T, -265, y, 10, 'TR']);
  for (const x of range(165, 255, 30)) b.push(['007', T, x, 145, 10, 'T']);
  for (const y of [45, 75, 105]) b.push(['007', T, 265, y, 10, 'TR']);
  for (const x of range(15, 105, 30)) b.push(['007', G, x, 70, 10, 'T']);
  // Barcelona-Liegen vor der Onyx-Wand, Kolbes "Morgen" im kleinen Becken
  for (const x of [-45, 45]) b.push(['LEGO003', 'leather_beige', x, -20, 10, 'TR']);
  b.push(['010', 'brass', 240, 115, 10], ['030', 'brass', 240, 115, 40, 'T'], ['030', 'brass', 240, 115, 70, 'T']);
  return b;
}

// ------------------------------------------------------------- Mies van der Rohe: Neue Nationalgalerie (Berlin, 1968)
// Granitpodest, darauf die Glashalle unter dem schwebenden Stahldach (Kassetten aus zwei Traegerlagen),
// acht Stuetzen am Rand, zwei Schaechte aus gruenem Marmor, Skulpturen auf der Terrasse. Rund 430 Steine.
export function nationalgalerie() {
  const b = [], S = 'steel_black', G = 'acrylic';
  for (const x of range(-270, 270, 60)) for (const y of range(-270, 270, 60)) b.push(['040', 'granite_black', x, y, 0], ['040', 'granite_white', x, y, 5]);
  // Glashalle 180 x 180
  for (const y of [-90, 90]) for (const x of range(-75, 75, 30)) b.push(['007', G, x, y, 10, 'T']);
  for (const x of [-90, 90]) for (const y of range(-60, 60, 30)) b.push(['007', G, x, y, 10, 'TR']);
  for (const x of [-45, 45]) b.push(['003', 'india_oscuro', x, 0, 10]);
  // acht Stuetzen, zwei Traegerlagen, Dachplatten
  for (const x of [-180, -120, 120, 180]) for (const y of [-90, 90]) b.push(['012', S, x, y, 10]);
  for (const x of range(-180, 180, 60)) for (const y of [-90, 90]) b.push(['016', S, x, y, 100, 0]);
  for (const y of range(-180, 180, 30)) for (const x of [-90, 90]) b.push(['016', S, x, y, 110, 90]);
  for (const x of range(-165, 165, 30)) for (const y of range(-165, 165, 30)) b.push(['004', S, x, y, 120]);
  // Terrasse: Skulpturen und Baenke
  b.push(['012', 'rust', -230, -220, 10], ['037', 'rust', -230, -185, 10], ['014', 'rust', -200, -220, 10, 90]);
  b.push(['010', 'brass', 225, -225, 10], ['001', 'brass', 255, -225, 10], ['030', 'brass', 225, -225, 40, 'T']);
  for (const y of [-50, 50]) b.push(['LEGO003', 'leather_black', 0, y, 10, 'TR']);
  return b;
}

// ------------------------------------------------------------- Peter Eisenman: Denkmal fuer die ermordeten Juden Europas (Berlin, 2005)
// Massstabsgetreu (ca. 1:32): 187 Stelen 30 x 60 mm, Gaenge 30 mm, 10 bis 150 mm hoch (Original 0,2 bis 4,7 m),
// zur Mitte hin hoeher, die Oberkanten wogen. Das Feld ist groesser als das Raster. Rund 560 Steine.
export function stelenfeld() {
  const b = [], C = 'concrete';
  for (const x of range(-480, 480, 60)) for (const y of range(-450, 450, 90)) {
    const u = x / 500, v = y / 470;
    const ring = Math.max(0, 1 - Math.hypot(u * 0.95, v * 1.05));
    const wave = 0.5 + 0.5 * Math.sin(u * 5.3 + v * 2.1) * Math.cos(v * 4.2 - u * 1.3);
    const jitter = ((Math.sin(x * 12.9898 + y * 78.233) * 43758.5453) % 1 + 1) % 1;
    const s = 0.6 * ring ** 0.45 + 0.3 * wave * Math.sqrt(ring) + 0.1 * jitter;
    const h = 10 + Math.round(Math.min(1, s) * 14) * 10; // 10 ... 150 mm
    const n = Math.floor(h / 30), rest = (h - 30 * n) / 10;
    for (let k = 0; k < n; k++) b.push(['002', C, x, y, 30 * k, 'T']);
    for (let k = 0; k < rest; k++) b.push(['006', C, x, y, 30 * n + 10 * k, 0]);
  }
  return b;
}
