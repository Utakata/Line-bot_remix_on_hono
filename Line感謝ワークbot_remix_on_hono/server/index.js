import { Hono } from 'hono';
import { serve } from '@hono/node-server';
import { secureHeaders } from 'hono/secure-headers';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import dotenv from 'dotenv';

// 環境変数の読み込み
dotenv.config();

const app = new Hono();

// ミドルウェアの設定
app.use('*', logger());
app.use('*', secureHeaders());
app.use('*', cors());

// ルートハンドラ
app.get('/', (c) => c.text('LINE感謝ワークbot Server is running!'));

// LINEウェブフックエンドポイント
app.post('/webhook', async (c) => {