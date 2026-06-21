/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        warmCream: '#F8F4EE',
        softBeige: '#EFE7DA',
        mountainGreen: '#4E7B5A',
        sunsetOrange: '#F5A623',
        skyBlue: '#7DB6E8',
        heading: '#222222',
        body: '#666666',
      },
      fontFamily: {
        sans: ['Inter', 'SF Pro Text', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
