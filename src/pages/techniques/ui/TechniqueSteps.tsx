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
          <div key={i} className={`h-1 flex-1 rounded-full ${i <= currentStep ? 'bg-accent' : 'bg-hover'}`} />
        ))}
      </div>

      <Card className="bg-accent-soft">
        <p className="text-sm text-muted">
          Шаг {currentStep + 1} из {totalSteps}
        </p>
        <p className="mt-2 text-base font-medium text-fg">
          {technique.steps[currentStep]}
        </p>
      </Card>

      <div className="flex gap-3">
        <Button variant="ghost" fullWidth onClick={currentStep === 0 ? onComplete : () => setCurrentStep(currentStep - 1)}>
          {currentStep === 0 ? 'Закрыть' : 'Назад'}
        </Button>
        <Button fullWidth onClick={isLast ? onComplete : () => setCurrentStep(currentStep + 1)}>
          {isLast ? 'Готово' : 'Далее'}
        </Button>
      </div>
    </div>
  );
}
