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
      transitionDuration: {
        2000: '2000ms',
      },
      scale: {
        '-1': '-1',
        1: '1',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
