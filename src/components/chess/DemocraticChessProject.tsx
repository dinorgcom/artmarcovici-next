import Image from "next/image";
import Link from "next/link";
import { Chess } from "chess.js";
import FigureBoard from "./FigureBoard";
import { buildInitialPieces } from "./engine";

// Dedicated page for the installation (/work/democratic-chess). It replaces the
// generic gallery template: the photographs carry the page, the text explains
// the idea, and the playable version is one click away.

const IMG = {
  lineup: "/images/democratic-chess/01.gif",
  above: "/images/democratic-chess/02.gif",
  tenniel: "/images/democratic-chess/03.jpg",
};

function PlayButton({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/democratic-chess"
      className={`inline-flex items-center gap-3 rounded-full bg-accent px-7 py-3 text-sm font-medium text-black transition-colors hover:bg-[#e2bb6c] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-black ${className}`}
    >
      Play Democratic Chess
    </Link>
  );
}

export default function DemocraticChessProject() {
  const pieces = buildInitialPieces(new Chess());

  return (
    <article className="pb-24">
      {/* hero: the installation itself */}
      <header className="max-w-7xl mx-auto px-4 pt-10 lg:pt-14">
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-10">
          <Link href="/" className="hover:text-white transition-colors">Home</Link>
          <span>/</span>
          <Link href="/gallery/projects" className="hover:text-white transition-colors">Projects</Link>
          <span>/</span>
          <span className="text-white">Democratic Chess</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-end">
          <div className="lg:pb-6">
            <h1 className="font-serif text-5xl sm:text-6xl xl:text-7xl leading-[0.95] text-white">
              Democratic
              <br />
              Chess
            </h1>
            <p className="mt-6 max-w-md text-lg leading-relaxed text-gray-300">
              A chess set whose figures are network cameras. Each one can look around, listen and
              talk — to the other figures and to the two people playing.
            </p>
            <PlayButton className="mt-8" />
          </div>

          <figure>
            <div className="relative aspect-[1000/805] overflow-hidden rounded-sm bg-surface">
              <Image
                src={IMG.above}
                alt="Black and white camera-figures mid-game on a glossy chessboard, seen from above"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 60vw"
                unoptimized
              />
            </div>
            <figcaption className="mt-3 text-xs text-gray-500">Mid-game, seen from above.</figcaption>
          </figure>
        </div>
      </header>

      {/* the idea */}
      <section className="max-w-7xl mx-auto px-4 mt-24 lg:mt-32 grid gap-10 md:grid-cols-[minmax(0,4fr)_minmax(0,7fr)] md:items-center">
        <figure className="max-w-sm">
          <div className="relative aspect-[730/907] overflow-hidden rounded-sm bg-white">
            <Image
              src={IMG.tenniel}
              alt="John Tenniel's engraving of Alice talking with the Red Queen in a wood"
              fill
              className="object-cover grayscale"
              sizes="(max-width: 768px) 100vw, 30vw"
              unoptimized
            />
          </div>
          <figcaption className="mt-3 text-xs text-gray-500">
            Alice and the Red Queen — John Tenniel, <i>Through the Looking-Glass</i>, 1871.
          </figcaption>
        </figure>

        <div className="max-w-xl">
          <h2 className="font-serif text-3xl sm:text-4xl text-accent">Through the looking-glass</h2>
          <div className="mt-6 space-y-5 text-lg leading-relaxed text-gray-300">
            <p>
              The project starts from Lewis Carroll&rsquo;s <i>Through the Looking-Glass</i>: a
              story played out as a game of chess on a giant board of fields instead of squares.
              Its main characters are chess pieces, and Alice herself is turned into a pawn.
            </p>
            <p>
              Democratic Chess gives the pieces that voice. In place of figurines, Wi-Fi network
              cameras stand on the board — each able to look around, listen, and speak with the
              other figures and with the two people playing.
            </p>
          </div>
        </div>
      </section>

      {/* how a move is decided */}
      <section className="max-w-7xl mx-auto px-4 mt-24 lg:mt-32 grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div>
          <h2 className="font-serif text-3xl sm:text-4xl text-accent">How a move is decided</h2>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-gray-300">
            Because the figures can see, hear and speak, the game can be played in a number of
            different ways.
          </p>
          <dl className="mt-10 max-w-md space-y-6 border-l border-accent/40 pl-6">
            <div>
              <dt className="font-serif text-xl text-gray-100">By the figures</dt>
              <dd className="mt-1 text-gray-400 leading-relaxed">
                A move can be decided democratically, discussed by every figure involved.
              </dd>
            </div>
            <div>
              <dt className="font-serif text-xl text-gray-100">In debate</dt>
              <dd className="mt-1 text-gray-400 leading-relaxed">
                Figures can argue a move with one of the players, or with each other, before it is
                carried out.
              </dd>
            </div>
            <div>
              <dt className="font-serif text-xl text-gray-100">By the players</dt>
              <dd className="mt-1 text-gray-400 leading-relaxed">
                In the end, the two people at the board still have the final say.
              </dd>
            </div>
          </dl>
        </div>

        <figure className="lg:mt-16">
          <div className="relative aspect-[1000/752] overflow-hidden rounded-sm bg-surface">
            <Image
              src={IMG.lineup}
              alt="Rows of white camera-figures with printed chess symbols on a black and white board"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 60vw"
              unoptimized
            />
          </div>
          <figcaption className="mt-3 text-xs text-gray-500">
            The white figures: each canister carries its chess symbol and a pan-tilt camera.
          </figcaption>
        </figure>
      </section>

      {/* the playable version */}
      <section className="max-w-7xl mx-auto px-4 mt-24 lg:mt-32">
        <div className="relative overflow-hidden rounded-lg border border-accent/25 bg-[radial-gradient(ellipse_at_70%_40%,#1a1610_0%,#050505_60%)]">
          <div className="grid gap-12 px-6 py-12 sm:px-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)] lg:items-center lg:py-16">
            <div className="max-w-lg">
              <h2 className="font-serif text-3xl sm:text-5xl text-white">Play it in your browser</h2>
              <p className="mt-6 text-lg leading-relaxed text-gray-300">
                The playable version takes the idea one step further. The players only decide
                which figure moves; the figure decides where it goes, judging the board through
                its own camera.
              </p>
              <p className="mt-4 text-gray-400 leading-relaxed">
                Take any of the 34 roles — player or figure. The computer plays the rest, and they
                talk at the table while you think.
              </p>
              <PlayButton className="mt-8" />
            </div>
            <Link
              href="/democratic-chess"
              aria-label="Play Democratic Chess"
              className="block pl-5 pb-5 transition-transform duration-500 hover:-translate-y-1"
            >
              <FigureBoard pieces={pieces} />
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}
