// Grosse Modelle, Teil 2 (250-400 Steine). Regeln wie in large.js: ein Stein = [Code, Material, x, y, z, Lage],
// x/y/z = Mitte der Standflaeche in mm, nur lieferbare Formen, jeder Stein liegt mit seinem Schwerpunkt auf.
// Platten (004/006/007/123): Lage 0 = laengs y, 90 = laengs x, 'T' = stehend (Wand laengs x), 'TR' = stehend laengs y.
// Quader 002/003: 'TR' = liegend laengs x, 'T' = liegend laengs y. Staebe 014/015/016 liegen flach, Lage 0 = laengs y.
import { range, plant } from './rooms.js';

// ------------------------------------------------------------- Kengo Kuma: Yusuhara Holzbrueckenmuseum (2010)
// Ein Betonpfeiler traegt Lage um Lage laenger auskragende Holzstaebe (umgekehrte Pyramide), oben das Brueckendeck
// mit einer offenen Galerie: Rundstab-Pfosten, Traeger, Sparren, Dachbohlen. 257 Steine.
export function yusuhara() {
  const b = [], M = 'mahogany', C = 'concrete', STICK = { 60: '014', 90: '015', 180: '016' };
  for (const z of [0, 90]) for (const x of [-30, 0, 30]) for (const y of [-30, 0, 30]) b.push(['003', C, x, y, z]);
  const LAYERS = [ // je Lage: [Laenge, x-Mitte] der Staebe laengs x, Spannweite waechst um 60 mm
    [[180, 0]],
    [[90, -75], [60, 0], [90, 75]],
    [[90, -105], [60, -30], [60, 30], [90, 105]],
    [[90, -135], [180, 0], [90, 135]],
    [[90, -165], [60, -90], [60, -30], [60, 30], [60, 90], [90, 165]],
    [[90, -195], [60, -120], [180, 0], [60, 120], [90, 195]],
    [[90, -225], [180, -90], [180, 90], [90, 225]],
  ];
  LAYERS.forEach((pieces, j) => {
    const z = 180 + 20 * j, span = 180 + 60 * j;
    for (const y of [-40, -20, 0, 20, 40]) for (const [len, x] of pieces) b.push([STICK[len], M, x, y, z, 90]);
    for (let x = span / 2 - 5; x > 0; x -= 30) b.push(['015', M, x, 0, z + 10, 0], ['015', M, -x, 0, z + 10, 0]); // Querstaebe
  });
  for (const y of [-30, 0, 30]) for (const x of range(-225, 225, 90)) b.push(['007', M, x, y, 320, 90]); // Deck
  for (const y of [-40, 40]) for (const x of range(-225, 225, 90)) b.push(['043', M, x, y, 330]); // Pfosten
  for (const y of [-40, 40]) for (const x of [-180, 0, 180]) b.push(['016', M, x, y, 390, 90]); // Traeger
  for (const x of range(-240, 240, 60)) b.push(['015', M, x, 0, 400, 0]); // Sparren
  for (const y of [-30, 0, 30]) for (const x of range(-225, 225, 90)) b.push(['007', M, x, y, 410, 90]); // Dach
  return b;
}

// ------------------------------------------------------------- Teehaus mit Engawa und Moosgarten
// Plattform aus Wenge-Traegern und Ahorn-Bohlen, Teeraum mit Tatami aus Filz und Shoji aus stehenden Acrylplatten,
// Flachdach auf Rundstab-Pfosten weit ueber die Veranda gezogen; davor Kiesgarten mit Moos, Trittsteinen,
// Wasserbecken, Laterne, Zaun und zwei Baeumen. 277 Steine.
export function teehaus() {
  const b = [], A = 'maple', W = 'wenge', F = 'felt_white', G = 'acrylic', S = 'sandstone_white', K = 'granite_black';
  for (const x of [-180, -90, 0, 90, 180]) {
    for (const y of [-105, -15, 75]) b.push(['003', W, x, y, 0, 'T']);
    b.push(['001', W, x, 135, 0]);
  }
  for (const y of range(-135, 135, 30)) for (const x of [-180, -90, 0, 90, 180]) b.push(['007', A, x, y, 30, 90]);
  // Teeraum x -120..120 / y -30..120: Tatami im Verband, Shoji hinten und seitlich
  range(-15, 105, 30).forEach((y, r) => {
    if (r % 2 === 0) for (const x of [-90, -30, 30, 90]) b.push(['006', F, x, y, 40, 90]);
    else { b.push(['004', F, -105, y, 40], ['004', F, 105, y, 40]); for (const x of [-60, 0, 60]) b.push(['006', F, x, y, 40, 90]); }
  });
  for (const x of range(-105, 105, 30)) b.push(['007', G, x, 125, 40, 'T']);
  for (const x of [-125, 125]) for (const y of range(-15, 105, 30)) b.push(['007', G, x, y, 40, 'TR']);
  // Dach: Pfosten (3 Rundstaebe = 90), Traeger laengs y, Pfetten laengs x, Bohlen laengs y
  for (const x of [-125, 0, 125]) for (const y of [-35, -75, -135]) for (const z of [40, 70, 100]) b.push(['042', A, x, y, z]);
  for (const x of [-125, 0, 125]) b.push(['016', A, x, 45, 130, 0], ['016', A, x, -135, 130, 0]);
  for (const y of [-165, -105, -45, 15, 75, 125]) for (const x of [-90, 90]) b.push(['016', A, x, y, 140, 90]);
  for (const x of range(-165, 165, 30)) {
    for (const y of [-120, -30, 60]) b.push(['007', A, x, y, 150, 0]);
    b.push(['004', A, x, 120, 150]);
  }
  // Garten
  for (const y of [-180, -240]) for (const x of range(-180, 180, 60)) b.push(['040', S, x, y, 0]);
  for (const x of [-240, 240]) for (const y of range(-180, 120, 60)) b.push(['040', S, x, y, 0]);
  for (const x of range(-150, 150, 60)) b.push(['006', W, x, -165, 5, 90]); // Stufe
  for (const [x, y] of [[-200, -220], [-150, -260], [-250, -120], [250, 20], [180, -220], [-250, 110], [120, -250]]) b.push(['MOO001', 'moss', x, y, 5]);
  for (const [x, y] of [[0, -200], [25, -230], [-15, -258]]) b.push(['004', K, x, y, 5]); // Trittsteine
  b.push(['004', K, 240, -190, 5], ['005', G, 240, -190, 15], ['043', 'rust', 262, -190, 5]); // Becken mit Bambusrohr
  b.push(['001', K, -240, 60, 5], ['004', K, -240, 60, 35], ['001', K, -240, 60, 45], ['040', K, -240, 60, 75]); // Laterne
  for (const x of range(-200, 200, 20)) b.push(['030', W, x, -292, 0, 'T']); // Zaun
  plant(b, -240, -20, 5, true);
  plant(b, 240, 120, 5, false);
  return b;
}

// ------------------------------------------------------------- Louis Kahn: Salk Institute (1965)
// Zwei symmetrische Fluegel: je fuenf Studiertuerme mit Betonkern und Teakwand (Wenge) zur Plaza, dahinter der
// Laborriegel aus zwei langen Betonwaenden mit Dachplatten; dazwischen die Travertin-Plaza mit der Wasserrinne. 338 Steine.
export function salk() {
  const b = [], C = 'concrete', S = 'sandstone_white', W = 'wenge', G = 'acrylic';
  for (const x of [-90, -60, -30, 30, 60, 90]) for (const y of range(-225, 225, 90)) b.push(['007', S, x, y, 0]);
  for (const y of [-210, -90, 30, 150]) b.push(['123', G, 0, y, 0]);
  b.push(['005', G, 0, 225, 0], ['005', G, 0, 255, 0]);
  for (const s of [-1, 1]) {
    for (const y of [-210, -105, 0, 105, 210]) {
      for (const z of [0, 90]) {
        for (const x of [130, 160]) for (const dy of [-15, 15]) b.push(['003', C, s * x, y + dy, z]);
        for (const dy of [-15, 15]) b.push(['007', W, s * 110, y + dy, z, 'TR']);
      }
      b.push(['006', C, s * 145, y, 180, 90]);
    }
    for (const x of [190, 280]) for (let k = 0; k < 5; k++) {
      const z = 30 * k;
      if (k % 2 === 0) for (const y of range(-225, 225, 90)) b.push(['003', C, s * x, y, z, 'T']);
      else { b.push(['002', C, s * x, -240, z, 'T'], ['002', C, s * x, 180, z, 'T'], ['002', C, s * x, 240, z, 'T']); for (const y of range(-165, 105, 90)) b.push(['003', C, s * x, y, z, 'T']); }
    }
    for (const y of range(-255, 255, 30)) b.push(['007', C, s * 235, y, 150, 90]);
  }
  return b;
}

// ------------------------------------------------------------- Ponte Vecchio (Florenz)
// Drei Pfeiler im Fluss, darueber vier Kragsteinlagen, die sich zu Boegen schliessen; Deck aus hellem Granit;
// beidseitig die Laeden aus weissen Quadern mit Mahagoni-Laeden und ueber den Fluss ragenden Daechern,
// in der Mitte die offene Arkade. 398 Steine.
export function ponteVecchio() {
  const b = [], S = 'sandstone_white', L = 'lacquer_white', M = 'mahogany', ROWS = [-60, -30, 0, 30, 60];
  for (const x of range(-285, 285, 30)) for (const y of [-45, 45]) b.push(['007', 'lacquer_blue', x, y, 0]);
  for (const xp of [-180, 0, 180]) for (const y of ROWS) {
    for (const z of [10, 40]) b.push(['002', S, xp, y, z, 'TR']);
    b.push(['007', S, xp, y, 70, 90]);
    b.push(['006', S, xp - 30, y, 80, 90], ['006', S, xp + 30, y, 80, 90]);
    b.push(['006', S, xp - 45, y, 90, 90], ['004', S, xp, y, 90], ['006', S, xp + 45, y, 90, 90]);
    b.push(['007', S, xp - 45, y, 100, 90], ['007', S, xp + 45, y, 100, 90]);
  }
  for (const x of [-285, 285]) for (const y of ROWS) { for (const z of [10, 40, 70]) b.push(['001', S, x, y, z]); b.push(['004', S, x, y, 100]); }
  for (const y of ROWS) { for (const x of range(-225, 225, 90)) b.push(['007', 'granite_white', x, y, 110, 90]); b.push(['004', 'granite_white', -285, y, 110], ['004', 'granite_white', 285, y, 110]); }
  for (const s of [-1, 1]) for (const xs of [-240, -180, -120, -60, 60, 120, 180, 240]) {
    for (const z of [120, 150]) b.push(['002', L, xs - 15, s * 45, z, 'T'], ['002', L, xs + 15, s * 45, z, 'T']);
    b.push(['004', M, xs - 15, s * 10, 120, 'T'], ['004', M, xs + 15, s * 10, 120, 'T']);
    b.push(['007', M, xs - 15, s * 60, 180, 0], ['007', M, xs + 15, s * 60, 180, 0]);
  }
  return b;
}
