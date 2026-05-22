import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.public.blob.vercel-storage.com',
      },
      {
        protocol: 'https',
        hostname: 'oqi7jzvkg9c2e27j.public.blob.vercel-storage.com',
      },
    ],
  },
};

export default nextConfig;
