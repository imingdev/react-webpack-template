module.exports = {
  plugins: [
    'stylelint-order'
  ],
  extends: 'stylelint-config-standard',
  rules: {
    'selector-list-comma-newline-after': null,
    'declaration-colon-newline-after': null,
    'font-family-no-missing-generic-family-keyword': null,
    'at-rule-no-unknown': null,
    'no-descending-specificity': null,
  }
};