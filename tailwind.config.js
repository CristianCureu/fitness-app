/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./lib/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: '#0F111A',
        surface: '#161A2A',
        'surface-light': '#1E2233',
        primary: '#f798af',
        'primary-dark': '#e5749a',
        'primary-light': '#ffb7cc',
        purple: '#9A8CFF',
        'purple-dark': '#7A6CE5',
        'purple-soft': '#B0A6FF',
        'text-primary': '#E8ECF5',
        'text-secondary': '#A3ADC8',
        'text-muted': '#6E7694',
        border: '#1F2434',
        'border-light': '#2B3246',
      },
    },
  },
  plugins: [],
}
