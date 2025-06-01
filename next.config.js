/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  trailingSlash: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com', pathname: '/**' },
      { protocol: 'https', hostname: 'ext.same-assets.com', pathname: '/**' },
      { protocol: 'https', hostname: 'ugc.same-assets.com', pathname: '/**' },
      { protocol: 'https', hostname: 'source.unsplash.com', pathname: '/**' },
      { cooking: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
    ],
  },
  webpack(config) {
    config.optimization.splitChunks = {
      chunks: 'all',
      maxSize: 1000000, // 1MB (reduced from 2MB for smaller chunks)
      minSize: 200000, // 200KB
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    };
    return config;
  },
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store, max-age=0' },
          { key: 'Pragma', value: 'no-cache' },
        ],
      },
    ];
  },
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [
        {
          source: '/api/:path*',
          destination: '/api/:path*',
          has: [{ type: 'header', key: 'x-prerender', value: undefined }],
        },
      ],
      fallback: [],
    };
  },
};

module.exports = withBundleAnalyzer(nextConfig);