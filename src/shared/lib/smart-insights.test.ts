import { describe, it, expect } from 'vitest';
import { generateSmartInsight } from './smart-insights';
import type { AnxietyEntry } from '@/shared/types';

function makeEntry(overrides: Partial<AnxietyEntry> = {}): AnxietyEntry {
  return {
    id: '1',
    level: 5,
    note: '',
    triggers: [],
    timestamp: new Date().toISOString(),
    ...overrides,
  };
}

describe('generateSmartInsight', () => {
  it('returns null when fewer than 3 entries', () => {
    expect(generateSmartInsight([])).toBeNull();
    expect(generateSmartInsight([makeEntry(), makeEntry()])).toBeNull();
  });

  it('returns a positive insight when recent average is lower than older average', () => {
    // 7 recent entries with low levels, then 7 older entries with high levels
    const recent = Array.from({ length: 7 }, (_, i) =>
      makeEntry({ id: `r${i}`, level: 2, timestamp: new Date().toISOString() }),
    );
    const older = Array.from({ length: 7 }, (_, i) =>
      makeEntry({ id: `o${i}`, level: 8, timestamp: new Date().toISOString() }),
    );
    const entries = [...recent, ...older];
    const result = generateSmartInsight(entries);
    expect(result).not.toBeNull();
    expect(result!.type).toBe('positive');
    expect(result!.text).toContain('снижается');
  });

  it('returns a suggestion insight when a time-of-day period is notably worse', () => {
    // All entries in the evening with high levels, plus some low morning entries
    const eveningEntries = Array.from({ length: 5 }, (_, i) =>
      makeEntry({
        id: `e${i}`,
        level: 9,
        timestamp: new Date(2024, 5, 10, 20, 0).toISOString(), // 20:00 = evening
      }),
    );
    const morningEntries = Array.from({ length: 5 }, (_, i) =>
      makeEntry({
        id: `m${i}`,
        level: 2,
        timestamp: new Date(2024, 5, 10, 8, 0).toISOString(), // 08:00 = morning
      }),
    );
    const entries = [...eveningEntries, ...morningEntries];
    const result = generateSmartInsight(entries);
    expect(result).not.toBeNull();
    expect(result!.type).toBe('suggestion');
    expect(result!.text).toContain('вечером');
  });

  it('returns a neutral insight when a trigger appears 3+ times', () => {
    const entries = Array.from({ length: 5 }, (_, i) =>
      makeEntry({
        id: `t${i}`,
        level: 5,
        triggers: ['Работа'],
        timestamp: new Date(2024, 5, 10, 12 + i, 0).toISOString(),
      }),
    );
    const result = generateSmartInsight(entries);
    expect(result).not.toBeNull();
    expect(result!.type).toBe('neutral');
    expect(result!.text).toContain('Работа');
  });

  it('returns a positive insight for low anxiety streak', () => {
    // 7 entries all with low anxiety, no triggers, same time of day
    const entries = Array.from({ length: 7 }, (_, i) =>
      makeEntry({
        id: `l${i}`,
        level: 2,
        triggers: [],
        timestamp: new Date(2024, 5, 10, 12, i).toISOString(),
      }),
    );
    const result = generateSmartInsight(entries);
    expect(result).not.toBeNull();
    expect(result!.type).toBe('positive');
    expect(result!.text).toContain('низкая тревога');
  });

  it('returns null when no patterns are detected', () => {
    // 3 entries with moderate levels, no triggers, same time — no pattern
    const entries = Array.from({ length: 3 }, (_, i) =>
      makeEntry({
        id: `n${i}`,
        level: 5,
        triggers: [],
        timestamp: new Date(2024, 5, 10, 12, i).toISOString(),
      }),
    );
    const result = generateSmartInsight(entries);
    // With level=5 and no triggers, the low streak won't trigger (level > 3)
    // No time-of-day difference, no trend (fewer than 7 entries)
    expect(result).toBeNull();
  });
});
