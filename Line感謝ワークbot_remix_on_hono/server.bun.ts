import { Hono } from 'hono'
import { serve } from 'bun'
import { logger } from 'hono/logger'
import { secureHeaders } from 'hono/secure-headers'

// Honoアプリケーションのインスタンスを作成
const app = new Hono()

// ミドルウェアの設定
app.use('*', logger())
app.use('*', secureHeaders())

// ルートの設定
app.get('/', (c) => {
  return c.json({ message: 'Welcome to Line感謝ワークbot' })
})

// エラーハンドリング
app.notFound((c) => {
  return c.json({ message: 'Not Found' }, 404)
})

app.onError((err, c) => {
  console.error(`${err}`)
  return c.json({ message: 'Internal