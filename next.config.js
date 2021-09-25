module.exports = {
  reactStrictMode: true,
  i18n: {
    locales: ['cs'],
    defaultLocale: 'cs',

    domains: [
      {
        domain: 'http://localhost:3000/',
        defaultLocale: 'cs',
      },
      {
        domain: 'https://www.ms-strazisko.cz',
        defaultLocale: 'cs',
      },
      {
        domain: 'https://admin.ms-strazisko.cz',
        defaultLocale: 'cs',
      }
    ],
  },
  images: {
    deviceSizes: [320, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    domains: ['picsum.photos', 'images.unsplash.com', 'www.ms-strazisko.cz'],
  },
  async redirects() {
    return [
      {
        source: '/a',
        destination: '/',
        permanent: true,
      },
    ]
  },
  api: {
    bodyParser: false,
  },
}
