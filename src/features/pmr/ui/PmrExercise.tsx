import { useState, useRef, useEffect, useCallback } from 'react';
import { Button, Card, StepProgress } from '@/shared/ui';

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

  // Effect-driven timer: starts interval when phase is tense or relax.
  // timeLeft is already set before entering these phases.
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
          // Set duration for next timed phase before transitioning
          if (nextDuration > 0) {
            // We need a microtask to batch the state updates properly
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

  const toggleGroup = (id: string) => {
    setSelectedGroups((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id],
    );
  };

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
    <div className="grid grid-cols-5 gap-2">
      {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onSelect(n)}
          className="flex h-10 w-full items-center justify-center rounded-xl bg-elevated text-fg font-medium text-sm hover:bg-hover transition-colors"
        >
          {n}
        </button>
      ))}
    </div>
  );

  // --- Selection phase ---
  if (phase === 'select') {
    return (
      <div className="space-y-4">
        <p className="text-sm text-muted text-center">
          Выберите группы мышц для расслабления
        </p>

        <div className="grid grid-cols-2 gap-2">
          {MUSCLE_GROUPS.map((group) => {
            const isSelected = selectedGroups.includes(group.id);
            return (
              <button
                key={group.id}
                type="button"
                onClick={() => toggleGroup(group.id)}
                className={`rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  isSelected
                    ? 'bg-accent text-white'
                    : 'bg-elevated text-subtle hover:bg-hover'
                }`}
              >
                {group.label}
              </button>
            );
          })}
        </div>

        <div className="flex gap-3">
          <Button type="button" variant="ghost" fullWidth onClick={onCancel}>
            Отмена
          </Button>
          <Button
            type="button"
            fullWidth
            onClick={startExercise}
            disabled={selectedGroups.length === 0}
          >
            Начать ({selectedGroups.length})
          </Button>
        </div>
      </div>
    );
  }

  // --- Done phase ---
  if (phase === 'done') {
    return (
      <div className="space-y-4">
        <h3 className="text-center text-lg font-bold text-fg">Результаты</h3>

        <div className="space-y-2">
          {selectedGroups.map((groupId) => {
            const group = MUSCLE_GROUPS.find((g) => g.id === groupId);
            const before = tensionBefore[groupId] ?? 0;
            const after = tensionAfter[groupId] ?? 0;
            const diff = before - after;
            return (
              <Card key={groupId}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-fg">
                    {group?.label}
                  </span>
                  <div className="flex items-center gap-3 text-xs">
                    <span className="text-muted">До: {before}</span>
                    <span className="text-muted">После: {after}</span>
                    {diff > 0 && (
                      <span className="text-accent-soft-fg font-medium">
                        -{diff}
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <Button type="button" fullWidth onClick={onComplete}>
          Завершить
        </Button>
      </div>
    );
  }

  // --- Exercise phases ---
  return (
    <div className="space-y-4">
      <StepProgress total={selectedGroups.length} current={currentGroupIndex} />

      <p className="text-xs text-muted text-center">
        Группа {currentGroupIndex + 1} из {selectedGroups.length}
      </p>

      <div className="flex justify-center">
        <div className="text-center">
          <h3 className="text-lg font-bold text-fg">{currentGroup?.label}</h3>
        </div>
      </div>

      {phase === 'rate-before' && (
        <Card>
          <div className="space-y-3">
            <p className="text-sm text-center text-muted">
              Оцените напряжение в этой зоне (1-10)
            </p>
            {renderRatingButtons(handleBeforeRating)}
          </div>
        </Card>
      )}

      {phase === 'tense' && (
        <Card className="bg-accent-soft">
          <div className="text-center space-y-3">
            <p className="text-sm font-medium text-accent-soft-fg">
              Напрягите {currentGroup?.label?.toLowerCase()} на 5 секунд
            </p>
            <div className="text-4xl font-bold text-accent-fg tabular-nums">
              {timeLeft}
            </div>
            <p className="text-xs text-muted">Держите напряжение...</p>
          </div>
        </Card>
      )}

      {phase === 'relax' && (
        <Card>
          <div className="text-center space-y-3">
            <p className="text-sm font-medium text-fg">
              Расслабьте {currentGroup?.label?.toLowerCase()} на 10 секунд
            </p>
            <div className="text-4xl font-bold text-accent-fg tabular-nums">
              {timeLeft}
            </div>
            <p className="text-xs text-muted">Почувствуйте разницу...</p>
          </div>
        </Card>
      )}

      {phase === 'rate-after' && (
        <Card>
          <div className="space-y-3">
            <p className="text-sm text-center text-muted">
              Оцените напряжение после расслабления (1-10)
            </p>
            {renderRatingButtons(handleAfterRating)}
          </div>
        </Card>
      )}

      <Button type="button" variant="ghost" fullWidth onClick={onCancel}>
        Отмена
      </Button>
    </div>
  );
}
