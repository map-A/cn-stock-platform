module.exports = {
  extends: require.resolve('@umijs/fabric/dist/eslint'),
  globals: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION: true,
    page: true,
    REACT_APP_ENV: true,
  },
  rules: {
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'max-lines': ['error', { max: 300, skipBlankLines: true, skipComments: true }],
    'max-lines-per-function': ['warn', { max: 150, skipBlankLines: true, skipComments: true }],
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    "semi": ["error", "always"],
    "quotes": ["error", "single"]
  },
};
