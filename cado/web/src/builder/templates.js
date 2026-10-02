// Vorlagen. Ein Stein = [Code, Material, x, y, z, Lage]
//   x / y / z  Mitte der Standflaeche des Steins in mm (x nach rechts, y nach hinten, z Hoehe ueber dem Raster)
//   Lage       Zahl   = Drehung um die Hochachse in Grad
//              Text   = Tastenfolge wie im Builder: R dreht um die Hochachse, T kippt nach vorn ('TR' = Quader liegt quer)
// Regeln: nur Formen, die es im jeweiligen Material gibt (materials.json "only"); nichts schwebt,
// jeder Stein liegt mit seinem Schwerpunkt auf. Pruefen: cado.validate() in der Browser-Konsole.
import * as THREE from 'three';
import { betonGalerie, moosRaum, lounge, aluRaum, stelenHalle, weisserHof, bad, roterSalon, fassade } from './architect.js';
import { kumaGitter, churchOfLight, thermeVals } from './large.js';
import { yusuhara, teehaus, salk, ponteVecchio } from './large2.js';
import { barcelona, nationalgalerie, stelenfeld } from './large3.js';
import { savoye, farnsworth, fallingwater, kolumba, pontDuGard, habitat } from './large4.js';
import { kaitKobo, narutaki, waldhaeuser, tokioGasse } from './large5.js';

function tempelruine() {
  const M = 'carrara', b = [];
  for (const x of [-60, 0, 60]) b.push(['040', M, x, 0, 0]); // Plattform aus 60er Platten (5 mm)
  for (const x of [-60, 0]) b.push(['012', M, x, 0, 5], ['010', M, x, 0, 95], ['005', M, x, 0, 125]);
  b.push(['003', M, -30, 0, 130, 'TR'], ['006', M, -30, 0, 160, 90]); // Gebaelkrest
  b.push(['012', M, 60, 0, 5]); // gebrochene dritte Saeule
  b.push(['010', M, 75, -60, 0, 'TR'], ['005', M, 20, -55, 0], ['024', M, -55, -55, 0, 'TR']); // Truemmer
  return b;
}

function torii() {
  const R = 'aluminium_red', K = 'steel_black'; // der 180er Stab fuer den Nuki ist in Rot nur eloxiert lieferbar
  return [
    ['012', R, -60, 0, 0], ['012', R, 60, 0, 0],
    ['016', R, 0, -5, 90, 90], ['016', R, 0, 5, 90, 90], // Nuki
    ['001', R, -60, 0, 100], ['001', R, 60, 0, 100], ['024', 'brass', 0, 0, 100], // Gakuzuka
    ...[-10, 0, 10].map((y) => ['016', K, 0, y, 130, 90]), // Shimaki
    ...[-10, 0, 10].map((y) => ['016', K, 0, y, 140, 90]), // Kasagi
    ['004', K, -75, 0, 150], ['004', K, 75, 0, 150], // aufgesetzte Enden
  ];
}

export const TEMPLATES = [
  { group: 'CADO Architect', name: 'Beton-Galerie', note: 'Bild 2: Halle aus Betonsteinen, Aluprofile, Lichtschlitz, drei Bildstelen', bricks: betonGalerie(), dark: true, view: { pos: [-15, -330, 75], look: [5, 0, 70], fov: 48 } },
  { group: 'CADO Architect', name: 'Moos-Raum', note: 'Bild 4: dieselbe Halle, zwei Moos-Vitrinen auf Alusockeln, Seitenfenster', bricks: moosRaum(), dark: true, view: { pos: [-10, -250, 80], look: [5, 0, 45], fov: 48 } },
  { group: 'CADO Architect', name: 'Lounge', note: 'Bild 5: Wengewand mit Lichtband, Liegen aus Lederblöcken, Acryl auf Rot', bricks: lounge(), dark: false, view: { pos: [-170, -170, 60], look: [40, 40, 25], fov: 45 } },
  { group: 'CADO Architect', name: 'Alu-Raum', note: 'Bild 6: Raumecke aus Aluminiumsteinen, roter Sockel, Rost-Skulptur', bricks: aluRaum(), dark: false, view: { pos: [175, -170, 70], look: [-10, 20, 40], fov: 42 } },
  { group: 'CADO Architect', name: 'Stelen-Halle', note: 'Bild 8: Glasboden über Wenge, schwarz-rote Stelen', bricks: stelenHalle(), dark: false, view: { pos: [-60, -190, 55], look: [10, 20, 50], fov: 50 } },
  { group: 'CADO Architect', name: 'Weißer Hof', note: 'Bild 7: Sandsteinpfeiler mit Strebekeilen, Rundsäule', bricks: weisserHof(), dark: true, view: { pos: [130, -230, 150], look: [0, 20, 60], fov: 40 } },
  { group: 'CADO Architect', name: 'Bad', note: 'Bild 9: Becken aus polierten Aluwürfeln, Wengesockel mit Alu-Lamellen', bricks: bad(), dark: false, view: { pos: [-190, -150, 60], look: [20, 20, 25], fov: 45 } },
  { group: 'CADO Architect', name: 'Roter Salon', note: 'Bild 10: drei rote Lederblöcke im U, Spiegeltisch, Lamellen', bricks: roterSalon(), dark: false, view: { pos: [150, -240, 95], look: [0, -15, 20], fov: 40 } },
  { group: 'CADO Architect', name: 'Fassade', note: 'Bild 3: weißer Bau mit Fensterbändern aus Acryl', bricks: fassade(), dark: false, view: { pos: [-260, -330, 170], look: [0, 0, 150], fov: 40 } },
  { group: 'Große Modelle', name: 'Kuma-Holzgitter', note: 'Kengo Kuma, GC Prostho Museum: gestapeltes Kreuzgitter aus 286 Ahorn-Stäben', bricks: kumaGitter(), dark: false, view: { pos: [-300, -420, 150], look: [0, 0, 90], fov: 42 } },
  { group: 'Große Modelle', name: 'Church of the Light', note: 'Tadao Ando: Betonkasten, das Kreuz aus Lichtsteinen, Dielen in drei Stufen, Bänke (Schnittmodell)', bricks: churchOfLight(), dark: true, view: { pos: [15, -290, 65], look: [0, 135, 115], fov: 50 } },
  { group: 'Große Modelle', name: 'Therme Vals', note: 'Peter Zumthor: geschichtete Steinblöcke, Becken unter Acryl, alles aus Platten', bricks: thermeVals(), dark: false, view: { pos: [-40, -330, 110], look: [30, 60, 40], fov: 48 } },
  { group: 'Große Modelle', name: 'Yusuhara-Brückenmuseum', note: 'Kengo Kuma: ein Pfeiler trägt Lage um Lage weiter auskragende Holzstäbe, oben die Galerie', bricks: yusuhara(), dark: false, view: { pos: [-380, -300, 200], look: [0, 0, 260], fov: 46 } },
  { group: 'Große Modelle', name: 'Teehaus', note: 'Engawa aus Ahornbohlen, Tatami aus Filz, Shoji aus Acryl, Flachdach; Kiesgarten mit Moos, Becken, Laterne', bricks: teehaus(), dark: false, view: { pos: [-240, -480, 150], look: [0, -20, 70], fov: 48 } },
  { group: 'Große Modelle', name: 'Salk Institute', note: 'Louis Kahn: zwei Flügel mit Studiertürmen (Beton + Teak), Travertin-Plaza mit Wasserrinne', bricks: salk(), dark: false, view: { pos: [0, -330, 60], look: [0, 60, 40], fov: 48 } },
  { group: 'Große Modelle', name: 'Ponte Vecchio', note: 'Drei Kragbögen im Fluss, Läden mit Mahagoni-Läden und über das Wasser ragenden Dächern', bricks: ponteVecchio(), dark: false, view: { pos: [-140, -540, 165], look: [0, 0, 100], fov: 45 } },
  { group: 'Große Modelle', name: 'Barcelona-Pavillon', note: 'Mies van der Rohe 1929: Travertin-Podest, zwei Becken, Onyx-Wand, grüner Marmor, Flachdach auf acht Stützen', bricks: barcelona(), dark: false, view: { pos: [-310, -330, 70], look: [0, 0, 55], fov: 45 } },
  { group: 'Große Modelle', name: 'Neue Nationalgalerie', note: 'Mies van der Rohe 1968: Stahldach auf acht Stützen über der Glashalle, Granitpodest, Skulpturenterrasse', bricks: nationalgalerie(), dark: false, view: { pos: [-170, -520, 60], look: [0, 0, 80], fov: 44 } },
  { group: 'Große Modelle', name: 'Stelenfeld Berlin', note: 'Peter Eisenman 2005: 120 Betonstelen im Raster, zur Mitte hin höher – am besten begehen', bricks: stelenfeld(), dark: false, view: { pos: [30, -560, 90], look: [30, 0, 60], fov: 55 } },
  { group: 'Große Modelle', name: 'Villa Savoye', note: 'Le Corbusier 1931: weißer Kasten auf 16 Pilotis, Bandfenster, Glas-Erdgeschoss, offene Dachterrasse', bricks: savoye(), dark: false, view: { pos: [-330, -380, 60], look: [0, 0, 90], fov: 44 } },
  { group: 'Große Modelle', name: 'Farnsworth House', note: 'Mies van der Rohe 1951: Glashaus zwischen zwei schwebenden weißen Platten, Holzkern, Terrasse', bricks: farnsworth(), dark: false, view: { pos: [-150, -360, 60], look: [0, 0, 80], fov: 44 } },
  { group: 'Große Modelle', name: 'Fallingwater', note: 'Frank Lloyd Wright 1937: auskragende Terrassen über Fels und Wasserfall, Bruchstein, kirschrote Fensterpfosten', bricks: fallingwater(), dark: false, view: { pos: [330, -640, 60], look: [-20, 0, 140], fov: 44 } },
  { group: 'Große Modelle', name: 'Kolumba', note: 'Peter Zumthor 2007: Filtermauerwerk über der Kirchenruine, schlanke Stützen, große Fenster', bricks: kolumba(), dark: false, view: { pos: [-260, -380, 90], look: [0, 0, 150], fov: 46 } },
  { group: 'Große Modelle', name: 'Pont du Gard', note: 'Römisches Aquädukt: drei Bogenreihen aus Hohlkehlen in Ahorn über dem Gardon', bricks: pontDuGard(), dark: false, view: { pos: [-200, -420, 60], look: [0, 0, 170], fov: 48 } },
  { group: 'Große Modelle', name: 'Habitat 67', note: 'Moshe Safdie 1967: drei Terrassenberge aus kreuzweise gestapelten Betonmodulen mit Dachgärten', bricks: habitat(), dark: false, view: { pos: [-200, -420, 120], look: [0, 0, 110], fov: 48 } },
  { group: 'Japan heute', name: 'KAIT Kobo', note: 'Junya Ishigami 2008: Glashalle mit einem Wald aus dünnen Stützen unter der weißen Decke mit Oberlichtern', bricks: kaitKobo(), dark: false, view: { pos: [-250, -470, 75], look: [0, 0, 55], fov: 46 } },
  { group: 'Japan heute', name: 'Haus in Narutaki', note: 'kooo architects, Kyoto: Holzraum mit langen Deckenbalken, Tatami, Shoji, offen zum Moosgarten', bricks: narutaki(), dark: false, view: { pos: [-230, -40, 55], look: [150, 20, 70], fov: 60 } },
  { group: 'Japan heute', name: 'Schwarze Häuser im Wald', note: 'Nach Ryue Nishizawa, SSH No.03: schwarze Boxen auf Stelzen, Stege, Wald aus Moos-Bäumen', bricks: waldhaeuser(), dark: false, view: { pos: [-330, -360, 110], look: [0, 0, 100], fov: 50 } },
  { group: 'Japan heute', name: 'Tokioter Gasse', note: 'Sechs schmale Mikrohäuser mit großen Fenstern und Dachgärten, Straße, Strommasten', bricks: tokioGasse(), dark: false, view: { pos: [-230, -470, 70], look: [0, 60, 140], fov: 46 } },
  { group: 'Architektur', name: 'Tempelruine', note: 'Drei Säulen, Gebälkrest, gestürzte Trommel', bricks: tempelruine() },
  { group: 'Architektur', name: 'Torii', note: 'Schreintor in Zinnober und Schwarz', bricks: torii() },
  {
    group: 'Frei', name: 'Design-Serie', note: 'Gitter, Kugelwürfel, Alu-Buchsen, Moos, Mosaik, Leder',
    bricks: [
      ['GRI003', 'aluminium_black', -105, 30, 0], ['061', 'maple', -60, 30, 0], ['PAN003', 'lacquer_red', -15, 30, 0],
      ['ALWE003', 'wenge', 30, 30, 0], ['MOX003', 'acrylic', 75, 30, 0], ['SSP012', 'stainless', 120, 30, 0],
      ['GRI001', 'aluminium', -105, -20, 0], ['PAN001', 'lacquer_white', -60, -20, 0], ['MOO001', 'moss', -15, -20, 0],
      ['002', 'mosaic_copper', 30, -20, 0], ['AIR078', 'aluminium', 90, -20, 0],
      ['LEGO003', 'leather_blue', -75, -70, 0, 'TR'], ['007', 'mosaic_red', 30, -70, 0, 90], ['001', 'wax', 105, -70, 0],
    ],
  },
];

// Mit "Als Vorlage speichern" abgelegte Fassungen (src/builder/saved/*.json): gleicher Name ersetzt die Code-Vorlage
// an ihrer Stelle, neue Namen kommen in ihre Gruppe (sonst "Eigene"). Werden beim Build mit ausgeliefert.
const SAVED = Object.values(import.meta.glob('./saved/*.json', { eager: true, import: 'default' }));
for (const saved of SAVED) {
  const tpl = { group: 'Eigene', note: '', ...saved, saved: true };
  const i = TEMPLATES.findIndex((x) => x.name === tpl.name);
  if (i >= 0) TEMPLATES[i] = { ...tpl, group: saved.group ?? TEMPLATES[i].group, replaces: true };
  else {
    const last = TEMPLATES.map((x) => x.group).lastIndexOf(tpl.group);
    TEMPLATES.splice(last >= 0 ? last + 1 : TEMPLATES.length, 0, tpl);
  }
}

const Q_TURN = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI / 2);
const Q_TIP = new THREE.Quaternion().setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2);

function orientation(lage = 0) {
  const q = new THREE.Quaternion();
  if (typeof lage === 'number') return q.setFromAxisAngle(new THREE.Vector3(0, 1, 0), (lage * Math.PI) / 180);
  if (Array.isArray(lage)) return q.fromArray(lage).normalize(); // gespeicherte Vorlage: Quaternion
  for (const key of lage) q.premultiply(key === 'T' ? Q_TIP : Q_TURN);
  return q;
}

// rotatedBox(code, q) liefert die Huelle des gedrehten Steins relativ zu seinem Ursprung (kommt vom Builder)
export function templateToBricks(template, nextId, rotatedBox) {
  return template.bricks.map(([code, mat, x, y, z, lage, s], i) => {
    const q = orientation(lage);
    const box = rotatedBox(code, q);
    return {
      id: nextId(), code, mat, s: s ?? (i * 0.6180339) % 1,
      p: [x * 0.001 - (box.min.x + box.max.x) / 2, z * 0.001 - box.min.y, -y * 0.001 - (box.min.z + box.max.z) / 2],
      q: q.toArray(),
    };
  });
}
