import Link from "next/link";
import type { Metadata } from "next";
import book from "@/data/book.json";

export const metadata: Metadata = {
  title: "Command Responsibility — Hermann Wenkart",
  description:
    "Command Responsibility: A Different Perspective. Facts by a Jewish Camp Official. The story of Hermann Wenkart and the Deblin-Irena camp — free to read online, with audiobook and PDF download.",
  openGraph: {
    title: "Command Responsibility — Hermann Wenkart",
    description:
      "A Holocaust survivor's first-hand report from the Deblin-Irena camp, free to read and listen to online.",
    type: "book",
  },
};

type Chapter = {
  slug: string;
  title: string;
  part: number;
  pages: number[];
  words: number;
  blocks: { type: string; text?: string; src?: string; caption?: string }[];
};

const chapters = book.chapters as Chapter[];
const parts = book.parts as Record<string, string>;

function readingTime(words: number) {
  return Math.max(1, Math.round(words / 150));
}

export default function BookPage() {
  const totalWords = chapters.reduce((sum, c) => sum + c.words, 0);
  const grouped = Object.entries(parts).map(([num, label]) => ({
    num: Number(num),
    label,
    chapters: chapters.filter((c) => c.part === Number(num)),
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <span>/</span>
        <span className="text-white">Command Responsibility</span>
      </nav>

      {/* Hero */}
      <div className="grid md:grid-cols-5 gap-10 mb-16">
        <div className="md:col-span-3">
          <p className="text-sm uppercase tracking-widest text-gray-500 mb-3">
            A book by Hermann Wenkart · Free to read &amp; listen
          </p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-wide mb-4">
            {book.title}
          </h1>
          <p className="text-xl text-gray-400 mb-6">{book.subtitle}</p>
          <p className="text-gray-400 leading-relaxed mb-4 max-w-2xl">
            Hermann Wenkart, my grandfather, was deported from Vienna to Poland in
            1940. As the Jewish camp elder of the Deblin-Irena forced labor camp he
            stood between the German command and a thousand prisoners — a position
            of impossible choices. He wrote this account in 1963; it is published
            here in full, together with historical analysis, the story of survivor
            Sam Harris, and the history of the Dęblin camp.
          </p>
          <blockquote className="border-l-2 border-accent pl-4 my-8 max-w-2xl">
            <p className="text-gray-300 italic">
              “The inner need to write and free myself from the burden of
              experience by putting it on paper.”
            </p>
            <cite className="text-sm text-gray-500 not-italic">
              — Dunja Rosen, the Jewish writer, on why she was compelled to write
            </cite>
          </blockquote>
          <div className="flex flex-wrap gap-4 mt-8">
            <Link
              href={`/command-responsibility/${chapters[0].slug}`}
              className="inline-block px-8 py-3 border border-accent text-accent hover:bg-accent hover:text-black transition-all duration-300 tracking-widest text-sm uppercase"
            >
              Start Reading
            </Link>
            <Link
              href="/command-responsibility/journey"
              className="inline-block px-8 py-3 border border-accent text-accent hover:bg-accent hover:text-black transition-all duration-300 tracking-widest text-sm uppercase"
            >
              Explore the Journey (3D)
            </Link>
            <a
              href="/book/command-responsibility-hermann-wenkart.pdf"
              download
              className="inline-block px-8 py-3 border border-white/30 text-gray-300 hover:border-white hover:text-white transition-all duration-300 tracking-widest text-sm uppercase"
            >
              Download PDF (free)
            </a>
            <a
              href="/book/command-responsibility-hermann-wenkart.epub"
              download
              className="inline-block px-8 py-3 border border-white/30 text-gray-300 hover:border-white hover:text-white transition-all duration-300 tracking-widest text-sm uppercase"
            >
              Download EPUB (free)
            </a>
          </div>
          <p className="text-sm text-gray-600 mt-4">
            {Math.round(totalWords / 1000)}k words · approx. {Math.round(totalWords / 150 / 60 * 10) / 10} hours
            · {book.edition}
          </p>
        </div>
        <div className="md:col-span-2">
          <figure>
            <img
              src="/book/images/hermann-wenkart.jpg"
              alt="Hermann Wenkart"
              className="w-full max-w-sm mx-auto rounded-lg"
            />
            <figcaption className="text-center text-sm text-gray-500 mt-3">
              Hermann Wenkart
            </figcaption>
          </figure>
        </div>
      </div>

      {/* Table of contents */}
      <div className="max-w-3xl">
        <h2 className="font-serif text-3xl mb-8 text-gray-200">Contents</h2>
        {grouped.map((part) => (
          <div key={part.num} className="mb-10">
            <h3 className="text-sm uppercase tracking-widest text-gray-500 mb-4">
              Part {part.num} — {part.label}
            </h3>
            <ol className="space-y-1">
              {part.chapters.map((ch) => (
                <li key={ch.slug}>
                  <Link
                    href={`/command-responsibility/${ch.slug}`}
                    className="group flex items-baseline justify-between gap-4 py-2 border-b border-white/5 hover:border-white/20 transition-colors"
                  >
                    <span className="text-gray-300 group-hover:text-white transition-colors">
                      {ch.title}
                    </span>
                    <span className="text-xs text-gray-600 whitespace-nowrap">
                      {ch.words > 0 ? `${readingTime(ch.words)} min` : "plates"}
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </div>
  );
}
