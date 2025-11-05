/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        turret: ['"Turret Road"', 'sans-serif'],
        titillium: ['"Titillium Web"', 'sans-serif'],

      },
    },
  },
  plugins: [],
}