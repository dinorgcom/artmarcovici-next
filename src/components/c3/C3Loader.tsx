"use client";

import dynamic from "next/dynamic";

const World = dynamic(() => import("./World"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 bg-[#4a4848] flex items-center justify-center">
      <p className="font-serif text-white/80 tracking-widest animate-pulse">
        COUNTING THE MONEY OF THE WORLD…
      </p>
    </div>
  ),
});

export default function C3Loader() {
  return <World />;
}
