import { useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, StepProgress } from '@/shared/ui';
import { getTestById, getLevel } from '@/entities/assessment';
import { useAssessmentResults } from '@/entities/assessment';

const CRISIS_PHONE = '8-800-2000-122';

export function AssessmentPage() {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  const addResult = useAssessmentResults((s) => s.addResult);
  const test = getTestById(testId ?? '');

  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    () => new Array(test?.questionCount ?? 0).fill(null),
  );
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showCrisis, setShowCrisis] = useState(false);

  const submitResults = useCallback(
    (finalAnswers: (number | null)[]) => {
      if (!test) return;
      const numericAnswers = finalAnswers.map((a) => a ?? 0);
      const score = numericAnswers.reduce((sum, a) => sum + a, 0);
      const level = getLevel(test, score);
      addResult({
        testId: test.id,
        score,
        answers: numericAnswers,
        levelLabel: level.label,
        levelColor: level.color,
      });
      navigate(`/stats/tests/${test.id}/result`, { replace: true });
    },
    [test, addResult, navigate],
  );

  const handleSelect = useCallback(
    (value: number) => {
      if (!test) return;
      const next = [...answers];
      next[step] = value;
      setAnswers(next);

      if (test.hasCrisisQuestion && step === test.hasCrisisQuestion.questionIndex && value > 0) {
        setShowCrisis(true);
        return;
      }

      setTimeout(() => {
        if (step < test.questionCount - 1) {
          setStep(step + 1);
        } else {
          submitResults(next);
        }
      }, 300);
    },
    [test, step, answers, submitResults],
  );

  if (!test) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted">Тест не найден</p>
      </div>
    );
  }

  const question = test.questions[step];
  const selected = answers[step];
  const isLast = step === test.questionCount - 1;
  const hasAnswered = answers.filter((a) => a !== null).length;

  // Crisis contact screen
  if (showCrisis) {
    return (
      <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-4 pt-[env(safe-area-inset-top)]">
        <Card className="w-full text-center">
          <h2 className="text-lg font-semibold text-fg mb-3">Вы не одиноки</h2>
          <p className="text-sm text-muted mb-4">
            Если у вас есть мысли о причинении себе вреда, пожалуйста, обратитесь за помощью.
          </p>
          <a
            href={`tel:${CRISIS_PHONE}`}
            className="mb-4 flex items-center justify-center gap-2 rounded-xl bg-accent py-4 text-lg font-semibold text-white"
          >
            Телефон доверия: {CRISIS_PHONE}
          </a>
          <p className="text-xs text-faint mb-4">Бесплатно, анонимно, круглосуточно</p>
          <Button
            fullWidth
            variant="secondary"
            onClick={() => {
              setShowCrisis(false);
              if (isLast) {
                submitResults(answers);
              } else {
                setTimeout(() => setStep(step + 1), 100);
              }
            }}
          >
            Продолжить тест
          </Button>
        </Card>
      </div>
    );
  }

  // Exit confirmation
  if (showExitConfirm) {
    return (
      <div className="mx-auto flex min-h-screen max-w-lg flex-col items-center justify-center px-4 pt-[env(safe-area-inset-top)]">
        <Card className="w-full">
          <h2 className="text-lg font-semibold text-fg mb-2">Прервать тест?</h2>
          <p className="text-sm text-muted mb-5">
            Прогресс не сохранится. Вы ответили на {hasAnswered} из {test.questionCount} вопросов.
          </p>
          <div className="space-y-2">
            <Button fullWidth onClick={() => setShowExitConfirm(false)}>
              Продолжить тест
            </Button>
            <Button fullWidth variant="ghost" onClick={() => navigate('/stats', { replace: true })}>
              Выйти
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col px-4 pb-6 pt-[max(1.5rem,env(safe-area-inset-top))]">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <button onClick={() => setShowExitConfirm(true)} className="text-sm text-faint hover:text-subtle">
          ← Выйти
        </button>
        <span className="text-sm text-muted">
          Вопрос {step + 1} из {test.questionCount}
        </span>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <StepProgress total={test.questionCount} current={step} />
      </div>

      {/* Preamble */}
      <p className="mb-2 text-xs text-faint">{test.preamble}</p>

      {/* Question */}
      <h2 className="mb-6 text-lg font-semibold text-fg leading-snug">{question.text}</h2>

      {/* Options */}
      <div className="flex-1 space-y-3">
        {question.options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => handleSelect(opt.value)}
            className={`w-full rounded-2xl px-4 py-4 text-left text-sm font-medium transition-all ${
              selected === opt.value
                ? 'bg-accent-soft border-2 border-accent text-accent-soft-fg scale-[0.98]'
                : 'bg-elevated text-subtle border-2 border-transparent active:scale-[0.98]'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Navigation */}
      <div className="mt-6 flex gap-3">
        {step > 0 && (
          <Button variant="ghost" fullWidth onClick={() => setStep(step - 1)}>
            Назад
          </Button>
        )}
        <Button
          fullWidth
          disabled={selected === null}
          onClick={() => {
            if (isLast) submitResults(answers);
            else setStep(step + 1);
          }}
        >
          {isLast ? 'Завершить' : 'Далее'}
        </Button>
      </div>
    </div>
  );
}
