/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // High-contrast accessibility tokens
        'pos-black': '#000000',
        'pos-white': '#FFFFFF',
        'pos-primary': '#00FF00', // Neon Green for high visibility
        'pos-secondary': '#FFD700', // Gold for warnings/alerts
        'pos-danger': '#FF0000', // Pure Red for errors/voids
        'pos-surface': '#121212', // Dark surface
      },
      fontSize: {
        'pos-xl': ['1.5rem', '2rem'],
        'pos-2xl': ['2rem', '2.5rem'],
      }
    },
  },
  plugins: [],
}
