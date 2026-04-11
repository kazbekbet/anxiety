import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card } from '@/shared/ui';
import { Sparkline } from '@/shared/ui/Sparkline';
import { getTestById, getLevel, useAssessmentResults } from '@/entities/assessment';
import { TestGauge } from './TestGauge';

const LEVEL_BADGE: Record<string, string> = {
  emerald: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400',
  amber: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-400',
  orange: 'bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-400',
  red: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400',
};

export function AssessmentResultPage() {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  const results = useAssessmentResults((s) => s.results);
  const test = getTestById(testId ?? '');

  const testResults = useMemo(
    () => results.filter((r) => r.testId === testId).reverse(),
    [results, testId],
  );

  const latest = testResults[testResults.length - 1];

  if (!test || !latest) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <Card className="w-full max-w-lg text-center">
          <p className="text-muted">Результат не найден</p>
          <Button className="mt-4" onClick={() => navigate('/stats', { replace: true })}>
            К статистике
          </Button>
        </Card>
      </div>
    );
  }

  const level = getLevel(test, latest.score);
  const sparkData = testResults.map((r) => r.score);
  const prevResult = testResults.length >= 2 ? testResults[testResults.length - 2] : null;
  const delta = prevResult ? latest.score - prevResult.score : null;

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col px-4 py-6">
      <h1 className="mb-6 text-center text-xl font-bold text-fg">{test.shortTitle} — результат</h1>

      {/* Gauge */}
      <Card className="mb-4 flex flex-col items-center py-6">
        <TestGauge score={latest.score} maxScore={test.maxScore} color={level.color} />

        <span
          className={`mt-2 rounded-full px-4 py-1.5 text-sm font-medium ${LEVEL_BADGE[level.color] ?? ''}`}
        >
          {level.label}
        </span>

        {delta !== null && (
          <p className={`mt-3 text-sm ${delta > 0 ? 'text-red-500' : delta < 0 ? 'text-emerald-500' : 'text-faint'}`}>
            {delta > 0 ? `+${delta}` : delta} к прошлому разу {delta > 0 ? '↑' : delta < 0 ? '↓' : ''}
          </p>
        )}

        {/* Sparkline history */}
        {testResults.length >= 2 && (
          <div className="mt-4">
            <Sparkline data={sparkData} width={120} height={32} className="text-accent" />
          </div>
        )}

        {testResults.length === 1 && (
          <p className="mt-4 text-center text-xs text-faint max-w-[240px]">
            Это ваш первый результат. Пройдите тест снова через {test.intervalDays} дней, чтобы отследить динамику.
          </p>
        )}
      </Card>

      {/* Disclaimer */}
      <Card className="mb-4 bg-elevated">
        <p className="text-xs text-muted leading-relaxed">
          Этот опросник — инструмент самонаблюдения, не медицинский тест.
          Результаты не являются диагнозом и не заменяют консультацию специалиста.
          При устойчивом ухудшении состояния обратитесь к психологу или психиатру.
        </p>
        <p className="mt-2 text-xs text-faint">{test.attribution}</p>
      </Card>

      {/* Actions */}
      <div className="mt-auto space-y-2">
        {(level.color === 'orange' || level.color === 'red') && (
          <Button fullWidth variant="secondary" onClick={() => navigate('/techniques', { replace: true })}>
            Изучить техники снижения тревожности
          </Button>
        )}
        <Button fullWidth onClick={() => navigate('/stats', { replace: true })}>
          К статистике
        </Button>
      </div>
    </div>
  );
}
