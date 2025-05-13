import type { Config } from "tailwindcss";
import scrollbarhide from "tailwind-scrollbar-hide";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  safelist: [
    'aspect-[1/1]',
    'aspect-[4/5]',
  ],
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
  plugins: [scrollbarhide],
};

export default config;
