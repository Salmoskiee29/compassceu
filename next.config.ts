import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Bake COMING_SOON in at build time so the proxy sees it on Netlify,
  // where build-time variables (netlify.toml) don't reach the runtime.
  env: {
    COMING_SOON: process.env.COMING_SOON ?? "true",
  },
};

export default nextConfig;
