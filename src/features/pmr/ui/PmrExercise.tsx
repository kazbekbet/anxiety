import { useState, useRef, useEffect, useCallback } from 'react';
import {
  Button,
  Chip,
  Group,
  Paper,
  Progress,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';

interface MuscleGroup {
  id: string;
  label: string;
}

const MUSCLE_GROUPS: MuscleGroup[] = [
  { id: 'hands', label: 'Руки' },
  { id: 'shoulders', label: 'Плечи' },
  { id: 'face', label: 'Лицо' },
  { id: 'neck', label: 'Шея' },
  { id: 'chest', label: 'Грудь' },
  { id: 'stomach', label: 'Живот' },
  { id: 'legs', label: 'Ноги' },
];

type Phase = 'select' | 'rate-before' | 'tense' | 'relax' | 'rate-after' | 'done';

const TENSE_DURATION = 5;
const RELAX_DURATION = 10;

interface PmrExerciseProps {
  onComplete: () => void;
  onCancel: () => void;
}

export function PmrExercise({ onComplete, onCancel }: PmrExerciseProps) {
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>('select');
  const [timeLeft, setTimeLeft] = useState(0);
  const [tensionBefore, setTensionBefore] = useState<Record<string, number>>({});
  const [tensionAfter, setTensionAfter] = useState<Record<string, number>>({});
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const cleanup = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => () => cleanup(), [cleanup]);

  const currentGroup = selectedGroups[currentGroupIndex]
    ? MUSCLE_GROUPS.find((g) => g.id === selectedGroups[currentGroupIndex])
    : null;

  useEffect(() => {
    if (phase !== 'tense' && phase !== 'relax') return;

    const nextPhase: Phase = phase === 'tense' ? 'relax' : 'rate-after';
    const nextDuration = phase === 'tense' ? RELAX_DURATION : 0;

    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          if (nextDuration > 0) {
            queueMicrotask(() => {
              setTimeLeft(nextDuration);
              setPhase(nextPhase);
            });
          } else {
            queueMicrotask(() => setPhase(nextPhase));
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [phase]);

  const startExercise = () => {
    if (selectedGroups.length === 0) return;
    setCurrentGroupIndex(0);
    setPhase('rate-before');
  };

  const handleBeforeRating = (rating: number) => {
    const groupId = selectedGroups[currentGroupIndex];
    setTensionBefore((prev) => ({ ...prev, [groupId]: rating }));
    setTimeLeft(TENSE_DURATION);
    setPhase('tense');
  };

  const handleAfterRating = (rating: number) => {
    const groupId = selectedGroups[currentGroupIndex];
    setTensionAfter((prev) => ({ ...prev, [groupId]: rating }));

    if (currentGroupIndex < selectedGroups.length - 1) {
      setCurrentGroupIndex((prev) => prev + 1);
      setPhase('rate-before');
    } else {
      setPhase('done');
    }
  };

  const renderRatingButtons = (onSelect: (n: number) => void) => (
    <SimpleGrid cols={5} spacing="xs">
      {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
        <Button
          key={n}
          type="button"
          variant="light"
          color="gray"
          size="sm"
          onClick={() => onSelect(n)}
          h={40}
        >
          {n}
        </Button>
      ))}
    </SimpleGrid>
  );

  // --- Selection phase ---
  if (phase === 'select') {
    return (
      <Stack gap="md">
        <Text fz="sm" c="dimmed" ta="center">
          Выберите группы мышц для расслабления
        </Text>

        <Chip.Group multiple value={selectedGroups} onChange={setSelectedGroups}>
          <SimpleGrid cols={2} spacing="xs">
            {MUSCLE_GROUPS.map((group) => (
              <Chip
                key={group.id}
                value={group.id}
                variant="light"
                radius="md"
                size="md"
                styles={{ label: { width: '100%', justifyContent: 'center' } }}
              >
                {group.label}
              </Chip>
            ))}
          </SimpleGrid>
        </Chip.Group>

        <Group gap="sm" grow>
          <Button type="button" variant="subtle" onClick={onCancel}>
            Отмена
          </Button>
          <Button type="button" onClick={startExercise} disabled={selectedGroups.length === 0}>
            Начать ({selectedGroups.length})
          </Button>
        </Group>
      </Stack>
    );
  }

  // --- Done phase ---
  if (phase === 'done') {
    return (
      <Stack gap="md">
        <Title order={3} fz="lg" fw={700} ta="center">
          Результаты
        </Title>

        <Stack gap="xs">
          {selectedGroups.map((groupId) => {
            const group = MUSCLE_GROUPS.find((g) => g.id === groupId);
            const before = tensionBefore[groupId] ?? 0;
            const after = tensionAfter[groupId] ?? 0;
            const diff = before - after;
            return (
              <Paper key={groupId} withBorder radius="lg" p="md">
                <Group justify="space-between">
                  <Text fz="sm" fw={500}>
                    {group?.label}
                  </Text>
                  <Group gap="md">
                    <Text fz="xs" c="dimmed">
                      До: {before}
                    </Text>
                    <Text fz="xs" c="dimmed">
                      После: {after}
                    </Text>
                    {diff > 0 && (
                      <Text fz="xs" fw={500} c="var(--mantine-color-calm-text)">
                        -{diff}
                      </Text>
                    )}
                  </Group>
                </Group>
              </Paper>
            );
          })}
        </Stack>

        <Button type="button" fullWidth onClick={onComplete}>
          Завершить
        </Button>
      </Stack>
    );
  }

  // --- Exercise phases ---
  const progressValue = ((currentGroupIndex + 1) / selectedGroups.length) * 100;

  return (
    <Stack gap="md">
      <Progress value={progressValue} radius="xl" />

      <Text fz="xs" c="dimmed" ta="center">
        Группа {currentGroupIndex + 1} из {selectedGroups.length}
      </Text>

      <Group justify="center">
        <Title order={3} fz="lg" fw={700}>
          {currentGroup?.label}
        </Title>
      </Group>

      {phase === 'rate-before' && (
        <Paper withBorder radius="lg" p="md">
          <Stack gap="sm">
            <Text fz="sm" ta="center" c="dimmed">
              Оцените напряжение в этой зоне (1-10)
            </Text>
            {renderRatingButtons(handleBeforeRating)}
          </Stack>
        </Paper>
      )}

      {phase === 'tense' && (
        <Paper withBorder radius="lg" p="md" bg="var(--mantine-color-brand-light)">
          <Stack gap="sm" align="center">
            <Text
              fz="sm"
              fw={500}
              c="var(--mantine-color-brand-light-color)"
              ta="center"
            >
              Напрягите {currentGroup?.label?.toLowerCase()} на 5 секунд
            </Text>
            <Text
              fz={36}
              fw={700}
              c="var(--mantine-color-brand-light-color)"
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {timeLeft}
            </Text>
            <Text fz="xs" c="dimmed">
              Держите напряжение...
            </Text>
          </Stack>
        </Paper>
      )}

      {phase === 'relax' && (
        <Paper withBorder radius="lg" p="md">
          <Stack gap="sm" align="center">
            <Text fz="sm" fw={500}>
              Расслабьте {currentGroup?.label?.toLowerCase()} на 10 секунд
            </Text>
            <Text
              fz={36}
              fw={700}
              c="var(--mantine-color-brand-text)"
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {timeLeft}
            </Text>
            <Text fz="xs" c="dimmed">
              Почувствуйте разницу...
            </Text>
          </Stack>
        </Paper>
      )}

      {phase === 'rate-after' && (
        <Paper withBorder radius="lg" p="md">
          <Stack gap="sm">
            <Text fz="sm" ta="center" c="dimmed">
              Оцените напряжение после расслабления (1-10)
            </Text>
            {renderRatingButtons(handleAfterRating)}
          </Stack>
        </Paper>
      )}

      <Button type="button" variant="subtle" fullWidth onClick={onCancel}>
        Отмена
      </Button>
    </Stack>
  );
}
