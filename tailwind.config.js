/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-body)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      colors: {
        brand: {
          50:  '#f0f4ff',
          100: '#dde6ff',
          200: '#c3d0ff',
          300: '#9db0ff',
          400: '#7086ff',
          500: '#4a5fff',
          600: '#3040f5',
          700: '#2530d8',
          800: '#1f28ae',
          900: '#1e2789',
          950: '#13185c',
        },
        ink: {
          50:  '#f8f7f4',
          100: '#efede8',
          200: '#dedad2',
          300: '#c8c2b6',
          400: '#ada594',
          500: '#958c7c',
          600: '#7d7367',
          700: '#675f54',
          800: '#564f47',
          900: '#48433c',
          950: '#26231f',
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease forwards',
        'fade-in': 'fadeIn 0.4s ease forwards',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
