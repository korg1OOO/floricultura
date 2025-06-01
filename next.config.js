/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  images: {
    unoptimized: false, // Keep this for optimized images
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
  // Enable static export if applicable (reduces bundle size for static sites)
  output: 'standalone', // Use standalone output for smaller, self-contained builds
  // Optimize Webpack configuration
  webpack(config, { isServer }) {
    if (!isServer) {
      // Externalize large dependencies to reduce client-side bundle size
      config.externals.push('mongoose', 'sharp');
    }
    config.optimization.splitChunks = {
      chunks: 'all',
      maxSize: 250000, // Reduce maxSize to 250KB to create smaller chunks
      minSize: 30000, // Lower minSize to ensure smaller modules are split
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
    // Add compression for JS/CSS files
    config.optimization.minimize = true; // Ensure minification is enabled
    return config;
  },
  // Enable compression for Cloudflare Pages
  compress: true,
  // Configure caching for faster rebuilds
  cacheHandler: require.resolve('next/dist/server/cache-handler'),
  cacheMaxMemorySize: 0, // Disable in-memory cache to reduce build size
});