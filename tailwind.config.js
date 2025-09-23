/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#FD9A00", // main color
          50: "#FFF4E6",
          100: "#FFE1BF",
          200: "#FFC68A",
          300: "#FFAA54",
          400: "#FF941F",
          500: "#FD9A00",  // base
          600: "#E08B00",
          700: "#B56D00",
          800: "#804C00",
          900: "#4C2B00",
        },
        secondary: {
          DEFAULT: "#D3D3D3", // light gray
          50: "#FAFAFA",
          100: "#F5F5F5",
          200: "#E5E5E5",
          300: "#D3D3D3",
          400: "#A3A3A3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
        }
      }
    },
  },
  plugins: [],
}
