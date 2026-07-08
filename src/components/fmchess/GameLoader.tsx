"use client";

import dynamic from "next/dynamic";

const Game = dynamic(() => import("./Game"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <p className="font-serif text-accent tracking-widest animate-pulse">OPENING THE MARKET…</p>
    </div>
  ),
});

export default function GameLoader() {
  return <Game />;
}
