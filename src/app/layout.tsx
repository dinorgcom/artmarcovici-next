import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });

export const metadata: Metadata = {
  metadataBase: new URL("https://biest.com"),
  title: {
    default: "Art Marcovici",
    template: "%s | Art Marcovici",
  },
  description: "Contemporary Art by Michael Marcovici — Paintings, Sculptures, Mosaics & Digital Art",
  openGraph: {
    title: "Art Marcovici",
    description: "Contemporary Art by Michael Marcovici",
    type: "website",
    siteName: "Art Marcovici — biest.com",
    images: [{ url: "/og/og-default.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${playfair.variable} font-sans bg-black text-white antialiased`}>
        <Navigation />
        <main className="min-h-screen pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
