import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./hooks/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#05070B",
        foreground: "#F5F7FA",
        panel: "#0B111A",
        line: "#182434",
        accent: {
          DEFAULT: "#7DD3FC",
          soft: "#38BDF8"
        },
        gold: "#F5C86A",
        emerald: "#46E39E",
        rose: "#FB7185"
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(125,211,252,0.12), 0 16px 60px rgba(6,20,36,0.55)",
        focus: "0 0 0 3px rgba(125,211,252,0.28)"
      },
      backgroundImage: {
        "hero-radial":
          "radial-gradient(circle at top, rgba(125,211,252,0.22), transparent 32%), radial-gradient(circle at 20% 20%, rgba(245,200,106,0.12), transparent 24%), linear-gradient(180deg, rgba(8,11,17,1) 0%, rgba(5,7,11,1) 55%, rgba(3,5,8,1) 100%)",
        grid: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)"
      },
      animation: {
        float: "float 7s ease-in-out infinite",
        pulseSoft: "pulseSoft 3.5s ease-in-out infinite"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" }
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.72" },
          "50%": { opacity: "1" }
        }
      }
    }
  },
  plugins: []
};

export default config;
