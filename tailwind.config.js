/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './App.js',
    './index.js',
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary:   '#2D6A4F',
        secondary: '#52B788',
        accent:    '#F4A261',
        light:     '#F8F9FA',
        dark:      '#212529',
        muted:     '#6C757D',
      },
    },
  },
  plugins: [],
};