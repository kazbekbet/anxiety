import { useState } from 'react';
import { Button, Card, StepProgress, inputClass } from '@/shared/ui';

const STEPS = [
  { sense: 'ВИДИТЕ', count: 5, icon: '👁', color: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300' },
  { sense: 'ТРОГАЕТЕ', count: 4, icon: '✋', color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' },
  { sense: 'СЛЫШИТЕ', count: 3, icon: '👂', color: 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300' },
  { sense: 'ЧУВСТВУЕТЕ (запах)', count: 2, icon: '👃', color: 'bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300' },
  { sense: 'ОЩУЩАЕТЕ на вкус', count: 1, icon: '👅', color: 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300' },
];


interface GroundingExerciseProps {
  onComplete: () => void;
  onCancel: () => void;
}

export function GroundingExercise({ onComplete, onCancel }: GroundingExerciseProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [inputs, setInputs] = useState<string[][]>(STEPS.map((s) => Array(s.count).fill('')));

  const step = STEPS[currentStep];
  const isLast = currentStep === STEPS.length - 1;
  const hasAtLeastOne = inputs[currentStep].some((v) => v.trim().length > 0);

  const updateInput = (index: number, value: string) => {
    const next = [...inputs];
    next[currentStep] = [...next[currentStep]];
    next[currentStep][index] = value;
    setInputs(next);
  };

  return (
    <div className="space-y-4">
      <StepProgress total={STEPS.length} current={currentStep} />

      <Card className={step.color}>
        <div className="text-center">
          <div className="mb-2 text-3xl">{step.icon}</div>
          <h3 className="text-lg font-semibold">
            Назовите {step.count} {step.count === 1 ? 'вещь' : step.count < 5 ? 'вещи' : 'вещей'},
            которые вы {step.sense}
          </h3>
        </div>
      </Card>

      <div className="space-y-2">
        {inputs[currentStep].map((val, i) => (
          <input key={i} value={val} onChange={(e) => updateInput(i, e.target.value)} placeholder={`${i + 1}.`} className={inputClass} autoFocus={i === 0} />
        ))}
      </div>

      <div className="flex gap-3">
        <Button type="button" variant="ghost" fullWidth onClick={currentStep === 0 ? onCancel : () => setCurrentStep(currentStep - 1)}>
          {currentStep === 0 ? 'Отмена' : 'Назад'}
        </Button>
        <Button type="button" fullWidth disabled={!hasAtLeastOne} onClick={isLast ? onComplete : () => setCurrentStep(currentStep + 1)}>
          {isLast ? 'Готово' : 'Далее'}
        </Button>
      </div>
    </div>
  );
}
