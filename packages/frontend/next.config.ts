import type { NextConfig } from "next";
module.exports = {
  /*  async rewrites() {
    return [
      {
        source: "/auth/:path*",
        destination: "http://localhost:4000/auth/:path*",
      },
    ];
  },*/
  reactStrictMode: true,
  swcMinify: true,
} as NextConfig;

//export default nextConfig;
