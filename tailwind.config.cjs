/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        nerissa: {
          midnight: "#0F172A", // Deep dark base
          raven: "#1E293B",    // Card base
          teal: "#38BDF8",     // Main accent (melodic teal)
          purple: "#818CF8",   // Secondary accent
          onyx: "#020617",     // Deepest black
          feather: "#334155",  // Muted tones
          gold: "#FDE047",     // Subtle highlight (tuning fork)
        },
        primary: {
          50: "#F0F9FF",
          100: "#E0F2FE",
          200: "#BAE6FD",
          300: "#7DD3FC",
          400: "#38BDF8",
          500: "#0EA5E9",
          600: "#0284C7",
          700: "#0369A1",
          800: "#075985",
          900: "#0C4A6E",
        },
      },
      fontFamily: {
        sans: ["'Inter'", "system-ui", "sans-serif"],
        display: ["'Outfit'", "system-ui", "sans-serif"],
        mono: ["'Fira Code'", "monospace"],
      },
      boxShadow: {
        nerissa: "0 4px 20px -5px rgba(56, 189, 248, 0.3)",
        "nerissa-lg": "0 10px 40px -10px rgba(56, 189, 248, 0.4)",
        card: "0 2px 8px -2px rgba(0, 0, 0, 0.1), 0 4px 12px -4px rgba(0, 0, 0, 0.08)",
      },
      animation: {
        "wave-echo": "waveEcho 3s ease-in-out infinite",
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "float": "float 6s ease-in-out infinite",
        "pulse-cyan": "pulseCyan 2s infinite",
      },
      keyframes: {
        waveEcho: {
          "0%, 100%": { transform: "scaleY(1)" },
          "50%": { transform: "scaleY(1.5)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseCyan: {
          "0%, 100%": { boxShadow: "0 0 0px rgba(56, 189, 248, 0.4)" },
          "50%": { boxShadow: "0 0 20px rgba(56, 189, 248, 0.6)" },
        }
      },
      borderRadius: {
        "nerissa": "0.75rem",
        "nerissa-lg": "1.25rem",
      }
    },
  },
  plugins: [],
};
