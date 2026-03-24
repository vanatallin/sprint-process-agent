/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Sprint health status colors
        'health-healthy': '#22c55e',
        'health-at-risk': '#eab308',
        'health-critical': '#ef4444',
      }
    },
  },
  plugins: [],
}
