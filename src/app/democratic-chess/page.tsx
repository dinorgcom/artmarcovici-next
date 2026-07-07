import type { Metadata } from "next";
import GameLoader from "@/components/chess/GameLoader";

export const metadata: Metadata = {
  title: "Democratic Chess — Play",
  description:
    "Playable version of the installation Democratic Chess by Michael Marcovici: the players decide which figure moves, the camera-figures decide where to go.",
};

export default function DemocraticChessGamePage() {
  return <GameLoader />;
}
