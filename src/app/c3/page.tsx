import type { Metadata } from "next";
import C3Loader from "@/components/c3/C3Loader";

export const metadata: Metadata = {
  title: "C3 — Money in the World Today (3D)",
  description:
    "The money of the world as walkable cubes: from the entire cryptocurrency market to the mountain of derivatives. 3D version of the C3 / CryptoCreditCoin infographic by Michael Marcovici.",
};

export default function C3Page() {
  return <C3Loader />;
}
