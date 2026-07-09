import Link from "next/link";
import type { Metadata } from "next";
import book from "@/data/book-de.json";

export const metadata: Metadata = {
  title: "Befehlsnotstand anders gesehen — Hermann Wenkart",
  description:
    "Befehlsnotstand anders gesehen: Tatsachenbericht eines jüdischen Lagerfunktionärs. Die Geschichte von Hermann Wenkart und dem Lager Deblin-Irena — kostenlos online lesen und anhören.",
  openGraph: {
    title: "Befehlsnotstand anders gesehen — Hermann Wenkart",
    description:
      "Der Bericht eines Holocaust-Überlebenden aus dem Lager Deblin-Irena, kostenlos online zu lesen und zu hören.",
    type: "book",
  },
};

type Chapter = {
  slug: string;
  title: string;
  part: number;
  words: number;
  blocks: { type: string; text?: string; src?: string; caption?: string }[];
};

const chapters = book.chapters as Chapter[];
const parts = book.parts as Record<string, string>;

function readingTime(words: number) {
  return Math.max(1, Math.round(words / 150));
}

export default function BookPageDe() {
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
        <span className="text-white">Befehlsnotstand</span>
      </nav>

      {/* Hero */}
      <div className="grid md:grid-cols-5 gap-10 mb-16">
        <div className="md:col-span-3">
          <p className="text-sm uppercase tracking-widest text-gray-500 mb-3">
            Ein Buch von Hermann Wenkart · Kostenlos lesen &amp; anhören
          </p>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl tracking-wide mb-4">
            {book.title}
          </h1>
          <p className="text-xl text-gray-400 mb-6">{book.subtitle}</p>
          <p className="text-gray-400 leading-relaxed mb-4 max-w-2xl">
            Hermann Wenkart, mein Großvater, wurde 1940 von Wien nach Polen
            deportiert. Als jüdischer Lagerältester des Zwangsarbeitslagers
            Deblin-Irena stand er zwischen der deutschen Kommandantur und tausend
            Häftlingen — eine Position unmöglicher Entscheidungen. Er schrieb
            diesen Bericht 1963; er wird hier vollständig veröffentlicht,
            gemeinsam mit einer historischen Analyse, der Geschichte des
            Überlebenden Sam Harris und der Geschichte des Lagers Dęblin.
          </p>
          <blockquote className="border-l-2 border-accent pl-4 my-8 max-w-2xl">
            <p className="text-gray-300 italic">
              „In jener finsteren Zeit gab es weniger einen Befehls- als einen
              Menschlichkeitsnotstand!“
            </p>
            <cite className="text-sm text-gray-500 not-italic">
              — Hermann Wenkart, im Kapitel „Zusammenbruch“
            </cite>
          </blockquote>
          <div className="flex flex-wrap gap-4 mt-8">
            <Link
              href={`/befehlsnotstand/${chapters[0].slug}`}
              className="inline-block px-8 py-3 border border-accent text-accent hover:bg-accent hover:text-black transition-all duration-300 tracking-widest text-sm uppercase"
            >
              Jetzt lesen
            </Link>
            <Link
              href="/befehlsnotstand/reise"
              className="inline-block px-8 py-3 border border-accent text-accent hover:bg-accent hover:text-black transition-all duration-300 tracking-widest text-sm uppercase"
            >
              Die Reise erkunden (3D)
            </Link>
            <Link
              href="/command-responsibility"
              className="inline-block px-8 py-3 border border-white/30 text-gray-300 hover:border-white hover:text-white transition-all duration-300 tracking-widest text-sm uppercase"
            >
              English Edition
            </Link>
          </div>
          <p className="text-sm text-gray-600 mt-4">
            {Math.round(totalWords / 1000)}k Wörter · ca. {Math.round(totalWords / 150 / 60 * 10) / 10} Stunden
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
        <h2 className="font-serif text-3xl mb-8 text-gray-200">Inhalt</h2>
        {grouped.map((part) => (
          <div key={part.num} className="mb-10">
            <h3 className="text-sm uppercase tracking-widest text-gray-500 mb-4">
              Teil {part.num} — {part.label}
            </h3>
            <ol className="space-y-1">
              {part.chapters.map((ch) => (
                <li key={ch.slug}>
                  <Link
                    href={`/befehlsnotstand/${ch.slug}`}
                    className="group flex items-baseline justify-between gap-4 py-2 border-b border-white/5 hover:border-white/20 transition-colors"
                  >
                    <span className="text-gray-300 group-hover:text-white transition-colors">
                      {ch.title}
                    </span>
                    <span className="text-xs text-gray-600 whitespace-nowrap">
                      {ch.words > 0 ? `${readingTime(ch.words)} Min.` : "Bildteil"}
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
