import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: false,
    formats: ["image/webp", "image/avif"],
    remotePatterns: [],
  },
};

export default nextConfig;
