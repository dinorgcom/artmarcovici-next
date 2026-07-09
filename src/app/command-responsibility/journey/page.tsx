import type { Metadata } from "next";
import JourneyLoader from "@/components/journey/JourneyLoader";

export const metadata: Metadata = {
  title: "The Journey — Command Responsibility",
  description:
    "A memorial landscape: the stations of Hermann Wenkart's path 1940–1945 — Vienna, the deportation, Opole, Dęblin, Częstochowa, collapse and homecoming — with the audiobook chapter at every station.",
};

export default function JourneyPage() {
  return <JourneyLoader />;
}
