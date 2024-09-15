import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { logger } from 'hono/logger'
import { secureHeaders } from 'hono/secure-headers'

// LINEボット関連の機能をインポート（実際の実装に応じて調整が必要）
import { handleLineWebhook } from './lineBot'

const app = new Hono()

// ミドルウェアの設定
app.use('*', logger())
app.use('*', secureHeaders())

// ルートパスのハンドラ
app.get('/', (c) => {
  return c.text('Line感謝ワークbot is running!')
})

// LINEウェブフックのエンドポイント
app.post('/webhook', async (c) => {
  const body = await c.req.json()
  await handleLineWebhook(body)
  return c.json({ status: 'success' })
})

// 健康チ