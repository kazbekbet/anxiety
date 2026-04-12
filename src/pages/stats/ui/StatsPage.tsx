import { useMemo, useState } from 'react';
import { startOfDay } from 'date-fns';
import { Header } from '@/widgets/header';
import { Card } from '@/shared/ui';
import { ProgressCard } from '@/widgets/progress-card';
import { AssessmentWidget } from '@/widgets/assessment-widget';
import { ValuesWidget } from '@/widgets/values-widget';
import { getLevelColor } from '@/shared/lib/level-colors';
import { useAnxietyEntries, useAverageByDay, useThoughtRecords } from '@/entities/anxiety';
import { getLast7Days, formatShortDay } from '@/shared/lib/date';
import {
  filterByPeriod,
  averageLevel,
  topTriggers,
  buildInsights,
  averageCbtReduction,
  formatTriggerCount,
  type Period,
} from '@/shared/lib/insights';
import { ExportButton } from '@/features/export-data';

const PERIODS: { key: Period; label: string }[] = [
  { key: '7d', label: '7 дней' },
  { key: '30d', label: '30 дней' },
  { key: 'all', label: 'Всё время' },
];

export function StatsPage() {
  const entries = useAnxietyEntries((s) => s.entries);
  const records = useThoughtRecords((s) => s.records);
  const averageByDay = useAverageByDay();
  const [period, setPeriod] = useState<Period>('7d');

  const days = getLast7Days();

  const chartData = useMemo(() => {
    return days.map((day) => {
      const key = startOfDay(day).toISOString();
      return { label: formatShortDay(day), value: averageByDay.get(key) ?? 0 };
    });
  }, [days, averageByDay]);

  const filteredEntries = useMemo(() => filterByPeriod(entries, period), [entries, period]);
  const filteredRecords = useMemo(() => filterByPeriod(records, period), [records, period]);
  const overallAverage = useMemo(() => Math.round(averageLevel(filteredEntries)), [filteredEntries]);
  const maxLevel = filteredEntries.length > 0 ? Math.max(...filteredEntries.map((e) => e.level)) : 0;
  const minLevel = filteredEntries.length > 0 ? Math.min(...filteredEntries.map((e) => e.level)) : 0;
  const top3Triggers = useMemo(() => topTriggers(filteredEntries, 3), [filteredEntries]);
  const insights = useMemo(() => buildInsights(entries), [entries]);
  const cbtReduction = useMemo(() => averageCbtReduction(filteredRecords), [filteredRecords]);

  return (
    <div className="space-y-4">
      <Header title="Статистика" subtitle="Ваш прогресс" />

      {/* Period selector */}
      <div className="flex gap-1 rounded-xl bg-elevated p-1">
        {PERIODS.map((p) => (
          <button
            key={p.key}
            onClick={() => setPeriod(p.key)}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
              period === p.key
                ? 'bg-card text-accent-fg shadow-sm'
                : 'text-muted hover:text-subtle'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="text-center">
          <p className="text-2xl font-bold text-accent-fg">{filteredEntries.length}</p>
          <p className="text-xs text-muted">Записей</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-bold text-accent-fg">{filteredRecords.length}</p>
          <p className="text-xs text-muted">Мыслей КПТ</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-bold text-accent-fg">{overallAverage || '—'}</p>
          <p className="text-xs text-muted">Средний</p>
        </Card>
      </div>

      {/* Progress card */}
      <ProgressCard />

      {/* Psychological tests */}
      <AssessmentWidget />

      {/* Values */}
      <ValuesWidget />

      {/* 7-day bar chart */}
      <Card>
        <h3 className="mb-4 font-semibold text-fg">Тревожность за 7 дней</h3>
        {entries.length === 0 ? (
          <p className="py-8 text-center text-sm text-faint">Нет данных — добавьте записи в дневник</p>
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

      {/* Top triggers */}
      {top3Triggers.length > 0 && (
        <Card>
          <h3 className="mb-3 font-semibold text-fg">Частые триггеры</h3>
          <div className="space-y-2">
            {top3Triggers.map((t, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="text-subtle">{t.trigger}</span>
                <span className="text-faint">{formatTriggerCount(t.count)}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Text insights */}
      {insights.length > 0 && (
        <Card>
          <h3 className="mb-3 font-semibold text-fg">Аналитика</h3>
          <div className="space-y-2">
            {insights.map((text, i) => (
              <p key={i} className="text-sm text-muted">{text}</p>
            ))}
          </div>
        </Card>
      )}

      {/* CBT effectiveness */}
      {cbtReduction !== null && (
        <Card>
          <h3 className="mb-3 font-semibold text-fg">Эффективность КПТ</h3>
          <p className="text-sm text-muted">
            КПТ-записи снижают тревогу в среднем на{' '}
            <strong className="text-fg">{cbtReduction.toFixed(1)}</strong> баллов
          </p>
        </Card>
      )}

      {/* Summary */}
      {filteredEntries.length > 0 && (
        <Card>
          <h3 className="mb-3 font-semibold text-fg">Сводка</h3>
          <div className="space-y-2 text-sm">
            {[
              ['Максимум', `${maxLevel}/10`],
              ['Минимум', `${minLevel}/10`],
              ['Средний', `${overallAverage}/10`],
              ['Всего записей', `${filteredEntries.length}`],
            ].map(([label, value]) => (
              <div key={label} className="flex justify-between">
                <span className="text-muted">{label}</span>
                <span className="font-medium text-fg">{value}</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Export */}
      <ExportButton entries={entries} records={records} />
    </div>
  );
}
