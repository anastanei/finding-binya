/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './*.html',
    './src/**/*.{html,js,jsx,ts,tsx,scss}',
    './public/js/**/*.js' ],
  theme: {
    extend: {
      colors: {
        custom: {
          background: '#D9D9D9',
          text: '#285AEB',
          secondaryText: '#d6249f',
          accent: '#fd7080',
        },
      },
      backgroundImage: {
        'custom-gradient': 'radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)',
      },
      fontFamily: {
        'georgia': ['Georgia', 'sans-serif'], 
      },
      maxWidth: {
        'custom': '120rem',
        'custom-small': '288px',
      },
    },
  },
  plugins: [],
}