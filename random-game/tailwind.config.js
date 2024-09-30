/** @type {import('tailwindcss').Config} */

// --paynes-gray: #3E576Eff; - background light blue
// --indigo-dye: #2F4B66ff;  - accent-dark secBackground
// --coyote: #7A674Fff;   background-light secText
// --citron: #DAC373ff;  accent
// --vanilla: #E2D19Eff;  text
module.exports = {
  content: [
    "./*.html",
    "./src/**/*.{html,js,jsx,ts,tsx,scss}",
    "./public/js/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        custom: {
          background: "#3E576E",
          text: "#E2D19E",
          accent: "#C6AD6B",
          secondaryText: "#7A674F",
          secondaryBackground: "#847349",
        },
      },
      backgroundImage: {
        "custom-gradient":
          "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)",
      },
      fontFamily: {
        georgia: ["Georgia", "sans-serif"],
      },
      maxWidth: {
        custom: "120rem",
        "custom-small": "288px",
      },
    },
  },
  plugins: [],
};
