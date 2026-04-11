import { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/shared/ui';
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
    if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
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
        if (prev <= 1) { cleanup(); setIsRunning(false); setIsFinished(true); return 0; }
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

  const size = 200;
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = isRunning || isFinished ? 1 - secondsLeft / totalSeconds : 0;
  const dashOffset = circumference * (1 - progress);

  if (!isRunning && !isFinished) {
    return (
      <div className="flex flex-col items-center gap-5">
        <p className="text-sm text-muted">Выберите длительность сессии</p>
        <div className="flex gap-3">
          {DURATION_OPTIONS.map((d) => (
            <button
              key={d}
              onClick={() => setSelectedDuration(d)}
              className={`rounded-xl px-5 py-3 text-sm font-medium transition-colors ${
                selectedDuration === d ? 'bg-accent text-white' : 'bg-elevated text-subtle hover:bg-hover'
              }`}
            >
              {d} мин
            </button>
          ))}
        </div>
        <Button fullWidth onClick={handleStart}>Начать</Button>
      </div>
    );
  }

  if (isFinished) {
    return (
      <div className="flex flex-col items-center gap-5">
        <div className="rounded-2xl bg-accent-soft p-6 text-center">
          <p className="text-lg font-medium text-accent-soft-fg">
            Время вышло. Отпустите беспокойства до завтра.
          </p>
        </div>
        {text.trim() && (
          <div className="w-full rounded-xl bg-elevated p-3 text-sm text-subtle">
            <p className="mb-1 text-xs font-medium text-faint">Вы записали:</p>
            <p className="whitespace-pre-wrap">{text}</p>
          </div>
        )}
        <Button fullWidth onClick={handleSave}>Сохранить и закрыть</Button>
        <Button fullWidth variant="ghost" onClick={onClose}>Закрыть без сохранения</Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative">
        <svg width={size} height={size} className="-rotate-90">
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeWidth={strokeWidth} className="text-elevated" />
          <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={dashOffset} className="text-accent transition-[stroke-dashoffset] duration-1000 ease-linear" />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-3xl font-bold tabular-nums text-fg">{formatTime(secondsLeft)}</span>
        </div>
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Запишите свои беспокойства..."
        className="w-full resize-none rounded-xl border border-input-border bg-input p-3 text-sm text-fg placeholder:text-faint focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
        rows={4}
      />
      <Button fullWidth variant="ghost" onClick={() => { cleanup(); onClose(); }}>Отменить</Button>
    </div>
  );
}
