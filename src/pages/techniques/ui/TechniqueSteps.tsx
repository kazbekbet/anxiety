import { useState } from 'react';
import { Button, Group, Paper, Progress, Stack, Text } from '@mantine/core';
import type { Technique } from '@/shared/types';

interface TechniqueStepsProps {
  technique: Technique;
  onComplete: () => void;
}

export function TechniqueSteps({ technique, onComplete }: TechniqueStepsProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = technique.steps.length;
  const isLast = currentStep === totalSteps - 1;
  const progressValue = ((currentStep + 1) / totalSteps) * 100;

  return (
    <Stack gap="md">
      <Progress value={progressValue} radius="xl" />

      <Paper withBorder radius="lg" p="md" bg="brand.0">
        <Text fz="sm" c="dimmed">
          Шаг {currentStep + 1} из {totalSteps}
        </Text>
        <Text mt="xs" fz="md" fw={500}>
          {technique.steps[currentStep]}
        </Text>
      </Paper>

      <Group gap="sm" grow>
        <Button
          variant="subtle"
          onClick={currentStep === 0 ? onComplete : () => setCurrentStep(currentStep - 1)}
        >
          {currentStep === 0 ? 'Закрыть' : 'Назад'}
        </Button>
        <Button onClick={isLast ? onComplete : () => setCurrentStep(currentStep + 1)}>
          {isLast ? 'Готово' : 'Далее'}
        </Button>
      </Group>
    </Stack>
  );
}
