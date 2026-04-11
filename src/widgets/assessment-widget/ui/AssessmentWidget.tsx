import { useNavigate } from 'react-router-dom';
import { Card, Button } from '@/shared/ui';
import { LevelBar } from '@/shared/ui/LevelIndicator';
import { allAssessments, getLevel } from '@/entities/assessment';
import { useAssessmentResults } from '@/entities/assessment';
import { formatEntryDate } from '@/shared/lib/date';
import { levelColorToNumber, daysSince } from '@/shared/lib/assessment-utils';

export function AssessmentWidget() {
  const results = useAssessmentResults((s) => s.results);
  const navigate = useNavigate();

  const testCards = allAssessments.slice(0, 2).map((test) => {
    const lastResult = results.find((r) => r.testId === test.id);
    const days = lastResult ? daysSince(lastResult.timestamp) : null;
    const level = lastResult ? getLevel(test, lastResult.score) : null;
    return { test, lastResult, days, level };
  });

  return (
    <Card>
      <h3 className="mb-3 font-semibold text-fg">Психологические тесты</h3>
      <div className="space-y-3">
        {testCards.map(({ test, lastResult, days, level }) => (
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
                    <LevelBar level={levelColorToNumber(level.color)} />
                  </div>
                  <span className="text-xs font-medium text-subtle">
                    {lastResult.score}/{test.maxScore}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted">{level.label}</span>
                  {days !== null && days >= test.intervalDays && (
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
