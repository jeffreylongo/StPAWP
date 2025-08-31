/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-blue': '#1a4b8f',
        'primary-blue-dark': '#0d2a53',
        'primary-blue-darker': '#071a36',
        'primary-gold': '#c6a84a',
        'primary-gold-light': '#e5d9b6',
        'neutral-light': '#f5f5f5',
        'text-primary': '#1f2937',
        'text-muted': '#6b7280',
        'border-color': '#e5e7eb',
      },
      fontFamily: {
        'cinzel': ['Cinzel', 'serif'],
        'garamond': ['Cormorant Garamond', 'serif'],
        'sans': ['Open Sans', 'sans-serif'],
      },
      fontSize: {
        'xs': '.75rem',
        'sm': '.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '4rem',
      },
      minHeight: {
        'calendar-day': '120px',
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      }
    },
  },
  plugins: [],
}