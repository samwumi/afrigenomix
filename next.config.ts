import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  
  // Optimize for limited process environments (Hostinger Cloud Startup)
  experimental: {
    // Reduce worker threads to minimize process count
    workerThreads: false,
    cpus: 1,
  },
  
  // Production optimizations
  compress: true,
  productionBrowserSourceMaps: false,
  
  // Use SWC minification (faster, less memory)
  swcMinify: true,
};

export default nextConfig;
