import { useState } from 'react';
import {
  Avatar,
  Button,
  Group,
  Paper,
  Progress,
  Stack,
  Text,
  Title,
} from '@mantine/core';

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
  const progressValue = ((currentStep + 1) / STOP_STEPS.length) * 100;

  return (
    <Stack gap="md">
      <Progress value={progressValue} radius="xl" />

      <Group justify="center">
        <Avatar color="brand" radius="xl" size={80}>
          <Text fz={32} fw={700} c="white">
            {step.letter}
          </Text>
        </Avatar>
      </Group>

      <Paper withBorder radius="lg" p="md" bg="brand.0">
        <Stack gap="xs" align="center">
          <Title order={3} fz="lg" fw={700}>
            {step.title}
          </Title>
          <Text fz="sm" fw={500} c="brand.7" ta="center">
            {step.instruction}
          </Text>
        </Stack>
      </Paper>

      <Text fz="sm" c="dimmed" ta="center" px="xs">
        {step.prompt}
      </Text>

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
          onClick={isLast ? onComplete : () => setCurrentStep(currentStep + 1)}
        >
          {isLast ? 'Готово' : 'Далее'}
        </Button>
      </Group>
    </Stack>
  );
}
