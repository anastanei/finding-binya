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
          background: "#624E88", // purple
          text: "#E6D9A2", // vanilla
          accent: "#FABC3F", // pink - #CB80AB"  #FABC3 -yellow warm
          secondaryBackground: "#8967B3", // light-purple
          secondaryAccent: "#CB80AB",
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
        // "custom-inset": "inset 3px 3px 5px #FFF, inset -3px -3px 5px #C6AD6B",
        "custom-inset":
          "inset 3px 3px 5px #FFEECC, inset -3px -3px 5px #BBBB88",

        "custom-inset-hover":
          "inset 3px 3px 5px #FFCD5F, inset -3px -3px 5px #CCAA24",
      },
      maxWidth: {
        custom: "120rem",
        "custom-small": "288px",
      },
    },
  },
  plugins: [],
};
