/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Refined Premium Palette
        'pos-black': '#020617', // Slate-950
        'pos-white': '#f8fafc', // Slate-50
        'pos-primary': '#10b981', // Emerald-500 (Sophisticated Green)
        'pos-secondary': '#f59e0b', // Amber-500
        'pos-danger': '#ef4444', // Red-500
        'pos-surface': '#0f172a', // Slate-900
        'pos-border': '#1e293b', // Slate-800
        'pos-muted': '#64748b', // Slate-500
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'pos': '12px',
      }
    },
  },
  plugins: [],
}
