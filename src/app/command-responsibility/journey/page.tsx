import type { Metadata } from "next";
import JourneyLoader from "@/components/journey/JourneyLoader";

export const metadata: Metadata = {
  title: "The Journey — Command Responsibility",
  description:
    "A memorial landscape: the stations of Hermann Wenkart's path 1940–1945 — Vienna, the deportation, Opole, Dęblin, Częstochowa, collapse and homecoming — with the audiobook chapter at every station.",
  openGraph: {
    title: "The Journey — a 3D memorial landscape",
    description:
      "The stations of Hermann Wenkart's path 1940–1945, walkable in 3D — with the audiobook chapter at every station.",
    images: [{ url: "/og/og-journey.jpg", width: 1200, height: 630 }],
  },
};

export default function JourneyPage() {
  return <JourneyLoader />;
}
