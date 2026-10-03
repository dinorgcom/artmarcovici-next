// Nachbauten der Fotos von biest.com/work/cado-architect - so nah am Bild wie mit lieferbaren Steinen moeglich.
// Regeln wie in templates.js: nur lieferbare Formen je Material, nichts schwebt, alles liegt auf.
// view = Kamerastandpunkt des Fotos in Werkbank-mm: pos / look = [x, y, z], fov in Grad.
import { range, cycle, wallX, wallY } from './rooms.js';

const LB = 'leather_beige', LR = 'leather_red';
const PLATE = { 30: '004', 60: '006', 90: '007' };

// Plattenboden im Laeuferverband, Platten laengs x; rows = Anzahl Reihen (je 30 tief), patterns = Laengenfolgen je Reihe
function floorBond(b, mats, x0, y0, z, rows, patterns) {
  for (let r = 0; r < rows; r++) {
    let x = x0;
    for (const len of cycle(patterns, r)) {
      b.push([PLATE[len], cycle(mats, r), x + len / 2, y0 + 15 + 30 * r, z, len === 30 ? 0 : 90]);
      x += len;
    }
  }
}
// Dielen laengs y (30 breit): rows = [[Code, yMitte], ...]
function planks(b, mats, x0, x1, z, rows) {
  range(x0 + 15, x1 - 15, 30).forEach((x, i) => { for (const [code, y] of rows) b.push([code, cycle(mats, i), x, y, z]); });
}

// ---------------------------------------------------------------------------------- Bild 2 und 4: Halle aus Betonsteinen
function betonHalle(b, glazed) {
  const C = 'concrete';
  for (const x of [-60, 0, 60]) for (const y of [-120, -60, 0, 60, 120]) b.push(['040', 'sandstone_white', x, y, 0]); // Fliesen 60 x 60
  wallX(b, C, -90, 135, 5, 8, [[60, 60, 60], [90, 90]]); // Rueckwand
  wallY(b, C, -75, -150, 5, 8, [[60, 60, 60, 90], [90, 60, 60, 60]]); // linke Wand
  const glass = {};
  for (const key of glazed) glass[key] = 'acrylic';
  wallY(b, C, 75, -150, 5, 8, [[60, 60, 60, 90], [90, 60, 60, 60]], glass); // rechte Wand mit Lichtoeffnung
  for (const y of [-120, -60, 0, 60, 120]) b.push(['016', 'aluminium', 0, y, 245, 90]); // Aluprofile quer ueber den Waenden
  for (const x of [-60, -30, 0, 30, 60]) b.push(['007', C, x, 90, 255]); // Deckenplatten ueber dem hinteren Teil
}

export function betonGalerie() {
  const b = [];
  betonHalle(b, ['3:1', '4:1', '5:1']); // schmaler Lichtschlitz
  b.push(['002', 'lacquer_white', 5, -45, 5], ['002', 'lacquer_red', -30, 5, 5], ['002', 'lacquer_black', 35, 15, 5]); // drei Bildstelen
  b.push(['007', 'acrylic', -20, -135, 5, 'T']); // Glasscheibe im Vordergrund
  return b;
}

export function moosRaum() {
  const b = [];
  betonHalle(b, ['1:1', '1:2', '2:1', '2:2', '3:1', '3:2']); // grosses Fenster rechts
  for (const x of [-30, 30]) {
    b.push(['007', 'aluminium', x, -30, 5], ['007', 'aluminium', x, -30, 15], ['MOX003', 'acrylic', x, -30, 25, 'T']); // Vitrine auf Sockel
  }
  return b;
}

// ---------------------------------------------------------------------------------- Bild 5: Lounge
export function lounge() {
  const b = [], W = 'wenge';
  planks(b, ['wenge', 'walnut', 'wenge', 'wenge'], -180, 180, 0, [['007', -60], ['007', 30], ['004', 90]]);
  const band = { '2:0': 'light', '2:1': 'light', '2:2': 'light', '2:3': 'light' };
  wallX(b, W, -180, 90, 10, 6, [[90, 90, 90, 90], [30, 90, 90, 90, 60]], band); // Wengewand mit Lichtband
  wallY(b, W, 165, -105, 10, 6, [[90, 90], [60, 90, 30]], { '2:0': 'light', '2:1': 'light' });
  const daybed = (mat, x, back) => {
    b.push(['LEGO003', mat, x, 60, 10, 'TR'], ['LEGO003', mat, x, 30, 10, 'TR']);
    if (back) b.push(['LEGO003', mat, x, 60, 40, 'TR']);
  };
  daybed(LB, -135, true);
  b.push(['002', W, -75, 45, 10, 'T']); // Wengetisch zwischen den Liegen
  daybed(LB, -15, true);
  b.push(['002', W, 45, 45, 10, 'T']);
  daybed(LR, 105, true); // rotes Ecksofa
  b.push(['LEGO003', LR, 135, -30, 10, 'T'], ['LEGO003', LR, 105, -30, 10, 'T'], ['LEGO003', LR, 135, -30, 40, 'T']);
  b.push(['LEGO003', LB, -45, -60, 10, 'T'], ['LEGO003', LB, -15, -60, 10, 'T']); // Liege im Vordergrund
  b.push(['LEGO003', LB, -135, -60, 10, 'T'], ['LEGO003', LB, -105, -60, 10, 'T']);
  for (const x of [-75, 30]) b.push(['005', 'steel_red', x, -75, 10], ['001', 'acrylic', x, -75, 15]); // Acryl auf Rot
  b.push(['005', 'steel_red', 60, -15, 10], ['005', 'acrylic', 60, -15, 15], ['005', 'acrylic', 60, -15, 20]);
  return b;
}

// ---------------------------------------------------------------------------------- Bild 6: Raumecke aus Aluminiumsteinen
export function aluRaum() {
  const b = [], A = 'aluminium';
  floorBond(b, [A], -150, -90, 0, 6, [[60, 60, 60, 60, 60], [30, 60, 60, 60, 60, 30]]);
  const dark = {};
  for (const i of range(0, 5, 1)) dark[`4:${i}`] = 'aluminium_black'; // der spiegelnde dunkle Streifen in Lage 5
  wallX(b, A, -150, 75, 10, 6, [[60, 60, 60, 60, 60], [30, 60, 60, 60, 60, 30]], dark);
  wallY(b, A, -135, -90, 10, 6, [[60, 60, 30], [30, 60, 60]], dark);
  b.push(['002', 'lacquer_red', 30, -15, 10, 'T'], ['002', 'lacquer_red', 60, -15, 10, 'T']); // roter Sockel aus zwei Quadern
  b.push(['014', 'rust', 45, -35, 40, 90], ['024', 'rust', 32.5, -17.5, 40], ['017', 'rust', 47, -17.5, 40]); // Rost-Skulptur
  b.push(['043', 'rust', 50, 0, 40, 'TR'], ['043', 'rust', 65, -17.5, 40]);
  return b;
}

// ---------------------------------------------------------------------------------- Bild 8: Halle mit Glasboden und Stelen
export function stelenHalle() {
  const b = [], A = 'aluminium', K = 'lacquer_black', R = 'lacquer_red';
  planks(b, ['wenge'], -150, 150, 0, [['007', -45], ['007', 45]]); // Wenge unter dem Boden
  planks(b, ['acrylic'], -150, 150, 10, [['007', -45]]); // Glasboden vorn
  planks(b, [A], -150, 150, 10, [['007', 45]]); // Aluboden hinten
  wallX(b, K, -150, 75, 20, 3, [[60, 60, 60, 60, 60], [30, 60, 60, 60, 60, 30]]); // drei schwarze Lagen
  wallX(b, A, -150, 75, 110, 2, [[30, 60, 60, 60, 60, 30], [60, 60, 60, 60, 60]]); // darueber Aluminium
  for (const z of [20, 50, 80, 110]) b.push(['001', A, 135, 30, z]); // Alupfeiler rechts
  // Stele 1: breiter schwarzer Quader, rotes Band, Quader - auf roter Platte
  b.push(['006', R, -75, 0, 20, 90], ['006', R, -75, 30, 20, 90]);
  b.push(['002', K, -75, 15, 30, 'TR'], ['006', R, -75, 15, 60, 90], ['002', K, -75, 15, 70, 'TR']);
  // Stele 2: Wuerfel, Band, Wuerfel
  b.push(['006', R, 0, 0, 20, 90], ['006', R, 0, 30, 20, 90]);
  b.push(['001', K, 0, 15, 30], ['004', 'aluminium_red', 0, 15, 60], ['001', K, 0, 15, 70]);
  // Stele 3: rund
  for (const dx of [-15, 15]) for (const dy of [-15, 15]) b.push(['004', 'aluminium_red', 75 + dx, 15 + dy, 20]);
  b.push(['010', 'aluminium_black', 75, 15, 30], ['135', 'aluminium_red', 75, 15, 60], ['010', 'aluminium_black', 75, 15, 70]);
  return b;
}

// ---------------------------------------------------------------------------------- Bild 7: weisser Sandstein - Pfeiler mit Strebekeilen
export function weisserHof() {
  const b = [], S = 'sandstone_white';
  for (const y of [-45, -15, 15, 45]) for (const x of [-90, -30, 30, 90]) b.push(['006', S, x, y, 0, 90]);
  for (const x of [-90, 0, 90]) {
    b.push(['002', S, x, 45, 10], ['095', S, x, 15, 10, 'RT'], ['006', S, x, 30, 70]); // Pfeilerschaft, Strebekeil, Deckplatte
    if (x === 0) b.push(['012', S, x, 45, 80]); // in der Mitte eine Rundsaeule
    else b.push(['002', S, x, 45, 80], ['001', S, x, 45, 140]);
  }
  for (const x of [-45, 45]) b.push(['002', S, x, 45, 10, 'TR'], ['002', S, x, 45, 40, 'TR']); // niedrige Mauer dazwischen
  return b;
}

// ---------------------------------------------------------------------------------- Bild 9: Becken aus polierten Aluwuerfeln
export function bad() {
  const b = [], A = 'aluminium';
  floorBond(b, ['mahogany'], -135, -90, 0, 6, [[90, 90, 90], [60, 90, 90, 30]]);
  for (const x of [-60, -30, 0, 30, 60]) b.push(['001', A, x, -30, 10], ['001', A, x, 30, 10]); // Beckenrand
  b.push(['001', A, -60, 0, 10], ['001', A, 60, 0, 10], ['007', 'acrylic', 0, 0, 10, 90]); // Stirnseiten, Wasser
  wallX(b, 'wenge', -135, 75, 10, 2, [[90, 90, 90], [30, 90, 90, 60]]); // Wengesockel
  for (const x of range(-120, 120, 40)) b.push(['015', A, x, 75, 70, 'T']); // Lamellen aus Alustaeben
  [[-120, -75], [-120, -40], [-120, -5]].forEach(([x, y]) => b.push(['010', A, x, y, 10], ['135', A, x, y, 40])); // Hocker
  b.push(['002', A, 120, -60, 10, 'T'], ['002', A, 120, 0, 10, 'T'], ['001', A, 120, 45, 10]); // abgetreppte Aluwand rechts
  b.push(['002', A, 120, -15, 40, 'T'], ['001', A, 120, 30, 40], ['001', A, 120, 45, 70]);
  return b;
}

// ---------------------------------------------------------------------------------- Bild 10: drei rote Lederbloecke im U
export function roterSalon() {
  const b = [], A = 'aluminium', W = 'lacquer_white';
  planks(b, [A], -150, 150, 0, [['007', -45], ['007', 45]]); // Alu-Unterboden
  planks(b, [W], -150, 150, 10, [['007', -15], ['006', 60]]); // weisser Boden, vorn zurueckgesetzt
  b.push(['LEGO003', LR, -45, -15, 20, 'T'], ['LEGO003', LR, 15, 15, 20, 'TR'], ['LEGO003', LR, 15, -45, 20, 'TR']); // Sofas im U
  b.push(['006', A, 15, -15, 20, 90]); // spiegelnder Tisch
  for (const x of range(-140, 140, 20)) b.push(['015', A, x, 80, 20, 'T']); // Lamellenwand
  b.push(['007', A, -120, 0, 20], ['006', A, -120, 15, 30], ['004', A, -120, 30, 40]); // Alutreppe links
  for (const x of [75, 135]) b.push(['006', 'lacquer_red', x, 55, 20, 90], ['002', 'acrylic', x, 55, 30, 'TR']); // Acryl auf Rot
  b.push(['011', 'aluminium_black', 105, 15, 20]);
  return b;
}

// ---------------------------------------------------------------------------------- Bild 3: weisser Bau mit Fensterbaendern aus Acryl
export function fassade() {
  const b = [], S = 'sandstone_white';
  const bandCourse = (z) => {
    wallX(b, S, -75, -30, z, 1, [[60, 60, 30]]);
    wallX(b, S, -75, 30, z, 1, [[30, 60, 60]]);
    b.push(['001', S, -60, 0, z], ['001', S, 60, 0, z]);
  };
  const windows = (z) => {
    for (const y of [-30, 30]) for (const x of [-60, -30, 0, 30, 60]) b.push(['002', Math.abs(x) === 60 ? S : 'acrylic', x, y, z]);
    b.push(['002', 'acrylic', -60, 0, z], ['002', 'acrylic', 60, 0, z]);
  };
  [0, 90, 180].forEach((z) => { bandCourse(z); windows(z + 30); });
  bandCourse(270);
  for (const x of [-60, -30, 0, 30, 60]) b.push(['007', S, x, 0, 300]); // Dachplatten
  return b;
}
