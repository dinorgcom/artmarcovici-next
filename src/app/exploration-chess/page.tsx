import type { Metadata } from "next";
import GameLoader from "@/components/xchess/GameLoader";

export const metadata: Metadata = {
  title: "Exploration Chess — Play (preview)",
  description:
    "Game-logic preview: chess where every move costs money and treasures are buried under the squares — explore, develop, collect tolls.",
  robots: { index: false },
};

export default function ExplorationChessPage() {
  return <GameLoader />;
}
