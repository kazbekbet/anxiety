import { useReducer, useEffect, useRef, useCallback } from 'react';
import { Box, Button, Center, Group, Stack, Text } from '@mantine/core';

type Phase = 'inhale' | 'hold' | 'exhale' | 'hold2';

interface PhaseConfig {
  phase: Phase;
  label: string;
  duration: number;
}

interface BreathingPattern {
  phases: PhaseConfig[];
  totalCycles: number;
}

const PATTERNS: Record<string, BreathingPattern> = {
  'box-breathing': {
    phases: [
      { phase: 'inhale', label: 'Вдох', duration: 4 },
      { phase: 'hold', label: 'Задержка', duration: 4 },
      { phase: 'exhale', label: 'Выдох', duration: 4 },
      { phase: 'hold2', label: 'Задержка', duration: 4 },
    ],
    totalCycles: 4,
  },
  'breathing-478': {
    phases: [
      { phase: 'inhale', label: 'Вдох', duration: 4 },
      { phase: 'hold', label: 'Задержка', duration: 7 },
      { phase: 'exhale', label: 'Выдох', duration: 8 },
    ],
    totalCycles: 4,
  },
};

interface State {
  running: boolean;
  phaseIndex: number;
  cycle: number;
  phaseTimer: number;
  elapsed: number;
  finished: boolean;
}

type Action =
  | { type: 'start' }
  | { type: 'stop' }
  | { type: 'tick'; pattern: BreathingPattern };

function createInitialState(): State {
  return { running: false, phaseIndex: 0, cycle: 0, phaseTimer: 0, elapsed: 0, finished: false };
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'start':
      return { ...createInitialState(), running: true };
    case 'stop':
      return { ...state, running: false };
    case 'tick': {
      if (!state.running) return state;
      const { pattern } = action;
      const newElapsed = state.elapsed + 1;
      const newPhaseTimer = state.phaseTimer + 1;
      const curPhase = pattern.phases[state.phaseIndex];
      if (newPhaseTimer >= curPhase.duration) {
        const nextPhaseIdx = state.phaseIndex + 1;
        if (nextPhaseIdx >= pattern.phases.length) {
          const nextCycle = state.cycle + 1;
          if (nextCycle >= pattern.totalCycles) {
            return { ...state, running: false, elapsed: newElapsed, phaseTimer: 0, finished: true };
          }
          return { ...state, cycle: nextCycle, phaseIndex: 0, phaseTimer: 0, elapsed: newElapsed, finished: false };
        }
        return { ...state, phaseIndex: nextPhaseIdx, phaseTimer: 0, elapsed: newElapsed, finished: false };
      }
      return { ...state, phaseTimer: newPhaseTimer, elapsed: newElapsed };
    }
  }
}

interface BreathingExerciseProps {
  techniqueId: string;
  onComplete: (elapsedSeconds: number) => void;
  onCancel: () => void;
}

export function BreathingExercise({ techniqueId, onComplete, onCancel }: BreathingExerciseProps) {
  const pattern = PATTERNS[techniqueId];
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { running, phaseIndex, cycle, phaseTimer, elapsed, finished } = state;
  const currentPhase = pattern.phases[phaseIndex];

  const cleanup = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (finished) onComplete(elapsed);
  }, [finished, elapsed, onComplete]);

  useEffect(() => {
    if (!running) {
      cleanup();
      return;
    }
    intervalRef.current = setInterval(() => dispatch({ type: 'tick', pattern }), 1000);
    return cleanup;
  }, [running, pattern, cleanup]);

  useEffect(() => cleanup, [cleanup]);

  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  const timeStr = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const remaining = currentPhase.duration - phaseTimer;

  const circleScale =
    currentPhase.phase === 'inhale'
      ? 0.5 + 0.5 * (phaseTimer / currentPhase.duration)
      : currentPhase.phase === 'exhale'
        ? 1.0 - 0.5 * (phaseTimer / currentPhase.duration)
        : currentPhase.phase === 'hold'
          ? 1.0
          : 0.5;

  return (
    <Stack gap="xl">
      <Group justify="space-between">
        <Text fz="sm" c="dimmed">
          Цикл {Math.min(cycle + 1, pattern.totalCycles)} из {pattern.totalCycles}
        </Text>
        <Text fz="sm" c="dimmed">
          {timeStr}
        </Text>
      </Group>

      <Center py="md">
        <Box pos="relative" w={192} h={192} display="flex" style={{ alignItems: 'center', justifyContent: 'center' }}>
          <Box
            pos="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            style={{
              borderRadius: '50%',
              backgroundColor: 'var(--mantine-color-brand-1)',
              opacity: 0.6,
              transform: `scale(${running ? circleScale : 0.5})`,
              transition: running ? 'transform 1s ease-in-out' : 'none',
            }}
          />
          <Box
            pos="absolute"
            style={{
              width: '70%',
              height: '70%',
              borderRadius: '50%',
              backgroundColor: 'var(--mantine-color-brand-2)',
              opacity: 0.7,
              transform: `scale(${running ? circleScale : 0.5})`,
              transition: running ? 'transform 1s ease-in-out' : 'none',
            }}
          />
          <Box pos="relative" ta="center" style={{ zIndex: 1 }}>
            {running ? (
              <>
                <Text fz={28} fw={700} c="brand.7">
                  {remaining}
                </Text>
                <Text mt={4} fz="sm" fw={500} c="dimmed">
                  {currentPhase.label}
                </Text>
              </>
            ) : (
              <Text fz="sm" fw={500} c="dimmed">
                {elapsed > 0 ? 'Пауза' : 'Готовы?'}
              </Text>
            )}
          </Box>
        </Box>
      </Center>

      {running && (
        <Group justify="center" gap="xs">
          {pattern.phases.map((_, i) => (
            <Box
              key={i}
              w={8}
              h={8}
              style={{
                borderRadius: '50%',
                backgroundColor:
                  i === phaseIndex
                    ? 'var(--mantine-color-brand-5)'
                    : 'var(--mantine-color-gray-3)',
                transition: 'background-color 200ms ease',
              }}
            />
          ))}
        </Group>
      )}

      <Group gap="sm" grow>
        <Button type="button" variant="subtle" onClick={onCancel}>
          Отмена
        </Button>
        <Button
          type="button"
          onClick={running ? () => dispatch({ type: 'stop' }) : () => dispatch({ type: 'start' })}
        >
          {running ? 'Стоп' : elapsed > 0 ? 'Заново' : 'Начать'}
        </Button>
      </Group>
    </Stack>
  );
}
