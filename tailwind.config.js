/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'activist': ['Oswald', 'Impact', 'Arial Black', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#7c3aed',
          foreground: '#ffffff'
        },
        secondary: {
          DEFAULT: '#f3f4f6',
          foreground: '#7c3aed'
        }
      }
    },
  },
  plugins: [],
}