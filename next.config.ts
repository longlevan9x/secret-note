import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  distDir: process.env.BUILD_DIR || '.next',

  images: {
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.simpleicons.org',
      },
      {
        protocol: 'https',
        hostname: 'logo.clearbit.com',
      },
    ],
  },
};

export default nextConfig;
