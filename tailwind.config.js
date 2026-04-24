/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,jsx}",
    "./src/components/**/*.{js,jsx}",
    "./src/app/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          blue: "#2563EB",
          "blue-dark": "#1D4ED8",
          "blue-light": "#EFF6FF",
          red: "#DC2626",
          dark: "#0A0A0A",
          "dark-2": "#111827",
          light: "#F9FAFB",
          muted: "#6B7280",
          border: "#E5E7EB",
          "border-dark": "#D1D5DB",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
        serif: ["var(--font-merriweather)", "Georgia", "serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      fontSize: {
        "2xs": ["11px", { lineHeight: "1.4" }],
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
      },
      borderRadius: {
        news: "10px",
        "news-lg": "14px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.05)",
        "card-hover": "0 8px 24px rgba(0,0,0,0.10)",
        "hero": "0 20px 60px rgba(0,0,0,0.18)",
        "nav": "0 1px 0 rgba(0,0,0,0.08)",
      },
      animation: {
        ticker: "ticker 40s linear infinite",
        "fade-in": "fadeIn 0.25s ease-out",
        "slide-up": "slideUp 0.3s ease-out",
        "pulse-dot": "pulseDot 2s ease-in-out infinite",
      },
      keyframes: {
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseDot: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.5", transform: "scale(0.85)" },
        },
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: "none",
            color: "#1a1a1a",
            lineHeight: "1.75",
          },
        },
      },
    },
  },
  plugins: [],
};
