module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        'purp-darker': 'rgba(24, 20, 51, 1)',
        'purp-dark': 'rgba(28, 24, 55, 1)',
        'purp-mid': 'rgba(40, 38, 67, 1)'
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
