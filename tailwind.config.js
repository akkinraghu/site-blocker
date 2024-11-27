/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        toggle: {
          off: '#CBD5E1',  // Slate-300: A subtle gray for off state
          on: '#22C55E',   // Green-500: A vibrant green for on state
          ring: '#86EFAC'  // Green-300: A lighter green for focus ring
        }
      }
    },
  },
  plugins: [],
}
