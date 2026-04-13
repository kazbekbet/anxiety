import { useState } from 'react';
import { Box, Button, Center, Group, Paper, Stack, Text, ThemeIcon, Title } from '@mantine/core';

interface OnboardingFlowProps {
  onComplete: () => void;
}

function HeartIcon() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function ScaleBubbles() {
  return (
    <Group justify="center" gap="xs">
      <ThemeIcon radius="lg" size={48} color="calm" variant="light">
        <Text fw={700}>1</Text>
      </ThemeIcon>
      <ThemeIcon radius="lg" size={48} color="yellow" variant="light">
        <Text fw={700}>5</Text>
      </ThemeIcon>
      <ThemeIcon radius="lg" size={48} color="warm" variant="light">
        <Text fw={700}>9</Text>
      </ThemeIcon>
    </Group>
  );
}

const STEPS = [
  {
    title: 'Вы не одиноки',
    text: 'Тревожность — одно из самых распространённых состояний. Это приложение поможет вам лучше понять свою тревогу и научиться с ней справляться.',
    icon: (
      <ThemeIcon variant="light" size={80} radius="xl" color="brand">
        <HeartIcon />
      </ThemeIcon>
    ),
  },
  {
    title: 'Как это работает',
    text: 'Записывайте уровень тревоги одним касанием. Используйте дыхательные техники и КПТ-упражнения. Отслеживайте прогресс через статистику и тесты.',
    icon: <ScaleBubbles />,
  },
  {
    title: 'Всё приватно',
    text: 'Данные хранятся только на вашем устройстве. Нет аккаунтов, серверов или трекинга. Вы полностью контролируете свою информацию.',
    icon: (
      <ThemeIcon variant="light" size={80} radius="xl" color="brand">
        <LockIcon />
      </ThemeIcon>
    ),
  },
];

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
  const [step, setStep] = useState(0);
  const isLast = step === STEPS.length - 1;
  const current = STEPS[step];

  return (
    <Center
      mih="100vh"
      px="lg"
      bg="var(--mantine-color-body)"
      style={{
        paddingTop: 'env(safe-area-inset-top)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <Box w="100%" maw={380}>
        <Group justify="center" gap={6} mb="xl">
          {STEPS.map((_, i) => (
            <Box
              key={i}
              h={8}
              w={i === step ? 24 : 8}
              bg={i === step ? 'brand.5' : 'var(--mantine-color-default-hover)'}
              style={{ borderRadius: 999, transition: 'all 300ms ease' }}
            />
          ))}
        </Group>

        <Paper withBorder radius="lg" p="xl" ta="center" key={step}>
          <Stack gap="md" align="center">
            {current.icon}
            <Title order={2} fz="xl" fw={700}>
              {current.title}
            </Title>
            <Text fz="sm" c="dimmed">
              {current.text}
            </Text>
          </Stack>
        </Paper>

        <Stack gap="xs" mt="lg">
          <Button fullWidth size="md" onClick={isLast ? onComplete : () => setStep(step + 1)}>
            {isLast ? 'Начать' : 'Далее'}
          </Button>
          {!isLast && (
            <Button fullWidth variant="subtle" onClick={onComplete}>
              Пропустить
            </Button>
          )}
        </Stack>
      </Box>
    </Center>
  );
}
