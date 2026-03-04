import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: false,
    formats: ["image/webp", "image/avif"],
    // Use deviceSizes for better responsive images
    deviceSizes: [320, 420, 640, 750, 828, 1080, 1200],
    // Use imageSizes for different image sizes
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [],
  },
};

export default nextConfig;
