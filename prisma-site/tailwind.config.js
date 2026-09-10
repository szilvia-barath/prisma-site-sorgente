/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#161616",
        bg: "#FCFCFC",
        surface: "#FFFFFF",
        accent: "#BBDC2F",
        accent2: "#61B136",
        tint: "#E1EEC7",
        line: "#E7E7E4",
        muted: "#6B6B68",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl2: "14px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(22,22,22,0.04), 0 1px 8px rgba(22,22,22,0.04)",
      },
    },
  },
  plugins: [],
};
