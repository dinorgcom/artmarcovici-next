// German texts for the Economic Periodic Table (/elements).
// Element names follow the German IUPAC/DIN spelling.

import type { MetricKey } from "./elements";

export const ELEMENT_NAMES_DE: Record<number, string> = {
  1: "Wasserstoff", 2: "Helium", 3: "Lithium", 4: "Beryllium", 5: "Bor", 6: "Kohlenstoff",
  7: "Stickstoff", 8: "Sauerstoff", 9: "Fluor", 10: "Neon", 11: "Natrium", 12: "Magnesium",
  13: "Aluminium", 14: "Silicium", 15: "Phosphor", 16: "Schwefel", 17: "Chlor", 18: "Argon",
  19: "Kalium", 20: "Calcium", 21: "Scandium", 22: "Titan", 23: "Vanadium", 24: "Chrom",
  25: "Mangan", 26: "Eisen", 27: "Cobalt", 28: "Nickel", 29: "Kupfer", 30: "Zink",
  31: "Gallium", 32: "Germanium", 33: "Arsen", 34: "Selen", 35: "Brom", 36: "Krypton",
  37: "Rubidium", 38: "Strontium", 39: "Yttrium", 40: "Zirconium", 41: "Niob", 42: "Molybdän",
  43: "Technetium", 44: "Ruthenium", 45: "Rhodium", 46: "Palladium", 47: "Silber", 48: "Cadmium",
  49: "Indium", 50: "Zinn", 51: "Antimon", 52: "Tellur", 53: "Iod", 54: "Xenon",
  55: "Caesium", 56: "Barium", 57: "Lanthan", 58: "Cer", 59: "Praseodym", 60: "Neodym",
  61: "Promethium", 62: "Samarium", 63: "Europium", 64: "Gadolinium", 65: "Terbium", 66: "Dysprosium",
  67: "Holmium", 68: "Erbium", 69: "Thulium", 70: "Ytterbium", 71: "Lutetium", 72: "Hafnium",
  73: "Tantal", 74: "Wolfram", 75: "Rhenium", 76: "Osmium", 77: "Iridium", 78: "Platin",
  79: "Gold", 80: "Quecksilber", 81: "Thallium", 82: "Blei", 83: "Bismut", 84: "Polonium",
  85: "Astat", 86: "Radon", 87: "Francium", 88: "Radium", 89: "Actinium", 90: "Thorium",
  91: "Protactinium", 92: "Uran", 93: "Neptunium", 94: "Plutonium", 95: "Americium", 96: "Curium",
  97: "Berkelium", 98: "Californium", 99: "Einsteinium", 100: "Fermium", 101: "Mendelevium",
  102: "Nobelium", 103: "Lawrencium", 104: "Rutherfordium", 105: "Dubnium", 106: "Seaborgium",
  107: "Bohrium", 108: "Hassium", 109: "Meitnerium", 110: "Darmstadtium", 111: "Roentgenium",
  112: "Copernicium", 113: "Nihonium", 114: "Flerovium", 115: "Moscovium", 116: "Livermorium",
  117: "Tenness", 118: "Oganesson",
};

// keyed by the English note in elements.ts
export const ELEMENT_NOTES_DE: Record<string, string> = {
  "made atoms at a time — no price": "nur atomweise hergestellt — kein Preis",
  "synthetic — research quantities": "synthetisch — Forschungsmengen",
  "too unstable — no market": "zu instabil — kein Markt",
  "industrial gas": "Industriegas",
  liquid: "flüssig",
  "white phosphorus": "weißer Phosphor",
  "synthetic — no bulk production, research-scale pricing":
    "synthetisch — keine Massenproduktion, Preise für Forschungsmengen",
  "research quantities": "Forschungsmengen",
  "no commercial market today": "heute kein kommerzieller Markt",
  "metallurgical grade": "metallurgische Qualität",
  "as graphite": "als Graphit",
  "Po-210, commercial reactor production — the research isotope Po-209 runs ~$49B/g":
    "Po-210, kommerzielle Reaktorproduktion — das Forschungsisotop Po-209 kostet rund 49 Mrd. $/g",
  "Cm-244 — synthetic, research quantities": "Cm-244 — synthetisch, Forschungsmengen",
  "Cf-252 — synthetic, ~$27M per gram": "Cf-252 — synthetisch, rund 27 Mio. $ pro Gramm",
  "Bk-249 — synthetic, research quantities": "Bk-249 — synthetisch, Forschungsmengen",
  "Am-241 — synthetic, research quantities": "Am-241 — synthetisch, Forschungsmengen",
};

export const METRIC_LABELS_DE: Record<MetricKey, string> = {
  kg: "$ / kg",
  g: "$ / g",
  liter: "$ / Liter",
  mol: "$ / mol",
  atom: "$ / Atom",
  electron: "$ / Elektron",
  coulomb: "$ / Coulomb",
  nucleon: "$ / Nukleon",
};

export const METRIC_DESCRIPTIONS_DE: Record<MetricKey, string> = {
  kg: "Preis pro Kilogramm",
  g: "Preis pro Gramm",
  liter: "Preis pro Liter — Gase als Gas bei Normbedingungen, Br und Hg flüssig",
  mol: "Preis pro Mol (6,022 × 10²³ Atome)",
  atom: "Preis pro einzelnem Atom",
  electron: "Preis pro Elektron eines neutralen Atoms",
  coulomb: "Preis pro Coulomb Elektronenladung",
  nucleon: "Preis pro Proton oder Neutron im Kern",
};

// "… what dividing by ___ actually changes" — German needs its own phrase
export const METRIC_DIVISORS_DE: Record<MetricKey, string> = {
  kg: "ein Kilogramm",
  g: "ein Gramm",
  liter: "einen Liter (Gase als Gas bei Normbedingungen, Br und Hg flüssig)",
  mol: "ein Mol (6,022 × 10²³ Atome)",
  atom: "ein einzelnes Atom",
  electron: "ein Elektron eines neutralen Atoms",
  coulomb: "ein Coulomb Elektronenladung",
  nucleon: "ein Proton oder Neutron im Kern",
};
