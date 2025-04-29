// tailwind.config.ts
import { nextui } from "@nextui-org/react";
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        'art-brush': ['var(--font-art-brush)'],
        'indie-pimp': ['var(--font-indie-pimp)'],
        'mk-abel': ['var(--font-mk-abel)'],
      },
      colors: {
        background: '#ededed',
        primary: {
          DEFAULT: '#3485c6',
          foreground: '#ffffff',
          dark: '#163b58',
        },
        text: '#56565B',
      },
      animation: {
        'fade-in-delay': 'fadeIn 1s ease-out 0.5s forwards',
        'fade-in-delay-2': 'fadeIn 1s ease-out 1s forwards',
        'fade-up': 'fade-up 0.8s ease-out both',
        'fade-in': 'fade-in 1s ease-out both',
        'scale-up': 'scale-up 0.4s ease-out both',
        'slide-right': 'slide-right 0.6s ease-out both',
        'spin-slow': 'spin 3s linear infinite',
        'spin-reverse': 'spin-reverse 2s linear infinite',
        'loaderpulse': 'loaderpulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        'fade-up': {
          '0%': {
            opacity: '0',
            transform: 'translateY(30px)',
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'fade-in': {
          '0%': {
            opacity: '0',
          },
          '100%': {
            opacity: '1',
          },
        },
        'scale-up': {
          '0%': {
            transform: 'scale(0.8)',
            opacity: '0',
          },
          '100%': {
            transform: 'scale(1)',
            opacity: '1',
          },
        },
        'slide-right': {
          '0%': {
            transform: 'translateX(-20px)',
            opacity: '0',
          },
          '100%': {
            transform: 'translateX(0)',
            opacity: '1',
          },
        },
        'spin-reverse': {
          '0%': { transform: 'rotate(360deg)' },
          '100%': { transform: 'rotate(0deg)' },
        },
        'loaderpulse': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '.8', transform: 'scale(0.95)' },
        },
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
}

export default config;