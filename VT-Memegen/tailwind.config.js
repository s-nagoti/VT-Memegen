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
        maroonDark: '#660000', // Darker shade for hover effects
      }
    },
  },
  plugins: [],
}