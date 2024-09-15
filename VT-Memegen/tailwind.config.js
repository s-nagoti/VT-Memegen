/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class', // Enable dark mode via a CSS class
  theme: {
    extend: {
      colors: {
        darkGrey: '#1f1f1f',
        maroon: '#800000',
        accentRed: '#b22222',
        maroonLight: '#993333', // Adjusted to be a bit lighter
      }
    },
  },
  plugins: [],
}