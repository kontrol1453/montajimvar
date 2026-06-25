/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        'expo-secure-store': false,
      };
    }
    // mobile klasörünü ignore et
    config.module.rules.push({
      test: /[\\/]mobile[\\/]/,
      loader: 'ignore-loader',
    });
    return config;
  },
};

module.exports = nextConfig;