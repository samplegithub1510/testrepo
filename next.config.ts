import type { NextConfig } from "next";

// `output: "export"` builds a fully static site into /out.
// It deploys to Vercel as-is, and to GitHub Pages or any static host.
const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
};

export default nextConfig;
