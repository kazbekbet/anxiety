import { useState } from 'react';
import { Button, Card } from '@/shared/ui';
import type { Technique } from '@/shared/types';

interface TechniqueStepsProps {
  technique: Technique;
  onComplete: () => void;
}

export function TechniqueSteps({ technique, onComplete }: TechniqueStepsProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = technique.steps.length;
  const isLast = currentStep === totalSteps - 1;

  return (
    <div className="space-y-4">
      <div className="flex gap-1">
        {technique.steps.map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full ${i <= currentStep ? 'bg-indigo-500' : 'bg-slate-200 dark:bg-slate-600'}`}
          />
        ))}
      </div>

      <Card className="bg-indigo-50 dark:bg-indigo-950">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Шаг {currentStep + 1} из {totalSteps}
        </p>
        <p className="mt-2 text-base font-medium text-slate-800 dark:text-slate-200">
          {technique.steps[currentStep]}
        </p>
      </Card>

      <div className="flex gap-3">
        <Button
          variant="ghost"
          fullWidth
          onClick={currentStep === 0 ? onComplete : () => setCurrentStep(currentStep - 1)}
        >
          {currentStep === 0 ? 'Закрыть' : 'Назад'}
        </Button>
        <Button
          fullWidth
          onClick={isLast ? onComplete : () => setCurrentStep(currentStep + 1)}
        >
          {isLast ? 'Готово' : 'Далее'}
        </Button>
      </div>
    </div>
  );
}
