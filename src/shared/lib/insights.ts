import { startOfDay, subDays, isWithinInterval, eachDayOfInterval, format } from 'date-fns';
import { ru } from 'date-fns/locale';
import type { AnxietyEntry, ThoughtRecord } from '@/shared/types';

export type Period = '7d' | '30d' | 'all';

/** Filter entries by period relative to today */
export function filterByPeriod<T extends { timestamp: string }>(
  items: T[],
  period: Period,
): T[] {
  if (period === 'all') return items;
  const now = new Date();
  const daysBack = period === '7d' ? 6 : 29;
  const start = startOfDay(subDays(now, daysBack));
  const end = now;
  return items.filter((item) =>
    isWithinInterval(new Date(item.timestamp), { start, end }),
  );
}

/** Average level across entries (returns 0 if empty) */
export function averageLevel(entries: AnxietyEntry[]): number {
  if (entries.length === 0) return 0;
  return entries.reduce((sum, e) => sum + e.level, 0) / entries.length;
}

/** Top-N triggers with counts */
export function topTriggers(
  entries: AnxietyEntry[],
  n: number,
): { trigger: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const entry of entries) {
    for (const t of entry.triggers) {
      const trimmed = t.trim();
      if (trimmed) {
        counts.set(trimmed, (counts.get(trimmed) ?? 0) + 1);
      }
    }
  }
  return [...counts.entries()]
    .map(([trigger, count]) => ({ trigger, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, n);
}

/** Get the calmest day of the week (lowest average) */
export function calmestDayOfWeek(entries: AnxietyEntry[]): string | null {
  if (entries.length === 0) return null;
  const dayTotals = new Map<number, { sum: number; count: number }>();
  for (const entry of entries) {
    const day = new Date(entry.timestamp).getDay();
    const existing = dayTotals.get(day) ?? { sum: 0, count: 0 };
    existing.sum += entry.level;
    existing.count += 1;
    dayTotals.set(day, existing);
  }
  let bestDay = -1;
  let bestAvg = Infinity;
  for (const [day, { sum, count }] of dayTotals) {
    const avg = sum / count;
    if (avg < bestAvg) {
      bestAvg = avg;
      bestDay = day;
    }
  }
  if (bestDay === -1) return null;
  // date-fns: create a date for that weekday and format
  // Use a known reference: 2024-01-07 is Sunday (day 0)
  const ref = new Date(2024, 0, 7 + bestDay);
  return format(ref, 'EEEE', { locale: ru });
}

/** Average CBT reduction (emotionIntensity - newEmotionIntensity) */
export function averageCbtReduction(records: ThoughtRecord[]): number | null {
  if (records.length === 0) return null;
  const total = records.reduce(
    (sum, r) => sum + (r.emotionIntensity - r.newEmotionIntensity),
    0,
  );
  return total / records.length;
}

/** Get sparkline data: last 7 days average levels */
export function sparklineData(entries: AnxietyEntry[]): number[] {
  const today = startOfDay(new Date());
  const days = eachDayOfInterval({ start: subDays(today, 6), end: today });
  return days.map((day) => {
    const dayStart = startOfDay(day);
    const dayEnd = new Date(dayStart);
    dayEnd.setHours(23, 59, 59, 999);
    const dayEntries = entries.filter((e) =>
      isWithinInterval(new Date(e.timestamp), { start: dayStart, end: dayEnd }),
    );
    if (dayEntries.length === 0) return 0;
    return dayEntries.reduce((s, e) => s + e.level, 0) / dayEntries.length;
  });
}

/** Trend comparing today's average vs yesterday's average. Returns 'up' | 'down' | 'same' | null */
export function trendDirection(
  entries: AnxietyEntry[],
): 'up' | 'down' | 'same' | null {
  const today = startOfDay(new Date());
  const yesterday = subDays(today, 1);

  const todayEntries = entries.filter((e) => {
    const d = new Date(e.timestamp);
    return d >= today;
  });
  const yesterdayEntries = entries.filter((e) => {
    const d = new Date(e.timestamp);
    return d >= yesterday && d < today;
  });

  if (todayEntries.length === 0 || yesterdayEntries.length === 0) return null;

  const todayAvg = todayEntries.reduce((s, e) => s + e.level, 0) / todayEntries.length;
  const yesterdayAvg =
    yesterdayEntries.reduce((s, e) => s + e.level, 0) / yesterdayEntries.length;

  if (todayAvg > yesterdayAvg) return 'up';
  if (todayAvg < yesterdayAvg) return 'down';
  return 'same';
}

/** Build text insights */
export function buildInsights(entries: AnxietyEntry[]): string[] {
  const insights: string[] = [];

  // Weekly average vs previous week
  const now = new Date();
  const weekEntries = filterByPeriod(entries, '7d');
  const weekAvg = averageLevel(weekEntries);

  const prevWeekStart = startOfDay(subDays(now, 13));
  const prevWeekEnd = startOfDay(subDays(now, 7));
  const prevWeekEntries = entries.filter((e) =>
    isWithinInterval(new Date(e.timestamp), { start: prevWeekStart, end: prevWeekEnd }),
  );
  const prevWeekAvg = averageLevel(prevWeekEntries);

  if (weekEntries.length > 0) {
    let text = `Средняя тревожность за неделю: ${weekAvg.toFixed(1)}`;
    if (prevWeekEntries.length > 0) {
      text += ` (было ${prevWeekAvg.toFixed(1)} на прошлой неделе)`;
    }
    insights.push(text);
  }

  // Calmest day
  const calmest = calmestDayOfWeek(entries);
  if (calmest) {
    insights.push(
      `Самый спокойный день — ${calmest.charAt(0).toLowerCase() + calmest.slice(1)}`,
    );
  }

  // Top trigger
  const top = topTriggers(entries, 1);
  if (top.length > 0) {
    insights.push(`Самый частый триггер — ${top[0].trigger}`);
  }

  return insights;
}

/** Format trigger count with Russian plural */
export function formatTriggerCount(count: number): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return `${count} раз`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${count} раза`;
  return `${count} раз`;
}
