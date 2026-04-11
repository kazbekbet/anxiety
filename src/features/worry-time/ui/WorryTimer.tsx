import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/shared/ui';
import { useWorryTime } from '../model/store';

const DURATION_OPTIONS = [5, 10, 15] as const;

interface WorryTimerProps {
  onClose: () => void;
}

export function WorryTimer({ onClose }: WorryTimerProps) {
  const { addSession } = useWorryTime();
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

  useEffect(() => {
    return cleanup;
  }, [cleanup]);

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
    if (text.trim()) {
      addSession({ duration: selectedDuration, text: text.trim() });
    }
    onClose();
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  // SVG circle properties
  const size = 200;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = isRunning || isFinished ? 1 - secondsLeft / totalSeconds : 0;
  const dashOffset = circumference * (1 - progress);

  // Duration selection
  if (!isRunning && !isFinished) {
    return (
      <div className="flex flex-col items-center gap-5">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Выберите длительность сессии
        </p>
        <div className="flex gap-3">
          {DURATION_OPTIONS.map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDuration(d)}
              className={`rounded-xl px-5 py-3 text-sm font-medium transition-colors ${
                selectedDuration === d
                  ? 'bg-indigo-500 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600'
              }`}
            >
              {d} мин
            </button>
          ))}
        </div>
        <Button fullWidth onClick={handleStart}>
          Начать
        </Button>
      </div>
    );
  }

  // Finished state
  if (isFinished) {
    return (
      <div className="flex flex-col items-center gap-5">
        <div className="rounded-2xl bg-indigo-50 p-6 text-center dark:bg-indigo-950">
          <p className="text-lg font-medium text-indigo-700 dark:text-indigo-300">
            Время вышло. Отпустите беспокойства до завтра.
          </p>
        </div>
        {text.trim() && (
          <div className="w-full rounded-xl bg-slate-50 p-3 text-sm text-slate-600 dark:bg-slate-700 dark:text-slate-300">
            <p className="mb-1 text-xs font-medium text-slate-400">Вы записали:</p>
            <p className="whitespace-pre-wrap">{text}</p>
          </div>
        )}
        <Button fullWidth onClick={handleSave}>
          Сохранить и закрыть
        </Button>
        <Button fullWidth variant="ghost" onClick={onClose}>
          Закрыть без сохранения
        </Button>
      </div>
    );
  }

  // Running state
  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative">
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-slate-100 dark:text-slate-700"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            className="text-indigo-500 transition-[stroke-dashoffset] duration-1000 ease-linear"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-bold tabular-nums text-slate-900 dark:text-slate-50">
            {formatTime(secondsLeft)}
          </span>
        </div>
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Запишите свои беспокойства..."
        className="w-full resize-none rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-50 dark:placeholder:text-slate-500 dark:focus:border-indigo-600 dark:focus:ring-indigo-900"
        rows={4}
      />

      <Button fullWidth variant="ghost" onClick={() => { cleanup(); onClose(); }}>
        Отменить
      </Button>
    </div>
  );
}
