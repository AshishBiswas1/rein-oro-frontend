/** @type {import('tailwindcss').Config} */
module.exports = {
 content: [
  "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
  "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
 ],
 theme: {
  extend: {
   colors: {
    rein: {
     black: "#0A0A0A",
     charcoal: "#141414",
     surface: "#1C1A16",
     gold: {
      primary: "#C9A84C",
      light: "#E8C97A",
      dim: "#8A6F32",
     },
     cream: "#F5EDD6",
     gray: {
      light: "#9A9485",
      mid: "#4A4640",
     },
    },
   },
   fontFamily: {
    display: ["var(--font-cormorant)", "serif"],
    ui: ["var(--font-jost)", "sans-serif"],
    accent: ["var(--font-cinzel)", "serif"],
   },
   backgroundImage: {
    "luxury-grain": `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E")`,
   },
   // MOVE KEYFRAMES & ANIMATION INSIDE THE EXTEND BLOCK
   keyframes: {
    float: {
     "0%, 100%": { transform: "translateY(0)" },
     "50%": { transform: "translateY(-16px)" },
    },
    marquee: {
     "0%": { transform: "translateX(0)" },
     "100%": { transform: "translateX(-100%)" },
    },
   },
   animation: {
    float: "float 6s ease-in-out infinite",
    marquee: "marquee 25s linear infinite",
   },
  },
 },
 plugins: [],
};
