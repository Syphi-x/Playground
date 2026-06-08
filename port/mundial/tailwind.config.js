/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        pitch: {
          950: "#071510",
          900: "#0a1f14",
          800: "#0f2e1c",
          700: "#143d24",
          600: "#1a4d2e",
        },
        neon: "#39ff14",
      },
    },
  },
  plugins: [],
};
