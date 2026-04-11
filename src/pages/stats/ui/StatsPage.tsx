import { useMemo } from 'react';
import { startOfDay } from 'date-fns';
import { Header } from '@/widgets/header';
import { Card } from '@/shared/ui';
import { getLevelColor } from '@/shared/lib/level-colors';
import { useAnxietyEntries, useAverageByDay, useThoughtRecords } from '@/entities/anxiety';
import { getLast7Days, formatShortDay } from '@/shared/lib/date';

export function StatsPage() {
  const entries = useAnxietyEntries((s) => s.entries);
  const records = useThoughtRecords((s) => s.records);
  const averageByDay = useAverageByDay();

  const days = getLast7Days();

  const chartData = useMemo(() => {
    return days.map((day) => {
      const key = startOfDay(day).toISOString();
      return {
        label: formatShortDay(day),
        value: averageByDay.get(key) ?? 0,
      };
    });
  }, [days, averageByDay]);

  const overallAverage =
    entries.length > 0
      ? Math.round(entries.reduce((sum, e) => sum + e.level, 0) / entries.length)
      : 0;

  const maxLevel = entries.length > 0 ? Math.max(...entries.map((e) => e.level)) : 0;
  const minLevel = entries.length > 0 ? Math.min(...entries.map((e) => e.level)) : 0;

  return (
    <div className="space-y-4">
      <Header title="Статистика" subtitle="Ваш прогресс" />

      <div className="grid grid-cols-3 gap-3">
        <Card className="text-center">
          <p className="text-2xl font-bold text-accent-fg">{entries.length}</p>
          <p className="text-xs text-muted">Записей</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-bold text-accent-fg">{records.length}</p>
          <p className="text-xs text-muted">Мыслей КПТ</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-bold text-accent-fg">{overallAverage || '—'}</p>
          <p className="text-xs text-muted">Средний</p>
        </Card>
      </div>

      <Card>
        <h3 className="mb-4 font-semibold text-fg">Тревожность за 7 дней</h3>
        {entries.length === 0 ? (
          <p className="py-8 text-center text-sm text-faint">
            Нет данных — добавьте записи в дневник
          </p>
        ) : (
          <div className="flex items-end justify-between gap-2" style={{ height: 160 }}>
            {chartData.map((d, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-1">
                <span className="text-xs font-medium text-subtle">{d.value || ''}</span>
                <div className="w-full flex flex-col justify-end" style={{ height: 120 }}>
                  <div
                    className={`w-full rounded-t-md transition-all duration-300 ${d.value ? getLevelColor(d.value) : 'bg-elevated'}`}
                    style={{ height: d.value ? `${(d.value / 10) * 100}%` : '4px' }}
                  />
                </div>
                <span className="text-xs text-faint">{d.label}</span>
              </div>
            ))}
          </div>
        )}
      </Card>

      {entries.length > 0 && (
        <Card>
          <h3 className="mb-3 font-semibold text-fg">Сводка</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted">Максимум</span>
              <span className="font-medium text-fg">{maxLevel}/10</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Минимум</span>
              <span className="font-medium text-fg">{minLevel}/10</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Средний</span>
              <span className="font-medium text-fg">{overallAverage}/10</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Всего записей</span>
              <span className="font-medium text-fg">{entries.length}</span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
