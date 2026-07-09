import bookDe from "@/data/book-de.json";
import { project, type Station } from "./stations";

/* ---------- German edition of the journey data ---------- */

interface Block {
  type: string;
  text?: string;
  src?: string;
  caption?: string;
}
interface Chapter {
  slug: string;
  title: string;
  blocks: Block[];
}

function excerptOf(slug: string, maxLen = 260): string {
  const chapter = (bookDe.chapters as Chapter[]).find((c) => c.slug === slug);
  if (!chapter) return "";
  const p = chapter.blocks.find((b) => b.type === "p" && b.text && b.text.length > 60);
  if (!p?.text) return "";
  return p.text.length <= maxLen ? p.text : p.text.slice(0, maxLen).replace(/\s+\S*$/, "") + " …";
}

/** Same geography as the English journey — only the words change. */
export const STATIONS_DE: Station[] = [
  {
    slug: "prologue",
    title: "Prolog",
    place: "Wien",
    kind: "city",
    pos: project(48.21, 16.37),
    audio: "/book/audio-de/prologue.mp3",
    excerpt: excerptOf("prologue"),
    mentions: "Argentinierstraße — die „Auswanderungsabteilung“ · Sperlschule — das Sammellager",
  },
  {
    slug: "deportation",
    title: "Abtransport",
    place: "Der Zug nach Osten",
    kind: "train",
    pos: project(49.55, 18.2),
    audio: "/book/audio-de/deportation.mp3",
    excerpt: excerptOf("deportation"),
    mentions: "Aspangbahnhof, Wien — von hier fuhren die Transporte ab",
  },
  {
    slug: "opole",
    title: "Opole",
    place: "Das Ghetto",
    kind: "town",
    pos: project(51.15, 21.97),
    audio: "/book/audio-de/opole.mp3",
    excerpt: excerptOf("opole"),
    mentions: "Opole Lubelskie, Distrikt Lublin · Puławy an der Weichsel",
  },
  {
    slug: "deblin",
    title: "Deblin",
    place: "Das Lager",
    kind: "camp",
    pos: project(51.56, 21.86),
    audio: "/book/audio-de/deblin.mp3",
    excerpt: excerptOf("deblin"),
    mentions: "der Flugplatz · Irena, die angrenzende Stadt · Wieprz und Weichsel",
  },
  {
    slug: "braun-and-rademacher",
    title: "Braun und Rademacher",
    place: "Die Kommandanten",
    kind: "admin",
    pos: [project(51.56, 21.86)[0] + 2.3, project(51.56, 21.86)[1] - 1.4],
    audio: "/book/audio-de/braun-and-rademacher.mp3",
    excerpt: excerptOf("braun-and-rademacher"),
  },
  {
    slug: "czestochowa",
    title: "Czenstochau",
    place: "Das Munitionswerk",
    kind: "factory",
    pos: project(50.81, 19.12),
    audio: "/book/audio-de/czestochowa.mp3",
    excerpt: excerptOf("czestochowa"),
    mentions: "die HASAG-Munitionswerke",
  },
  {
    slug: "collapse",
    title: "Zusammenbruch",
    place: "Das Kriegsende",
    kind: "ruins",
    pos: [project(50.81, 19.12)[0] - 2.2, project(50.81, 19.12)[1] + 2.4],
    audio: "/book/audio-de/collapse.mp3",
    excerpt: excerptOf("collapse"),
  },
  {
    slug: "homecoming",
    title: "Heimkehr",
    place: "Wien, wieder",
    kind: "home",
    pos: [project(48.21, 16.37)[0] - 1.6, project(48.21, 16.37)[1] + 1.6],
    audio: "/book/audio-de/homecoming.mp3",
    excerpt: excerptOf("homecoming"),
  },
];

/** Framing documents of the German edition. */
export const DOCUMENTS_DE: { slug: string; title: string; audio: string | null }[] = [
  { slug: "foreword-2024", title: "Vorwort zur Ausgabe von 2024", audio: "/book/audio-de/foreword-2024.mp3" },
  { slug: "back-cover-1963", title: "Klappentext der Ausgabe von 1963", audio: "/book/audio-de/back-cover-1963.mp3" },
  { slug: "foreword", title: "Vorwort", audio: "/book/audio-de/foreword.mp3" },
  { slug: "sworn-declaration", title: "Eidesstattliche Erklärung, 1946", audio: "/book/audio-de/sworn-declaration.mp3" },
  { slug: "historical-analysis", title: "Historischer Hintergrund", audio: "/book/audio-de/historical-analysis.mp3" },
  { slug: "deblin-camp-wikipedia", title: "Das Lager Dęblin (Wikipedia)", audio: "/book/audio-de/deblin-camp-wikipedia.mp3" },
  { slug: "sam-harris", title: "Sam Harris — Die Geschichte eines Überlebenden", audio: "/book/audio-de/sam-harris.mp3" },
  { slug: "family-trees", title: "Fotografien & Stammbäume", audio: null },
];

export const BOOK_TITLE_DE = bookDe.title as string;
export const BOOK_AUTHOR_DE = bookDe.author as string;

export interface BookPhotoDe {
  src: string;
  caption: string;
  chapter: string;
  chapterTitle: string;
}

/** All photographs and diagrams printed in the German edition. */
export const PHOTOS_DE: BookPhotoDe[] = (bookDe.chapters as Chapter[]).flatMap((c) =>
  c.blocks
    .filter((b) => b.src)
    .map((b) => ({
      src: b.src as string,
      caption: b.caption || "",
      chapter: c.slug,
      chapterTitle: c.title,
    }))
);
