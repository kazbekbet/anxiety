import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Button,
  Center,
  Group,
  Paper,
  RingProgress,
  Stack,
  Text,
  Textarea,
} from '@mantine/core';
import { useWorryTime } from '../model/store';

const DURATION_OPTIONS = [5, 10, 15] as const;

interface WorryTimerProps {
  onClose: () => void;
}

export function WorryTimer({ onClose }: WorryTimerProps) {
  const addSession = useWorryTime((s) => s.addSession);
  const [selectedDuration, setSelectedDuration] = useState<number>(15);
  const [isRunning, setIsRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [text, setText] = useState('');
  const [isFinished, setIsFinished] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const totalSeconds = selectedDuration * 60;

  const cleanup = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => cleanup, [cleanup]);

  const handleStart = () => {
    setSecondsLeft(selectedDuration * 60);
    setIsRunning(true);
    setIsFinished(false);
  };

  useEffect(() => {
    if (!isRunning) return;
    intervalRef.current = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          cleanup();
          setIsRunning(false);
          setIsFinished(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return cleanup;
  }, [isRunning, cleanup]);

  const handleSave = () => {
    if (text.trim()) addSession({ duration: selectedDuration, text: text.trim() });
    onClose();
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const elapsedPct =
    isRunning || isFinished ? (1 - secondsLeft / totalSeconds) * 100 : 0;

  if (!isRunning && !isFinished) {
    return (
      <Stack align="center" gap="md">
        <Text fz="sm" c="dimmed">
          Выберите длительность сессии
        </Text>
        <Group gap="sm">
          {DURATION_OPTIONS.map((d) => (
            <Button
              key={d}
              variant={selectedDuration === d ? 'filled' : 'light'}
              color="brand"
              onClick={() => setSelectedDuration(d)}
            >
              {d} мин
            </Button>
          ))}
        </Group>
        <Button fullWidth color="brand" onClick={handleStart}>
          Начать
        </Button>
      </Stack>
    );
  }

  if (isFinished) {
    return (
      <Stack align="center" gap="md">
        <Paper withBorder radius="lg" p="md" bg="var(--mantine-color-brand-light)" w="100%">
          <Text fz="lg" fw={500} ta="center" c="bright">
            Время вышло. Отпустите беспокойства до завтра.
          </Text>
        </Paper>
        {text.trim() && (
          <Paper withBorder radius="lg" p="sm" w="100%">
            <Text fz="xs" fw={500} c="dimmed" mb={4}>
              Вы записали:
            </Text>
            <Text fz="sm" style={{ whiteSpace: 'pre-wrap' }}>
              {text}
            </Text>
          </Paper>
        )}
        <Button fullWidth color="brand" onClick={handleSave}>
          Сохранить и закрыть
        </Button>
        <Button fullWidth variant="subtle" onClick={onClose}>
          Закрыть без сохранения
        </Button>
      </Stack>
    );
  }

  return (
    <Stack align="center" gap="md">
      <Center>
        <RingProgress
          size={200}
          thickness={8}
          roundCaps
          sections={[{ value: elapsedPct, color: 'brand' }]}
          label={
            <Text ta="center" fz={32} fw={700} style={{ fontVariantNumeric: 'tabular-nums' }}>
              {formatTime(secondsLeft)}
            </Text>
          }
        />
      </Center>
      <Textarea
        value={text}
        onChange={(e) => setText(e.currentTarget.value)}
        placeholder="Запишите свои беспокойства..."
        rows={4}
        autosize={false}
        w="100%"
      />
      <Button
        fullWidth
        variant="subtle"
        onClick={() => {
          cleanup();
          onClose();
        }}
      >
        Отменить
      </Button>
    </Stack>
  );
}
