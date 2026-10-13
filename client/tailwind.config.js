/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0A0A0A", // background near-black
        surface: "#141414", // cards / drawers
        gold: "#C9A24B",
        "light-gold": "#E8C872",
        bronze: "#8A6A2A",
        cream: "#F5F1E8", // off-white text
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', "Cinzel", "serif"],
        body: ['"Jost"', '"Helvetica Neue"', "Arial", "sans-serif"],
        arabic: ['"Amiri"', "serif"],
      },
      boxShadow: {
        gold: "0 10px 40px -12px rgba(201,162,75,0.35)",
      },
      backgroundImage: {
        "gold-gradient":
          "linear-gradient(120deg,#8A6A2A 0%,#C9A24B 35%,#E8C872 55%,#C9A24B 75%,#8A6A2A 100%)",
        marble:
          "radial-gradient(1200px 600px at 20% 10%, rgba(201,162,75,0.10), transparent 60%), radial-gradient(900px 500px at 85% 80%, rgba(201,162,75,0.08), transparent 55%), linear-gradient(115deg, transparent 46%, rgba(232,200,114,0.06) 47%, transparent 49%), linear-gradient(65deg, transparent 62%, rgba(232,200,114,0.05) 63%, transparent 65%), linear-gradient(160deg,#0A0A0A,#050505)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease forwards",
        "fade-in": "fade-in 0.5s ease forwards",
        shimmer: "shimmer 3s linear infinite",
      },
    },
  },
  plugins: [],
};
