/** @type {import('prettier').Config} */
module.exports = {
  semi: false,
  singleQuote: true,
  arrowParens: 'avoid',
  trailingComma: 'none',
  tabWidth: 2,
  endOfLine: 'auto',
  plugins: [require('prettier-plugin-tailwindcss')],
}
