/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        dark: {
          base: "#0A0A0C",
          surface: "#121217",
          elevated: "#181820",
          border: "#262630",
          hover: "#22222D",
        },
        gold: {
          50: "#FAF7EE",
          100: "#F4ECD6",
          200: "#E9D9AC",
          300: "#DFC583",
          400: "#D4AF37",
          500: "#C39A34",
          600: "#A37C24",
          700: "#7E5C19",
          DEFAULT: "#D4AF37",
          light: "#E5C378",
          cream: "#F5F0E8",
        },
      },
      fontFamily: {
        serif: ["Georgia", "Cambria", "Times New Roman", "serif"],
        sans: ["-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
}
