/** @type {import('prettier').Config} */
module.exports = {
  semi: false,
  singleQuote: true,
  arrowParens: 'avoid',
  trailingComma: 'none',
  endOfLine: 'auto',
  plugins: [require('prettier-plugin-tailwindcss')],
}
