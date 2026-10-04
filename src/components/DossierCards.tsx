import Image from "next/image";
import type { ReactNode } from "react";

// Datendossiers auf der Startseite. Die Karten werden nach `updated` sortiert (neuestes oben)
// und zeigen das Datum an; das jüngste Update ist rot markiert. Bei jeder inhaltlichen Aktualisierung eines Dossiers hier das Datum setzen.
type Dossier = {
  href: string;
  updated: string; // ISO-Datum der letzten inhaltlichen Aktualisierung
  kicker: string;
  title: ReactNode;
  body: ReactNode;
  cta: string;
  wide?: boolean;
  background: ReactNode;
};

const dossiers: Dossier[] = [
  {
    href: "/gaza/",
    updated: "2026-10-04",
    kicker: "Data installation · 2023–2026",
    title: (
      <>
        GAZA — <span className="text-gray-300">MAKE UP YOUR MIND</span>
      </>
    ),
    body: (
      <>
        The health ministry&apos;s casualty list — 72,835 names — not just shown but
        stress-tested: a 3D age pyramid, the combatant deduction from competing sources,
        week-by-week press narratives, and a calculator for{" "}
        <span className="text-white">your own</span> estimate of the civilian toll.
        English · العربية · עברית · Deutsch.
      </>
    ),
    cta: "Examine the numbers",
    background: (
      <>
        <Image
          src="/images/gaza-card.jpg"
          alt="Red-tinted Sentinel-2 satellite view of the Gaza Strip coastline"
          fill
          className="object-cover object-center opacity-80 transition-transform duration-700 group-hover:scale-105"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
      </>
    ),
  },
  {
    href: "/frankreich-bildung/",
    updated: "2026-10-03",
    kicker: "Data dossier · France 1980–2026",
    title: (
      <>
        MORE MONEY PER CHILD — <span className="text-gray-300">LESS LEARNING?</span>
      </>
    ),
    body: (
      <>
        As French pupils blockade their lycées over &quot;cuts&quot;: spending per pupil since
        1980, inflation-adjusted, set against PISA, TIMSS, PIRLS and four decades of
        identical national tests. Deutsch.
      </>
    ),
    cta: "Open the dossier",
    wide: true,
    background: (
      <>
        <Image
          src="/images/frankreich-schule-card.jpg"
          alt="French primary school classroom in 1912, about thirty pupils, the word Calcul on the blackboard"
          fill
          className="object-cover object-[65%_45%] opacity-70 transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 1280px) 100vw, 1280px"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/10" />
      </>
    ),
  },
  {
    href: "/femizide/",
    updated: "2026-10-04",
    kicker: "Case database · Austria 2019–2026",
    title: "FEMIZIDE IN ÖSTERREICH",
    body: (
      <>
        203 documented femicide cases — victims, perpetrators, motives, trials, sources —
        searchable and filterable, with year-by-year statistics, an interactive map of the
        nine Bundesländer, a population-adjusted comparison, and a 56-year historical view
        back to 1970. Deutsch.
      </>
    ),
    cta: "Open the database",
    background: (
      <>
        <Image
          src="/images/femizide-card.jpg"
          alt="Vertical color stripes, one per year, with a gold long-term trend line"
          fill
          className="object-cover object-center opacity-80 transition-transform duration-700 group-hover:scale-105"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
      </>
    ),
  },
  {
    href: "/westbank/",
    updated: "2026-09-25",
    kicker: "Data & sources · West Bank 2023–2026",
    title: (
      <>
        SETTLER VIOLENCE — <span className="text-gray-300">CASES &amp; CONTEXT</span>
      </>
    ),
    body: (
      <>
        A sourced German-language working page separating direct killings from deaths in
        the context of settler attacks — with case records, prosecution status and the
        Palestinian population series for the West Bank.
      </>
    ),
    cta: "Open the research",
    wide: true,
    background: (
      <div className="absolute inset-0 overflow-hidden bg-[#11110f]">
        <div className="absolute -right-12 -top-24 h-96 w-96 rounded-full border border-accent/30 transition-transform duration-700 group-hover:scale-110" />
        <div className="absolute right-24 -top-10 h-[130%] w-24 rotate-[14deg] bg-accent/70 transition-transform duration-700 group-hover:rotate-[18deg]" />
        <div className="absolute right-52 top-16 h-72 w-72 rounded-full border border-white/10" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
      </div>
    ),
  },
  {
    href: "/mortality/",
    updated: "2026-10-04",
    kicker: "Interactive data project · Austria 1970–2026",
    title: "WORAN ÖSTERREICH STIRBT",
    body: (
      <>
        Fifty-six years of official mortality data, made explorable by cause of death,
        sex and age. Compare trends, standardized rates and estimated years of life
        lost — plus a separate week-by-week view of mortality and weather.
      </>
    ),
    cta: "Explore the data",
    background: (
      <>
        <Image
          src="/images/sarkophag-leopold.jpg"
          alt="Sarcophagus of Emperor Leopold I"
          fill
          className="object-cover object-center opacity-65 saturate-50 transition-transform duration-700 group-hover:scale-105"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/20" />
      </>
    ),
  },
  {
    href: "/wien-sonne-temperatur",
    updated: "2026-10-04",
    kicker: "Interactive data project · Vienna 1880–2026",
    title: "146 YEARS OF SUN & TEMPERATURE",
    body: (
      <>
        Daily observations from Vienna&apos;s Hohe Warte, transformed into a long view of
        sunshine, maximum temperatures and their changing ratio — with weekly detail for
        2025 and 2026 and atmospheric CO₂ measurements from 1959 onward.
      </>
    ),
    cta: "Explore the climate data",
    wide: true,
    background: (
      <>
        <Image
          src="/images/vienna-weather-tornado.jpg"
          alt="Wasserhose über dem Bodensee unter dunklen Gewitterwolken"
          fill
          className="object-cover object-[58%_48%] opacity-75 saturate-75 transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 1280px) 100vw, 1280px"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/10" />
      </>
    ),
  },
];

const formatDate = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });

export default function DossierCards() {
  // Neuestes zuerst; bei gleichem Datum bleibt die Reihenfolge oben erhalten (stabile Sortierung)
  const sorted = [...dossiers].sort((a, b) => b.updated.localeCompare(a.updated));
  const latest = sorted[0]?.updated;

  return (
    <>
      {sorted.map((d) => {
        const fresh = d.updated === latest;
        return (
          <section key={d.href} className="max-w-7xl mx-auto px-4 pt-6">
            <a
              href={d.href}
              className="art-card group relative block overflow-hidden rounded-lg border border-accent/30 hover:border-accent transition-colors duration-300 bg-black"
            >
              <div className="absolute inset-0">{d.background}</div>
              <div className={`relative px-8 py-12 md:px-14 md:py-16 ${d.wide ? "max-w-2xl" : "max-w-xl"}`}>
                <p className="mb-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs uppercase tracking-[0.3em]">
                  <span className="text-accent">{d.kicker}</span>
                  <time
                    dateTime={d.updated}
                    className={`inline-flex items-center gap-2 border px-2.5 py-1 text-[10px] tracking-[0.22em] ${
                      fresh ? "border-red-500/70 text-white" : "border-white/25 text-gray-300"
                    }`}
                  >
                    {fresh && <span className="h-1.5 w-1.5 bg-red-500" aria-hidden="true" />}
                    Updated {formatDate(d.updated)}
                  </time>
                </p>
                <h2 className="font-serif text-3xl md:text-5xl tracking-wide mb-4">{d.title}</h2>
                <p className={`text-gray-300 mb-8 leading-relaxed ${d.wide ? "max-w-xl" : ""}`}>{d.body}</p>
                <span className="inline-block px-8 py-3 border border-accent text-accent group-hover:bg-accent group-hover:text-black transition-all duration-300 tracking-widest text-sm uppercase">
                  {d.cta}
                </span>
              </div>
            </a>
          </section>
        );
      })}
    </>
  );
}
