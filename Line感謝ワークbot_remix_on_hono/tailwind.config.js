/** @type {import('tailwindcss').Config} */
module.exports = {
  // コンテンツのソースファイルを指定
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  // ダークモードの設定（'media'はシステム設定に従う、'class'は手動で切り替え）
  darkMode: 'media',
  // テーマのカスタマイズ
  theme: {
    extend: {
      // ここにカスタムの色やフォントなどを追加できます
      colors: {
        'primary': '#4A5568',
        'secondary': '#718096',
      },
      fontFamily: {
        'sans': ['Roboto', 'Arial', 'sans-serif'],
      },
    },
  },
  // プラグインの追加