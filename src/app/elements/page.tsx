import type { Metadata } from "next";
import EconomicTableLoader from "@/components/elements/EconomicTableLoader";

export const metadata: Metadata = {
  title: "The Economic Periodic Table",
  description:
    "The periodic table of elements, priced: what every element costs per kilogram, per mole, per atom, per electron and per coulomb of charge — as a color map or a 3D price landscape.",
};

export default function ElementsPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="mb-8">
        <h1 className="font-serif text-3xl text-white sm:text-4xl">
          The Economic Periodic Table
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">
          Every element, priced. Choose the unit of account — a kilogram, a mole, a single atom,
          an electron, a coulomb of charge — and the table repaints itself from cheap (blue) to
          absurd (fuchsia), on a logarithmic scale. Switch to 3D to see prices as a landscape.
        </p>
      </header>
      <EconomicTableLoader />
    </div>
  );
}
