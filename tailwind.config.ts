import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1.5rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        mono: ["Space Mono", "monospace"],
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        border: "hsl(var(--border))",
        card: "hsl(var(--background))",
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        pastel: {
          pink: "hsl(var(--pastel-pink))",
          lavender: "hsl(var(--pastel-lavender))",
          mint: "hsl(var(--pastel-mint))",
          butter: "hsl(var(--pastel-butter))",
          sky: "hsl(var(--pastel-sky))",
          peach: "hsl(var(--pastel-peach))",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
