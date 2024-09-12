/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#5d6aa2",
        secondary: "#d2cbe1",
        accent: "##65528e",
      },
    },
  },
  plugins: [],
};
