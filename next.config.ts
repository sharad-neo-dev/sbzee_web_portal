import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: "export",
  experimental: {
    optimizePackageImports: ["framer-motion", "lucide-react"],
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "dev-fruggies-assets.s3.ap-south-1.amazonaws.com",
        pathname: "/**",
      },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  async rewrites() {
    return [
      {
        source: "/api/v1/:path*",
        destination: "https://dev.api.fruggies.co.in/api/v1/:path*",
      },
      // {
      //   source: "/api/images/:path*",
      //   destination:
      //     "https://dev-fruggies-assets.s3.ap-south-1.amazonaws.com/:path*",
      // },
    ];
  },
  trailingSlash: true,
};

export default nextConfig;
