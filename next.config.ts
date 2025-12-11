import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Emit a static export into the `out/` folder on build
  output: "export",
  experimental: {
    optimizePackageImports: ["framer-motion", "lucide-react"],
  },
  images: {
    // Next/Image optimizer is not available in static export; serve images as-is
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    formats: ["image/webp", "image/avif"],
  },
  trailingSlash: true,
};

export default nextConfig;
