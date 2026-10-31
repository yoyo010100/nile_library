import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'Times New Roman', 'serif'],
        sans: ['var(--font-sans)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        nile: {
          midnight: '#020818',
          deep: '#030f2a',
          teal: '#22d3ee',      // cyan-400
          emerald: '#34d399',   // emerald-400
          gold: '#fbbf24',      // amber-400
          glow: 'rgba(34,211,238,0.12)',
        },
        // kept for any remaining references
        wax: {
          DEFAULT: '#8b0000',
          light: '#a50d0d',
          dark: '#5c0000',
        },
      },
      animation: {
        'wave-slow': 'wave 8s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4,0,0.6,1) infinite',
        'flow': 'flow 6s linear infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
      },
      keyframes: {
        wave: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        flow: {
          '0%': { backgroundPosition: '0% 50%' },
          '100%': { backgroundPosition: '200% 50%' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'nile-glow': '0 0 40px -10px rgba(34,211,238,0.4)',
        'gold-glow': '0 0 40px -10px rgba(251,191,36,0.4)',
        'glass': '0 8px 32px 0 rgba(0,0,0,0.37)',
      },
    },
  },
  plugins: [],
};

export default config;
