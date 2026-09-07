import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static HTML export to `out/` for GitHub Pages (served on a custom domain).
  output: "export",
  // GitHub Pages is a static host — Next's image optimizer can't run, so serve
  // images as-is.
  images: { unoptimized: true },
  // Emit each route as a folder with index.html (e.g. /services/index.html),
  // which static hosts like GitHub Pages resolve cleanly.
  trailingSlash: true,
};

export default nextConfig;
