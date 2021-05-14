const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const config = require('./config');
const packageConfig = require('../package.json');

exports.assetsPath = function (_path) {
  const assetsSubDirectory = config.isDevelopment
    ? config.dev.assetsSubDirectory
    : config.build.assetsSubDirectory;

  return path.posix.join(assetsSubDirectory, _path);
};

exports.assetsFilenames = {
  app: config.isDevelopment ? '[name].js' : exports.assetsPath('js/[contenthash:8].js'),
  chunk: config.isDevelopment ? '[name].js' : exports.assetsPath('js/[contenthash:8].js'),
  css: config.isDevelopment ? '[name].css' : exports.assetsPath('css/[contenthash:8].css'),
  img: config.isDevelopment ? '[path][name].[ext]' : exports.assetsPath('images/[contenthash:8].[ext]'),
  font: config.isDevelopment ? '[path][name].[ext]' : exports.assetsPath('fonts/[contenthash:8].[ext]'),
  video: config.isDevelopment ? '[path][name].[ext]' : exports.assetsPath('videos/[contenthash:8].[ext]')
};

exports.assetsLoaders = [{
  test: /\.(png|jpe?g|gif|svg|webp|avif)$/i,
  loader: 'url-loader',
  options: {
    limit: 1000,
    name: exports.assetsFilenames.img
  }
}, {
  test: /\.(webm|mp4|ogv)$/i,
  loader: 'url-loader',
  options: {
    limit: 1000,
    name: exports.assetsFilenames.video
  }
}, {
  test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/i,
  loader: 'url-loader',
  options: {
    limit: 1000,
    name: exports.assetsFilenames.font
  }
}];

exports.cssLoaders = function (opt) {
  const options = { ...opt || {} };

  const cssLoader = {
    loader: 'css-loader',
    options: {
      modules: {
        auto: options.useCssModules ? undefined : /\.module\.\w+$/i,
        localIdentName: config.isDevelopment ? '[name]__[local]--[hash:base64:5]' : '_[hash:base64:10]'
      },
      sourceMap: options.sourceMap
    }
  };

  const postcssLoader = {
    loader: 'postcss-loader',
    options: {
      sourceMap: options.sourceMap
    }
  };

  // generate loader string to be used with extract text plugin
  function generateLoaders(loader, loaderOptions) {
    const loaders = options.usePostCSS ? [cssLoader, postcssLoader] : [cssLoader];

    if (loader) {
      const opts = {
        sourceMap: options.sourceMap
      };
      loaders.push({
        loader: `${loader}-loader`,
        options: { ...loaderOptions, ...opts }
      });
    }

    // Extract CSS when that option is specified
    // (which is the case during production build)
    if (options.extract) {
      return [MiniCssExtractPlugin.loader].concat(loaders);
    }
    return ['style-loader'].concat(loaders);
  }

  return {
    css: generateLoaders(),
    postcss: generateLoaders(),
    less: generateLoaders('less'),
    sass: generateLoaders('sass', { indentedSyntax: true }),
    scss: generateLoaders('sass'),
    stylus: generateLoaders('stylus'),
    styl: generateLoaders('stylus')
  };
};

// Generate loaders for standalone style files (outside of .vue)
exports.styleLoaders = function (options) {
  const output = [];
  const normalLoaders = exports.cssLoaders(options);
  const cssModulesLoaders = exports.cssLoaders({ ...options || {}, useCssModules: true });

  for (const extension in normalLoaders) {
    const test = new RegExp(`\\.${extension}$`);
    output.push({
      oneOf: [{
        test,
        resourceQuery: /css_modules/,
        use: cssModulesLoaders[extension]
      }, {
        test,
        use: normalLoaders[extension]
      }]
    });
  }

  return output;
};

exports.createNotifierCallback = () => {
  const notifier = require('node-notifier');

  return (severity, errors) => {
    if (severity !== 'error') return;

    const error = errors[0];
    const filename = error.file && error.file.split('!').pop();

    notifier.notify({
      title: packageConfig.name,
      message: `${severity}: ${error.name}`,
      subtitle: filename || ''
    });
  };
};
