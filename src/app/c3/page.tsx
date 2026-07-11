import type { Metadata } from "next";
import C3Loader from "@/components/c3/C3Loader";

export const metadata: Metadata = {
  title: "C3 — Money in the World Today (3D)",
  description:
    "The money of the world as walkable cubes: from the entire cryptocurrency market to the mountain of derivatives. 3D version of the C3 / CryptoCreditCoin infographic by Michael Marcovici.",
  openGraph: {
    title: "Money in the World — 1950 to today, in 3D",
    description:
      "The money of the world as walkable cubes, morphing from 1950 to today — cryptocurrencies, gold, cash, credit, real estate, derivatives.",
    images: [{ url: "/og/og-c3.jpg", width: 1200, height: 630 }],
  },
};

export default function C3Page() {
  return <C3Loader />;
}
