import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // Image configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'i.ibb.co',
      },
      {
        protocol: 'https',
        hostname: '**.imgbb.com',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: '**.freeimage.host',
      },
      {
        protocol: 'https',
        hostname: 'iili.io',
      },
    ],
    unoptimized: false,
  },
  
  // Optimize for limited process environments (Hostinger Cloud Startup)
  experimental: {
    // Reduce worker threads to minimize process count
    workerThreads: false,
    cpus: 1,
  },
  
  // Production optimizations
  compress: true,
  productionBrowserSourceMaps: false,
};

export default nextConfig;
