import { useMemo } from 'react';
import { Card } from '@/shared/ui';
import { useAnxietyEntries, useThoughtRecords } from '@/entities/anxiety';

export function ProgressCard() {
  const { entries } = useAnxietyEntries();
  const { records } = useThoughtRecords();

  const anxietyProgress = useMemo(() => {
    if (entries.length < 7) return null;

    const sorted = [...entries].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    );

    const first7 = sorted.slice(0, 7);
    const last7 = sorted.slice(-7);

    const firstAvg = first7.reduce((sum, e) => sum + e.level, 0) / first7.length;
    const lastAvg = last7.reduce((sum, e) => sum + e.level, 0) / last7.length;

    const diff = firstAvg - lastAvg;
    const percentChange = firstAvg > 0 ? Math.round((diff / firstAvg) * 100) : 0;

    return {
      firstAvg: Math.round(firstAvg * 10) / 10,
      lastAvg: Math.round(lastAvg * 10) / 10,
      percentChange,
      improved: diff > 0,
    };
  }, [entries]);

  const thoughtEffectiveness = useMemo(() => {
    if (records.length === 0) return null;

    const reductions = records.map((r) => r.emotionIntensity - r.newEmotionIntensity);
    const avgReduction = reductions.reduce((sum, r) => sum + r, 0) / reductions.length;

    return Math.round(avgReduction * 10) / 10;
  }, [records]);

  if (!anxietyProgress && thoughtEffectiveness === null) return null;

  return (
    <Card>
      <h3 className="mb-3 font-semibold text-slate-900 dark:text-slate-50">Прогресс</h3>

      {anxietyProgress && (
        <div className="mb-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-700">
          <p className="mb-2 text-sm text-slate-500 dark:text-slate-400">
            Уровень тревожности
          </p>
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium text-slate-600 dark:text-slate-300">
              Было: {anxietyProgress.firstAvg}
            </span>
            <span className="text-slate-400">&rarr;</span>
            <span className="font-medium text-slate-600 dark:text-slate-300">
              Сейчас: {anxietyProgress.lastAvg}
            </span>
          </div>
          <p
            className={`mt-1 text-sm font-medium ${
              anxietyProgress.improved
                ? 'text-green-600 dark:text-green-400'
                : 'text-red-500 dark:text-red-400'
            }`}
          >
            {anxietyProgress.improved
              ? `Улучшение на ${anxietyProgress.percentChange}%`
              : anxietyProgress.percentChange === 0
                ? 'Без изменений'
                : `Рост на ${Math.abs(anxietyProgress.percentChange)}%`}
          </p>
        </div>
      )}

      {thoughtEffectiveness !== null && records.length > 0 && (
        <div className="rounded-xl bg-slate-50 p-3 dark:bg-slate-700">
          <p className="mb-1 text-sm text-slate-500 dark:text-slate-400">
            Эффективность записей мыслей
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Среднее снижение интенсивности:{' '}
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
              {thoughtEffectiveness > 0 ? `-${thoughtEffectiveness}` : thoughtEffectiveness}
            </span>{' '}
            баллов
          </p>
          <p className="mt-1 text-xs text-slate-400">
            На основе {records.length}{' '}
            {records.length === 1 ? 'записи' : records.length < 5 ? 'записей' : 'записей'}
          </p>
        </div>
      )}

      {!anxietyProgress && entries.length > 0 && entries.length < 7 && (
        <p className="text-sm text-slate-400">
          Добавьте ещё {7 - entries.length} записей для отслеживания прогресса тревожности
        </p>
      )}
    </Card>
  );
}
