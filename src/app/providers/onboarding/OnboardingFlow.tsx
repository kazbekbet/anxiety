import { useState } from 'react';
import { Button, Card } from '@/shared/ui';

interface OnboardingFlowProps {
  onComplete: () => void;
}

const STEPS = [
  {
    title: 'Вы не одиноки',
    text: 'Тревожность — одно из самых распространённых состояний. Это приложение поможет вам лучше понять свою тревогу и научиться с ней справляться.',
    icon: (
      <svg className="mx-auto mb-4 text-accent" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
    ),
  },
  {
    title: 'Как это работает',
    text: 'Записывайте уровень тревоги одним касанием. Используйте дыхательные техники и КПТ-упражнения. Отслеживайте прогресс через статистику и тесты.',
    icon: (
      <div className="mx-auto mb-4 flex gap-3 justify-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-lg font-bold">1</div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 text-lg font-bold">5</div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 text-lg font-bold">9</div>
      </div>
    ),
  },
  {
    title: 'Всё приватно',
    text: 'Данные хранятся только на вашем устройстве. Нет аккаунтов, серверов или трекинга. Вы полностью контролируете свою информацию.',
    icon: (
      <svg className="mx-auto mb-4 text-accent" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
  },
];

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(0);
  const isLast = step === STEPS.length - 1;
  const current = STEPS[step];

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-6 pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
      <div className="w-full max-w-sm">
        {/* Progress dots */}
        <div className="mb-8 flex justify-center gap-2">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === step ? 'w-6 bg-accent' : 'w-2 bg-hover'
              }`}
            />
          ))}
        </div>

        <Card className="text-center py-8 animate-fade-in" key={step}>
          {current.icon}
          <h2 className="text-xl font-bold text-fg mb-3">{current.title}</h2>
          <p className="text-sm text-muted leading-relaxed">{current.text}</p>
        </Card>

        <div className="mt-6 space-y-3">
          <Button fullWidth onClick={isLast ? onComplete : () => setStep(step + 1)}>
            {isLast ? 'Начать' : 'Далее'}
          </Button>
          {!isLast && (
            <Button fullWidth variant="ghost" onClick={onComplete}>
              Пропустить
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
