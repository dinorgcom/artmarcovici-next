import type { Metadata } from "next";
import JourneyLoader from "@/components/journey/JourneyLoader";

export const metadata: Metadata = {
  title: "Die Reise — Befehlsnotstand anders gesehen",
  description:
    "Eine Gedenklandschaft: die Stationen von Hermann Wenkarts Weg 1940–1945 — Wien, der Abtransport, Opole, Dęblin, Czenstochau, Zusammenbruch und Heimkehr — mit dem Hörbuch-Kapitel an jeder Station.",
  openGraph: {
    title: "Die Reise — eine 3D-Gedenklandschaft",
    description:
      "Die Stationen von Hermann Wenkarts Weg 1940–1945, begehbar in 3D — mit dem Hörbuch-Kapitel an jeder Station.",
    images: [{ url: "/og/og-journey.jpg", width: 1200, height: 630 }],
  },
};

export default function JourneyPageDe() {
  return <JourneyLoader lang="de" />;
}
