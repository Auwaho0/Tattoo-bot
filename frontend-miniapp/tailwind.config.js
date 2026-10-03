/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: { primary: '#0A0A0C', secondary: '#141418' },
        accent: { blood: '#8B0000', ash: '#B0B0B8', purple: '#6A0DAD' },
        txt: { primary: '#E8E8EC', secondary: '#6E6E78' },
        border: { gothic: '#2A2A32' },
      },
      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
        unifraktur: ['UnifrakturCook', 'serif'],
        cormorant: ['"Cormorant Garamond"', 'serif'],
        inter: ['Inter', 'sans-serif'],
      },
      boxShadow: { glow: '0 0 20px rgba(139, 0, 0, 0.7)' },
    },
  },
  plugins: [],
};