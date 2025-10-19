/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}'
  ],
  theme: {
    extend: {
      colors: {
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
        accent: '#ff7a59',
        success: '#22c55e',
        warning: '#facc15',
        danger: '#ef4444',
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
        accent: '0 12px 40px rgba(58, 107, 255, 0.18)'
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio')
  ]
};
