import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Button } from '@/shared/ui';
import { Heatmap } from '@/widgets/heatmap';
import { useAnxietyEntries } from '@/entities/anxiety';
import { filterByPeriod, averageLevel } from '@/shared/lib/insights';
import { generateSmartInsight } from '@/shared/lib/smart-insights';
import { subDays, startOfDay, isWithinInterval } from 'date-fns';

export function DigestPage() {
  const entries = useAnxietyEntries((s) => s.entries);
  const navigate = useNavigate();

  const weekEntries = useMemo(() => filterByPeriod(entries, '7d'), [entries]);
  const prevWeekEntries = useMemo(() => {
    const now = new Date();
    const start = startOfDay(subDays(now, 13));
    const end = startOfDay(subDays(now, 6));
    return entries.filter((e) => isWithinInterval(new Date(e.timestamp), { start, end }));
  }, [entries]);

  const weekAvg = averageLevel(weekEntries);
  const prevAvg = averageLevel(prevWeekEntries);
  const delta = prevWeekEntries.length > 0 ? weekAvg - prevAvg : null;
  const insight = useMemo(() => generateSmartInsight(entries), [entries]);

  if (weekEntries.length === 0) {
    return (
      <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-4 pt-[env(safe-area-inset-top)]">
        <Card className="w-full text-center">
          <h2 className="text-lg font-semibold text-fg mb-2">Ещё нет данных</h2>
          <p className="text-sm text-muted mb-4">Начните записывать тревогу, чтобы увидеть еженедельный дайджест</p>
          <Button onClick={() => navigate('/', { replace: true })}>На главную</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen max-w-lg px-4 pb-6 pt-[max(1.5rem,env(safe-area-inset-top))]">
      <h1 className="text-2xl font-bold text-fg mb-1">Ваша неделя</h1>
      <p className="text-sm text-muted mb-5">{weekEntries.length} записей за 7 дней</p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <Card className="text-center">
          <p className="text-2xl font-bold text-accent-fg">{weekEntries.length}</p>
          <p className="text-xs text-muted">Записей</p>
        </Card>
        <Card className="text-center">
          <p className="text-2xl font-bold text-accent-fg">{weekAvg.toFixed(1)}</p>
          <p className="text-xs text-muted">Средний</p>
        </Card>
        <Card className="text-center">
          {delta !== null ? (
            <p className={`text-2xl font-bold ${delta < 0 ? 'text-emerald-500' : delta > 0 ? 'text-red-500' : 'text-faint'}`}>
              {delta > 0 ? '+' : ''}{delta.toFixed(1)}
            </p>
          ) : (
            <p className="text-2xl font-bold text-faint">—</p>
          )}
          <p className="text-xs text-muted">vs прошлая</p>
        </Card>
      </div>

      {/* Heatmap */}
      <Card className="mb-4">
        <h3 className="font-semibold text-fg mb-3">Карта тревожности</h3>
        <Heatmap entries={entries} />
        <div className="mt-3 flex items-center gap-2 text-[10px] text-faint">
          <span>Спокойно</span>
          <div className="flex gap-0.5">
            <div className="h-3 w-3 rounded-sm bg-emerald-400 dark:bg-emerald-600" />
            <div className="h-3 w-3 rounded-sm bg-amber-400 dark:bg-amber-500" />
            <div className="h-3 w-3 rounded-sm bg-orange-400 dark:bg-orange-500" />
            <div className="h-3 w-3 rounded-sm bg-red-400 dark:bg-red-500" />
          </div>
          <span>Тревожно</span>
        </div>
      </Card>

      {/* Insight */}
      {insight && (
        <Card className={`mb-4 text-sm ${
          insight.type === 'positive' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
          : insight.type === 'suggestion' ? 'bg-accent-soft text-accent-soft-fg'
          : 'bg-elevated text-subtle'
        }`}>
          {insight.text}
        </Card>
      )}

      <Button fullWidth onClick={() => navigate('/', { replace: true })}>
        Продолжить
      </Button>
    </div>
  );
}
