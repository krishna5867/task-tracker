/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        sm: "0px 1px 5px rgba(0, 0, 0, 0.1)"
      }
    },
  },
  plugins: [],
}

