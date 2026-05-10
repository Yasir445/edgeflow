/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-syne)", "system-ui", "sans-serif"],
        mono: ["var(--font-dm-mono)", "monospace"],
      },
      colors: {
        bg: {
          DEFAULT: "#080c10",
          secondary: "#0d1117",
          card: "rgba(255,255,255,0.04)",
          hover: "rgba(255,255,255,0.06)",
        },
        border: {
          DEFAULT: "rgba(255,255,255,0.06)",
          hover: "rgba(255,255,255,0.12)",
        },
        accent: {
          green: "#00ff9d",
          blue: "#00b8ff",
          purple: "#a78bfa",
          amber: "#fbbf24",
          red: "#ff4d6d",
        },
        trade: {
          win: "#00ff9d",
          loss: "#ff4d6d",
          breakeven: "#fbbf24",
        },
      },
      backgroundImage: {
        "gradient-accent": "linear-gradient(135deg, #00ff9d, #00b8ff)",
        "gradient-card": "linear-gradient(135deg, rgba(0,255,157,0.05), rgba(0,184,255,0.05))",
        "gradient-hero": "radial-gradient(ellipse at top, rgba(0,255,157,0.07) 0%, transparent 60%)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease forwards",
        "slide-up": "slideUp 0.4s ease forwards",
        "slide-in": "slideIn 0.3s ease forwards",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: { from: { opacity: "0" }, to: { opacity: "1" } },
        slideUp: { from: { opacity: "0", transform: "translateY(16px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        slideIn: { from: { opacity: "0", transform: "translateX(-16px)" }, to: { opacity: "1", transform: "translateX(0)" } },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(0,255,157,0.2)" },
          "50%": { boxShadow: "0 0 40px rgba(0,255,157,0.4)" },
        },
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
