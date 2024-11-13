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
  },
};

module.exports = nextConfig;
