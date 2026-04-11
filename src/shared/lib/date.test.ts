import { describe, it, expect } from 'vitest';
import { formatEntryDate, formatTime, getLast7Days } from './date';

describe('date utils', () => {
  it('formats today as "Сегодня"', () => {
    expect(formatEntryDate(new Date().toISOString())).toBe('Сегодня');
  });

  it('formats yesterday as "Вчера"', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    expect(formatEntryDate(yesterday.toISOString())).toBe('Вчера');
  });

  it('formats time as HH:mm', () => {
    const time = formatTime('2024-01-15T14:30:00.000Z');
    expect(time).toMatch(/^\d{2}:\d{2}$/);
  });

  it('returns 7 days', () => {
    const days = getLast7Days();
    expect(days).toHaveLength(7);
  });
});
