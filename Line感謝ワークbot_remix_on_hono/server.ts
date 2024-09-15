import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { logger } from 'hono/logger'
import { cors } from 'hono/cors'

// アプリケーションの初期化
const app = new Hono()

// ミドルウェアの設定
app.use('*', logger())
app.use('*', cors())

// ルートハンドラ
app.get('/', (c) => {
  return c.json({ message: 'Welcome to Line感謝ワークbot_remix_on_hono' })
})

// エラーハンドリング
app.onError((err, c) => {
  console.error(`${err}`)
  return c.json({ error: 'Internal Server Error' }, 500)
})

// 404 Not Found ハンドラ
app.notFound((c) => {
  return c.json({ message: 'Not Found' }, 404)
})

// サーバーの起動
const port