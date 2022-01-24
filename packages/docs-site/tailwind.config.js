const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans]
      },
      screens: {
        "2xl": "1467px",
        "1580px": "1580px"
      }
    }
  },
  plugins: [require("@tailwindcss/typography")]
};
