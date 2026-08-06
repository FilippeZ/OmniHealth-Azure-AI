/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#f8fafc",
        surface: "#ffffff",
        "surface-muted": "#f1f5f9",
        "surface-card": "#ffffff",
        primary: "#2563eb",
        "primary-light": "#eff6ff",
        "primary-dark": "#1d4ed8",
        secondary: "#059669",
        "secondary-light": "#ecfdf5",
        tertiary: "#d97706",
        "tertiary-light": "#fffbeb",
        error: "#e11d48",
        "error-light": "#fff1f2",
        "text-main": "#0f172a",
        "text-muted": "#64748b",
        "border-subtle": "#e2e8f0",
        "border-strong": "#cbd5e1"
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        'clinical': '0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.05)',
        'clinical-card': '0 4px 6px -1px rgb(0 0 0 / 0.03), 0 2px 4px -2px rgb(0 0 0 / 0.03)',
        'clinical-hover': '0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.04)',
      }
    },
  },
  plugins: [],
}
