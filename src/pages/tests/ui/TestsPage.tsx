import { useNavigate } from 'react-router-dom';
import { Header } from '@/widgets/header';
import { Card, Button } from '@/shared/ui';
import { LevelBar } from '@/shared/ui/LevelIndicator';
import { allAssessments, getLevel, useAssessmentResults } from '@/entities/assessment';
import { formatEntryDate } from '@/shared/lib/date';
import { levelColorToNumber, daysSince } from '@/shared/lib/assessment-utils';

export function TestsPage() {
  const results = useAssessmentResults((s) => s.results);
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <Header title="Тесты" subtitle="Стандартизированные опросники" />

      <Card className="bg-elevated">
        <p className="text-xs text-muted leading-relaxed">
          Тесты — инструмент самонаблюдения, не медицинский диагноз.
          Проходите регулярно для отслеживания динамики.
        </p>
      </Card>

      <div className="space-y-3">
        {allAssessments.map((test) => {
          const lastResult = results.find((r) => r.testId === test.id);
          const days = lastResult ? daysSince(lastResult.timestamp) : null;
          const level = lastResult ? getLevel(test, lastResult.score) : null;
          const isDue = days === null || days >= test.intervalDays;

          return (
            <Card key={test.id}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-fg">{test.shortTitle}</h3>
                    <span className="text-xs text-faint">{test.questionCount} вопросов</span>
                  </div>
                  <p className="text-sm text-muted mb-2">{test.description}</p>

                  {lastResult && level ? (
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <div className="flex-1">
                          <LevelBar level={levelColorToNumber(level.color)} />
                        </div>
                        <span className="text-xs font-medium text-subtle">
                          {lastResult.score}/{test.maxScore}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted">{level.label}</span>
                        <span className="text-xs text-faint">
                          {formatEntryDate(lastResult.timestamp)}
                        </span>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>

              <Button
                fullWidth
                variant={isDue ? 'primary' : 'secondary'}
                className="mt-3"
                onClick={() => navigate(`/stats/tests/${test.id}`)}
              >
                {lastResult ? (isDue ? 'Пройти снова' : 'Пройти ещё раз') : 'Пройти тест'}
              </Button>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
