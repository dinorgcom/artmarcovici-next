import Image from "next/image";
import Link from "next/link";
import siteData from "@/data/siteData.json";

// Get featured works (pages with the most images)
const featuredSlugs = [
  "free-tibet",
  "mosaic",
  "big-bang",
  "rat-traders",
  "cado-bricks-1",
  "territories",
  "hypnosis",
  "street",
  "ejection",
];

const featured = featuredSlugs
  .map((slug) => {
    const page = (siteData.pages as Record<string, { title: string; images: string[]; description: string }>)[slug];
    if (!page) return null;
    return { slug, ...page };
  })
  .filter(Boolean) as Array<{ slug: string; title: string; images: string[]; description: string }>;

export default function Home() {
  return (
    <div className="bg-black">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background grid of images */}
        <div className="absolute inset-0 grid grid-cols-3 gap-1 opacity-20">
          {featured.slice(0, 9).map((item, i) => (
            item.images[0] && (
              <div key={i} className="relative">
                <Image
                  src={item.images[0]}
                  alt=""
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            )
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />

        <div className="relative z-10 text-center px-4">
          <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl tracking-wider mb-6">
            <span className="text-accent">ART</span> MARCOVICI
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-xl mx-auto mb-10 tracking-wide">
            Contemporary Art by Michael Marcovici
          </p>
          <Link
            href="/gallery/artworks"
            className="inline-block px-8 py-3 border border-accent text-accent hover:bg-accent hover:text-black transition-all duration-300 tracking-widest text-sm uppercase"
          >
            Explore Works
          </Link>
        </div>
      </section>

      {/* Play Democratic Chess */}
      <section className="max-w-7xl mx-auto px-4 pt-20">
        <Link
          href="/democratic-chess"
          className="art-card group relative block overflow-hidden rounded-lg border border-accent/30 hover:border-accent transition-colors duration-300"
        >
          <div className="absolute inset-0">
            <Image
              src="/images/democratic-chess/01.gif"
              alt="Democratic Chess — camera figures on a chessboard"
              fill
              className="object-cover opacity-40 transition-transform duration-700 group-hover:scale-105"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-black/30" />
          </div>
          <div className="relative px-8 py-14 md:px-14 md:py-20 max-w-2xl">
            <p className="text-xs uppercase tracking-[0.3em] text-accent mb-3">Playable installation</p>
            <h2 className="font-serif text-3xl md:text-5xl tracking-wide mb-4">
              DEMOCRATIC CHESS
            </h2>
            <p className="text-gray-300 mb-8 leading-relaxed">
              Thirty-two camera-figures and two players. The players only decide{" "}
              <span className="text-white">who</span> moves — the figures see the board through
              their own lens and decide <span className="text-white">where</span> to go. Take one
              of the 34 roles; the rest debate around you.
            </p>
            <span className="inline-block px-8 py-3 border border-accent text-accent group-hover:bg-accent group-hover:text-black transition-all duration-300 tracking-widest text-sm uppercase">
              Play now
            </span>
          </div>
        </Link>
      </section>

      {/* Gapminder 3D — tribute to Hans Rosling */}
      <section className="max-w-7xl mx-auto px-4 pt-20">
        <a
          href="/gapminder/"
          className="art-card group relative block overflow-hidden rounded-lg border border-accent/30 hover:border-accent transition-colors duration-300"
        >
          <div className="absolute inset-0">
            <Image
              src="/images/gapminder-card.png"
              alt="3D bubble chart of world development data"
              fill
              className="object-cover opacity-50 transition-transform duration-700 group-hover:scale-105"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/20" />
          </div>
          <div className="relative px-8 py-12 md:px-14 md:py-16 max-w-xl">
            <p className="text-xs uppercase tracking-[0.3em] text-accent mb-4">Interactive data installation</p>
            <p className="text-gray-300 leading-relaxed">
              <span className="font-serif text-xl text-white tracking-wide">Gapminder 3D</span>{" "}
              — 110 indicators, 273 countries, one animated timeline. World development
              explored in a navigable 3D bubble room. Made in the spirit of{" "}
              <span className="text-white">Gapminder.org</span>, a tribute to{" "}
              <span className="text-white">Hans Rosling</span> (1948–2017).
            </p>
          </div>
        </a>
      </section>

      {/* Command Responsibility — the Journey */}
      <section className="max-w-7xl mx-auto px-4 pt-20">
        <a
          href="/command-responsibility/journey"
          className="art-card group relative block overflow-hidden rounded-lg border border-accent/30 hover:border-accent transition-colors duration-300"
        >
          <div className="absolute inset-0">
            <div className="absolute -right-16 top-0 h-56 w-56 rounded-full bg-accent/20 blur-3xl" />
            <div className="absolute right-64 bottom-0 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/20" />
          </div>
          <div className="relative px-8 py-12 md:px-14 md:py-16 max-w-xl">
            <p className="text-xs uppercase tracking-[0.3em] text-accent mb-4">Book · 3D journey</p>
            <p className="text-gray-300 leading-relaxed">
              <span className="font-serif text-xl text-white tracking-wide">Command Responsibility</span>{" "}
              — Hermann Wenkart&rsquo;s 1963 account as Jewish camp elder of Deblin-Irena,
              between the German command and a thousand prisoners. Published in full, with
              historical analysis — told as a <span className="text-white">journey in 3D</span>.
            </p>
          </div>
        </a>
      </section>

      {/* Featured Works */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="font-serif text-3xl md:text-4xl text-center mb-4">Featured Works</h2>
        <div className="w-16 h-px bg-accent mx-auto mb-12" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((item) => (
            <Link
              key={item.slug}
              href={`/work/${item.slug}`}
              className="art-card group relative aspect-[4/3] bg-surface rounded-lg overflow-hidden"
            >
              {item.images[0] && (
                <Image
                  src={item.images[0]}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  unoptimized
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="font-serif text-xl text-white tracking-wide">{item.title}</h3>
                <p className="text-sm text-gray-400 mt-1">{item.images.length} works</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <h2 className="font-serif text-3xl md:text-4xl text-center mb-4">Collections</h2>
        <div className="w-16 h-px bg-accent mx-auto mb-12" />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { title: "Artworks", href: "/gallery/artworks", desc: "Paintings, prints & mixed media" },
            { title: "Mosaic", href: "/gallery/mosaic", desc: "Mosaic art series" },
            { title: "CADO", href: "/gallery/cado", desc: "Sculptural building elements" },
            { title: "Projects", href: "/gallery/projects", desc: "Conceptual & business art projects" },
          ].map((cat) => (
            <Link
              key={cat.title}
              href={cat.href}
              className="group p-8 border border-white/10 rounded-lg hover:border-accent/50 transition-all duration-300 text-center"
            >
              <h3 className="font-serif text-2xl mb-2 group-hover:text-accent transition-colors">
                {cat.title}
              </h3>
              <p className="text-sm text-gray-500">{cat.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
