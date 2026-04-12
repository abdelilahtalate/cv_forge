import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        bg: {
          deep: '#09090b',
          base: '#0f0f12',
          raised: '#16161a',
          surface: '#1c1c21',
          elevated: '#232329',
        },
        border: {
          subtle: '#27272a',
          default: '#3f3f46',
        },
        accent: {
          DEFAULT: '#f59e0b',
          light: '#fbbf24',
          dim: 'rgba(245,158,11,0.12)',
          glow: 'rgba(245,158,11,0.25)',
        },
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.35s ease-out both',
        'fade-in': 'fadeIn 0.25s ease-out both',
        'slide-left': 'slideInLeft 0.3s ease-out both',
        'slide-right': 'slideInRight 0.3s ease-out both',
        float: 'float 3s ease-in-out infinite',
        'gradient-shift': 'gradientShift 4s ease infinite',
        shimmer: 'shimmer 2s ease-in-out infinite',
        blink: 'blink 0.8s step-end infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(12px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideInLeft: {
          from: { transform: 'translateX(-100%)' },
          to: { transform: 'translateX(0)' },
        },
        slideInRight: {
          from: { transform: 'translateX(100%)' },
          to: { transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config
