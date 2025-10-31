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
          DEFAULT: "#16A34A", // main color - green
          50: "#F0FDF4",
          100: "#DCFCE7",
          200: "#BBF7D0",
          300: "#86EFAC",
          400: "#4ADE80",
          500: "#16A34A",  // base
          600: "#15803D",
          700: "#166534",
          800: "#14532D",
          900: "#104A26",
        },
        secondary: {
          DEFAULT: "#391E60", // deep purple
          50: "#F5F3F8",
          100: "#EBE7F2",
          200: "#D2C7E3",
          300: "#B9A7D4",
          400: "#8060B6",
          500: "#391E60",  // base
          600: "#331B56",
          700: "#2A1647",
          800: "#221238",
          900: "#7729C6",
        }
      },
      // Add the font family here
      fontFamily: {
        pacifico: ['Pacifico', 'cursive'],
      }
    },
  },
  plugins: [],
}