const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = withNextIntl({
  reactStrictMode: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'e5osher1gwoyuako.public.blob.vercel-storage.com',
        pathname: '**',
      },
    ],
  },
});

module.exports = nextConfig;