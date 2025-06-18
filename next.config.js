const path = require("path");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: false,
});

const nextConfig = {
  reactStrictMode: true,
  images: {
    deviceSizes: [320, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.ms-strazisko.cz",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "jidelna.zsmspteni.cz",
        pathname: "/**",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/a",
        destination: "/",
        permanent: true,
      },
    ];
  },
  webpack(config) {
    config.resolve.alias["@styles"] = path.resolve(__dirname, "src/styles");
    return config;
  },
};

module.exports = withBundleAnalyzer(nextConfig);
