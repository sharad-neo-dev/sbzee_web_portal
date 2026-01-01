import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // output: "export",
  trailingSlash: true,
  experimental: {
    optimizePackageImports: ["framer-motion", "lucide-react"],
  },
  images: {
    unoptimized: true, // Disable Next.js image optimization for static export
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dev-fruggies-assets.s3.ap-south-1.amazonaws.com",
        pathname: "/**", // Allow all paths from this hostname
      },
      {
        protocol: "https",
        hostname: "**.s3.ap-south-1.amazonaws.com", // Also allow any S3 bucket
      },
    ],
    formats: ["image/webp", "image/avif"],
    // Disable Next.js image optimization for these domains
    domains: [
      "dev-fruggies-assets.s3.ap-south-1.amazonaws.com",
      "*.s3.ap-south-1.amazonaws.com",
    ],
  },
  env: {
    NEXT_PUBLIC_API_BASE_URL:
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      "https://dev.api.fruggies.co.in/api/v1",
  },
};

export default nextConfig;
