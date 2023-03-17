/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./index.html", "./src/**/*.{html,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        handwritten: [
          "BryanSans",
          "Bradley Hand",
          "cursive",
          ...defaultTheme.fontFamily.sans,
        ],
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    base: false,
    themes: false,
  },
};
