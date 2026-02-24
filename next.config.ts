import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "svgl.app",
      },
      {
        protocol: "https",
        hostname: "ui.aceternity.com",
      },
    ],
  },
};

export default nextConfig;
