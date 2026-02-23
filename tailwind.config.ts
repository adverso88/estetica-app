import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#FFF0F3',
          100: '#FFD6E0',
          200: '#FFB3C6',
          300: '#FF85A1',
          400: '#E8668A',
          500: '#C2556E',
          600: '#A84260',
          700: '#8D3052',
          800: '#721E44',
          900: '#570D35',
          950: '#3A0022',
        },
        secondary: {
          50: '#FDF6EF',
          100: '#F8E5CF',
          200: '#F2CAA0',
          300: '#EAB071',
          400: '#DC9A52',
          500: '#D4956A',
          600: '#B87D4A',
          700: '#9A6432',
          800: '#7B4B1B',
          900: '#5C3300',
          950: '#3D2100',
        },
        blush: {
          DEFAULT: '#FDF0F3',
          100: '#FCE4EC',
          200: '#F8CEDB',
        },
        background: '#FDFAFB',
        surface: '#FFFFFF',
        foreground: {
          DEFAULT: '#1A0A10',
          secondary: '#6B5460',
          muted: '#9E8A93',
        },
        success: {
          50: '#ECFDF5',
          100: '#D1FAE5',
          500: '#10B981',
          600: '#059669',
          700: '#047857',
        },
        warning: {
          50: '#FFFBEB',
          100: '#FEF3C7',
          500: '#F59E0B',
          600: '#D97706',
          700: '#B45309',
        },
        error: {
          50: '#FEF2F2',
          100: '#FEE2E2',
          500: '#EF4444',
          600: '#DC2626',
          700: '#B91C1C',
        },
        border: {
          DEFAULT: '#EEE0E5',
          light: '#F7F0F3',
          dark: '#D4B8BF',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['Playfair Display', 'Georgia', 'serif'],
      },
      fontSize: {
        'display-xl': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-lg': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-md': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.01em', fontWeight: '600' }],
        'display-sm': ['1.875rem', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '600' }],
        'display-xs': ['1.5rem', { lineHeight: '1.4', fontWeight: '600' }],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'rose': '0 8px 32px 0 rgba(194, 85, 110, 0.18)',
        'card': '0 1px 3px 0 rgb(194 85 110 / 0.06), 0 1px 2px -1px rgb(194 85 110 / 0.06)',
        'card-hover': '0 6px 16px -2px rgb(194 85 110 / 0.14), 0 2px 6px -2px rgb(194 85 110 / 0.08)',
        'elevated': '0 12px 24px -4px rgb(194 85 110 / 0.15)',
        'modal': '0 25px 50px -12px rgb(0 0 0 / 0.15)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(12px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        slideDown: { '0%': { opacity: '0', transform: 'translateY(-12px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        scaleIn: { '0%': { opacity: '0', transform: 'scale(0.95)' }, '100%': { opacity: '1', transform: 'scale(1)' } },
        pulseSoft: { '0%, 100%': { opacity: '1' }, '50%': { opacity: '0.6' } },
      },
      backgroundImage: {
        'gradient-rose': 'linear-gradient(135deg, #C2556E 0%, #D4956A 100%)',
        'gradient-blush': 'linear-gradient(135deg, #FDF0F3 0%, #FDF6EF 100%)',
      },
    },
  },
  plugins: [],
}

export default config
