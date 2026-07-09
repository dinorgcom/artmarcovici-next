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
}

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

/** The stations of Hermann Wenkart's journey, in order. */
export const STATIONS: Station[] = [
  {
    slug: "prologue",
    title: "Prologue",
    place: "Vienna",
    kind: "city",
    pos: [-16, 5],
    audio: "/book/audio/prologue.mp3",
    excerpt: excerptOf("prologue"),
  },
  {
    slug: "deportation",
    title: "Deportation",
    place: "The Train East",
    kind: "train",
    pos: [-9, 1.5],
    audio: "/book/audio/deportation.mp3",
    excerpt: excerptOf("deportation"),
  },
  {
    slug: "opole",
    title: "Opole",
    place: "The Ghetto",
    kind: "town",
    pos: [-2.5, -2],
    audio: "/book/audio/opole.mp3",
    excerpt: excerptOf("opole"),
  },
  {
    slug: "deblin",
    title: "Dęblin",
    place: "The Camp",
    kind: "camp",
    pos: [4, -4.5],
    audio: "/book/audio/deblin.mp3",
    excerpt: excerptOf("deblin"),
  },
  {
    slug: "braun-and-rademacher",
    title: "Braun and Rademacher",
    place: "The Commandants",
    kind: "admin",
    pos: [7.5, -6.5],
    audio: "/book/audio/braun-and-rademacher.mp3",
    excerpt: excerptOf("braun-and-rademacher"),
  },
  {
    slug: "czestochowa",
    title: "Częstochowa",
    place: "The Munitions Works",
    kind: "factory",
    pos: [12, -2.5],
    audio: "/book/audio/czestochowa.mp3",
    excerpt: excerptOf("czestochowa"),
  },
  {
    slug: "collapse",
    title: "Collapse",
    place: "The End of the War",
    kind: "ruins",
    pos: [15.5, 2.5],
    audio: "/book/audio/collapse.mp3",
    excerpt: excerptOf("collapse"),
  },
  {
    slug: "homecoming",
    title: "Homecoming",
    place: "Vienna, again",
    kind: "home",
    pos: [-13, 9.5],
    audio: "/book/audio/homecoming.mp3",
    excerpt: excerptOf("homecoming"),
  },
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
