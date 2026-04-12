import { useState } from 'react';
import { Button, Card, StepProgress } from '@/shared/ui';

interface StopStep {
  letter: string;
  title: string;
  instruction: string;
  prompt: string;
}

const STOP_STEPS: StopStep[] = [
  {
    letter: 'S',
    title: 'Стоп',
    instruction: 'Остановитесь. Не действуйте.',
    prompt: 'Замрите на несколько секунд. Не принимайте решений и не реагируйте импульсивно.',
  },
  {
    letter: 'T',
    title: 'Шаг назад',
    instruction: 'Отойдите от ситуации мысленно.',
    prompt: 'Сделайте глубокий вдох. Представьте, что вы наблюдаете за ситуацией со стороны.',
  },
  {
    letter: 'O',
    title: 'Наблюдайте',
    instruction: 'Что вы чувствуете? Где тревога в теле?',
    prompt: 'Отметьте свои мысли, эмоции и телесные ощущения. Просто наблюдайте, не оценивая.',
  },
  {
    letter: 'P',
    title: 'Действуйте осознанно',
    instruction: 'Что будет правильным шагом?',
    prompt: 'Подумайте: какое действие соответствует вашим ценностям и целям прямо сейчас?',
  },
];

interface StopSkillProps {
  onComplete: () => void;
  onCancel: () => void;
}

export function StopSkill({ onComplete, onCancel }: StopSkillProps) {
  const [currentStep, setCurrentStep] = useState(0);

  const step = STOP_STEPS[currentStep];
  const isLast = currentStep === STOP_STEPS.length - 1;

  return (
    <div className="space-y-4">
      <StepProgress total={STOP_STEPS.length} current={currentStep} />

      <div className="flex justify-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent text-white text-4xl font-bold">
          {step.letter}
        </div>
      </div>

      <Card className="bg-accent-soft">
        <div className="text-center space-y-2">
          <h3 className="text-lg font-bold text-fg">{step.title}</h3>
          <p className="text-sm font-medium text-accent-soft-fg">
            {step.instruction}
          </p>
        </div>
      </Card>

      <p className="text-sm text-muted text-center px-2">{step.prompt}</p>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="ghost"
          fullWidth
          onClick={currentStep === 0 ? onCancel : () => setCurrentStep(currentStep - 1)}
        >
          {currentStep === 0 ? 'Отмена' : 'Назад'}
        </Button>
        <Button
          type="button"
          fullWidth
          onClick={isLast ? onComplete : () => setCurrentStep(currentStep + 1)}
        >
          {isLast ? 'Готово' : 'Далее'}
        </Button>
      </div>
    </div>
  );
}
