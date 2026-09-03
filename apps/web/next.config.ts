import { NextConfig } from 'next';

const nextConfig = {
  reactStrictMode: true,
  turbopack: {
    root: '/home/joseph/Projects/stackschool-monorepo',
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9000',
        pathname: '/**',
      },
    ],
  },
} as NextConfig;

module.exports = nextConfig;
