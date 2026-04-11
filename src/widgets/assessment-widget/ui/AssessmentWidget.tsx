import { useNavigate } from 'react-router-dom';
import { Card, Button } from '@/shared/ui';
import { LevelBar } from '@/shared/ui/LevelIndicator';
import { assessments, getLevel } from '@/entities/assessment';
import { useAssessmentResults } from '@/entities/assessment';
import { formatEntryDate } from '@/shared/lib/date';

export function AssessmentWidget() {
  const results = useAssessmentResults((s) => s.results);
  const navigate = useNavigate();

  const now = new Date();
  const testCards = assessments.map((test) => {
    const lastResult = results.find((r) => r.testId === test.id);
    const daysSince = lastResult
      ? Math.floor((now.getTime() - new Date(lastResult.timestamp).getTime()) / 86400000)
      : null;
    const level = lastResult ? getLevel(test, lastResult.score) : null;
    return { test, lastResult, daysSince, level };
  });

  const levelToNumber = (color: string) => {
    if (color === 'emerald') return 2;
    if (color === 'amber') return 4;
    if (color === 'orange') return 7;
    return 9;
  };

  return (
    <Card>
      <h3 className="mb-3 font-semibold text-fg">Психологические тесты</h3>
      <div className="space-y-3">
        {testCards.map(({ test, lastResult, daysSince, level }) => (
          <div key={test.id} className="rounded-xl bg-elevated p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-fg">{test.shortTitle}</span>
              {lastResult ? (
                <span className="text-xs text-faint">
                  {formatEntryDate(lastResult.timestamp)}
                </span>
              ) : (
                <span className="text-xs text-faint">не пройден</span>
              )}
            </div>
            {lastResult && level ? (
              <>
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex-1">
                    <LevelBar level={levelToNumber(level.color)} />
                  </div>
                  <span className="text-xs font-medium text-subtle">
                    {lastResult.score}/{test.maxScore}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted">{level.label}</span>
                  {daysSince !== null && daysSince >= test.intervalDays && (
                    <button
                      onClick={() => navigate(`/stats/tests/${test.id}`)}
                      className="text-xs font-medium text-accent-fg"
                    >
                      Пройти снова
                    </button>
                  )}
                </div>
              </>
            ) : (
              <Button
                variant="secondary"
                fullWidth
                className="mt-1"
                onClick={() => navigate(`/stats/tests/${test.id}`)}
              >
                Пройти тест
              </Button>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
