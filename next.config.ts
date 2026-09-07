import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Emit a minimal standalone server for small Docker images / Cloud Run.
  output: "standalone",
};

export default nextConfig;
