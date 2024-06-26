/* eslint-disable @typescript-eslint/no-var-requires */
/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{astro,html,js,ts,jsx,tsx,md,mdx,svelte,vue}",
  ],
  theme: {
    screens: {
      "2xs": "360px",
      xs: "475px",
      ...defaultTheme.screens,
    },
    extend: {
      fontFamily: {
        handwritten: [
          "Rubik Doodle Shadow",
          "Rubik Variable",
          ...defaultTheme.fontFamily.sans,
        ],
        sans: ["Rubik Variable", ...defaultTheme.fontFamily.sans],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    base: false,
    themes: ["light"],
  },
};
