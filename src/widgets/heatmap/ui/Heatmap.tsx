import { useMemo } from 'react';
import { startOfDay, subDays, format } from 'date-fns';
import { ru } from 'date-fns/locale';
import type { AnxietyEntry } from '@/shared/types';

interface HeatmapProps {
  entries: AnxietyEntry[];
}

function getColor(level: number): string {
  if (level === 0) return 'bg-hover';
  if (level <= 3) return 'bg-emerald-400 dark:bg-emerald-600';
  if (level <= 5) return 'bg-amber-400 dark:bg-amber-500';
  if (level <= 7) return 'bg-orange-400 dark:bg-orange-500';
  return 'bg-red-400 dark:bg-red-500';
}

const PERIODS = ['Утро', 'День', 'Вечер'] as const;

export function Heatmap({ entries }: HeatmapProps) {
  const data = useMemo(() => {
    const today = startOfDay(new Date());
    const days = Array.from({ length: 7 }, (_, i) => subDays(today, 6 - i));

    return days.map((day) => {
      const dayStart = day.getTime();
      const dayEnd = dayStart + 86400000;
      const dayEntries = entries.filter((e) => {
        const t = new Date(e.timestamp).getTime();
        return t >= dayStart && t < dayEnd;
      });

      const periods = [0, 0, 0]; // morning, afternoon, evening
      const counts = [0, 0, 0];
      for (const e of dayEntries) {
        const h = new Date(e.timestamp).getHours();
        const idx = h < 12 ? 0 : h < 18 ? 1 : 2;
        periods[idx] += e.level;
        counts[idx]++;
      }

      return {
        label: format(day, 'EE', { locale: ru }),
        cells: periods.map((sum, i) => (counts[i] > 0 ? Math.round(sum / counts[i]) : 0)),
      };
    });
  }, [entries]);

  return (
    <div>
      <div className="flex gap-1 mb-1">
        <div className="w-10" />
        {data.map((d, i) => (
          <div key={i} className="flex-1 text-center text-[10px] text-faint">{d.label}</div>
        ))}
      </div>
      {PERIODS.map((period, row) => (
        <div key={period} className="flex gap-1 mb-1">
          <div className="w-10 text-[10px] text-faint flex items-center">{period}</div>
          {data.map((d, col) => (
            <div
              key={col}
              className={`flex-1 aspect-square rounded-sm ${getColor(d.cells[row])}`}
              title={d.cells[row] > 0 ? `${d.label} ${period}: ${d.cells[row]}/10` : ''}
            />
          ))}
        </div>
      ))}
    </div>
  );
}
