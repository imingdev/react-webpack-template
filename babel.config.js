const config = require('./build/config');

module.exports = {
  presets: ['react-app'],
  plugins: [
    '@pieced/babel-plugin-auto-css-modules',
    config.isDevelopment && 'react-refresh/babel',
  ].filter(Boolean),
  compact: false,
};
