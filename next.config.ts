import type { NextConfig } from "next";

// biest.com/gapminder is served by its own Vercel project (repo
// dinorgcom/gapminder-3d, root directory `app`; see docs/DEPLOY.md there).
// The origin must be that project's production domain.
const GAPMINDER_ORIGIN = "https://gapminder-3d.vercel.app";

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
  async redirects() {
    return [
      // Westjordanland-Dossier heißt seit 10/2026 „Judäa und Samaria“ unter /js
      { source: "/westbank", destination: "/js", permanent: true },
      { source: "/westbank/:path*", destination: "/js/:path*", permanent: true },
    ];
  },
  async rewrites() {
    return {
      // beforeFiles: wins over any leftover static copy in public/gapminder.
      // The proxied response keeps the origin's Cache-Control headers.
      beforeFiles: [
        {
          // Vercel Web Analytics of the gapminder project (cookie-free visit
          // and story counts): its script and endpoint live at the origin's
          // root /_vercel/insights, so this rule must come before the generic
          // /gapminder/:path* proxy below.
          source: "/gapminder/_vercel/insights/:path*",
          destination: `${GAPMINDER_ORIGIN}/_vercel/insights/:path*`,
        },
        {
          source: "/gapminder",
          destination: `${GAPMINDER_ORIGIN}/gapminder`,
        },
        {
          source: "/gapminder/:path*",
          destination: `${GAPMINDER_ORIGIN}/gapminder/:path*`,
        },
      ],
      afterFiles: [
        {
          // CADO Builder: eigenständige 3D-App, gebaut im CADO-Projekt (npm run build:site)
          source: "/cado-builder",
          destination: "/cado-builder/index.html",
        },
        {
          source: "/mortality",
          destination: "/mortality/index.html",
        },
        {
          source: "/frankreich-bildung",
          destination: "/frankreich-bildung/index.html",
        },
        {
          source: "/js",
          destination: "/js/index.html",
        },
        {
          source: "/wien-sonne-temperatur",
          destination: "/wien-sonne-temperatur/index.html",
        },
      ],
    };
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
