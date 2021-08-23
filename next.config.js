// next.config.js
const withSass = require('@zeit/next-sass')
const withFonts = require('next-fonts');

module.exports = withFonts(withSass({
  /* config options here */
  target: 'serverless',
  webpack: function (config) {
    config.module.rules.push({
      test: /\.md$/,
      use: 'raw-loader',
    })
    return config
  },
}));