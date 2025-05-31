/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: false, // Re-enable optimization
    domains: [
      "source.unsplash.com",
      "images.unsplash.com",
      "ext.same-assets.com",
      "ugc.same-assets.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "source.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ext.same-assets.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "ugc.same-assets.com",
        pathname: "/**",
      },
    ],
  },
  webpack(config) {
    config.optimization.splitChunks = {
      chunks: 'all', // Split all chunks, including vendor and async
      maxSize: 2000000, // 2 MiB max per chunk
      minSize: 500000, // 500 kB minimum size for a chunk to be split
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/, // Split node_modules into separate chunks
          priority: -10,
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2, // Split if a module is used in at least 2 places
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    };
    return config;
  },
};

module.exports = nextConfig;