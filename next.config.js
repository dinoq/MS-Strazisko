const nextConfig = {
  reactStrictMode: true,
  i18n: {
    locales: ["cs"],
    defaultLocale: "cs",
  },
  images: {
    deviceSizes: [320, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    domains: ["picsum.photos", "images.unsplash.com", "www.ms-strazisko.cz", "jidelna.zsmspteni.cz"],
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
//   api: {
//     bodyParser: false,
//   },
};

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: false,
});

module.exports = withBundleAnalyzer(nextConfig);
//module.exports = nextConfig;
