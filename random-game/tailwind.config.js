/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    './*.html',
    './public/js/**/*.js' ],
  theme: {
    extend: {
      colors: {
        custom: {
          background: '#D9D9D9',
          text: '#285AEB',
          secondaryText: '#323232',
          accent: '#fd7080',
          secondary: '#d6249f'
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