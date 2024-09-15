import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { Hono } from 'hono';
import { Client } from '@line/bot-sdk';
import { lineAuth } from '../../src/middleware/lineAuth';

describe('LINE Auth Integration Tests', () => {
  let app: Hono;
  let mockLineClient: jest.Mocked<Client>;

  beforeAll(() => {
    // モックLINEクライアントの設定
    mockLineClient = {
      verifySignature: jest.fn(),
    } as any;

    // Honoアプリケーションの設定
    app = new Hono();
    app.use('/webhook', lineAuth(mockLineClient));
    app.post('/webhook', (c) => c.text('OK'));
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

  it('should pass authentication with valid signature', async () => {
    const mockSignature = 'validSignature';
    const mockBody = JSON.stringify({ events: [] });

    mockLineClient