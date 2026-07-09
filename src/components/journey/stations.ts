import book from "@/data/book.json";

export type StationKind =
  | "city"
  | "train"
  | "town"
  | "camp"
  | "admin"
  | "factory"
  | "ruins"
  | "home";

export interface Station {
  slug: string;
  title: string;
  place: string;
  kind: StationKind;
  pos: [number, number]; // x, z on the ground plane
  audio: string | null;
  excerpt: string;
  mentions?: string; // places named in this chapter
}

/* ---------- geography: a simple equirectangular projection ---------- */

const LAT0 = 50.3;
const LON0 = 19.3;
const KX = 3.93; // world units per degree longitude (~cos(50°) corrected)
const KZ = 6.1; // world units per degree latitude

/** lat/lon -> [x, z] world coordinates (north = -z). */
export function project(lat: number, lon: number): [number, number] {
  return [(lon - LON0) * KX, (LAT0 - lat) * KZ];
}

/** Map extent in world units (west, east, north, south edges). */
export const MAP_BOUNDS = {
  xMin: project(0, 12)[0],
  xMax: project(0, 25.8)[0],
  zMin: project(54.6, 0)[1],
  zMax: project(46.3, 0)[1],
};

interface Block {
  type: string;
  text?: string;
}
interface Chapter {
  slug: string;
  title: string;
  blocks: Block[];
}

function excerptOf(slug: string, maxLen = 260): string {
  const chapter = (book.chapters as Chapter[]).find((c) => c.slug === slug);
  if (!chapter) return "";
  const p = chapter.blocks.find((b) => b.type === "p" && b.text && b.text.length > 60);
  if (!p?.text) return "";
  return p.text.length <= maxLen ? p.text : p.text.slice(0, maxLen).replace(/\s+\S*$/, "") + " …";
}

/**
 * The stations of Hermann Wenkart's journey, in order — placed at their real
 * geographic locations. Opole is Opole Lubelskie near Puławy, the destination
 * of the Vienna transports.
 */
export const STATIONS: Station[] = [
  {
    slug: "prologue",
    title: "Prologue",
    place: "Vienna",
    kind: "city",
    pos: project(48.21, 16.37),
    audio: "/book/audio/prologue.mp3",
    excerpt: excerptOf("prologue"),
    mentions: "Argentinierstraße — the “Emigration Office” · Sperlschule — the assembly camp",
  },
  {
    slug: "deportation",
    title: "Deportation",
    place: "The Train East",
    kind: "train",
    pos: project(49.55, 18.2),
    audio: "/book/audio/deportation.mp3",
    excerpt: excerptOf("deportation"),
    mentions: "Aspangbahnhof, Vienna — where the transports left",
  },
  {
    slug: "opole",
    title: "Opole",
    place: "The Ghetto",
    kind: "town",
    pos: project(51.15, 21.97),
    audio: "/book/audio/opole.mp3",
    excerpt: excerptOf("opole"),
    mentions: "Opole Lubelskie, Lublin district · Puławy on the Vistula",
  },
  {
    slug: "deblin",
    title: "Dęblin",
    place: "The Camp",
    kind: "camp",
    pos: project(51.56, 21.86),
    audio: "/book/audio/deblin.mp3",
    excerpt: excerptOf("deblin"),
    mentions: "the airfield · Irena, the adjoining town · the Wieprz and Vistula rivers",
  },
  {
    slug: "braun-and-rademacher",
    title: "Braun and Rademacher",
    place: "The Commandants",
    kind: "admin",
    pos: [project(51.56, 21.86)[0] + 2.3, project(51.56, 21.86)[1] - 1.4],
    audio: "/book/audio/braun-and-rademacher.mp3",
    excerpt: excerptOf("braun-and-rademacher"),
  },
  {
    slug: "czestochowa",
    title: "Częstochowa",
    place: "The Munitions Works",
    kind: "factory",
    pos: project(50.81, 19.12),
    audio: "/book/audio/czestochowa.mp3",
    excerpt: excerptOf("czestochowa"),
    mentions: "the HASAG munitions works",
  },
  {
    slug: "collapse",
    title: "Collapse",
    place: "The End of the War",
    kind: "ruins",
    pos: [project(50.81, 19.12)[0] - 2.2, project(50.81, 19.12)[1] + 2.4],
    audio: "/book/audio/collapse.mp3",
    excerpt: excerptOf("collapse"),
  },
  {
    slug: "homecoming",
    title: "Homecoming",
    place: "Vienna, again",
    kind: "home",
    pos: [project(48.21, 16.37)[0] - 1.6, project(48.21, 16.37)[1] + 1.6],
    audio: "/book/audio/homecoming.mp3",
    excerpt: excerptOf("homecoming"),
  },
];

/* ---------- map furniture ---------- */

/** Reference cities drawn faintly on the map itself. */
export const REF_CITIES: { name: string; lat: number; lon: number }[] = [
  { name: "Warszawa", lat: 52.23, lon: 21.01 },
  { name: "Kraków", lat: 50.06, lon: 19.94 },
  { name: "Lublin", lat: 51.25, lon: 22.57 },
  { name: "Praha", lat: 50.09, lon: 14.42 },
  { name: "Brno", lat: 49.2, lon: 16.61 },
  { name: "Budapest", lat: 47.5, lon: 19.05 },
];

/** Camps of the family's story — quiet memorial markers, not stations. */
export const MEMORIALS: { name: string; lat: number; lon: number }[] = [
  { name: "Auschwitz", lat: 50.03, lon: 19.23 },
  { name: "Treblinka", lat: 52.63, lon: 22.05 },
  { name: "Mauthausen", lat: 48.26, lon: 14.52 },
];

/** Simplified border polylines (lat/lon) — drawn subtly on the ground map. */
export const BORDERS: [number, number][][] = [
  // Poland
  [
    [54.3, 14.2], [53.9, 14.35], [52.9, 14.15], [52.1, 14.7], [51.5, 14.6], [50.9, 15.0],
    [50.4, 16.3], [50.3, 17.7], [49.8, 18.6], [49.5, 19.4], [49.2, 20.1], [49.1, 21.0],
    [49.0, 22.6], [49.5, 22.7], [50.4, 23.7], [50.8, 24.1], [51.9, 23.6], [52.6, 23.2],
    [53.5, 23.5], [54.3, 22.8], [54.35, 19.6], [54.6, 18.7], [54.2, 16.4], [54.3, 14.2],
  ],
  // Austria
  [
    [48.77, 16.9], [48.0, 17.16], [47.7, 16.6], [47.0, 16.5], [46.65, 16.0], [46.4, 14.6],
    [46.6, 13.4], [46.8, 12.4], [47.0, 11.1], [46.9, 10.4], [47.4, 9.6], [47.6, 9.6],
    [47.5, 10.4], [47.4, 11.0], [47.6, 12.2], [47.7, 13.0], [48.3, 13.4], [48.6, 13.5],
    [48.5, 14.7], [48.8, 15.0], [48.6, 15.9], [48.77, 16.9],
  ],
  // Czech lands (west + south arcs; north is the Polish border)
  [
    [50.9, 15.0], [50.8, 14.3], [50.6, 13.4], [50.3, 12.1], [49.5, 12.5], [48.6, 13.5],
  ],
  // Czech–Slovak / Slovak–Polish arc
  [
    [48.77, 16.9], [48.85, 17.5], [49.3, 18.1], [49.5, 18.85],
  ],
  // Slovakia south / Hungary north
  [
    [48.0, 17.16], [47.75, 18.7], [48.05, 19.9], [48.35, 21.0], [48.4, 22.1], [49.0, 22.6],
  ],
];

/** Rivers (lat/lon) — the Vistula runs right past Dęblin. */
export const RIVERS: [number, number][][] = [
  // Danube
  [
    [48.58, 13.45], [48.4, 14.3], [48.2, 15.4], [48.15, 16.4], [48.05, 17.1],
    [47.75, 17.8], [47.75, 18.75], [47.5, 19.05], [46.9, 18.9], [46.2, 18.9],
  ],
  // Vistula
  [
    [49.7, 19.1], [49.9, 19.9], [50.05, 19.94], [50.2, 20.8], [50.5, 21.6],
    [50.68, 21.75], [51.1, 21.85], [51.56, 21.85], [52.0, 21.3], [52.23, 21.03],
    [52.4, 20.7], [52.55, 19.7], [53.0, 18.6], [53.7, 18.8], [54.35, 18.95],
  ],
  // Wieprz, joining the Vistula at Dęblin
  [
    [50.9, 23.0], [51.2, 22.6], [51.45, 22.2], [51.56, 21.9],
  ],
];

/** Baltic coastline (west→east); the sea lies north of it. */
export const COASTLINE: [number, number][] = [
  [54.3, 14.2], [54.2, 16.4], [54.6, 18.7], [54.35, 19.6], [54.3, 22.8], [54.5, 25.8],
];

/** Framing documents, listed quietly beside the landscape. */
export const DOCUMENTS: { slug: string; title: string; audio: string | null }[] = [
  { slug: "foreword-2024", title: "Foreword to the 2024 Edition", audio: "/book/audio/foreword-2024.mp3" },
  { slug: "back-cover-1963", title: "Back Cover Text, 1963", audio: "/book/audio/back-cover-1963.mp3" },
  { slug: "foreword", title: "Foreword", audio: "/book/audio/foreword.mp3" },
  { slug: "sworn-declaration", title: "Sworn Declaration, 1946", audio: "/book/audio/sworn-declaration.mp3" },
  { slug: "historical-analysis", title: "Historical Analysis", audio: "/book/audio/historical-analysis.mp3" },
  { slug: "deblin-camp-wikipedia", title: "The Dęblin Camp (Wikipedia)", audio: "/book/audio/deblin-camp-wikipedia.mp3" },
  { slug: "sam-harris", title: "Sam Harris — A Survivor's Story", audio: null },
  { slug: "family-trees", title: "Family Trees & Camp Plan", audio: null },
];

export const BOOK_TITLE = book.title as string;
export const BOOK_AUTHOR = book.author as string;
