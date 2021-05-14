const {extname} = require('path');

const CSS_EXT_NAMES = ['.css', '.less', '.sass', '.scss', '.stylus', '.styl'];

module.exports = () => ({
  visitor: {
    ImportDeclaration(path) {
      const {specifiers, source} = path.node;
      const {value} = source;
      if (specifiers.length && CSS_EXT_NAMES.includes(extname(value))) {
        // 在路径末尾加上 css_modules 用于 webpack 匹配该文件，
        // 如 import Test from './test.less'; 变成 import Test from './test.less?css_modules';
        source.value = `${value}?css_modules`;
      }
    }
  }
});
