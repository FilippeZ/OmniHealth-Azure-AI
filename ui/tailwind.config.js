/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: "#050b14",
        surface: "#0c1628",
        "on-surface": "#e2eaf7",
        primary: "#3b82f6",
        "on-primary": "#ffffff",
        secondary: "#10b981",
        tertiary: "#f59e0b",
        error: "#f43f5e",
        cyan: { DEFAULT: "#06b6d4" },
        purple: { DEFAULT: "#a855f7" },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-blue':    '0 0 24px rgba(59, 130, 246, 0.25)',
        'glow-emerald': '0 0 24px rgba(16, 185, 129, 0.25)',
        'glow-rose':    '0 0 24px rgba(244, 63, 94, 0.25)',
        'glow-amber':   '0 0 24px rgba(245, 158, 11, 0.25)',
        'glass':        '0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.06)',
      },
      backdropBlur: {
        xs: '4px',
      },
      animation: {
        'spin-slow': 'spin 4s linear infinite',
        'ping-slow': 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-4px)' },
        },
        shimmer: {
          '0%':       { backgroundPosition: '-200% 0' },
          '100%':     { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
