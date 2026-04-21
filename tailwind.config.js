/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'scroll-deals': 'scroll-deals 30s linear infinite',
      },
      keyframes: {
        'scroll-deals': {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(calc(-50% - 0.625rem))' },
        }
      }
    },
  },
  plugins: [],
}