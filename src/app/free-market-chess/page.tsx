import type { Metadata } from "next";
import GameLoader from "@/components/fmchess/GameLoader";

export const metadata: Metadata = {
  title: "Free Market Chess — Play",
  description:
    "Playable version of Free Market Chess by Michael Marcovici: buy, develop and rent out the squares, bribe your opponent — and remember, there is no judge.",
};

export default function FreeMarketChessPage() {
  return <GameLoader />;
}
