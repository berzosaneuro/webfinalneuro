import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#6366F1',   // Indigo
          hover:   '#818CF8',
          dark:    '#4F46E5',
        },
        dark: {
          bg:       '#0A0A0F',
          surface:  '#111118',
          card:     '#16161F',
          border:   '#1E1E2E',
        },
        text: {
          primary:   '#F8FAFC',
          secondary: '#94A3B8',
          muted:     '#475569',
        },
        success: '#10B981',
        warning: '#F59E0B',
        danger:  '#EF4444',
        instagram: '#E1306C',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in':    'fadeIn 0.4s ease-out',
        'slide-up':   'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        fadeIn:  { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(12px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}

export default config
