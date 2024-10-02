/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./*.html",
    "./src/**/*.{html,js,jsx,ts,tsx,scss}",
    "./public/js/*.js",
  ],
  theme: {
    extend: {
      colors: {
        custom: {
          background: "#3E576E", // paynes-gray
          text: "#E2D19E", // vanilla
          accent: "#C6AD6B", // citron
          secondaryText: "#7A674F", // coyote
          secondaryBackground: "#847349", // indigo-dye
        },
      },
      backgroundImage: {
        "custom-gradient":
          "radial-gradient(circle at 30% 107%, #fdf497 0%, #fdf497 5%, #fd5949 45%, #d6249f 60%, #285AEB 90%)",
      },
      fontFamily: {
        georgia: ["Georgia", "sans-serif"],
      },
      boxShadow: {
        "custom-inset": "inset 3px 3px 5px #FFF, inset -3px -3px 5px #C6AD6B",
      },
      maxWidth: {
        custom: "120rem",
        "custom-small": "288px",
      },
    },
  },
  plugins: [],
};
