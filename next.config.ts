import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'oknmglsdbhqdawmojxqv.supabase.co'
      }
    ]
  },
  experimental: {
    ppr: true,
    dynamicIO: true
  }
};

export default nextConfig;
