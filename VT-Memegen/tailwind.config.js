/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        maroon: {
          DEFAULT: '#800000', // Define the maroon color
          dark: '#4B0000',
          light: '#B03060',
      }
    },
  },
  plugins: [],
}
}