/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: 'api.atlassian.com' },
      { hostname: 'avatars.githubusercontent.com' },
      { hostname: 'images.unsplash.com' },
      { hostname: 'secure.gravatar.com' },
      { hostname: 'encrypted-tbn0.gstatic.com' },
      { hostname: 'localhost' },
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60,
  },
  
  async headers() {
    return [
      {
        source: '/(.*)',
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
