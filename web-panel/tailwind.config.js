/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{js,jsx}", "./components/**/*.{js,jsx}"],
  theme: {
    extend: {
      boxShadow: {
        soft: "0 2px 10px rgba(0,0,0,0.05)",
      }
    },
  },
  plugins: [],
};
