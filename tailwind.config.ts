import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: { DEFAULT: "#ffffff", dark: "#000000" },
        foreground: { DEFAULT: "#171717", dark: "#ededed" },
        border: { DEFAULT: "#e5e7eb", dark: "#333333" },
      },
    },
  },
  darkMode: "class",
  plugins: [],
};

export default config;