import type { Config } from 'tailwindcss'

export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.9) translateY(20px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(40px) scale(0.95)' },
          '100%': { opacity: '1', transform: 'translateX(0) scale(1)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-40px) scale(0.95)' },
          '100%': { opacity: '1', transform: 'translateX(0) scale(1)' },
        },
        overlayIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        pillIn: {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        inputIn: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        overlayOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' },
        },
        modalOut: {
          '0%': { opacity: '1', transform: 'scale(1) translateY(0)' },
          '100%': { opacity: '0', transform: 'scale(0.92) translateY(16px)' },
        },
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out forwards',
        slideInRight: 'slideInRight 0.5s ease-out forwards',
        slideInLeft: 'slideInLeft 0.5s ease-out forwards',
        overlayIn: 'overlayIn 0.35s ease-out forwards',
        pillIn: 'pillIn 0.35s ease-out forwards',
        inputIn: 'inputIn 0.4s ease-out forwards',
        overlayOut: 'overlayOut 0.26s ease-in forwards',
        modalOut: 'modalOut 0.26s ease-in forwards',
      },
    },
  },
  plugins: [require('daisyui')],
} satisfies Config
