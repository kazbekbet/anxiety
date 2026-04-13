import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Avatar,
  Badge,
  Button,
  Group,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';

interface TippCard {
  id: string;
  letter: string;
  title: string;
  instruction: string;
  duration: number;
  icon: string;
}

const TIPP_CARDS: TippCard[] = [
  {
    id: 'temperature',
    letter: 'T',
    title: 'Температура',
    instruction: 'Опустите лицо в холодную воду или приложите лёд к щекам',
    duration: 30,
    icon: '\u2744',
  },
  {
    id: 'intense-exercise',
    letter: 'I',
    title: 'Интенсивная нагрузка',
    instruction: 'Сделайте 20 приседаний или побегайте на месте',
    duration: 60,
    icon: '\u26A1',
  },
  {
    id: 'paced-breathing',
    letter: 'P',
    title: 'Ритмичное дыхание',
    instruction: 'Дышите медленно: вдох 4с, выдох 8с',
    duration: 60,
    icon: '\uD83C\uDF2C',
  },
  {
    id: 'paired-relaxation',
    letter: 'P',
    title: 'Парная релаксация',
    instruction: 'Напрягите всё тело на 5с, затем резко расслабьте',
    duration: 30,
    icon: '\uD83E\uDDD8',
  },
];

interface TippExerciseProps {
  onComplete: () => void;
  onCancel: () => void;
}

export function TippExercise({ onComplete, onCancel }: TippExerciseProps) {
  const [activeCard, setActiveCard] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [completed, setCompleted] = useState<Set<string>>(new Set());
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const cleanup = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => () => cleanup(), [cleanup]);

  const startTimer = (card: TippCard) => {
    cleanup();
    setActiveCard(card.id);
    setTimeLeft(card.duration);

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          cleanup();
          setCompleted((s) => new Set(s).add(card.id));
          setActiveCard(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const stopTimer = () => {
    cleanup();
    setActiveCard(null);
    setTimeLeft(0);
  };

  const allDone = completed.size === TIPP_CARDS.length;

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  return (
    <Stack gap="md">
      <Text fz="sm" c="dimmed" ta="center">
        Выполните упражнения TIPP для быстрого снижения интенсивных эмоций
      </Text>

      <Stack gap="sm">
        {TIPP_CARDS.map((card) => {
          const isActive = activeCard === card.id;
          const isDone = completed.has(card.id);

          return (
            <Paper
              key={card.id}
              withBorder
              radius="lg"
              p="md"
              style={{
                opacity: isDone ? 0.6 : 1,
                borderColor: isActive ? 'var(--mantine-color-brand-5)' : undefined,
                borderWidth: isActive ? 2 : undefined,
                transition: 'all 200ms ease',
              }}
            >
              <Group gap="sm" align="flex-start" wrap="nowrap">
                <ThemeIcon color="brand" variant="light" radius="md" size={48}>
                  <Text fz="lg">{card.icon}</Text>
                </ThemeIcon>
                <Stack gap={4} style={{ flex: 1, minWidth: 0 }}>
                  <Group gap="xs" align="center">
                    <Avatar color="brand" radius="xl" size={24}>
                      <Text fz="xs" fw={700} c="white">
                        {card.letter}
                      </Text>
                    </Avatar>
                    <Title order={3} fz="sm" fw={600}>
                      {card.title}
                    </Title>
                    {isDone && (
                      <Badge color="calm" variant="light" size="sm">
                        ✓
                      </Badge>
                    )}
                  </Group>
                  <Text fz="xs" c="dimmed">
                    {card.instruction}
                  </Text>

                  {isActive ? (
                    <Group gap="sm" mt="xs" align="center">
                      <Text fz="xl" fw={700} c="brand.7" style={{ fontVariantNumeric: 'tabular-nums' }}>
                        {formatTime(timeLeft)}
                      </Text>
                      <Button
                        type="button"
                        variant="subtle"
                        size="xs"
                        onClick={stopTimer}
                      >
                        Стоп
                      </Button>
                    </Group>
                  ) : (
                    <Button
                      type="button"
                      variant="light"
                      size="xs"
                      mt="xs"
                      w="fit-content"
                      onClick={() => startTimer(card)}
                      disabled={!!activeCard || isDone}
                    >
                      {isDone ? 'Выполнено' : `Начать (${card.duration}с)`}
                    </Button>
                  )}
                </Stack>
              </Group>
            </Paper>
          );
        })}
      </Stack>

      <Group gap="sm" grow>
        <Button type="button" variant="subtle" onClick={onCancel}>
          Отмена
        </Button>
        <Button
          type="button"
          onClick={onComplete}
          disabled={!allDone && completed.size === 0}
        >
          {allDone ? 'Завершить' : `Готово (${completed.size}/${TIPP_CARDS.length})`}
        </Button>
      </Group>
    </Stack>
  );
}
