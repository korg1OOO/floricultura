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
  compress: true, // Enable compression
  webpack(config, { isServer }) {
    if (!isServer) {
      config.externals.push('mongoose', 'sharp');
    }
    config.optimization.splitChunks = {
      chunks: 'all',
      maxSize: 100000, // 200KB to create smaller chunks
      minSize: 20000, // Allow smaller modules to split
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
    config.optimization.minimize = true; // Ensure minification
    config.module.rules.push({
      test: /\.css$/,
      use: [
        { loader: 'css-loader', options: { importLoaders: 1 } },
        { loader: 'postcss-loader', options: { postcssOptions: { plugins: ['cssnano'] } } },
      ],
    });
    return config;
  },
});
