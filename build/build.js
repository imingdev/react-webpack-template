const rm = require('rimraf');
const consola = require('consola');
const webpack = require('webpack');
const config = require('./config');
const webpackConfig = require('./webpack.prod.config');

rm(config.build.assetsRoot, (err) => {
  if (err) throw err;
  webpack(webpackConfig, (e, stats) => {
    if (e) throw e;
    process.stdout.write(`${stats.toString({
      entrypoints: false,
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false,
    })}\n\n`);

    if (stats.hasErrors()) {
      consola.error('  Build failed with errors.');
      process.exit(1);
    }

    consola.success('  Build complete.');
    consola.info('  Tip: built files are meant to be served over an HTTP server.');
    consola.info('  Opening index.html over file:// won\'t work.');
  });
});
