import { nextui } from "@nextui-org/react";

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      container: {
        center: true,
        padding: "2rem",
        screens: {
          sm: "100%",
          md: "100%",
          lg: "1024px",
          xl: "1280px",
          "2xl": "1536px",
          "3xl": "1920px",
          "4k": "2560px",
          "5k": "3200px",
        },
      },

      colors: {
        // primary colors
        color1: "#006A00",
        color2: "#008900",
        color3: "#009A00",
        color4: "#00AD00",
        color5: "#04BC04",
        color6: "#49C741",
        color7: "#70D167",
        color8: "#9DDE95",
        color9: "#C4EBBF",
        color10: "#E6F7E5",
        // dark / secondary colors
        color01: "#171717",
        color02: "#373737",
        color03: "#555",
        color04: "#686868",
        color05: "#909090",
        color06: "#B0B0B0",
        color07: "#D5D5D5",
        color08: "#E6E6E6",
        color09: "#F0F0F0 ",
        color09: "#F8F8F8",
      },

      colors: {
        // primary colors
        color1: "#006A00",
        color2: "#008900",
        color3: "#009A00",
        color4: "#00AD00",
        color5: "#04BC04",
        color6: "#49C741",
        color7: "#70D167",
        color8: "#9DDE95",
        color9: "#C4EBBF",
        color10: "#E6F7E5",
        // dark / secondary colors
        color01: "#171717",
        color02: "#373737",
        color03: "#555",
        color04: "#686868",
        color05: "#909090",
        color06: "#B0B0B0",
        color07: "#D5D5D5",
        color08: "#E6E6E6",
        color09: "#F0F0F0 ",
        color09: "#F8F8F8",
      },

      boxShadow: {
        "dark-gray": "0 4px 15px #18181859",
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};
