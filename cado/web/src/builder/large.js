// Grosse Modelle (250-450 Steine) nach Architektur-Ikonen. Gleiche Regeln wie templates.js:
// ein Stein = [Code, Material, x, y, z, Lage], x/y/z = Mitte der Standflaeche in mm, nur lieferbare Formen,
// nichts schwebt. Platten: Lage 0 = laengs y, 90 = laengs x. Staebe 016 = 10 x 10 x 180, liegen flach.
import { range } from './rooms.js';

// Plattenlage: fuellt das Rechteck x0..x1 / y0..y1 (Vielfache von 30) auf Hoehe z mit liegenden Platten laengs dir.
// 10 mm: 007 / 006 / 004 (ungerade Reihen beginnen mit dem kuerzeren Stueck -> versetzte Stoesse); 5 mm: 123 (120 lang)
function slab(b, mat, x0, y0, x1, y1, z, dir, thin = false) {
  const along = dir === 'x' ? x1 - x0 : y1 - y0, across = dir === 'x' ? y1 - y0 : x1 - x0;
  const even = thin ? [[120, '123']] : [[90, '007'], [60, '006'], [30, '004']];
  const odd = thin ? even : [[60, '006'], [90, '007'], [30, '004']];
  for (let a = 0, row = 0; a < across; a += 30, row++) {
    const kinds = row % 2 ? odd : even;
    for (let p = 0; p < along;) {
      const [len, code] = kinds.find(([l]) => l <= along - p) ?? kinds[kinds.length - 1];
      b.push([code, mat, dir === 'x' ? x0 + p + len / 2 : x0 + a + 15, dir === 'x' ? y0 + a + 15 : y0 + p + len / 2, z, dir === 'x' ? 90 : 0]);
      p += len;
    }
  }
}

// ------------------------------------------------------------- Kengo Kuma: Holzgitter (GC Prostho Museum, Kasugai)
// Gestapeltes Kreuzgitter aus Ahorn-Staeben 10 x 10 x 180: Lage um Lage abwechselnd laengs x und laengs y,
// Raster 60 mm, 22 Lagen = 220 mm hoch. 286 Staebe.
export function kumaGitter() {
  const b = [], M = 'maple';
  for (let k = 0; k < 22; k++) {
    if (k % 2 === 0) for (const y of range(-180, 180, 60)) for (const x of [-90, 90]) b.push(['016', M, x, y, 10 * k, 90]);
    else for (const x of range(-150, 150, 60)) for (const y of [-90, 90]) b.push(['016', M, x, y, 10 * k, 0]);
  }
  return b;
}

// ------------------------------------------------------------- Tadao Ando: Church of the Light (Ibaraki, 1989)
// Betonkasten 450 x 300, 9 Lagen hoch; in der Altarwand das Kreuz aus Lichtsteinen (003 = 30 x 30 x 90):
// stehende Saeule ueber die ganze Hoehe, Querbalken in Lage 6. Boden aus dunklen Dielen, in drei Stufen zum Altar
// hin abfallend; niedrige Baenke mit Ruecklehne aus Staeben. Vorderseite und Dach offen (Schnittmodell). 258 Steine.
export function churchOfLight() {
  const b = [], C = 'concrete', W = 'wenge', L = 'light';
  // Altarwand (y = 135), Kreuz bei x = 0
  for (let k = 0; k < 9; k++) {
    const z = 30 * k;
    if (k === 5) {
      for (const x of [-195, -135, 135, 195]) b.push(['002', C, x, 135, z, 'TR']);
      b.push(['003', L, -60, 135, z, 'TR'], ['003', L, 60, 135, z, 'TR']); // Querbalken des Kreuzes
      continue;
    }
    const left = k % 2 ? [['002', -195], ['003', -120], ['002', -45]] : [['003', -180], ['002', -105], ['002', -45]];
    for (const [code, x] of left) b.push([code, C, x, 135, z, 'TR'], [code, C, -x, 135, z, 'TR']);
  }
  for (const z of [0, 90, 180]) b.push(['003', L, 0, 135, z]); // Saeule des Kreuzes
  // Seitenwaende (x = +-210), von vorn bis an die Altarwand
  for (const x of [-210, 210]) {
    for (let k = 0; k < 9; k++) {
      const pieces = k % 2 ? [['002', -120], ['003', -45], ['002', 30], ['002', 90]] : [['003', -105], ['003', -15], ['003', 75]];
      for (const [code, y] of pieces) b.push([code, C, x, y, 30 * k, 'T']);
    }
  }
  // Dielenboden in drei Stufen: hinten (Altar) tief, vorn hoch
  for (const x of range(-180, 180, 30)) {
    b.push(['007', W, x, 75, 0]);
    for (const z of [0, 10]) b.push(['007', W, x, -15, z]);
    for (const z of [0, 10, 20]) b.push(['007', W, x, -105, z]);
  }
  // Baenke: Sitz aus Platten, Lehne aus Staeben, Mittelgang frei
  for (const [y, z] of [[-120, 30], [-75, 30], [-30, 20], [15, 20], [60, 10]]) {
    b.push(['007', W, -135, y, z, 90], ['006', W, -60, y, z, 90], ['006', W, 60, y, z, 90], ['007', W, 135, y, z, 90]);
    b.push(['015', W, -135, y + 10, z + 10, 90], ['014', W, -60, y + 10, z + 10, 90], ['014', W, 60, y + 10, z + 10, 90], ['015', W, 135, y + 10, z + 10, 90]);
  }
  return b;
}

// ------------------------------------------------------------- Peter Zumthor: Therme Vals (1996)
// Alles aus geschichteten Platten: Boden zweilagig, drei Steinbloecke aus 10/10/5-mm-Lagen mit wechselnder Richtung
// (Valser Schichtung), Becken aus blauen Platten unter Acryl, Sockelbaender in Granit schwarz. Dach offen. ~400 Steine.
export function thermeVals() {
  const b = [], C = 'concrete';
  // Boden um das Becken (x -120..30, y -120..150), zwei Lagen
  for (const z of [0, 10]) {
    slab(b, C, -210, -180, -120, 180, z, 'y');
    slab(b, C, 30, -180, 210, 180, z, 'y');
    slab(b, C, -120, -180, 30, -120, z, 'x');
    slab(b, C, -120, 150, 30, 180, z, 'x');
  }
  // Becken: blaue Platten, darueber Acryl = Wasser buendig mit dem Boden
  for (const x of range(-105, 15, 30)) for (const y of [-75, 15, 105]) b.push(['007', 'lacquer_blue', x, y, 0], ['007', 'acrylic', x, y, 10]);
  // Steinbloecke: Lagenfolge 10 / 5 / 10 / 10 / 5 mm, 10er-Lagen wechseln die Richtung, die ersten Lagen als Sockel in Granit
  const block = (x0, y0, x1, y1) => {
    const long = x1 - x0 >= y1 - y0 ? 'x' : 'y';
    let z = 20, i = 0;
    for (const t of [10, 5, 10, 10, 5, 10, 5, 10, 10, 5, 10, 5, 10, 10, 5, 10, 5, 10, 10, 5, 10, 5]) {
      if (z + t > 200) break;
      if (t === 5) slab(b, i < 4 ? 'granite_black' : C, x0, y0, x1, y1, z, long, true);
      else slab(b, C, x0, y0, x1, y1, z, i % 2 ? (long === 'x' ? 'y' : 'x') : long);
      z += t;
      i++;
    }
  };
  block(60, 60, 180, 150);    // rechts hinten, 120 x 90
  block(90, -120, 180, 0);    // rechts vorn, 90 x 120
  block(-210, -60, -120, 60); // links, 90 x 120
  // Sitzstufen am Becken und eine Liegebank
  for (const x of [-105, -45]) b.push(['004', C, x, -150, 20]);
  b.push(['007', 'wenge', 120, -150, 20, 90], ['007', 'wenge', 120, -150, 30, 90]);
  return b;
}
