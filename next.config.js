/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use standalone output for better compatibility with various hosting environments
  output: 'standalone',
  
  // Disable SWC minification if it causes issues, use Terser instead
  swcMinify: false,
  
  // Experimental features
  experimental: {
    // Use Turbopack for faster builds (optional, can be disabled if issues)
    turbo: {},
  },
  
  // Image optimization
  images: {
    domains: ['afrigenomix.com'],
  },
  
  // Environment variables that should be available on the client
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },
};

module.exports = nextConfig;
