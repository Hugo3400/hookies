/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        plank: { DEFAULT: '#1c1209', light: '#2a1c0f' },
        rum: '#3d2512',
        rope: '#8b6914',
        gold: { DEFAULT: '#c9952b', light: '#dbb44a' },
        parchment: '#e8d5b5',
        bone: '#f0e6d3',
        blood: '#7a1f1f',
        sea: '#1a3a4a',
      },
      fontFamily: {
        pirate: ['Pirata One', 'cursive'],
        subtitle: ['Cinzel', 'serif'],
      },
    },
  },
  plugins: [],
};
