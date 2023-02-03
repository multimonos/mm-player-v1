/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{svelte,js,ts,html}',
  ],
  plugins: [
      require("@tailwindcss/typography")
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
