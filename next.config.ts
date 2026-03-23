import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Output standalone for production deployment
  // output: 'standalone',

  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
  },

  // Rewrite English routes to Indonesian route directories
  async rewrites() {
    return [
      { source: '/en/about', destination: '/en/tentang' },
      { source: '/en/services', destination: '/en/layanan' },
      { source: '/en/services/:path*', destination: '/en/layanan/:path*' },
      { source: '/en/contact', destination: '/en/kontak' },
      { source: '/en/projects', destination: '/en/proyek' },
      { source: '/en/projects/:path*', destination: '/en/proyek/:path*' },
    ];
  },
};

export default nextConfig;
