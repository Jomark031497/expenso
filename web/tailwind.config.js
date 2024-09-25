/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#F57002", // For buttons, links, headers
        primaryDark: "#ED5635",
        secondary: "#FFC107", // For secondary buttons, hover states, accents
        success: "#00E676", // For positive balances, income, success messages
        error: "#F44336", // For negative balances, expenses, error notifications
        background: "#FAFAFA", // For the main background of the app
        cardBg: "#FFFFFF", // For card backgrounds (expense/income cards)
        textPrimary: "#212121", // For main text (headings, labels, etc.)
        textSecondary: "#757575", // For secondary text (descriptions, placeholders)
        inputBg: "#F5F5F5", // For input fields/forms background
        borderColor: "#E0E0E0", // For borders (input fields, cards, dividers)
      },
      fontFamily: {
        sans: ["Roboto", "sans-serif"],
      },
    },
  },
  plugins: [],
};
