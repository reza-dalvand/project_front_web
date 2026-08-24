// next.config.js
const isProd = process.env.NODE_ENV === 'production';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ✅ فقط در بیلد نهایی
  ...(isProd ? { output: 'export' } : {}),

  allowedDevOrigins: ['192.168.1.43', 'localhost', '127.0.0.1'],

  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'i.pravatar.cc' },
      { protocol: 'https', hostname: '*.tile.openstreetmap.org' },
      { protocol: 'https', hostname: 'api.maptiler.com' },
      // ✅ Production: Arvan Storage
      { protocol: 'https', hostname: '*.arvanstorage.ir' },
      // ✅ Production: BeauClub Domains
      { protocol: 'https', hostname: 'api.beauclub.ir' },
      { protocol: 'https', hostname: 'beauclub.ir' },
      { protocol: 'https', hostname: 'cdn.beauclub.ir' },
      { protocol: 'https', hostname: '*.beauclub.ir' },
    ],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256],
  },

  experimental: {
    optimizePackageImports: ['react-icons'],
  },
};

module.exports = nextConfig;
