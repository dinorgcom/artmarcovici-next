"use client";

import dynamic from "next/dynamic";

const EconomicTable = dynamic(() => import("./EconomicTable"), {
  ssr: false,
  loading: () => (
    <div className="flex h-[50vh] items-center justify-center">
      <p className="font-serif tracking-widest text-accent animate-pulse">
        WEIGHING THE ELEMENTS…
      </p>
    </div>
  ),
});

export default function EconomicTableLoader() {
  return <EconomicTable />;
}
