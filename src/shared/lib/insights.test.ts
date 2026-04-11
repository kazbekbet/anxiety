import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  filterByPeriod,
  averageLevel,
  topTriggers,
  calmestDayOfWeek,
  averageCbtReduction,
  sparklineData,
  trendDirection,
  buildInsights,
  formatTriggerCount,
} from './insights';
import type { AnxietyEntry, ThoughtRecord } from '@/shared/types';

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

function makeThought(overrides: Partial<ThoughtRecord> = {}): ThoughtRecord {
  return {
    id: '1',
    situation: 'test',
    automaticThought: 'bad',
    emotion: 'anxiety',
    emotionIntensity: 8,
    cognitiveDistortions: ['catastrophizing'],
    alternativeThought: 'ok',
    newEmotionIntensity: 4,
    timestamp: new Date().toISOString(),
    ...overrides,
  };
}

describe('filterByPeriod', () => {
  it('returns all items when period is "all"', () => {
    const items = [
      makeEntry({ timestamp: '2020-01-01T00:00:00Z' }),
      makeEntry({ timestamp: '2024-06-15T00:00:00Z' }),
    ];
    expect(filterByPeriod(items, 'all')).toHaveLength(2);
  });

  it('filters items within last 7 days', () => {
    const now = new Date();
    const recent = makeEntry({ id: 'a', timestamp: now.toISOString() });
    const old = makeEntry({ id: 'b', timestamp: '2020-01-01T00:00:00Z' });
    const result = filterByPeriod([recent, old], '7d');
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('a');
  });

  it('filters items within last 30 days', () => {
    const now = new Date();
    const recent = makeEntry({ id: 'a', timestamp: now.toISOString() });
    const twoWeeksAgo = new Date(now);
    twoWeeksAgo.setDate(twoWeeksAgo.getDate() - 14);
    const mid = makeEntry({ id: 'b', timestamp: twoWeeksAgo.toISOString() });
    const old = makeEntry({ id: 'c', timestamp: '2020-01-01T00:00:00Z' });
    const result = filterByPeriod([recent, mid, old], '30d');
    expect(result).toHaveLength(2);
  });

  it('returns empty array when no items match the period', () => {
    const old = [makeEntry({ timestamp: '2020-01-01T00:00:00Z' })];
    expect(filterByPeriod(old, '7d')).toHaveLength(0);
  });

  it('works with empty array', () => {
    expect(filterByPeriod([], '7d')).toEqual([]);
  });
});

describe('averageLevel', () => {
  it('returns 0 for empty array', () => {
    expect(averageLevel([])).toBe(0);
  });

  it('returns exact level for single entry', () => {
    expect(averageLevel([makeEntry({ level: 7 })])).toBe(7);
  });

  it('computes correct average for multiple entries', () => {
    const entries = [
      makeEntry({ level: 2 }),
      makeEntry({ level: 4 }),
      makeEntry({ level: 6 }),
    ];
    expect(averageLevel(entries)).toBe(4);
  });

  it('handles decimal averages', () => {
    const entries = [makeEntry({ level: 3 }), makeEntry({ level: 4 })];
    expect(averageLevel(entries)).toBe(3.5);
  });
});

describe('topTriggers', () => {
  it('returns empty array when no entries', () => {
    expect(topTriggers([], 3)).toEqual([]);
  });

  it('counts triggers across entries', () => {
    const entries = [
      makeEntry({ triggers: ['Work', 'Health'] }),
      makeEntry({ triggers: ['Work', 'Money'] }),
      makeEntry({ triggers: ['Work'] }),
    ];
    const result = topTriggers(entries, 3);
    expect(result[0]).toEqual({ trigger: 'Work', count: 3 });
    expect(result).toHaveLength(3);
  });

  it('limits results to n', () => {
    const entries = [
      makeEntry({ triggers: ['A', 'B', 'C', 'D'] }),
    ];
    expect(topTriggers(entries, 2)).toHaveLength(2);
  });

  it('ignores empty/whitespace triggers', () => {
    const entries = [makeEntry({ triggers: ['', '  ', 'Real'] })];
    const result = topTriggers(entries, 5);
    expect(result).toHaveLength(1);
    expect(result[0].trigger).toBe('Real');
  });

  it('trims trigger names', () => {
    const entries = [
      makeEntry({ triggers: [' Work '] }),
      makeEntry({ triggers: ['Work'] }),
    ];
    const result = topTriggers(entries, 1);
    expect(result[0]).toEqual({ trigger: 'Work', count: 2 });
  });
});

describe('calmestDayOfWeek', () => {
  it('returns null for empty entries', () => {
    expect(calmestDayOfWeek([])).toBeNull();
  });

  it('returns a day name string in Russian', () => {
    // Create entries all on the same weekday (a Monday)
    const entries = [
      makeEntry({ level: 2, timestamp: '2024-01-08T12:00:00Z' }), // Monday
      makeEntry({ level: 8, timestamp: '2024-01-09T12:00:00Z' }), // Tuesday
    ];
    const result = calmestDayOfWeek(entries);
    expect(result).toBe('понедельник');
  });

  it('picks the day with the lowest average', () => {
    const entries = [
      makeEntry({ level: 1, timestamp: '2024-01-08T10:00:00Z' }), // Mon
      makeEntry({ level: 3, timestamp: '2024-01-08T14:00:00Z' }), // Mon avg=2
      makeEntry({ level: 1, timestamp: '2024-01-09T10:00:00Z' }), // Tue avg=1
    ];
    const result = calmestDayOfWeek(entries);
    expect(result).toBe('вторник');
  });
});

describe('averageCbtReduction', () => {
  it('returns null for empty records', () => {
    expect(averageCbtReduction([])).toBeNull();
  });

  it('computes correct reduction for single record', () => {
    const records = [makeThought({ emotionIntensity: 8, newEmotionIntensity: 3 })];
    expect(averageCbtReduction(records)).toBe(5);
  });

  it('computes average reduction across multiple records', () => {
    const records = [
      makeThought({ emotionIntensity: 8, newEmotionIntensity: 4 }), // 4
      makeThought({ emotionIntensity: 6, newEmotionIntensity: 2 }), // 4
      makeThought({ emotionIntensity: 10, newEmotionIntensity: 7 }), // 3
    ];
    // (4+4+3)/3 = 3.666...
    expect(averageCbtReduction(records)).toBeCloseTo(3.667, 2);
  });

  it('handles negative reduction (worsened)', () => {
    const records = [makeThought({ emotionIntensity: 3, newEmotionIntensity: 7 })];
    expect(averageCbtReduction(records)).toBe(-4);
  });
});

describe('sparklineData', () => {
  it('returns array of 7 elements', () => {
    const result = sparklineData([]);
    expect(result).toHaveLength(7);
  });

  it('returns all zeros when no entries', () => {
    expect(sparklineData([])).toEqual([0, 0, 0, 0, 0, 0, 0]);
  });

  it('places today entry in the last slot', () => {
    const now = new Date();
    const entries = [makeEntry({ level: 5, timestamp: now.toISOString() })];
    const result = sparklineData(entries);
    expect(result[6]).toBe(5);
    // Other days should be 0
    expect(result.slice(0, 6).every((v) => v === 0)).toBe(true);
  });

  it('averages multiple entries on the same day', () => {
    const now = new Date();
    const entries = [
      makeEntry({ level: 4, timestamp: now.toISOString() }),
      makeEntry({ level: 8, timestamp: now.toISOString() }),
    ];
    const result = sparklineData(entries);
    expect(result[6]).toBe(6);
  });
});

describe('trendDirection', () => {
  let realDate: typeof Date;

  beforeEach(() => {
    realDate = globalThis.Date;
  });

  afterEach(() => {
    globalThis.Date = realDate;
    vi.useRealTimers();
  });

  it('returns null when no entries for today', () => {
    expect(trendDirection([])).toBeNull();
  });

  it('returns null when no entries for yesterday', () => {
    const now = new Date();
    const entries = [makeEntry({ level: 5, timestamp: now.toISOString() })];
    expect(trendDirection(entries)).toBeNull();
  });

  it('returns "up" when today is higher than yesterday', () => {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(12, 0, 0, 0);
    const todayEntry = makeEntry({ level: 8, timestamp: now.toISOString() });
    const yesterdayEntry = makeEntry({ level: 3, timestamp: yesterday.toISOString() });
    expect(trendDirection([todayEntry, yesterdayEntry])).toBe('up');
  });

  it('returns "down" when today is lower than yesterday', () => {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(12, 0, 0, 0);
    const todayEntry = makeEntry({ level: 2, timestamp: now.toISOString() });
    const yesterdayEntry = makeEntry({ level: 7, timestamp: yesterday.toISOString() });
    expect(trendDirection([todayEntry, yesterdayEntry])).toBe('down');
  });

  it('returns "same" when averages are equal', () => {
    const now = new Date();
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(12, 0, 0, 0);
    const todayEntry = makeEntry({ level: 5, timestamp: now.toISOString() });
    const yesterdayEntry = makeEntry({ level: 5, timestamp: yesterday.toISOString() });
    expect(trendDirection([todayEntry, yesterdayEntry])).toBe('same');
  });
});

describe('buildInsights', () => {
  it('returns empty array for no entries', () => {
    expect(buildInsights([])).toEqual([]);
  });

  it('includes weekly average insight when entries exist', () => {
    const now = new Date();
    const entries = [
      makeEntry({ level: 6, timestamp: now.toISOString() }),
      makeEntry({ level: 4, timestamp: now.toISOString() }),
    ];
    const insights = buildInsights(entries);
    expect(insights.some((i) => i.includes('Средняя тревожность за неделю'))).toBe(true);
  });

  it('includes calmest day insight', () => {
    const entries = [
      makeEntry({ level: 2, timestamp: '2024-01-08T12:00:00Z' }),
    ];
    const insights = buildInsights(entries);
    expect(insights.some((i) => i.includes('Самый спокойный день'))).toBe(true);
  });

  it('includes top trigger insight', () => {
    const now = new Date();
    const entries = [
      makeEntry({ level: 5, triggers: ['Work'], timestamp: now.toISOString() }),
    ];
    const insights = buildInsights(entries);
    expect(insights.some((i) => i.includes('Самый частый триггер — Work'))).toBe(true);
  });
});

describe('formatTriggerCount', () => {
  it('returns "1 раз"', () => {
    expect(formatTriggerCount(1)).toBe('1 раз');
  });

  it('returns "2 раза"', () => {
    expect(formatTriggerCount(2)).toBe('2 раза');
  });

  it('returns "3 раза"', () => {
    expect(formatTriggerCount(3)).toBe('3 раза');
  });

  it('returns "4 раза"', () => {
    expect(formatTriggerCount(4)).toBe('4 раза');
  });

  it('returns "5 раз"', () => {
    expect(formatTriggerCount(5)).toBe('5 раз');
  });

  it('returns "11 раз" (special case)', () => {
    expect(formatTriggerCount(11)).toBe('11 раз');
  });

  it('returns "12 раз" (special case)', () => {
    expect(formatTriggerCount(12)).toBe('12 раз');
  });

  it('returns "21 раз"', () => {
    expect(formatTriggerCount(21)).toBe('21 раз');
  });

  it('returns "22 раза"', () => {
    expect(formatTriggerCount(22)).toBe('22 раза');
  });
});
