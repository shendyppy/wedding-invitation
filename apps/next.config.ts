import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: false,
    // Remove formats to prevent GIF conversion issues
    // Next.js will still optimize but won't force convert animated GIFs
    remotePatterns: [],
  },
};

export default nextConfig;
