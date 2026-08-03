/** @type {import('next').NextConfig} */
const nextConfig = {
  // پشتیبانی از localhost در development
  allowedDevOrigins: ['192.168.1.43', 'localhost', '127.0.0.1'],
  
  // تنظیمات تصاویر
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'i.pravatar.cc' },
      { protocol: 'https', hostname: '*.tile.openstreetmap.org' },
      { protocol: 'https', hostname: 'api.maptiler.com' },
    ],
  },

  // پشتیبانی از maplibre-gl
  transpilePackages: ['maplibre-gl'],

  // تنظیمات PWA
  experimental: {
    optimizePackageImports: ['react-icons'],
  },

  // Headers سفارشی برای SEO و Security
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;