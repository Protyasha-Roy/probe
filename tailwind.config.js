/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'space-grotesk': ['Space Grotesk', 'system-ui', 'sans-serif'],
      },
      colors: {
        'primary-black': '#000000',
        'primary-white': '#ffffff',
        'primary-orange': '#FF5F1F',
        'success': '#00BA88',
        'error': '#FF4D4F',
        'warning': '#FFBA08',
      },
      boxShadow: {
        'brutal': '4px 4px 0 0 #000000',
        'brutal-lg': '8px 8px 0 0 #000000',
      },
      borderWidth: {
        '3': '3px',
      },
      container: {
        center: true,
        padding: '1rem',
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
        },
      },
    },
  },
  plugins: [],
}

