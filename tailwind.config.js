/** @type {import('tailwindcss').Config} */
module.exports = {
  
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {},
  },
  // The tailwind-scrollbar plugin for v3
  plugins: [
    require('tailwind-scrollbar'),
  ],
}
