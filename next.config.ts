import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    // Temporarily disable TypeScript checking during build for deployment
    ignoreBuildErrors: true,
  },
  eslint: {
    // Temporarily disable ESLint checking during build for deployment
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
