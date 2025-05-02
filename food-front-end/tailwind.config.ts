import type { Config } from "tailwindcss";

const config: Config = {
  plugins: [require("tailwindcss-animate")],
  content: ["./src/**/*.{ts,tsx,js,jsx,html}"],
  theme: {
    extend: {
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        marquee: 'marquee 20s linear infinite !important',
      },
    },
  },
};

export default config;