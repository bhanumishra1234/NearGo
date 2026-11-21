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
        clay: {
          50: '#FAF8F5',
          100: '#F5F1EB',
          200: '#EBE3D7',
          300: '#DDD0BF',
          400: '#C8B298',
          500: '#B09172',
          600: '#947456',
          700: '#75583E',
          800: '#5A422F',
          900: '#3D2C1F',
        },
        terracotta: {
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#7C3AED', // Electric Violet
          600: '#6D28D9',
          700: '#5B21B6',
          800: '#4C1D95',
          900: '#2E1065',
        },
        neargo: {
          bg: '#F7F6F3',
          card: '#FFFFFF',
          sidebar: '#FFFFFF',
          border: '#E8E5DF',
          hover: '#F2EFEB',
          accent: '#7C3AED',
          amber: '#D97706',
          green: '#15803D',
          blue: '#0284C7',
          charcoal: '#1C1917',
          muted: '#78716C',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(28, 25, 23, 0.05), 0 1px 2px -1px rgba(28, 25, 23, 0.05)',
        'card-hover': '0 10px 15px -3px rgba(28, 25, 23, 0.07), 0 4px 6px -4px rgba(28, 25, 23, 0.04)',
        'clay-glow': '0 4px 20px -2px rgba(217, 83, 47, 0.18)',
      }
    },
  },
  plugins: [],
}
