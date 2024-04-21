/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'avatars.githubusercontent.com',
      '192.168.0.102',
      'localhost',
      'images.unsplash.com',
      'secure.gravatar.com',
      'encrypted-tbn0.gstatic.com'
    ],
  },
}

module.exports = nextConfig
