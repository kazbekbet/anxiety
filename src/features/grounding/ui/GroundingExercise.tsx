import { useState } from 'react';
import {
  Button,
  Group,
  Paper,
  Progress,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';

const STEPS = [
  { sense: 'ВИДИТЕ', count: 5, icon: '👁', color: 'blue' },
  { sense: 'ТРОГАЕТЕ', count: 4, icon: '✋', color: 'teal' },
  { sense: 'СЛЫШИТЕ', count: 3, icon: '👂', color: 'yellow' },
  { sense: 'ЧУВСТВУЕТЕ (запах)', count: 2, icon: '👃', color: 'grape' },
  { sense: 'ОЩУЩАЕТЕ на вкус', count: 1, icon: '👅', color: 'warm' },
] as const;

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
  const progressValue = ((currentStep + 1) / STEPS.length) * 100;

  const updateInput = (index: number, value: string) => {
    const next = [...inputs];
    next[currentStep] = [...next[currentStep]];
    next[currentStep][index] = value;
    setInputs(next);
  };

  return (
    <Stack gap="md">
      <Progress value={progressValue} radius="xl" />

      <Paper withBorder radius="lg" p="md" bg={`${step.color}.0`}>
        <Stack gap="xs" align="center">
          <Text fz={32}>{step.icon}</Text>
          <Title order={3} fz="lg" fw={600} ta="center" c={`${step.color}.8`}>
            Назовите {step.count}{' '}
            {step.count === 1 ? 'вещь' : step.count < 5 ? 'вещи' : 'вещей'}, которые вы{' '}
            {step.sense}
          </Title>
        </Stack>
      </Paper>

      <Stack gap="xs">
        {inputs[currentStep].map((val, i) => (
          <TextInput
            key={i}
            value={val}
            onChange={(e) => updateInput(i, e.currentTarget.value)}
            placeholder={`${i + 1}.`}
            autoFocus={i === 0}
          />
        ))}
      </Stack>

      <Group gap="sm" grow>
        <Button
          type="button"
          variant="subtle"
          onClick={currentStep === 0 ? onCancel : () => setCurrentStep(currentStep - 1)}
        >
          {currentStep === 0 ? 'Отмена' : 'Назад'}
        </Button>
        <Button
          type="button"
          disabled={!hasAtLeastOne}
          onClick={isLast ? onComplete : () => setCurrentStep(currentStep + 1)}
        >
          {isLast ? 'Готово' : 'Далее'}
        </Button>
      </Group>
    </Stack>
  );
}
