import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/wien-sonne-temperatur",
        headers: [
          {
            key: "X-Robots-Tag",
            value: "noindex, nofollow, noarchive",
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/mortality",
        destination: "/mortality/index.html",
      },
      {
        source: "/wien-sonne-temperatur",
        destination: "/wien-sonne-temperatur/index.html",
      },
    ];
  },
  // The audiobooks (~400 MB) are served statically from public/ — never
  // bundle them into serverless functions (Vercel's 250 MB limit).
  // Chapter pages check for the MP3s with fs at build time (SSG), so the
  // exclusion does not affect rendering.
  outputFileTracingExcludes: {
    "*": ["./public/book/audio/**", "./public/book/audio-de/**"],
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
