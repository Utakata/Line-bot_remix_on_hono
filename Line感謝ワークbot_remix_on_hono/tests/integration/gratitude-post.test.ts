import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { app } from '../../src/index';
import { createTestClient } from 'hono/testing';
import { prisma } from '../../src/lib/prisma';

describe('Gratitude Post Integration Tests', () => {
  const client = createTestClient(app);

  beforeAll(async () => {
    // データベースの設定やテストデータの挿入
    await prisma.gratitudePost.deleteMany();
  });

  afterAll(async () => {
    // テスト後のクリーンアップ
    await prisma.gratitudePost.deleteMany();
    await prisma.$disconnect();
  });

  it('should create a new gratitude post', async () => {
    const response = await client.post('/api/gratitude', {
      json: {
        content: 'Thank you for your help!',
        authorId: