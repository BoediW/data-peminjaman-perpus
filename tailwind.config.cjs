/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        zedd: {
          white: "#fdfdfdff",       // Clean white bg
          snow: "#FFFFFF",        // Pure white
          glass: "#F1F3F8",      // Frosted glass surface
          silver: "#E2E8F0",     // Silver border
          steel: "#94A3B8",      // Muted text
          carbon: "#1E293B",     // Dark text
          obsidian: "#0F172A",   // Deepest dark
          violet: "#8B5CF6",     // Spectrum violet
          blue: "#3B82F6",       // Spectrum blue
          cyan: "#06B6D4",       // Spectrum cyan
          pink: "#EC4899",       // Spectrum pink
          magenta: "#A855F7",    // Spectrum magenta
          pulse: "#6366F1",      // Zedd pulse glow
          neon: "#818CF8",       // Neon accent
        },
        primary: {
          50: "#F5F3FF",
          100: "#EDE9FE",
          200: "#DDD6FE",
          300: "#C4B5FD",
          400: "#A78BFA",
          500: "#8B5CF6",
          600: "#7C3AED",
          700: "#6D28D9",
          800: "#5B21B6",
          900: "#4C1D95",
        },
        accent: {
          400: "#38BDF8",
          500: "#06B6D4",
          600: "#0891B2",
          700: "#0E7490",
        },
      },
      fontFamily: {
        sans: ["'Inter'", "system-ui", "sans-serif"],
        display: ["'Outfit'", "system-ui", "sans-serif"],
        mono: ["'Fira Code'", "monospace"],
      },
      boxShadow: {
        zedd: "0 4px 20px -5px rgba(139, 92, 246, 0.25)",
        "zedd-lg": "0 10px 40px -10px rgba(139, 92, 246, 0.35)",
        "zedd-glow": "0 0 30px -5px rgba(139, 92, 246, 0.2)",
        "spectrum": "0 4px 30px -5px rgba(99, 102, 241, 0.2)",
        card: "0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.04)",
        "card-hover": "0 8px 30px rgba(139, 92, 246, 0.08), 0 2px 10px rgba(0, 0, 0, 0.04)",
      },
      animation: {
        "spectrum-shift": "spectrumShift 6s ease-in-out infinite",
        "fade-in": "fadeIn 0.3s ease-out",
        "slide-up": "slideUp 0.4s ease-out",
        "float": "float 6s ease-in-out infinite",
        "pulse-glow": "pulseGlow 2s infinite",
        "spin-slow": "spin 8s linear infinite",
      },
      keyframes: {
        spectrumShift: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
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
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 0px rgba(139, 92, 246, 0.3)" },
          "50%": { boxShadow: "0 0 25px rgba(139, 92, 246, 0.5)" },
        },
      },
      borderRadius: {
        zedd: "0.75rem",
        "zedd-lg": "1.25rem",
      },
      backgroundImage: {
        "spectrum-gradient": "linear-gradient(135deg, #8B5CF6, #3B82F6, #06B6D4, #EC4899)",
        "spectrum-gradient-h": "linear-gradient(90deg, #8B5CF6, #3B82F6, #06B6D4, #EC4899, #8B5CF6)",
        "zedd-radial": "radial-gradient(circle, rgba(139, 92, 246, 0.08), transparent 70%)",
      },
    },
  },
  plugins: [],
};
