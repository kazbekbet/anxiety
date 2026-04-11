import { useReducer, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/shared/ui';

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
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
  }, []);

  useEffect(() => { if (finished) onComplete(elapsed); }, [finished, elapsed, onComplete]);

  useEffect(() => {
    if (!running) { cleanup(); return; }
    intervalRef.current = setInterval(() => dispatch({ type: 'tick', pattern }), 1000);
    return cleanup;
  }, [running, pattern, cleanup]);

  useEffect(() => cleanup, [cleanup]);

  const minutes = Math.floor(elapsed / 60);
  const seconds = elapsed % 60;
  const timeStr = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  const remaining = currentPhase.duration - phaseTimer;

  const circleScale =
    currentPhase.phase === 'inhale' ? 0.5 + 0.5 * (phaseTimer / currentPhase.duration)
    : currentPhase.phase === 'exhale' ? 1.0 - 0.5 * (phaseTimer / currentPhase.duration)
    : currentPhase.phase === 'hold' ? 1.0 : 0.5;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between text-sm text-muted">
        <span>Цикл {Math.min(cycle + 1, pattern.totalCycles)} из {pattern.totalCycles}</span>
        <span>{timeStr}</span>
      </div>

      <div className="flex flex-col items-center justify-center py-4">
        <div className="relative flex h-48 w-48 items-center justify-center">
          <div
            className="absolute inset-0 rounded-full bg-accent/20"
            style={{ transform: `scale(${running ? circleScale : 0.5})`, transition: running ? 'transform 1s ease-in-out' : 'none' }}
          />
          <div
            className="absolute rounded-full bg-accent/35"
            style={{ width: '70%', height: '70%', transform: `scale(${running ? circleScale : 0.5})`, transition: running ? 'transform 1s ease-in-out' : 'none' }}
          />
          <div className="relative z-10 text-center">
            {running ? (
              <>
                <div className="text-2xl font-bold text-accent-fg">{remaining}</div>
                <div className="mt-1 text-sm font-medium text-subtle">{currentPhase.label}</div>
              </>
            ) : (
              <div className="text-sm font-medium text-muted">{elapsed > 0 ? 'Пауза' : 'Готовы?'}</div>
            )}
          </div>
        </div>
      </div>

      {running && (
        <div className="flex justify-center gap-2">
          {pattern.phases.map((_, i) => (
            <div key={i} className={`h-2 w-2 rounded-full transition-colors ${i === phaseIndex ? 'bg-accent' : 'bg-hover'}`} />
          ))}
        </div>
      )}

      <div className="flex gap-3">
        <Button type="button" variant="ghost" fullWidth onClick={onCancel}>Отмена</Button>
        <Button type="button" fullWidth onClick={running ? () => dispatch({ type: 'stop' }) : () => dispatch({ type: 'start' })}>
          {running ? 'Стоп' : elapsed > 0 ? 'Заново' : 'Начать'}
        </Button>
      </div>
    </div>
  );
}
