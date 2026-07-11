import type { Metadata } from "next";
import GameLoader from "@/components/chess/GameLoader";

export const metadata: Metadata = {
  title: "Democratic Chess — Play",
  description:
    "Playable version of the installation Democratic Chess by Michael Marcovici: the players decide which figure moves, the camera-figures decide where to go.",
  openGraph: {
    title: "Democratic Chess — play it in 3D",
    description:
      "34 roles: the players decide WHO moves — the camera-figures decide where. An installation by Michael Marcovici, playable in the browser.",
    images: [{ url: "/og/og-chess.jpg", width: 1200, height: 630 }],
  },
};

export default function DemocraticChessGamePage() {
  return <GameLoader />;
}
