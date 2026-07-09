// The Economic Periodic Table — element data and price math.
//
// Prices are approximate USD per kilogram of the (mostly pure) element,
// compiled from public market data and literature (Wikipedia "Prices of
// chemical elements", USGS, metal exchanges, ~2019–2025). Synthetic and
// radioactive elements carry order-of-magnitude research-quantity
// estimates; elements with no market at all have price: null.

export type ElementDatum = {
  z: number;
  symbol: string;
  name: string;
  mass: number; // standard atomic weight, g/mol
  price: number | null; // USD per kg
  note?: string;
};

export const ELEMENTS: ElementDatum[] = [
  { z: 1, symbol: "H", name: "Hydrogen", mass: 1.008, price: 1.4, note: "industrial gas" },
  { z: 2, symbol: "He", name: "Helium", mass: 4.0026, price: 24 },
  { z: 3, symbol: "Li", name: "Lithium", mass: 6.94, price: 85 },
  { z: 4, symbol: "Be", name: "Beryllium", mass: 9.0122, price: 857 },
  { z: 5, symbol: "B", name: "Boron", mass: 10.81, price: 3.7 },
  { z: 6, symbol: "C", name: "Carbon", mass: 12.011, price: 0.12, note: "as graphite" },
  { z: 7, symbol: "N", name: "Nitrogen", mass: 14.007, price: 0.14, note: "industrial gas" },
  { z: 8, symbol: "O", name: "Oxygen", mass: 15.999, price: 0.15, note: "industrial gas" },
  { z: 9, symbol: "F", name: "Fluorine", mass: 18.998, price: 2.2 },
  { z: 10, symbol: "Ne", name: "Neon", mass: 20.18, price: 240 },
  { z: 11, symbol: "Na", name: "Sodium", mass: 22.99, price: 3.0 },
  { z: 12, symbol: "Mg", name: "Magnesium", mass: 24.305, price: 2.3 },
  { z: 13, symbol: "Al", name: "Aluminium", mass: 26.982, price: 2.6 },
  { z: 14, symbol: "Si", name: "Silicon", mass: 28.085, price: 1.7, note: "metallurgical grade" },
  { z: 15, symbol: "P", name: "Phosphorus", mass: 30.974, price: 2.7 },
  { z: 16, symbol: "S", name: "Sulfur", mass: 32.06, price: 0.09 },
  { z: 17, symbol: "Cl", name: "Chlorine", mass: 35.45, price: 0.082 },
  { z: 18, symbol: "Ar", name: "Argon", mass: 39.948, price: 0.93 },
  { z: 19, symbol: "K", name: "Potassium", mass: 39.098, price: 13.6 },
  { z: 20, symbol: "Ca", name: "Calcium", mass: 40.078, price: 2.4 },
  { z: 21, symbol: "Sc", name: "Scandium", mass: 44.956, price: 3460 },
  { z: 22, symbol: "Ti", name: "Titanium", mass: 47.867, price: 11.7 },
  { z: 23, symbol: "V", name: "Vanadium", mass: 50.942, price: 385 },
  { z: 24, symbol: "Cr", name: "Chromium", mass: 51.996, price: 9.4 },
  { z: 25, symbol: "Mn", name: "Manganese", mass: 54.938, price: 1.8 },
  { z: 26, symbol: "Fe", name: "Iron", mass: 55.845, price: 0.42 },
  { z: 27, symbol: "Co", name: "Cobalt", mass: 58.933, price: 33 },
  { z: 28, symbol: "Ni", name: "Nickel", mass: 58.693, price: 16 },
  { z: 29, symbol: "Cu", name: "Copper", mass: 63.546, price: 9.5 },
  { z: 30, symbol: "Zn", name: "Zinc", mass: 65.38, price: 2.7 },
  { z: 31, symbol: "Ga", name: "Gallium", mass: 69.723, price: 400 },
  { z: 32, symbol: "Ge", name: "Germanium", mass: 72.63, price: 1500 },
  { z: 33, symbol: "As", name: "Arsenic", mass: 74.922, price: 1.3 },
  { z: 34, symbol: "Se", name: "Selenium", mass: 78.971, price: 21 },
  { z: 35, symbol: "Br", name: "Bromine", mass: 79.904, price: 4.4 },
  { z: 36, symbol: "Kr", name: "Krypton", mass: 83.798, price: 290 },
  { z: 37, symbol: "Rb", name: "Rubidium", mass: 85.468, price: 15500 },
  { z: 38, symbol: "Sr", name: "Strontium", mass: 87.62, price: 6.7 },
  { z: 39, symbol: "Y", name: "Yttrium", mass: 88.906, price: 31 },
  { z: 40, symbol: "Zr", name: "Zirconium", mass: 91.224, price: 37 },
  { z: 41, symbol: "Nb", name: "Niobium", mass: 92.906, price: 74 },
  { z: 42, symbol: "Mo", name: "Molybdenum", mass: 95.95, price: 40 },
  { z: 43, symbol: "Tc", name: "Technetium", mass: 98, price: 100000, note: "synthetic — research quantities" },
  { z: 44, symbol: "Ru", name: "Ruthenium", mass: 101.07, price: 16000 },
  { z: 45, symbol: "Rh", name: "Rhodium", mass: 102.91, price: 180000 },
  { z: 46, symbol: "Pd", name: "Palladium", mass: 106.42, price: 32000 },
  { z: 47, symbol: "Ag", name: "Silver", mass: 107.87, price: 1100 },
  { z: 48, symbol: "Cd", name: "Cadmium", mass: 112.41, price: 2.7 },
  { z: 49, symbol: "In", name: "Indium", mass: 114.82, price: 250 },
  { z: 50, symbol: "Sn", name: "Tin", mass: 118.71, price: 30 },
  { z: 51, symbol: "Sb", name: "Antimony", mass: 121.76, price: 25 },
  { z: 52, symbol: "Te", name: "Tellurium", mass: 127.6, price: 64 },
  { z: 53, symbol: "I", name: "Iodine", mass: 126.9, price: 35 },
  { z: 54, symbol: "Xe", name: "Xenon", mass: 131.29, price: 1800 },
  { z: 55, symbol: "Cs", name: "Caesium", mass: 132.91, price: 61800 },
  { z: 56, symbol: "Ba", name: "Barium", mass: 137.33, price: 0.28 },
  { z: 57, symbol: "La", name: "Lanthanum", mass: 138.91, price: 4.9 },
  { z: 58, symbol: "Ce", name: "Cerium", mass: 140.12, price: 4.7 },
  { z: 59, symbol: "Pr", name: "Praseodymium", mass: 140.91, price: 95 },
  { z: 60, symbol: "Nd", name: "Neodymium", mass: 144.24, price: 75 },
  { z: 61, symbol: "Pm", name: "Promethium", mass: 145, price: 460000, note: "synthetic — research quantities" },
  { z: 62, symbol: "Sm", name: "Samarium", mass: 150.36, price: 14 },
  { z: 63, symbol: "Eu", name: "Europium", mass: 151.96, price: 31 },
  { z: 64, symbol: "Gd", name: "Gadolinium", mass: 157.25, price: 29 },
  { z: 65, symbol: "Tb", name: "Terbium", mass: 158.93, price: 900 },
  { z: 66, symbol: "Dy", name: "Dysprosium", mass: 162.5, price: 350 },
  { z: 67, symbol: "Ho", name: "Holmium", mass: 164.93, price: 65 },
  { z: 68, symbol: "Er", name: "Erbium", mass: 167.26, price: 26 },
  { z: 69, symbol: "Tm", name: "Thulium", mass: 168.93, price: 3000 },
  { z: 70, symbol: "Yb", name: "Ytterbium", mass: 173.05, price: 17 },
  { z: 71, symbol: "Lu", name: "Lutetium", mass: 174.97, price: 640 },
  { z: 72, symbol: "Hf", name: "Hafnium", mass: 178.49, price: 900 },
  { z: 73, symbol: "Ta", name: "Tantalum", mass: 180.95, price: 312 },
  { z: 74, symbol: "W", name: "Tungsten", mass: 183.84, price: 35 },
  { z: 75, symbol: "Re", name: "Rhenium", mass: 186.21, price: 4150 },
  { z: 76, symbol: "Os", name: "Osmium", mass: 190.23, price: 12000 },
  { z: 77, symbol: "Ir", name: "Iridium", mass: 192.22, price: 150000 },
  { z: 78, symbol: "Pt", name: "Platinum", mass: 195.08, price: 42000 },
  { z: 79, symbol: "Au", name: "Gold", mass: 196.97, price: 105000 },
  { z: 80, symbol: "Hg", name: "Mercury", mass: 200.59, price: 30 },
  { z: 81, symbol: "Tl", name: "Thallium", mass: 204.38, price: 4200 },
  { z: 82, symbol: "Pb", name: "Lead", mass: 207.2, price: 2.0 },
  { z: 83, symbol: "Bi", name: "Bismuth", mass: 208.98, price: 8 },
  { z: 84, symbol: "Po", name: "Polonium", mass: 209, price: 4.9e13, note: "synthetic — research quantities" },
  { z: 85, symbol: "At", name: "Astatine", mass: 210, price: null, note: "too unstable — no market" },
  { z: 86, symbol: "Rn", name: "Radon", mass: 222, price: null, note: "too unstable — no market" },
  { z: 87, symbol: "Fr", name: "Francium", mass: 223, price: null, note: "too unstable — no market" },
  { z: 88, symbol: "Ra", name: "Radium", mass: 226, price: null, note: "no commercial market today" },
  { z: 89, symbol: "Ac", name: "Actinium", mass: 227, price: 2.9e13, note: "synthetic — research quantities" },
  { z: 90, symbol: "Th", name: "Thorium", mass: 232.04, price: 287 },
  { z: 91, symbol: "Pa", name: "Protactinium", mass: 231.04, price: 280000, note: "research quantities" },
  { z: 92, symbol: "U", name: "Uranium", mass: 238.03, price: 150 },
  { z: 93, symbol: "Np", name: "Neptunium", mass: 237, price: 660000, note: "synthetic — research quantities" },
  { z: 94, symbol: "Pu", name: "Plutonium", mass: 244, price: 6.5e6, note: "synthetic — research quantities" },
  { z: 95, symbol: "Am", name: "Americium", mass: 243, price: 750000, note: "synthetic — research quantities" },
  { z: 96, symbol: "Cm", name: "Curium", mass: 247, price: 1.7e11, note: "synthetic — research quantities" },
  { z: 97, symbol: "Bk", name: "Berkelium", mass: 247, price: 1.85e11, note: "synthetic — research quantities" },
  { z: 98, symbol: "Cf", name: "Californium", mass: 251, price: 2.7e13, note: "synthetic — research quantities" },
  { z: 99, symbol: "Es", name: "Einsteinium", mass: 252, price: null, note: "made atoms at a time — no price" },
  { z: 100, symbol: "Fm", name: "Fermium", mass: 257, price: null, note: "made atoms at a time — no price" },
  { z: 101, symbol: "Md", name: "Mendelevium", mass: 258, price: null, note: "made atoms at a time — no price" },
  { z: 102, symbol: "No", name: "Nobelium", mass: 259, price: null, note: "made atoms at a time — no price" },
  { z: 103, symbol: "Lr", name: "Lawrencium", mass: 266, price: null, note: "made atoms at a time — no price" },
  { z: 104, symbol: "Rf", name: "Rutherfordium", mass: 267, price: null, note: "made atoms at a time — no price" },
  { z: 105, symbol: "Db", name: "Dubnium", mass: 268, price: null, note: "made atoms at a time — no price" },
  { z: 106, symbol: "Sg", name: "Seaborgium", mass: 269, price: null, note: "made atoms at a time — no price" },
  { z: 107, symbol: "Bh", name: "Bohrium", mass: 270, price: null, note: "made atoms at a time — no price" },
  { z: 108, symbol: "Hs", name: "Hassium", mass: 277, price: null, note: "made atoms at a time — no price" },
  { z: 109, symbol: "Mt", name: "Meitnerium", mass: 278, price: null, note: "made atoms at a time — no price" },
  { z: 110, symbol: "Ds", name: "Darmstadtium", mass: 281, price: null, note: "made atoms at a time — no price" },
  { z: 111, symbol: "Rg", name: "Roentgenium", mass: 282, price: null, note: "made atoms at a time — no price" },
  { z: 112, symbol: "Cn", name: "Copernicium", mass: 285, price: null, note: "made atoms at a time — no price" },
  { z: 113, symbol: "Nh", name: "Nihonium", mass: 286, price: null, note: "made atoms at a time — no price" },
  { z: 114, symbol: "Fl", name: "Flerovium", mass: 289, price: null, note: "made atoms at a time — no price" },
  { z: 115, symbol: "Mc", name: "Moscovium", mass: 290, price: null, note: "made atoms at a time — no price" },
  { z: 116, symbol: "Lv", name: "Livermorium", mass: 293, price: null, note: "made atoms at a time — no price" },
  { z: 117, symbol: "Ts", name: "Tennessine", mass: 294, price: null, note: "made atoms at a time — no price" },
  { z: 118, symbol: "Og", name: "Oganesson", mass: 294, price: null, note: "made atoms at a time — no price" },
];

export const AVOGADRO = 6.02214076e23;
export const ELEMENTARY_CHARGE = 1.602176634e-19; // coulomb

export type MetricKey = "kg" | "g" | "mol" | "atom" | "electron" | "coulomb" | "nucleon";

export type Metric = {
  key: MetricKey;
  label: string;
  description: string;
};

export const METRICS: Metric[] = [
  { key: "kg", label: "$ / kg", description: "price per kilogram" },
  { key: "g", label: "$ / g", description: "price per gram" },
  { key: "mol", label: "$ / mol", description: "price per mole (6.022 × 10²³ atoms)" },
  { key: "atom", label: "$ / atom", description: "price per single atom" },
  { key: "electron", label: "$ / electron", description: "price per electron of a neutral atom" },
  { key: "coulomb", label: "$ / coulomb", description: "price per coulomb of electron charge" },
  { key: "nucleon", label: "$ / nucleon", description: "price per proton or neutron in the nucleus" },
];

export function metricValue(el: ElementDatum, metric: MetricKey): number | null {
  if (el.price === null) return null;
  const perAtom = (el.price * el.mass) / 1000 / AVOGADRO;
  switch (metric) {
    case "kg":
      return el.price;
    case "g":
      return el.price / 1000;
    case "mol":
      return (el.price * el.mass) / 1000;
    case "atom":
      return perAtom;
    case "electron":
      return perAtom / el.z;
    case "coulomb":
      return perAtom / el.z / ELEMENTARY_CHARGE;
    case "nucleon":
      return perAtom / Math.round(el.mass);
  }
}

// Standard 18-column layout; lanthanides/actinides in rows 9 and 10
// (row 8 is a visual spacer).
export function gridPosition(z: number): { col: number; row: number } {
  if (z === 1) return { col: 1, row: 1 };
  if (z === 2) return { col: 18, row: 1 };
  if (z <= 4) return { col: z - 2, row: 2 };
  if (z <= 10) return { col: z + 8, row: 2 };
  if (z <= 12) return { col: z - 10, row: 3 };
  if (z <= 18) return { col: z - 4, row: 3 };
  if (z <= 36) return { col: z - 18, row: 4 };
  if (z <= 54) return { col: z - 36, row: 5 };
  if (z <= 56) return { col: z - 54, row: 6 };
  if (z <= 71) return { col: z - 54, row: 9 }; // La–Lu, cols 3–17
  if (z <= 86) return { col: z - 68, row: 6 };
  if (z <= 88) return { col: z - 86, row: 7 };
  if (z <= 103) return { col: z - 86, row: 10 }; // Ac–Lr, cols 3–17
  return { col: z - 100, row: 7 };
}

// Cheap → expensive gradient (log scale): blue → green → yellow → orange → red → fuchsia
const COLOR_STOPS: [number, number, number][] = [
  [37, 99, 235],
  [16, 185, 129],
  [234, 179, 8],
  [249, 115, 22],
  [239, 68, 68],
  [217, 70, 239],
];

export function colorForT(t: number): [number, number, number] {
  const clamped = Math.min(1, Math.max(0, t));
  const scaled = clamped * (COLOR_STOPS.length - 1);
  const i = Math.min(COLOR_STOPS.length - 2, Math.floor(scaled));
  const f = scaled - i;
  const a = COLOR_STOPS[i];
  const b = COLOR_STOPS[i + 1];
  return [
    Math.round(a[0] + (b[0] - a[0]) * f),
    Math.round(a[1] + (b[1] - a[1]) * f),
    Math.round(a[2] + (b[2] - a[2]) * f),
  ];
}

export function cssColor(rgb: [number, number, number]): string {
  return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
}

export function textColorOn(rgb: [number, number, number]): string {
  const luminance = (0.299 * rgb[0] + 0.587 * rgb[1] + 0.114 * rgb[2]) / 255;
  return luminance > 0.6 ? "#111111" : "#ffffff";
}

const SUPERSCRIPTS: Record<string, string> = {
  "-": "⁻",
  "0": "⁰",
  "1": "¹",
  "2": "²",
  "3": "³",
  "4": "⁴",
  "5": "⁵",
  "6": "⁶",
  "7": "⁷",
  "8": "⁸",
  "9": "⁹",
};

export function formatUSD(v: number): string {
  if (v === 0) return "$0";
  if (v >= 1e15 || v < 0.01) {
    const [mantissa, exponent] = v.toExponential(2).split("e");
    const sup = String(parseInt(exponent, 10))
      .split("")
      .map((c) => SUPERSCRIPTS[c] ?? c)
      .join("");
    return `$${mantissa} × 10${sup}`;
  }
  if (v >= 1e12) return `$${(v / 1e12).toFixed(2)}T`;
  if (v >= 1e9) return `$${(v / 1e9).toFixed(2)}B`;
  if (v >= 1e6) return `$${(v / 1e6).toFixed(2)}M`;
  if (v >= 1e3) return `$${(v / 1e3).toFixed(1)}k`;
  if (v >= 100) return `$${v.toFixed(0)}`;
  if (v >= 1) return `$${v.toFixed(2)}`;
  return `$${v.toFixed(v >= 0.1 ? 3 : 4)}`;
}
