const colors = require('tailwindcss/colors')

module.exports = {
  purge: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ], // remove unused styles in production
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        // sm: '2rem',
        // lg: '4rem',
        // xl: '5rem',
        // '2xl': '6rem',
      },
    },
    fontFamily: {
      sans: ['Tenor Sans', 'Arial', 'sans-serif'],
      serif: ['Philosopher', 'Helvetica', 'serif'],
    },
    colors: {
      black: 'var(--black)',
      white: 'var(--white)',
      primary: 'var(--primary)',
      secondary: 'var(--secondary)',
      tertiary: 'var(--tertiary)',
      'button-ui': 'var(--button-ui)',
    },
    extend: {
      spacing: {
        'screen-h/2': '50vh',
        'screen-w/2': '50vw',
      },
      transitionDuration: {
        2000: '2000ms',
      },
      scale: {
        '-1': '-1',
        200: '2',
        250: '2.5',
        300: '3',
      },
      rotate: {
        360: '360',
      },
      animation: {
        'spin-cloud-slow': 'spin 50s linear infinite',
        'spin-cloud-medium': 'spin 25s linear infinite',
        'spin-cloud-fast': 'spin 15s linear infinite',
      },
      cursor: {
        none: 'none',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
