/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  // darkMode: "media",
  theme: {
    extend: {
      textColor: {
        DEFAULT: "#000000", // 更改預設文字顏色為白色
        dark: "#000000", // 在夜間模式下將文字顏色設定為黑色
      },
    },
  },
  plugins: [],
};
