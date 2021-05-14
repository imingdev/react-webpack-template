/**
 * @intro: webpack配置基类.
 */
const path = require('path');
const WebpackBarPlugin = require('webpackbar');
const utils = require('./utils');
const config = require('./config');

const resolve = (dir) => path.join(__dirname, '..', dir);

const createLintingRule = () => ({
  test: /\.(jsx?)$/,
  loader: 'eslint-loader',
  enforce: 'pre',
  include: [resolve('src')],
  options: {
    formatter: require('eslint-friendly-formatter'),
    emitWarning: !config.dev.showEslintErrorsInOverlay
  }
});

module.exports = {
  context: resolve('/'),
  entry: {
    app: './src/main.jsx'
  },
  output: {
    path: resolve('dist'),
    filename: utils.assetsFilenames.app
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.vue'],
    alias: {
      '@': resolve('src')
    }
  },
  module: {
    rules: [{
      test: /\.(jsx?)$/,
      loader: 'babel-loader',
      include: [resolve('src')],
      options: {
        cacheDirectory: config.cacheDirectory('babel-loader')
      }
    },
    ...(config.dev.useEslint ? [createLintingRule()] : []),
    ...utils.assetsLoaders
    ]
  },
  plugins: [
    new WebpackBarPlugin()
  ],
  performance: {
    hints: false
  },
  node: {
    // prevent webpack from injecting useless setImmediate polyfill because Vue
    // source contains it (although only uses it if it's native).
    setImmediate: false,
    // prevent webpack from injecting mocks to Node native modules
    // that does not make sense for the client
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
};
