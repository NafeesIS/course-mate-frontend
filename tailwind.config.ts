import type { Config } from 'tailwindcss';

// const {
//   default: flattenColorPalette,
// } = require('tailwindcss/lib/util/flattenColorPalette');

const config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      screens: {
        xs: '375px',
      },
      fontFamily: {
        open_sans: ['var(--font-open_sans)', 'sans-serif'],
        playfair: ['var(--font-playfair)', 'serif'],
        inter: ['var(--font-inter)', 'sans-serif'],
      },
      colors: {
        // custom colors
        'warm-amber': 'hsla(43, 96%, 56%, 1)',
        'neon-pink': 'hsla(340, 98%, 56%, 1)',
        'dark-purple': 'hsla(274, 31%, 47%, 1)',
        'dark-slate': 'hsla(222, 47%, 11%, 0.9)',
        'dark-blue': '#0F172A',
        'midnight-blue': 'hsla(228, 80%, 33%, 1)',
        'navy-blue': 'hsla(231, 100%, 13%, 1)',
        'new-blue': 'hsla(229.5, 90%, 23%, 1)',
        'ocean-mist': 'hsla(191, 78%, 68%, 1)',
        'light-silver': 'hsla(var(--light-silver))',
        //New company alert colors
        'nca-primary-blue': '#013DC4',
        'nca-primary-orange': '#ff9900',
        'nca-primary-orange-transparent': '#f1eee6',
        'nca-sky-blue': '#F0F8FF',
        'nca-secondary-blue': '#1B63FD',
        'nca-primary-blue-transparent': '#c2d7fc',
        'nca-primary-red': '#FF4444',
        'nca-background-soft': '#F0F4FC',
        'nca-light-blue': '#DDEDF9',
        'nca-light-blue-transparent': '#DDEDF900',
        'nca-sub-heading-text': '#303030',
        'nca-paragraph-text': '#202020',

        // shadcn colors
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        blueGray: 'hsl(var(--blueGray))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        danger: {
          light: {
            DEFAULT: '#F87171', // Light mode main color
            50: '#FEE2E2',
            100: '#FECACA',
            200: '#FCA5A5',
            300: '#F87171',
            400: '#EF4444',
            500: '#DC2626',
            600: '#B91C1C',
            700: '#991B1B',
            800: '#7F1D1D',
            900: '#581C1C',
          },
          dark: {
            DEFAULT: '#FCA5A5', // Dark mode main color
            50: '#7F1D1D',
            100: '#991B1B',
            200: '#B91C1C',
            300: '#DC2626',
            400: '#EF4444',
            500: '#F87171',
            600: '#FCA5A5',
            700: '#FECACA',
            800: '#FEE2E2',
            900: '#FFEBEB',
          },
        },
      },
      gridTemplateColumns: {
        '16': 'repeat(16, minmax(0, 1fr))',
        '24': 'repeat(24, minmax(0, 1fr))',
        '32': 'repeat(32, minmax(0, 1fr))',
      },
      boxShadow: {
        'inner-balanced':
          'inset 0px 2px 4px rgba(0, 0, 0, 0.06), inset 0px -2px 4px rgba(0, 0, 0, 0.06)',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'caret-blink': {
          '0%,70%,100%': { opacity: '1' },
          '20%,50%': { opacity: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'caret-blink': 'caret-blink 1.2s ease-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config;

export default config;
