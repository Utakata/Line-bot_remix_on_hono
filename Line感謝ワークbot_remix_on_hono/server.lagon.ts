import { Hono } from 'hono'
import { handle } from 'hono/lagon'

// Honoアプリケーションのインスタンスを作成
const app = new Hono()

// ルートパスへのGETリクエストに対するハンドラー
app.get('/', (c) => {
  return c.text('Welcome to Line感謝ワークbot!')
})

// /thankのPOSTリクエストに対するハンドラー
// ここでLINEボットのメイン機能を実装する
app.post('/thank', async (c) => {
  // リクエストボディを取得
  const body = await c.req.json()
  
  // ここにLINEボットのロジックを実装
  // 例: メッセージの処理、感謝の言葉の生成など
  
  return c.json({