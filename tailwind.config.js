/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        atlas: {
          navy: '#01161e',
          teal: '#124559',
          slate: '#598392',
          sage: '#aec3b0',
          cream: '#eff6e0',
          light: '#f0f0f0',
        },
      },
      fontFamily: {
        sans: ['"Inter Variable"', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
