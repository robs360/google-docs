import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ibb.co', // ✅ main domain for imgbb hosted images
      },
      {
        protocol: 'https',
        hostname: 'ibb.co',   // (optional) in case some links use ibb.co
      },
    ],
  },
};

export default nextConfig;
