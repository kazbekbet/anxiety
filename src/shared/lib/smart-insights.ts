import type { AnxietyEntry } from '@/shared/types';

export interface SmartInsight {
  text: string;
  type: 'positive' | 'neutral' | 'suggestion';
}

export function generateSmartInsight(entries: AnxietyEntry[]): SmartInsight | null {
  if (entries.length < 3) return null;

  const recent = entries.slice(0, 7);
  const recentAvg = recent.reduce((s, e) => s + e.level, 0) / recent.length;

  // Trend: improving
  if (entries.length >= 7) {
    const older = entries.slice(7, 14);
    if (older.length >= 3) {
      const olderAvg = older.reduce((s, e) => s + e.level, 0) / older.length;
      if (recentAvg < olderAvg - 1) {
        return { text: `Ваша тревога снижается — средний уровень ${recentAvg.toFixed(1)} vs ${olderAvg.toFixed(1)} ранее`, type: 'positive' };
      }
    }
  }

  // Time of day pattern
  const hourGroups = new Map<string, number[]>();
  for (const e of entries.slice(0, 30)) {
    const h = new Date(e.timestamp).getHours();
    const period = h < 12 ? 'утром' : h < 18 ? 'днём' : 'вечером';
    const arr = hourGroups.get(period) ?? [];
    arr.push(e.level);
    hourGroups.set(period, arr);
  }
  let worstPeriod = '';
  let worstAvg = 0;
  for (const [period, levels] of hourGroups) {
    const avg = levels.reduce((s, l) => s + l, 0) / levels.length;
    if (avg > worstAvg && levels.length >= 3) {
      worstAvg = avg;
      worstPeriod = period;
    }
  }
  if (worstPeriod && worstAvg > recentAvg + 1) {
    return { text: `Тревога обычно выше ${worstPeriod} — попробуйте дыхательную технику заранее`, type: 'suggestion' };
  }

  // Top trigger
  const triggerCounts = new Map<string, number>();
  for (const e of entries.slice(0, 20)) {
    for (const t of e.triggers) {
      triggerCounts.set(t, (triggerCounts.get(t) ?? 0) + 1);
    }
  }
  if (triggerCounts.size > 0) {
    const sorted = [...triggerCounts.entries()].sort((a, b) => b[1] - a[1]);
    if (sorted[0][1] >= 3) {
      return { text: `Частый триггер — «${sorted[0][0]}». Замечать паттерн — уже шаг к управлению`, type: 'neutral' };
    }
  }

  // Low anxiety streak
  const lowStreak = recent.filter((e) => e.level <= 3).length;
  if (lowStreak >= 3) {
    return { text: `${lowStreak} из последних записей — низкая тревога. Отличная динамика!`, type: 'positive' };
  }

  return null;
}
