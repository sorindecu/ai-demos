import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          900: "#1E3A5F",
          700: "#1D4ED8",
          500: "#2563EB",
          100: "#EFF6FF",
        },
      },
    },
  },
  plugins: [],
};
export default config;
