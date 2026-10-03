import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        noir: {
          bg: '#0A0A0C',
          'bg-secondary': '#141418',
          blood: '#8B0000',
          ash: '#B0B0B8',
          purple: '#6A0DAD',
          text: '#E8E8EC',
          'text-secondary': '#6E6E78',
          border: '#2A2A32',
        },
      },
      fontFamily: {
        gothic: ['UnifrakturCook', 'cursive'],
        cinzel: ['Cinzel', 'serif'],
        cormorant: ['Cormorant Garamond', 'serif'],
      },
      boxShadow: {
        glow: '0 0 20px rgba(139, 0, 0, 0.5)',
        'glow-lg': '0 0 40px rgba(139, 0, 0, 0.6)',
      },
    },
  },
  plugins: [],
} satisfies Config;