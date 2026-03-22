import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Output standalone for production deployment
  // output: 'standalone',

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
