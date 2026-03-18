import type { Config } from "tailwindcss";
const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        syne: ["var(--font-syne)", "system-ui", "sans-serif"],
        dm: ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-dm-mono)", "monospace"],
      },
      colors: {
        brand: {
          gold: "#F5A623", "gold-light": "#FFC04A", "gold-dim": "#C27E0E",
          green: "#3DDC84", "green-light": "#5AEAA0",
        },
        dark: { bg: "#080F0A", surface: "#0F1A12", surface2: "#172118", border: "rgba(255,255,255,0.07)", "border-hover": "rgba(255,255,255,0.14)" },
        light: { bg: "#F4F6F3", surface: "#FFFFFF", surface2: "#EDF0EB", border: "rgba(0,0,0,0.07)", "border-hover": "rgba(0,0,0,0.14)" },
      },
      maxWidth: { "8xl": "88rem" },
      animation: {
        "scroll-left": "scrollLeft 22s linear infinite",
        "fade-up": "fadeUp 0.4s ease forwards",
        "pulse-dot": "pulseDot 1.5s ease-in-out infinite",
        shimmer: "shimmer 2s linear infinite",
        float: "float 6s ease-in-out infinite",
      },
      keyframes: {
        scrollLeft: { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
        fadeUp: { "0%": { opacity: "0", transform: "translateY(12px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        pulseDot: { "0%,100%": { opacity: "1" }, "50%": { opacity: "0.3" } },
        shimmer: { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
        float: { "0%,100%": { transform: "translateY(0px)" }, "50%": { transform: "translateY(-10px)" } },
      },
    },
  },
  plugins: [],
};
export default config;
