import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./hooks/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#05070B",
        foreground: "#F5F7FA",
        panel: {
          DEFAULT: "#0B1017",
          subtle: "#0E1520",
          elevated: "#121A26",
          glass: "rgba(11, 16, 23, 0.75)"
        },
        line: {
          DEFAULT: "#182333",
          subtle: "#1F2D40",
          highlight: "rgba(255, 255, 255, 0.08)"
        },
        accent: {
          DEFAULT: "#38BDF8",
          soft: "#7DD3FC",
          glow: "rgba(56, 189, 248, 0.25)"
        },
        gold: {
          DEFAULT: "#F5C86A",
          muted: "#D4A44C",
          glow: "rgba(245, 200, 106, 0.22)"
        },
        emerald: {
          DEFAULT: "#34D399",
          muted: "#059669",
          glow: "rgba(52, 211, 153, 0.2)"
        },
        rose: {
          DEFAULT: "#FB7185",
          muted: "#E11D48",
          glow: "rgba(251, 113, 133, 0.2)"
        },
        cyan: {
          DEFAULT: "#06B6D4",
          soft: "#67E8F9"
        }
      },
      fontFamily: {
        sora: ["var(--font-sora)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-mono)", "JetBrains Mono", "Courier New", "monospace"]
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(56,189,248,0.18), 0 12px 40px -10px rgba(14,165,233,0.35)",
        "gold-glow": "0 0 0 1px rgba(245,200,106,0.22), 0 12px 40px -10px rgba(245,200,106,0.3)",
        "card-elevation": "0 10px 30px -10px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.06)",
        "modal-elevation": "0 25px 60px -15px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.08)",
        focus: "0 0 0 3px rgba(56,189,248,0.35)"
      },
      backgroundImage: {
        "hero-radial":
          "radial-gradient(circle at 50% 0%, rgba(56,189,248,0.18) 0%, rgba(245,200,106,0.06) 35%, transparent 70%)",
        grid: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)"
      },
      letterSpacing: {
        timecode: "0.25em",
        director: "0.38em"
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        pulseSoft: "pulseSoft 3s ease-in-out infinite",
        shimmer: "shimmer 2.5s infinite"
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" }
        },
        pulseSoft: {
          "0%, 100%": { opacity: "0.65" },
          "50%": { opacity: "1" }
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" }
        }
      }
    }
  },
  plugins: []
};

export default config;
