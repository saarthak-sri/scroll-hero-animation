/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0b1d2d",
        sky: "#dff1ff",
        accent: "#ff6a3d",
        slate: "#5f6a73"
      },
      fontFamily: {
        display: ["Poppins", "sans-serif"],
        body: ["Manrope", "sans-serif"]
      },
      boxShadow: {
        car: "0 24px 48px rgba(11, 29, 45, 0.24)"
      }
    }
  },
  plugins: []
};
