module.exports = {
  reactStrictMode: true,
  i18n: {
    locales: ['cs', /*'en-US', 'nl-NL', 'nl-BE'*/],
    defaultLocale: 'cs',

    domains: [
      {
        domain: 'http://localhost:3000/',
        defaultLocale: 'cs',
      }/*,
      {
        domain: 'example.fr',
        defaultLocale: 'fr',
      },
      {
        domain: 'example.nl',
        defaultLocale: 'nl-NL',
        // specify other locales that should be redirected
        // to this domain
        locales: ['nl-BE'],
      },*/
    ],
  },
}
