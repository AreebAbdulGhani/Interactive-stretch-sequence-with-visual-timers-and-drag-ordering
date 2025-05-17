/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'bg-primary',
    'bg-primary-dark',
    'bg-secondary',
    'bg-background',
    'dark:bg-darkBg',
    'bg-accent',
    'text-primary',
    'text-secondary',
    'text-background',
    'dark:text-gray-200',
    'text-gray-800',
    'animate-breathing',
    'animate-shake',
    'animate-pulse-bg'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4F46E5',
          dark: '#4338CA',
          light: '#818CF8'
        },
        secondary: {
          DEFAULT: '#10B981',
          dark: '#059669',
          light: '#34D399'
        },
        background: '#F9FAFB',
        darkBg: '#111827',
        accent: {
          DEFAULT: '#EC4899',
          dark: '#DB2777',
          light: '#F472B6'
        }
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'wave': 'wave 10s linear infinite',
        'text-float': 'textFloat 3s ease-in-out infinite',
        'background-pulse': 'backgroundPulse 15s ease infinite',
        'glow': 'glow 3s ease-in-out infinite',
        'particle': 'particleFloat 6s ease-in-out infinite',
        'breathing': 'breathing 4s ease-in-out infinite',
        'gradient': 'textGradient 4s linear infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' }
        },
        wave: {
          '0%': { transform: 'translateX(0) translateZ(0)' },
          '50%': { transform: 'translateX(-25%) translateZ(0)' },
          '100%': { transform: 'translateX(-50%) translateZ(0)' }
        },
        textFloat: {
          '0%, 100%': { 
            transform: 'translateY(0) rotate(-1deg)',
            textShadow: '0 4px 8px rgba(79, 70, 229, 0.2)'
          },
          '50%': { 
            transform: 'translateY(-10px) rotate(1deg)',
            textShadow: '0 8px 16px rgba(79, 70, 229, 0.4)'
          }
        },
        backgroundPulse: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' }
        },
        glow: {
          '0%, 100%': { 
            opacity: '0.4',
            filter: 'blur(8px)',
            transform: 'scale(1)'
          },
          '50%': { 
            opacity: '0.8',
            filter: 'blur(16px)',
            transform: 'scale(1.2)'
          }
        },
        particleFloat: {
          '0%, 100%': {
            transform: 'translateY(0) translateX(0) rotate(0) scale(1)',
            opacity: '0.3'
          },
          '25%': {
            transform: 'translateY(-15px) translateX(15px) rotate(5deg) scale(1.2)',
            opacity: '0.6'
          },
          '50%': {
            transform: 'translateY(-25px) translateX(-15px) rotate(-5deg) scale(1.4)',
            opacity: '0.8'
          },
          '75%': {
            transform: 'translateY(-15px) translateX(15px) rotate(5deg) scale(1.2)',
            opacity: '0.6'
          }
        },
        breathing: {
          '0%, 100%': {
            transform: 'scale(1) rotate(0)',
            filter: 'brightness(1)'
          },
          '50%': {
            transform: 'scale(1.1) rotate(1deg)',
            filter: 'brightness(1.2)'
          }
        },
        textGradient: {
          to: {
            backgroundPosition: '200% center'
          }
        }
      },
      boxShadow: {
        'glow': '0 0 15px rgba(79, 70, 229, 0.5)',
        'glow-lg': '0 0 30px rgba(79, 70, 229, 0.6)',
      },
      backdropBlur: {
        'xs': '2px',
      },
      backgroundSize: {
        'auto': 'auto',
        'cover': 'cover',
        'contain': 'contain',
        '200%': '200%',
        '400%': '400%'
      }
    },
  },
  plugins: [],
  darkMode: 'class',
} 