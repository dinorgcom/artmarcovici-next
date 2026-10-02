// Grosse Modelle, Teil 4: noch mehr Klassiker. Regeln wie in large.js bis large3.js:
// ein Stein = [Code, Material, x, y, z, Lage], x/y/z = Mitte der Standflaeche in mm, nur lieferbare Formen.
// Platten 004/005/006/007: Lage 0 = laengs y, 90 = laengs x, 'T' = stehende Wand laengs x, 'TR' = stehende Wand laengs y.
// Quader 002/003: 'TR' = liegend laengs x, 'T' = liegend laengs y. Staebe 014/015/016: Lage 0 = laengs y, 90 = laengs x.
import { range, plant } from './rooms.js';

// heller Modellsockel (wie bei Architekturmodellen)
const lawn = (b, code, x0, x1, y0, y1, step, mat) => {
  for (const x of range(x0, x1, step)) for (const y of range(y0, y1, step)) b.push([code, mat, x, y, 0]);
};

// ------------------------------------------------------------- Le Corbusier: Villa Savoye (Poissy, 1931)
// Weisser Kasten auf 16 Pilotis ueber der Wiese, zurueckgesetztes Glas-Erdgeschoss, rundum Bandfenster,
// oben der offene Wohn- und Terrassengeschoss (Schnittmodell ohne Dach). Rund 285 Steine.
export function savoye() {
  const b = [], W = 'lacquer_white', G = 'acrylic';
  lawn(b, '040', -270, 270, -270, 270, 60, 'granite_white');
  for (const [x, y] of [[-200, -200], [-230, 150], [200, 210], [220, -170], [-150, 230]]) plant(b, x, y, 5, (x + y) % 2 === 0);
  for (const x of [-90, -30, 30, 90]) for (const y of [-90, -30, 30, 90]) b.push(['011', W, x, y, 5]); // Pilotis
  for (const y of [-60, 60]) for (const x of [-45, -15, 15, 45]) b.push(['006', G, x, y, 5, 'T']);
  for (const x of [-60, 60]) for (const y of [-30, 0, 30]) b.push(['006', G, x, y, 5, 'TR']);
  for (const x of [-90, -30, 30, 90]) for (const y of [-90, 0, 90]) b.push(['007', W, x, y, 65, 0]); // Unterzuege
  for (const y of range(-120, 120, 30)) for (const x of [-90, 0, 90]) b.push(['007', W, x, y, 75, 90]); // Decke
  // Bandfenster: Bruestung, Glasband, Sturz
  [[W, '004', 85], [G, '005', 115], [W, '004', 145]].forEach(([m, code, z]) => {
    for (const y of [-130, 130]) for (const x of range(-120, 120, 30)) b.push([code, m, x, y, z, 'T']);
    for (const x of [-130, 130]) for (const y of range(-105, 105, 30)) b.push([code, m, x, y, z, 'TR']);
  });
  for (const y of range(-105, 105, 30)) b.push(['007', G, 0, y, 85, 'TR']); // Glaswand Wohnraum / Terrasse
  for (const [x, y] of [[60, 60], [90, -60]]) b.push(['010', W, x, y, 85], ['MOO010', 'moss', x, y, 115]); // Pflanzkuebel
  b.push(['LEGO003', 'leather_black', -70, -40, 85, 'TR'], ['002', 'walnut', -70, 40, 85, 'TR']);
  return b;
}

// ------------------------------------------------------------- Mies van der Rohe: Farnsworth House (Plano, 1951)
// Glashaus zwischen zwei weissen Platten, die an acht Stuetzenpaaren ueber der Wiese schweben; Holzkern,
// offene Veranda, Travertin-Terrasse, Baeume. Rund 290 Steine.
export function farnsworth() {
  const b = [], W = 'lacquer_white', A = 'aluminium', G = 'acrylic';
  lawn(b, '004', -255, 255, -135, 135, 30, 'sandstone_white');
  const beams = (z) => {
    for (const y of [-40, 40]) b.push(['016', A, -150, y, z, 90], ['016', A, 30, y, z, 90], ['014', A, 150, y, z, 90], ['014', A, 210, y, z, 90]);
  };
  for (const x of range(-210, 210, 60)) for (const y of [-40, 40]) b.push(['042', A, x, y, 10], ['043', A, x, y, 60]);
  beams(40);
  for (const x of range(-225, 225, 30)) b.push(['007', W, x, 0, 50, 0]); // Boden
  for (const y of [-30, 30]) for (const x of range(-225, 105, 30)) b.push(['006', G, x, y, 60, 'T']);
  for (const x of [-235, 125]) b.push(['006', G, x, 0, 60, 'TR']);
  for (const x of [-75, -45]) b.push(['002', 'walnut', x, 0, 60], ['004', 'walnut', x, 0, 120]); // Kern
  beams(120);
  for (const x of range(-225, 225, 30)) b.push(['007', W, x, 0, 130, 0]); // Dach
  for (const x of [75, 165]) for (const y of [-105, -75]) b.push(['007', 'sandstone_white', x, y, 10, 90]); // Terrasse
  plant(b, -200, -105, 10, true);
  plant(b, -240, 105, 10, false);
  plant(b, 215, 110, 10, true);
  plant(b, 240, -110, 10, false);
  return b;
}

// ------------------------------------------------------------- Frank Lloyd Wright: Fallingwater (Pennsylvania, 1937)
// Dunkler Fels ueber dem Becken, davor der Wasserfall; darauf das Haus aus Bruchstein (Sandstein rot) mit
// gestuft auskragenden Terrassen (Sandstein hell), Glasbaendern, kirschroten Fensterpfosten und dem Kamin. Rund 340 Steine.
export function fallingwater() {
  const b = [], R = 'granite_black', S = 'sandstone_red', T = 'sandstone_white', G = 'acrylic', F = 'steel_red';
  // Becken
  for (const y of [-240, -210, -180, -150]) for (const x of range(-225, 225, 90)) b.push(['007', 'lacquer_blue', x, y, 0, 90], ['007', G, x, y, 10, 90]);
  // Fels: drei Lagen im Verband
  for (let k = 0; k < 3; k++) for (const y of range(-105, 105, 30)) {
    const row = (k + (y + 105) / 30) % 2 ? [['002', -180], ['003', -105], ['003', -15], ['003', 75], ['001', 135]] : [['003', -165], ['003', -75], ['003', 15], ['003', 105]];
    for (const [code, x] of row) b.push([code, R, x, y, 30 * k, code === '001' ? 0 : 'TR']);
  }
  for (const z of [20, 50]) for (const x of range(-135, 75, 30)) b.push(['005', G, x, -137.5, z, 'T']); // Wasserfall
  // Erdgeschoss (z 90-150): Rueckwand, Seitenwaende, Mittelwand, Glasfront
  // Sandstein rot gibt es nicht als 90er-Quader: ein 003 wird zu 002 + 001
  const wallX = (y, z, pieces) => { for (const [code, x] of pieces) code === '003' ? b.push(['002', S, x - 15, y, z, 'TR'], ['001', S, x + 30, y, z]) : b.push([code, S, x, y, z, 'TR']); };
  const wallY = (x, z, pieces) => { for (const [code, y] of pieces) code === '003' ? b.push(['002', S, x, y - 15, z, 'T'], ['001', S, x, y + 30, z]) : b.push([code, S, x, y, z, 'T']); };
  wallX(90, 90, [['002', -150], ['002', -90], ['002', -30], ['002', 30], ['002', 90]]);
  wallX(90, 120, [['003', -135], ['002', -60], ['003', 15], ['002', 90]]);
  for (const x of [-165, 105]) { wallY(x, 90, [['002', -60], ['003', 15]]); wallY(x, 120, [['003', -45], ['002', 30]]); }
  for (const z of [90, 120]) wallX(0, z, [['002', -120], ['002', -60], ['002', 0], ['002', 60]]);
  for (const x of range(-135, 75, 30)) b.push(['006', G, x, -90, 90, 'T']);
  for (const z of range(150, 300, 30)) b.push(['001', S, -165, 90, z]); // Kamin
  // Decke und erste Terrasse (kragt 30 mm nach vorn)
  for (const x of range(-135, 105, 30)) for (const y of [-45, 45]) b.push(['007', T, x, y, 150, 0]);
  b.push(['007', T, -165, -45, 150, 0], ['006', T, -165, 30, 150, 0]); // ueber der linken Wand (neben dem Kamin kuerzer)
  for (const x of range(-165, 105, 30)) {
    for (const y of [-75, 15]) b.push(['007', T, x, y, 160, 0]);
    if (x !== -165) b.push(['006', T, x, 90, 160, 0]); // hinten auf Decke und Rueckwand
  }
  for (const x of range(-165, 105, 30)) b.push(['004', T, x, -115, 170, 'T']); // Bruestung
  // Obergeschoss (z 170-230)
  for (const x of [-120, 60]) wallY(x, 170, [['002', -30], ['002', 30]]), wallY(x, 200, [['002', -30], ['002', 30]]);
  for (const z of [170, 200]) wallY(-30, z, [['003', 0]]);
  for (const z of [170, 200]) wallX(75, z, [['002', -120], ['002', -60], ['002', 0], ['002', 60]]);
  for (const x of range(-90, 30, 30)) b.push(['006', G, x, -60, 170, 'T']);
  for (const x of [-120, -60, 0, 60]) for (const z of [170, 200]) b.push(['030', F, x, -70, z, 'T']); // Fensterpfosten
  // zweite Terrasse (kragt zur Seite)
  for (const y of [-45, -15, 15, 45]) b.push(['007', T, -120, y, 230, 90], ['007', T, -30, y, 230, 90], ['007', T, 60, y, 230, 90]);
  b.push(['007', T, -30, 75, 230, 90], ['007', T, 60, 75, 230, 90]);
  // Dachzimmer (z 240-300) mit Dach
  for (const x of [-105, -15]) for (const z of [240, 270]) b.push(['002', S, x, 0, z, 'T']);
  for (const z of [240, 270]) b.push(['002', S, -90, 60, z, 'TR'], ['002', S, -30, 60, z, 'TR']);
  for (const y of [-15, 15, 45]) b.push(['007', T, -60, y, 300, 90]);
  for (const [x, y] of [[-240, -60], [210, 30], [-240, 90], [230, -80]]) plant(b, x, y, 0, x < 0);
  return b;
}

// ------------------------------------------------------------- Peter Zumthor: Kolumba (Koeln, 2007)
// Grauer Ziegelkasten ueber der Kirchenruine: unten Filtermauerwerk (Ziegel mit Luecken, jede Lage um 45 mm
// versetzt), oben geschlossen mit grossen Fenstern, innen schlanke Stuetzen durch den Ruinensaal, Flachdach. Rund 300 Steine.
export function kolumba() {
  const b = [], S = 'sandstone_white', A = 'aluminium';
  // je Lage [Laenge, Anfang]: 60er Ziegel mit 30 mm Luecken, jede zweite Lage um 45 mm versetzt, Enden mit Wuerfeln
  const LX = [[[60, -150], [60, -60], [60, 30], [60, 90]], [[30, -150], [60, -105], [60, -15], [60, 75]]];
  const LY = [[[60, -120], [60, -30], [60, 60]], [[30, -120], [60, -75], [60, 15], [30, 90]]];
  const brick = (len, along, a, fixed, z) => b.push([len === 30 ? '001' : '002', S, along === 'x' ? a : fixed, along === 'x' ? fixed : a, z, len === 30 ? 0 : along === 'x' ? 'TR' : 'T']);
  for (let k = 0; k < 7; k++) {
    for (const y of [-135, 135]) for (const [len, a] of LX[k % 2]) brick(len, 'x', a + len / 2, y, 30 * k);
    for (const x of [-135, 135]) for (const [len, a] of LY[k % 2]) brick(len, 'y', a + len / 2, x, 30 * k);
  }
  // geschlossener Oberteil mit Fenstern (Acryl)
  for (let k = 0; k < 3; k++) {
    const z = 210 + 30 * k, off = k % 2 ? 45 : 0;
    for (const y of [-135, 135]) {
      const cut = k === 1 && y === -135; // grosses Fenster zur Strasse
      for (const [code, x] of off ? [['002', -120], ['003', -45], ['003', 45], ['002', 120]] : [['003', -105], ['003', -15], ['003', 75], ['001', 135]]) {
        b.push([code, cut && Math.abs(x) < 60 ? 'acrylic' : S, x, y, z, code === '001' ? 0 : 'TR']);
      }
    }
    for (const x of [-135, 135]) {
      for (const [code, y] of off ? [['003', -75], ['003', 15], ['002', 90]] : [['002', -90], ['003', -15], ['003', 75]]) {
        b.push([code, k === 1 && x === 135 && y === 15 ? 'acrylic' : S, x, y, z, code === '001' ? 0 : 'T']);
      }
    }
  }
  for (const y of range(-105, 105, 30)) for (const x of [-135, 135]) b.push(['004', S, x, y, 300]); // Mauerkrone
  // schlanke Stuetzen, Traeger, Dach
  for (const x of [-45, 45]) for (const y of [-90, -30, 30, 90]) b.push(['053', A, x, y, 0, 'T'], ['053', A, x, y, 90, 'T'], ['053', A, x, y, 180, 'T'], ['042', A, x, y, 270]);
  for (const x of [-45, 45]) b.push(['016', A, x, -60, 300, 0], ['015', A, x, 75, 300, 0]);
  for (const y of range(-105, 105, 30)) for (const x of [-90, 0, 90]) b.push(['007', 'lacquer_white', x, y, 310, 90]);
  // Ruine der alten Kirche: Mauerreste, Saeulenstuempfe, Kapelle
  for (const [code, x, y, lage] of [['002', -75, -60, 'TR'], ['002', 90, 60, 'T'], ['001', 90, 15, 0], ['010', 0, 0, 0], ['011', 90, -75, 0], ['001', -90, 60, 0], ['002', 0, 90, 'TR']]) {
    b.push([code, 'sandstone_red', x, y, 0, lage]);
  }
  b.push(['002', 'sandstone_red', -75, -60, 30, 'TR']);
  return b;
}

// ------------------------------------------------------------- Pont du Gard (roemisch, 1. Jh.)
// Drei Bogenreihen uebereinander aus Hohlkehlen (nur in Holz lieferbar): unten hoch und doppelt tief, in der Mitte
// doppelt tief, oben eine Reihe mit der Wasserrinne; 30 mm breite Pfeiler. Darunter der Gardon. Rund 330 Steine.
export function pontDuGard() {
  const b = [], M = 'maple', ARCHES = range(-240, 240, 60);
  const tier = (rows, zPier, pierParts, zArch) => {
    for (const y of rows) for (const c of ARCHES) {
      b.push(['013', M, c - 15, y, zArch, 'RRRT'], ['013', M, c + 15, y, zArch, 'RRT']);
    }
    for (const y of rows) for (const x of range(-270, 270, 60)) pierParts.forEach(([code, dz]) => b.push([code, M, x, y, zPier + dz]));
    for (const y of rows) for (const x of range(-225, 225, 90)) b.push(['007', M, x, y, zArch + 30, 90]);
  };
  tier([-15, 15], 0, [['002', 0], ['002', 60]], 120);
  tier([-15, 15], 160, [['002', 0], ['001', 60]], 250);
  tier([0], 290, [['001', 0]], 320);
  for (const y of [-10, 10]) for (const x of [-180, 0, 180]) b.push(['016', M, x, y, 360, 90]); // Rinne
  // Fluss vor und hinter der Bruecke, Ufersteine
  for (const y of [-135, -105, -75, -45, 45, 75, 105, 135]) for (const x of [-90, 0, 90]) b.push(['007', 'lacquer_blue', x, y, 0, 90], ['007', 'acrylic', x, y, 10, 90]);
  for (const [x, y] of [[-165, -120], [-165, 90], [165, -60], [165, 120], [-200, -150], [200, 150]]) b.push(['001', 'granite_white', x, y, 0]);
  return b;
}

// ------------------------------------------------------------- Moshe Safdie: Habitat 67 (Montreal, 1967)
// Drei Terrassenberge aus Betonmodulen (je ein liegender Quader 30 x 60), Lage um Lage kreuzweise gestapelt,
// dazwischen Luecken, auf den Daechern Gaerten. Jedes Modul liegt auf zwei Modulen darunter. Rund 580 Steine.
export function habitat() {
  const b = [], C = 'concrete', NX = 20, NY = 10, cx = (i) => -300 + 15 + 30 * i, cy = (j) => -150 + 15 + 30 * j;
  const hash = (i, j, k) => (((Math.sin(i * 127.1 + j * 311.7 + k * 74.7) * 43758.5453) % 1) + 1) % 1;
  const limit = (i, j) => Math.max(...[3.5, 9.5, 16.5].map((c) => 13 - Math.abs(i - c) * 0.9 - Math.abs(j - 4.5) * 1.1));
  let below = null;
  for (let k = 0; k < 14; k++) {
    const occ = Array.from({ length: NX }, () => new Array(NY).fill(false));
    const alongX = k % 2 === 1;
    const ok = (i, j) => i < NX && j < NY && !occ[i][j] && limit(i, j) >= k && (k === 0 || below[i][j]);
    for (let i = 0; i < NX; i++) for (let j = 0; j < NY; j++) {
      const [i2, j2] = alongX ? [i + 1, j] : [i, j + 1];
      if (!ok(i, j) || !ok(i2, j2) || hash(i, j, k) > (k === 0 ? 0.85 : 0.95)) continue;
      occ[i][j] = occ[i2][j2] = true;
      b.push(['002', C, (cx(i) + cx(i2)) / 2, (cy(j) + cy(j2)) / 2, 30 * k, alongX ? 'TR' : 'T']);
    }
    if (below) for (let i = 0; i < NX; i++) for (let j = 0; j < NY; j++) {
      if (below[i][j] && !occ[i][j] && hash(i, j, k + 20) < 0.22) b.push(['MOO001', 'moss', cx(i), cy(j), 30 * k]); // Dachgarten
    }
    below = occ;
  }
  return b;
}
