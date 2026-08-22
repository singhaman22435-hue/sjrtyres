/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Ultra-Premium Carbon & Electric Cyan using CSS Variables
        brand: {
          DEFAULT: 'var(--color-brand-default)',
          dark: 'var(--color-brand-dark)',
          light: 'var(--color-brand-light)',
        },
        surface: {
          dark: 'var(--color-surface-dark)',
          card: 'var(--color-surface-card)',
          light: 'var(--color-surface-light)',
        },
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          inverse: 'var(--color-text-inverse)',
        }
      },
      fontFamily: {
        heading: ['"Outfit"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
      },
      boxShadow: {
        'glow': '0 0 20px var(--color-brand-default), 0 0 40px rgba(239,68,68,0.2)', // Sharper Velocity Red glow
      },
      keyframes: {
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        }
      },
      animation: {
        gradient: 'gradient 4s ease infinite',
        marquee: 'marquee 22s linear infinite',
      },
    },
  },
  plugins: [],
}
