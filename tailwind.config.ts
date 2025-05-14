import type { Config } from "tailwindcss";
import scrollbarhide from "tailwind-scrollbar-hide";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  safelist: ["aspect-[1/1]", "aspect-[4/5]"],
  theme: {
    extend: {
      colors: {
        background: "#ffffff",
        foreground: "#171717",
        border: "#e5e7eb",
      },
    },
  },
  plugins: [scrollbarhide],
};

export default config;
