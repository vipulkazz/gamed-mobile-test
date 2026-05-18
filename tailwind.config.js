/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        bg: "#0B0B0F",
        surface: "#151521",
        card: "#1B1B2A",
        border: "#26263A",
        text: "#F4F4F6",
        muted: "#8A8AA0",
        accent: "#7C5CFF",
        accentSoft: "#4B3DCC",
        success: "#3DDC97",
        danger: "#FF5C7A",
        warning: "#FFC857",
        gradeS: "#FFD166",
        gradeA: "#3DDC97",
        gradeB: "#7C5CFF",
        gradeC: "#FF9F1C",
        gradeD: "#FF5C7A",
      },
      fontFamily: {
        display: ["SpaceGrotesk_700Bold"],
        body: ["Inter_400Regular"],
      },
    },
  },
  plugins: [],
};
