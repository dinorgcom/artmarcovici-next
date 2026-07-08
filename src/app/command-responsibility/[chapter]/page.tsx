import fs from "fs";
import path from "path";
import Link from "next/link";
import { notFound } from "next/navigation";
import book from "@/data/book.json";

type Block = { type: string; text?: string; src?: string; caption?: string };
type Chapter = {
  slug: string;
  title: string;
  part: number;
  pages: number[];
  words: number;
  blocks: Block[];
};

const chapters = book.chapters as Chapter[];
const parts = book.parts as Record<string, string>;

export function generateStaticParams() {
  return chapters.map((c) => ({ chapter: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ chapter: string }>;
}) {
  const { chapter } = await params;
  const ch = chapters.find((c) => c.slug === chapter);
  return {
    title: ch ? `${ch.title} — Command Responsibility` : "Command Responsibility",
    description: `Command Responsibility by Hermann Wenkart — ${ch?.title ?? ""}. Free to read and listen.`,
  };
}

function audioSrc(slug: string): string | null {
  const file = path.join(process.cwd(), "public", "book", "audio", `${slug}.mp3`);
  return fs.existsSync(file) ? `/book/audio/${slug}.mp3` : null;
}

export default async function ChapterPage({
  params,
}: {
  params: Promise<{ chapter: string }>;
}) {
  const { chapter } = await params;
  const index = chapters.findIndex((c) => c.slug === chapter);
  if (index === -1) {
    notFound();
  }
  const ch = chapters[index];
  const prev = index > 0 ? chapters[index - 1] : null;
  const next = index < chapters.length - 1 ? chapters[index + 1] : null;
  const audio = audioSrc(ch.slug);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <span>/</span>
        <Link href="/command-responsibility" className="hover:text-white transition-colors">
          Command Responsibility
        </Link>
        <span>/</span>
        <span className="text-white">{ch.title}</span>
      </nav>

      <article className="max-w-2xl mx-auto">
        <p className="text-xs uppercase tracking-widest text-gray-500 mb-3">
          Part {ch.part} — {parts[String(ch.part)]}
        </p>
        <h1 className="font-serif text-3xl md:text-4xl lg:text-5xl tracking-wide mb-8">
          {ch.title}
        </h1>

        {audio && (
          <div className="mb-10 p-4 bg-surface rounded-lg border border-white/10">
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-2">
              Listen to this chapter
            </p>
            <audio controls preload="none" className="w-full">
              <source src={audio} type="audio/mpeg" />
            </audio>
          </div>
        )}

        <div className="space-y-6">
          {ch.blocks.map((block, i) => {
            if (block.type === "h2") {
              return (
                <h2 key={i} className="font-serif text-2xl text-gray-200 pt-6">
                  {block.text}
                </h2>
              );
            }
            if (block.type === "note") {
              return (
                <p key={i} className="text-gray-400 italic leading-relaxed">
                  {block.text}
                </p>
              );
            }
            if (block.type === "img" && block.src) {
              return (
                <figure key={i} className="py-6">
                  <img
                    src={block.src}
                    alt={block.caption || ch.title}
                    className="w-full max-w-md mx-auto rounded-lg"
                  />
                  {block.caption && (
                    <figcaption className="text-center text-sm text-gray-500 mt-3 max-w-md mx-auto">
                      {block.caption}
                    </figcaption>
                  )}
                </figure>
              );
            }
            return (
              <p key={i} className="text-gray-300 leading-relaxed text-lg">
                {block.text}
              </p>
            );
          })}
        </div>

        {/* Prev / Next */}
        <nav className="flex items-stretch justify-between gap-4 mt-16 pt-8 border-t border-white/10">
          {prev ? (
            <Link
              href={`/command-responsibility/${prev.slug}`}
              className="group flex-1 text-left"
            >
              <span className="block text-xs uppercase tracking-widest text-gray-600 mb-1">
                Previous
              </span>
              <span className="text-gray-400 group-hover:text-white transition-colors">
                {prev.title}
              </span>
            </Link>
          ) : (
            <span className="flex-1" />
          )}
          {next ? (
            <Link
              href={`/command-responsibility/${next.slug}`}
              className="group flex-1 text-right"
            >
              <span className="block text-xs uppercase tracking-widest text-gray-600 mb-1">
                Next
              </span>
              <span className="text-gray-400 group-hover:text-white transition-colors">
                {next.title}
              </span>
            </Link>
          ) : (
            <span className="flex-1" />
          )}
        </nav>
      </article>
    </div>
  );
}
