/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#FAF7EE",
          100: "#F4ECD6",
          200: "#E9D9AC",
          300: "#DFC583",
          400: "#D4B259",
          500: "#C39A34",
          600: "#A37C24",
          700: "#7E5C19",
          800: "#5B4011",
          900: "#382508",
        },
      },
    },
  },
  plugins: [],
}
