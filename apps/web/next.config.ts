import { NextConfig } from 'next';

const nextConfig = {
  reactStrictMode: true,
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
  async rewrites() {
    return [
      {
        // Si une requête commence par /images
        source: '/images/:path*',
        // Redirigez-la vers le serveur Express (qui sert les fichiers statiques)
        destination: 'http://localhost:4000/images/:path*',
      },
    ];
  },
} as NextConfig;

module.exports = nextConfig;
