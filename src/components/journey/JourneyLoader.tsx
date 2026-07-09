"use client";

import dynamic from "next/dynamic";

const Journey = dynamic(() => import("./Journey"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 bg-[#a7abb0] flex items-center justify-center">
      <p className="font-serif text-black/60 tracking-widest animate-pulse">LAYING OUT THE PATH…</p>
    </div>
  ),
});

export default function JourneyLoader({ lang = "en" }: { lang?: "en" | "de" }) {
  return <Journey lang={lang} />;
}
