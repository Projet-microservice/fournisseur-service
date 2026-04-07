/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      colors: {
        primary: { DEFAULT: "#4f46e5" },
        accent: { DEFAULT: "#06b6d4" }
      }
    }
  },
  plugins: []
}
