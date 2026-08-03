/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,jsx}',
    './src/components/**/*.{js,jsx}',
    './src/app/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        // رنگ‌های اصلی اپلیکیشن زیبانو
        primary: '#A88B7D',
        secondary: '#8D7468',
        background: '#F5F0EC',
        card: '#EBE3DE',
        'text-main': '#2C2521',
        'text-secondary': '#5A504B',
        border: '#DCD1CB',
      },
      fontFamily: {
        vazir: ['Vazir', 'sans-serif'],
        'vazir-medium': ['Vazir-Medium', 'sans-serif'],
        'vazir-bold': ['Vazir-Bold', 'sans-serif'],
      },
    },
  },
  plugins: [],
}