import { useState, useRef, useEffect, useCallback } from 'react';
import { Button, Card } from '@/shared/ui';

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
    <div className="space-y-4">
      <p className="text-sm text-muted text-center">
        Выполните упражнения TIPP для быстрого снижения интенсивных эмоций
      </p>

      <div className="space-y-3">
        {TIPP_CARDS.map((card) => {
          const isActive = activeCard === card.id;
          const isDone = completed.has(card.id);

          return (
            <Card
              key={card.id}
              className={`transition-all ${
                isActive
                  ? 'ring-2 ring-accent'
                  : isDone
                    ? 'opacity-60'
                    : ''
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-xl">
                  {card.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-accent text-white text-xs font-bold">
                      {card.letter}
                    </span>
                    <h3 className="font-semibold text-fg text-sm">
                      {card.title}
                    </h3>
                    {isDone && (
                      <span className="text-xs text-accent-soft-fg">\u2713</span>
                    )}
                  </div>
                  <p className="text-xs text-muted mt-1">{card.instruction}</p>

                  {isActive ? (
                    <div className="mt-3 flex items-center gap-3">
                      <div className="text-2xl font-bold text-accent-fg tabular-nums">
                        {formatTime(timeLeft)}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        className="text-xs px-3 py-1"
                        onClick={stopTimer}
                      >
                        Стоп
                      </Button>
                    </div>
                  ) : (
                    <Button
                      type="button"
                      variant="secondary"
                      className="mt-2 text-xs px-3 py-1.5"
                      onClick={() => startTimer(card)}
                      disabled={!!activeCard || isDone}
                    >
                      {isDone ? 'Выполнено' : `Начать (${card.duration}с)`}
                    </Button>
                  )}
                </div>
              </div>
            </Card>
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
          onClick={onComplete}
          disabled={!allDone && completed.size === 0}
        >
          {allDone ? 'Завершить' : `Готово (${completed.size}/${TIPP_CARDS.length})`}
        </Button>
      </div>
    </div>
  );
}
