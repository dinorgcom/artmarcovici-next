import type { Metadata } from "next";
import EconomicTableLoader from "@/components/elements/EconomicTableLoader";
import LangSwitch from "@/components/elements/LangSwitch";
import { BIEST_LANG_INIT_SCRIPT } from "@/lib/biestLangInit";

export const metadata: Metadata = {
  title: "The Economic Periodic Table",
  description:
    "The periodic table of elements, priced: what every element costs per kilogram, per mole, per atom, per electron and per coulomb of charge — as a color map or a 3D price landscape.",
};

export default function ElementsPage() {
  return (
    // German/English: the inline script picks the language before first paint
    // (same rule as the dossiers); LangSwitch keeps it in sync afterwards.
    <div
      data-biest-lang-root=""
      suppressHydrationWarning
      className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8"
    >
      <script dangerouslySetInnerHTML={{ __html: BIEST_LANG_INIT_SCRIPT }} />
      <header className="mb-8">
        <div className="flex items-start justify-between gap-4">
          <h1 className="font-serif text-3xl text-white sm:text-4xl">
            <span data-lang="de">Das ökonomische Periodensystem</span>
            <span data-lang="en">The Economic Periodic Table</span>
          </h1>
          <div className="pt-1.5 sm:pt-2.5">
            <LangSwitch />
          </div>
        </div>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted" data-lang="de">
          Jedes Element mit Preisschild. Wähle die Recheneinheit — ein Kilogramm, ein Mol, ein
          einzelnes Atom, ein Elektron, ein Coulomb Ladung — und die Tabelle färbt sich neu ein,
          von billig (blau) bis absurd (fuchsia), auf logarithmischer Skala. In 3D werden die
          Preise zur Landschaft.
        </p>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted" data-lang="en">
          Every element, priced. Choose the unit of account — a kilogram, a mole, a single atom,
          an electron, a coulomb of charge — and the table repaints itself from cheap (blue) to
          absurd (fuchsia), on a logarithmic scale. Switch to 3D to see prices as a landscape.
        </p>
      </header>
      <EconomicTableLoader />
    </div>
  );
}
