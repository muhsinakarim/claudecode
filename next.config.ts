import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove static export for now to keep API routes working
  // output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Remove basePath for Vercel deployment  
  // basePath: process.env.NODE_ENV === 'production' ? '/claudecode' : '',
  // assetPrefix: process.env.NODE_ENV === 'production' ? '/claudecode/' : '',
};

export default nextConfig;
