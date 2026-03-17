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
        // Thème pirate
        'pirate-dark': '#1a1410',
        'pirate-gold': '#d4a574',
        'pirate-red': '#8b0000',
        'pirate-blood': '#660000',
        'pirate-skull': '#2d2d2d',
      },
      fontFamily: {
        'pirate': ['Pirata One', 'cursive'],
      },
      animation: {
        'sail': 'sail 3s ease-in-out infinite',
        'wave': 'wave 2s ease-in-out infinite',
      },
      keyframes: {
        sail: {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(10px)' },
        },
        wave: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
    },
  },
  plugins: [],
};
