import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./store/**/*.{ts,tsx}",
    "./types/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "sunrise-cream": "#fdfcf0",
        "sunrise-orange": "#ffd1ba",
        "sunrise-sky": "#e0f2fe",
        "sunrise-purple": "#f3e8ff",
        ink: "#2a2a2a",
        "ink-muted": "#5f6368",
        glass: "rgba(255, 255, 255, 0.65)",
        "glass-border": "rgba(255, 255, 255, 0.7)",
      },
      boxShadow: {
        soft: "0 20px 50px rgba(15, 23, 42, 0.12)",
        glow: "0 0 30px rgba(255, 209, 186, 0.5)",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "Inter", "Segoe UI", "system-ui"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "SFMono-Regular"],
      },
    },
  },
  plugins: [],
};

export default config;
