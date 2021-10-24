module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
  },
  extends: ['airbnb-base'],
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    'no-unused-vars': 'off',
    'no-console': 'off',
    'func-names': 'off',
    'no-multiple-empty-lines': 'off',
    'no-unneeded-ternary': 'off',
    'no-plusplus': 'off',
    'prefer-destructuring': 'off',
    'no-underscore-dangle': 'off',
    'spaced-comment': 'off',
    'consistent-return': 'off',
    'camelcase': 'off',
    'comma-dangle': 'off',
    'quote-props': 'off',
  },
};
