// tailwind.config.js
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
        charcoal: '#1C1C1C', 
        hokieStone: '#75787B',  // Hokie Stone color
        maroon: '#861F41',     // VT Maroon
        maroonLight: '#993333', // A lighter maroon for hover or accents
        accentRed: '#bf0000',   // Another accent red (renamed for clarity)
        neutralWhite: '#D7D2CB', // Neutral white for text and backgrounds
      },
      fontFamily: {
        serif: ['Georgia', 'serif'], // Add serif font family
        sans: ['Inter', 'sans-serif'], // Default font family
      },
    },
  },
  plugins: [],
};
