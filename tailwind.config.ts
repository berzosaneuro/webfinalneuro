import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          primary: '#000000',
          surface: '#080808',
          'surface-2': '#0F0F0F',
          border: '#1C1C1C',
        },
        accent: {
          blue: '#0066FF',
          'blue-hover': '#3385FF',
          purple: '#5B21B6',
          cyan: '#06B6D4',
          teal: '#14B8A6',
          amber: '#F59E0B',
          emerald: '#10B981',
          rose: '#F43F5E',
        },
        text: {
          primary: '#F1F5F9',
          secondary: '#94A3B8',
          muted: '#64748B',
        },
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Inter', 'system-ui', 'sans-serif'],
        heading: ['Poppins', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.25rem',
        '4xl': '1.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out forwards',
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
        'slide-up': 'slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(100%)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(0, 102, 255, 0.25)' },
          '50%': { boxShadow: '0 0 20px rgba(0, 102, 255, 0.5)' },
        },
      },
    },
  },
  plugins: [],
}

export default config
