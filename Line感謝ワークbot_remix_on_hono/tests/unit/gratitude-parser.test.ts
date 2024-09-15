import { describe, it, expect } from 'vitest';
import { parseGratitudeMessage } from '../../src/utils/gratitude-parser';

describe('Gratitude Parser', () => {
  it('should parse a simple gratitude message', () => {
    const message = '今日は晴れてよかった';
    const result = parseGratitudeMessage(message);
    expect(result).toEqual({
      target: '天気',
      reason: '晴れた',
    });
  });

  it('should parse a message with explicit target', () => {
    const message = '友達に助けてもらってありがたかった';
    const result = parseGratitudeMessage(message);
    expect(result).toEqual({
      target: '友達',
      reason: '助けてもらった',
    });
  });

  it('should handle messages without clear targets', () => {
    const message = '今日も一日頑張れた