/** @type {import('tailwindcss').Config} */
import type { Config } from 'tailwindcss';

const config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/react-tailwindcss-select/dist/index.esm.js',
  ],
  prefix: '',
  daisyui: {
    themes: ['light', 'dark', 'cupcake'],
  },
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1440px',
      },
    },
    screens: {
      sm: '576px',
      // => @media (min-width: 576px) { ... }

      md: '768px',
      // => @media (min-width: 768px) { ... }

      lg: '992px',
      // => @media (min-width: 992px) { ... }

      xl: '1200px',
      // => @media (min-width: 1200px) { ... }

      xxl: '1400px',
      // => @media (min-width: 1400px) { ... }
    },
    extend: {
      backgroundImage: {
        'span-bg': 'var(--span-bg)',
      },
      colors: {
        background: 'hsl(var(--background))',
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
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
        foreground: 'hsl(var(--foreground))',
        primary: {
          '50': '#ecfff8',
          '100': '#d3ffef',
          '200': '#aaffe0',
          '300': '#69ffc9',
          '400': '#21ffac',
          '500': '#00f28e',
          '600': '#00ca72',
          '700': '#009e5c',
          '800': '#008755', //original
          '900': '#026542',
          '950': '#003922',
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        'button-secondary': 'var(--button-secondary)',
        'button-text': 'var(--button-text)',
        'text-secondary': 'var(--text-secondary)',
        'background-secondary': 'var(--background-secondary)',
        secondary: {
          '50': '#fefbec',
          '100': '#fbf3ca',
          '200': '#f6e691',
          '300': '#f2d457',
          '400': '#eebf2d', //original
          '500': '#e7a119',
          '600': '#cd7d12',
          '700': '#aa5913',
          '800': '#8a4616',
          '900': '#723a15',
          '950': '#411d07',
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        button: 'var(--button)',
        selected: 'var(--selected)',
        dropdown: 'var(--dropdown)',
        dropdownHover: 'var(--dropdown-hover)',
        buttonSecondary: 'var(--button-secondary)',
        colorCodGray: '#191919',
        colorOrangyRed: '#FE330A',
        colorLinenRuffle: '#EFEAE3',
        colorViolet: '#321CA4',
        colorGreen: '#39FF14',
        rxtGreen: '#008756',
        rxtYellow: '#eebf2d',
        rxtBlack: '#0f0f0e',
        rxtRoyalBlue: '#34436a',
        rxtLightGreen: '#33bb82',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        dmSans: ['DM Sans', 'sans-serif'],
        clashDisplay: ['Clash Display', 'sans-serif'],
        raleway: ['Raleway', 'sans-serif'],
        spaceGrotesk: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        sans: [
          'var(--font-geist-sans)',
          'var(--font-space-grotesk)',
          'var(--rubik)',
        ],
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate') /*, require('daisyui')*/],
} satisfies Config;

export default config;
