/// <reference types="@remix-run/dev" />
/// <reference types="@remix-run/node" />

// 環境変数の型定義
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      SESSION_SECRET: string;
      DATABASE_URL: string;
      REDIS_URL?: string;
      LINE_CHANNEL_SECRET: string;
      LINE_CHANNEL_ACCESS_TOKEN: string;
      APP_URL: string;
      PORT?: string;
      // 他の環境変数をここに追加
    }
  }
}

// Remixの特定の型拡張
declare module '@remix-run/server-runtime' {
  export interface AppLoadContext {
    // アプリケーション固有のコンテキスト型をここに追加
  }
}

// グローバルな型定義
declare global