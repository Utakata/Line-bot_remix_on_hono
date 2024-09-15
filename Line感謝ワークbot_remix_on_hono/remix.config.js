/** @type {import('@remix-run/dev').AppConfig} */
module.exports = {
  // アプリケーションのエントリーポイント
  appDirectory: "app",
  
  // ブラウザビルドのディレクトリ
  assetsBuildDirectory: "public/build",
  
  // サーバービルドのディレクトリ
  serverBuildPath: "build/index.js",
  
  // 公開ディレクトリ
  publicPath: "/build/",
  
  // サーバーモードの設定（'development' または 'production'）
  serverModuleFormat: "cjs",
  
  // future オプション（将来的な機能の有効化）
  future: {
    v2_errorBoundary: true,
    v2_meta: true,
    v2_normalizeFormMetho