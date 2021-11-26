/**
 * @intro: webpack配置生产.
 */
const path = require('path');
const merge = require('webpack-merge').default;
const CopyWebpackPlugin = require('copy-webpack-plugin');
const DotEnvWebpackPlugin = require('dotenv-webpack');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const webpackBaseConfig = require('./webpack.base.config');
const utils = require('./utils');
const config = require('./config');
const pkg = require('../package.json');

const resolve = (dir) => path.join(__dirname, '..', dir);

const mode = process.env.NODE_MODE || process.env.NODE_ENV;

const createZipPlugin = () => {
  // https://github.com/erikdesjardins/zip-webpack-plugin
  const ZipWebpackPlugin = require('zip-webpack-plugin');
  return new ZipWebpackPlugin({
    filename: `${pkg.name}_v${pkg.version}.zip`,
  });
};

module.exports = merge(webpackBaseConfig, {
  mode: 'production',
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.build.productionSourceMap,
      extract: true,
      usePostCSS: true,
    }),
  },
  devtool: config.build.productionSourceMap ? config.build.devtool : false,
  output: {
    path: config.build.assetsRoot,
    publicPath: config.build.assetsPublicPath,
    filename: utils.assetsFilenames.app,
    chunkFilename: utils.assetsFilenames.chunk,
    crossOriginLoading: 'anonymous',
  },
  plugins: [
    new DotEnvWebpackPlugin({
      path: `.env.${mode}`,
      silent: true, // hide any errors
      systemvars: true,
      defaults: '.env',
    }),
    new MiniCssExtractPlugin({
      filename: utils.assetsFilenames.css,
      chunkFilename: utils.assetsFilenames.css,
      ignoreOrder: true,
    }),
    // see https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: config.build.index,
      template: 'index.ejs',
      inject: true,
      favicon: 'favicon.ico',
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
    }),
    // copy custom static assets
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, '../static'),
      to: config.dev.assetsSubDirectory,
      ignore: ['.*'],
    }]),
    // https://github.com/erikdesjardins/zip-webpack-plugin
    config.build.packagedIntoZip && createZipPlugin(),
  ].filter(Boolean),
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: 'vendor',
          chunks: 'initial',
          test: ({ resource }) => resource && /\.js$/.test(resource) && resource.indexOf(resolve('node_modules')) === 0,
        },
        async: {
          name: 'async',
          chunks: 'async',
          minChunks: 3,
        },
      },
    },
    runtimeChunk: true,
    minimizer: [
      new OptimizeCSSPlugin({
        cssProcessorOptions: config.build.productionSourceMap
          ? {
            safe: true,
            map: { inline: false },
          }
          : { safe: true },
      }),
      new UglifyJsPlugin({
        cache: config.cacheDirectory('uglifyjs'),
        uglifyOptions: {
          output: {
            comments: false,
          },
          compress: {
            drop_debugger: true,
            drop_console: true,
          },
        },
        sourceMap: false,
        parallel: true,
      }),
    ],
  },
});
