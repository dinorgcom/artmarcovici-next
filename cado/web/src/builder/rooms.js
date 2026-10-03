// Grosse Raum-Vorlagen im Massstab ca. 1:20 (30 mm = 60 cm): Dielenboden, gemauerte Waende, Moebel, Buecher, Flaschen.
// Gleiche Regeln wie in templates.js: nur lieferbare Formen je Material, nichts schwebt, alles liegt auf.
// Ein Stein = [Code, Material, x, y, z, Lage]; x/y/z = Mitte der Standflaeche in mm, 'T' kippt, 'R' dreht.

export const range = (from, to, step) => Array.from({ length: Math.floor((to - from) / step) + 1 }, (_, i) => from + i * step);
export const cycle = (list, i) => list[((i % list.length) + list.length) % list.length];

// Dielenboden: Bretter 30 breit laengs y; rows = [[Code, yMitte], ...]
export function floor(b, mats, x0, x1, rows) {
  range(x0 + 15, x1 - 15, 30).forEach((x, i) => {
    for (const [code, y] of rows) b.push([code, cycle(mats, i), x, y, 0]);
  });
}

// Mauer laengs x im Laeuferverband aus liegenden Steinen; pieces = [gerade Lage, ungerade Lage] als Laengenfolgen
const LEN = { 30: '001', 60: '002', 90: '003' };
export function wallX(b, mat, x0, y, z0, courses, pieces, swap = {}) {
  for (let k = 0; k < courses; k++) {
    let x = x0;
    cycle(pieces, k).forEach((len, i) => {
      const m = swap[`${k}:${i}`] ?? mat;
      b.push([LEN[len], m, x + len / 2, y, z0 + 30 * k, len === 30 ? 0 : 'TR']);
      x += len;
    });
  }
}
export function wallY(b, mat, x, y0, z0, courses, pieces, swap = {}) {
  for (let k = 0; k < courses; k++) {
    let y = y0;
    cycle(pieces, k).forEach((len, i) => {
      b.push([LEN[len], swap[`${k}:${i}`] ?? mat, x, y + len / 2, z0 + 30 * k, len === 30 ? 0 : 'T']);
      y += len;
    });
  }
}

// Regal: Boeden (Platte 90) und dazwischen je neun stehende Buecher (Staebchen 10 x 10 x 30) - die Buecher tragen den naechsten Boden
const BOOKS = ['aluminium_red', 'wenge', 'aluminium_blue', 'mahogany', 'brass', 'aluminium_black', 'rosa_verona', 'onyx', 'india_oscuro', 'aluminium', 'rust'];
function shelf(b, x, y, z0, levels, alongY, seed = 0) {
  for (let l = 0; l <= levels; l++) {
    b.push(['007', 'walnut', x, y, z0 + 40 * l, alongY ? 0 : 90]);
    if (l === levels) break;
    range(-40, 40, 10).forEach((d, i) => {
      b.push(['030', cycle(BOOKS, i * 3 + l * 5 + seed), alongY ? x : x + d, alongY ? y + d : y, z0 + 10 + 40 * l, 'T']);
    });
  }
}

// Stuhl: zwei Platten als Sitz, stehende Platte als Lehne; dir = wohin die Lehne zeigt
function chair(b, mat, x, y, z, dir) {
  b.push(['004', mat, x, y, z], ['004', mat, x, y, z + 10]);
  const [dx, dy] = { N: [0, 20], S: [0, -20], E: [20, 0], W: [-20, 0] }[dir];
  b.push(['006', mat, x + dx, y + dy, z, dx ? 'TR' : 'T']);
}

export const plant = (b, x, y, z, tall) => b.push(['010', 'rust', x, y, z], [tall ? 'MOO011' : 'MOO010', 'moss', x, y, z + 30]);
