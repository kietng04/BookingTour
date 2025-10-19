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
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8'
        },
        slate: {
          950: '#0f172a'
        },
        success: '#16a34a',
        warning: '#facc15',
        danger: '#dc2626'
      },
      fontFamily: {
        heading: ['"Poppins"', 'ui-sans-serif'],
        body: ['"Inter"', 'ui-sans-serif']
      },
      boxShadow: {
        card: '0 16px 40px rgba(15, 23, 42, 0.12)'
      }
    }
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography')
  ]
};
