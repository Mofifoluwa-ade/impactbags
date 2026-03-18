import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        syne: ["var(--font-syne)", "system-ui", "sans-serif"],
        dm: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-dm-mono)", "monospace"],
      },
      colors: {
        brand: {
          gold: "#F5A623",
          "gold-light": "#FFC04A",
          "gold-dim": "#C27E0E",
          green: "#3DDC84",
          "green-light": "#5AEAA0",
        },
        dark: {
          bg: "#081A0B",
          surface: "#112015",
          surface2: "#182E1C",
          border: "rgba(255,255,255,0.08)",
          "border-hover": "rgba(255,255,255,0.16)",
        },
        light: {
          bg: "#F5F7F4",
          surface: "#FFFFFF",
          surface2: "#EEF3EC",
          border: "rgba(0,0,0,0.08)",
          "border-hover": "rgba(0,0,0,0.16)",
        },
      },
      animation: {
        "scroll-left": "scrollLeft 20s linear infinite",
        "fade-up": "fadeUp 0.4s ease forwards",
        "pulse-dot": "pulseDot 1.5s ease-in-out infinite",
        spin: "spin 0.8s linear infinite",
        "counter-up": "counterUp 0.3s ease forwards",
        shimmer: "shimmer 2s linear infinite",
      },
      keyframes: {
        scrollLeft: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseDot: {
          "0%,100%": { opacity: "1" },
          "50%": { opacity: "0.3" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
