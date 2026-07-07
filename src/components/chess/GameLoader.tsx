"use client";

import dynamic from "next/dynamic";

const Game = dynamic(() => import("./Game"), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 bg-black flex items-center justify-center">
      <p className="font-serif text-accent tracking-widest animate-pulse">
        SETTING UP THE BOARD…
      </p>
    </div>
  ),
});

export default function GameLoader() {
  return <Game />;
}
