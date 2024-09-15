import { Hono } from 'hono'
import { handle } from './handler'
import { cors } from 'hono/cors'

// Honoアプリケーションのインスタンスを作成
const app = new Hono()

// CORSミドルウェアを適用
app.use('*', cors())

// ルートパスへのGETリクエストに対するハンドラ
app.get('/', (c) => c.text('Line感謝ワークbot_remix_on_hono is running!'))

// WebhookエンドポイントへのPOSTリクエストに対するハンドラ
app.post('/webhook', handle)

// Cloudflare Workersのfetchハンドラ
export default {
  fetch: app.fetch,
}

// 環境変数の型定義
declare global {
  const LINE_CHANNEL_SECRET: string
  const LINE_CHANNEL_ACCESS_TOKEN: string
}