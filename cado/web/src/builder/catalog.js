// Stammdaten fuer den Builder. Masse und Volumen kommen aus /catalog.json (Blender-Export),
// Materialien, Preise und Dichten aus materials.json (dieselbe Datei liest das Blender-Skript).
import { MATERIALS, GROUPS } from './materials.js';

export { MATERIALS, GROUPS };
export const MATERIAL = Object.fromEntries(MATERIALS.map((m) => [m.id, m]));
export const MIN_ORDER = 100;

export const FAMILIES = [
  { name: 'Quader', codes: ['001', '002', '003', '024', '039', '017'] },
  { name: 'Platten', codes: ['004', '005', '006', '007', '123', '040', '121', '009'] },
  { name: 'Stäbe', codes: ['014', '015', '016', '053', '030'] },
  { name: 'Zylinder', codes: ['010', '011', '012', '021', '135', '073', '074', '041', '042', '043'] },
  { name: 'Rohre & Profile', codes: ['049', '058', '057', '056', '093', '065', '064'] },
  { name: 'Rundungen', codes: ['018', '044', '045', '046', '047', '048', '019', '023', '013', '117', '116', '068', '067'] },
  { name: 'Schrägen', codes: ['008', '022', '028', '020', '037', '063', '114', '094', '095', '096', '036', '035', '031', '120'] },
  { name: 'Pyramiden & Ecken', codes: ['027', '029', '025', '026'] },
  { name: 'Design', codes: ['GRI001', 'GRI002', 'GRI003', 'GRI004', 'GRI007', '059', '060', '061', 'PAN001', 'PAN002', 'PAN003',
    'ALWE001', 'ALWE002', 'ALWE003', 'AIR078', 'AIR079', 'PRO151', 'SSP012', 'MOX003', 'LEGO003',
    'MOO001', 'MOO002', 'MOO003', 'MOO010', 'MOO011', 'MOO012'] },
];

export const NAMES = {
  '001': 'Würfel 30', '002': 'Quader 60', '003': 'Quader 90', '004': 'Platte 30 × 10', '005': 'Platte 30 × 5',
  '006': 'Platte 60', '007': 'Platte 90', '008': 'Dreikant 30', '009': 'Dreieckplatte', '010': 'Zylinder 30',
  '011': 'Zylinder 60', '012': 'Zylinder 90', '013': 'Hohlkehle', '014': 'Stab 60', '015': 'Stab 90',
  '016': 'Stab 180', '017': 'Würfel 10', '018': 'Viertelzylinder 30', '019': 'Halbzylinder', '020': 'Rampe',
  '021': 'Scheibe', '022': 'Dreikant 10', '023': 'Halbscheibe', '024': 'Quader 15 × 30', '025': 'Eck-Tetraeder',
  '026': 'Würfel mit Eckschnitt', '027': 'Pyramide', '028': 'Dreikant 15', '029': 'Pyramide flach', '030': 'Stäbchen 30',
  '031': 'Rhomboid', '035': 'Trapez', '036': 'Pultdach', '037': 'Keil 45', '041': 'Rundstab 10',
  '042': 'Rundstab 30', '043': 'Rundstab 60', '044': 'Viertelzylinder 60', '045': 'Viertelzylinder 90',
  '046': 'Viertelstab 30', '047': 'Viertelstab 60', '048': 'Viertelstab 90',
  // Sonderformen (Masse aus Fotos geschaetzt)
  '039': 'Pfeiler 10 × 45', '040': 'Platte 60 × 60', '053': 'Stab 10 × 90', '063': 'Rampe 65', '114': 'Rampe 90',
  '094': 'Pultkeil 30', '095': 'Pultkeil 60', '096': 'Pultkeil 90', '120': 'Rhomboid 90 (Stein)', '123': 'Platte 120',
  '121': 'Matte 60 × 90', '135': 'Scheibe 10', '073': 'Zylinder 60 × 60', '074': 'Zylinder 60 × 90',
  '093': 'T-Profil 30', '065': 'T-Profil 60', '064': 'T-Profil 90', '049': 'Ring', '058': 'Rohr 30',
  '057': 'Rohr 60', '056': 'Rohr 90', '117': 'Dreiviertelzylinder 30', '116': 'Dreiviertelzylinder 60',
  '068': 'Schrägschnitt 30', '067': 'Schrägschnitt 60',
  // Design-Serie
  GRI001: 'Gitterwürfel', GRI002: 'Gitterquader 60', GRI003: 'Gitterquader 90', GRI004: 'Gitterplatte 30', GRI007: 'Gitterplatte 90',
  '059': 'Holzrahmen 30', '060': 'Holzrahmen 60', '061': 'Holzrahmen 90',
  PAN001: 'Kugelwürfel', PAN002: 'Kugelwürfel 2-fach', PAN003: 'Kugelwürfel 3-fach',
  ALWE001: 'Würfel mit Alu-Buchse', ALWE002: 'Quader 60 mit Alu-Buchsen', ALWE003: 'Quader 90 mit Alu-Buchsen',
  LEGO003: 'Lederblock 90', MOO001: 'Moos-Würfel', MOO002: 'Moos-Quader 60', MOO003: 'Moos-Quader 90',
  MOO010: 'Moos-Zylinder 30', MOO011: 'Moos-Zylinder 60', MOO012: 'Moos-Zylinder 90', AIR078: 'Linse 30', AIR079: 'Linse 60', PRO151: 'U-Profil', SSP012: 'Edelstahlrohr 90', MOX003: 'Acrylbox mit Moos',
};

// Design & Sonderteile: eine Kategorie fuer alle Design-Steine, jeder Eintrag ein fertiges Produkt (Form + Material),
// in der Palette immer sichtbar. Reihenfolge: Design-Formen in Standardmaterialien, dann Design-Materialien, dann Rohre.
export function designItems() {
  const items = [], seen = new Set();
  const push = (code, mat, name) => {
    const key = code + '|' + mat;
    if (seen.has(key) || !isAvailable(mat, code)) return;
    seen.add(key);
    items.push([code, mat, name ?? `${NAMES[code]} · ${MATERIAL[mat].name}`]);
  };
  for (const code of FAMILIES.find((f) => f.name === 'Design').codes) {
    for (const m of MATERIALS) if (m.group !== 'Design' && m.only) push(code, m.id);
  }
  for (const m of MATERIALS) {
    if (m.group === 'Design') for (const code of m.only ?? []) push(code, m.id, m.id === 'light' ? 'Lichtstein (leuchtet)' : undefined);
  }
  for (const code of ['049', '058', '057', '056']) push(code, 'aluminium'); // Ring und Rohre
  return items;
}

// reine Quader: Auflagehoehe ohne Raycast bestimmbar
export const BOX_CODES = new Set(['001', '002', '003', '004', '005', '006', '007', '014', '015', '016', '017', '024', '030', '039', '040', '053', '121', '123',
  // Gitter, Rahmen, Kugelwuerfel, Rohr: zum Stapeln wie massive Quader behandeln
  'GRI001', 'GRI002', 'GRI003', 'GRI004', 'GRI007', '059', '060', '061', 'PAN001', 'PAN002', 'PAN003',
  'ALWE001', 'ALWE002', 'ALWE003', 'PRO151', 'SSP012', 'MOX003', 'LEGO003',
  'MOO001', 'MOO002', 'MOO003', 'MOO010', 'MOO011', 'MOO012']);

// Design-Formen kosten unabhaengig vom Material 25 EUR
export const DESIGN_PRICE = 25;
const DESIGN_CODES = new Set(FAMILIES.find((f) => f.name === 'Design').codes);
export function unitPrice(mat, code) {
  return DESIGN_CODES.has(code) ? DESIGN_PRICE : (MATERIAL[mat]?.price ?? 0);
}

// "only" in materials.json: Material gibt es nur in diesen Formen. Ohne Angabe gilt vorerst: alle Formen.
// Wird durch die Inventarliste ersetzt.
export function isAvailable(mat, code) {
  const only = MATERIAL[mat]?.only;
  return !only || only.includes(code);
}
