/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1.25rem',
        lg: '2.5rem',
        xl: '3rem',
      },
    },
    extend: {
      colors: {
        brand: {
          25: '#f5f7ff',
          50: '#eff4ff',
          100: '#dce7ff',
          200: '#bcd1ff',
          300: '#8eb2ff',
          400: '#5a87ff',
          500: '#3a6bff',
          600: '#264edb',
          700: '#1f3fb3',
          800: '#1d368a',
          900: '#162762',
        },
        primary: {
          50: '#f2f7ff',
          100: '#e4efff',
          200: '#c3daff',
          300: '#9ac0ff',
          400: '#679aff',
          500: '#3a6bff',
          600: '#2449db',
          700: '#1b38ad',
          800: '#1d3383',
          900: '#1d2e63'
        },
        gray: {
          25: '#f8fafc',
        },
        accent: '#ff7a59',
        success: '#16a34a',
        warning: '#f59e0b',
        danger: '#ef4444',
        error: '#ef4444',
        slate: {
          950: '#0b1220'
        }
      },
      fontFamily: {
        display: ['"Poppins"', 'ui-sans-serif', 'system-ui'],
        body: ['"Inter"', 'ui-sans-serif', 'system-ui']
      },
      boxShadow: {
        soft: '0 10px 30px rgba(28, 65, 130, 0.08)',
        accent: '0 12px 40px rgba(58, 107, 255, 0.18)',
        card: '0 25px 45px -20px rgba(15, 23, 42, 0.18)',
        'card-hover': '0 35px 65px -25px rgba(15, 23, 42, 0.24)'
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio')
  ]
};
