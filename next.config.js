/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  images: {
    unoptimized: false,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/dqknds48u/**',
      },
      {
        protocol: 'https',
        hostname: 'ext.same-assets.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ugc.same-assets.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'source.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
  },
  webpack(config, { isServer }) {
    if (!isServer) {
      config.externals.push('mongoose', 'sharp');
    }
    config.optimization.splitChunks = {
      chunks: 'all',
      maxSize: 500000,
      minSize: 100000,
      cacheGroups: {
        vendors: { test: /[\\/]node_modules[\\/]/, priority: -10, reuseExistingChunk: true },
        default: { minChunks: 2, priority: -20, reuseExistingChunk: true },
      },
    };
    return config;
  },
});