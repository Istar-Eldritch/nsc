module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true
  },
  extends: [
    'standard',
    'plugin:@typescript-eslint/recommended'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  plugins: [
    'react',
    '@typescript-eslint'
  ],
  rules: {

    // The typescript compiler does this
    "@typescript-eslint/no-unused-vars": "off",

    // TODO: Fix linter issues and remove this lines
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/camelcase": "off",
    "quotes": "off",
    "semi": "off",
    "indent": "off",
    "space-before-function-paren": "off"
  }
}
