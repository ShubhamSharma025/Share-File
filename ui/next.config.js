/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    // Only use rewrites in development - Nginx handles this in production
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/api/upload',
          destination: 'http://localhost:8080/upload',
        },
        {
          source: '/api/download/:port',
          destination: 'http://localhost:8080/download/:port',
        },
      ];
    }
    return [];
  },
}

module.exports = nextConfig
