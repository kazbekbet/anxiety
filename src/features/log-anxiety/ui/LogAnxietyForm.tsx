import { useState } from 'react';
import { Button } from '@/shared/ui';
import { getLevelTextColor, getLevelBgColor } from '@/shared/lib/level-colors';

const TRIGGER_OPTIONS = [
  'Работа',
  'Учёба',
  'Отношения',
  'Здоровье',
  'Финансы',
  'Социальные ситуации',
  'Неопределённость',
  'Сон',
];

interface LogAnxietyFormProps {
  onSubmit: (data: { level: number; note: string; triggers: string[] }) => void;
  onCancel: () => void;
}

export function LogAnxietyForm({ onSubmit, onCancel }: LogAnxietyFormProps) {
  const [level, setLevel] = useState(5);
  const [note, setNote] = useState('');
  const [triggers, setTriggers] = useState<string[]>([]);

  const toggleTrigger = (t: string) => {
    setTriggers((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ level, note, triggers });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">
          Уровень тревожности
        </label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min={1}
            max={10}
            value={level}
            onChange={(e) => setLevel(Number(e.target.value))}
            className="flex-1 accent-indigo-500"
          />
          <div
            className={`flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold ${getLevelBgColor(level)} ${getLevelTextColor(level)}`}
          >
            {level}
          </div>
        </div>
        <div className="mt-1 flex justify-between text-xs text-slate-400">
          <span>Спокойствие</span>
          <span>Паника</span>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Триггеры</label>
        <div className="flex flex-wrap gap-2">
          {TRIGGER_OPTIONS.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => toggleTrigger(t)}
              className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
                triggers.includes(t)
                  ? 'bg-indigo-500 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700">Заметка</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Что вы чувствуете?"
          rows={3}
          className="w-full resize-none rounded-xl border border-slate-200 p-3 text-sm placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
        />
      </div>

      <div className="flex gap-3">
        <Button type="button" variant="ghost" fullWidth onClick={onCancel}>
          Отмена
        </Button>
        <Button type="submit" fullWidth>
          Сохранить
        </Button>
      </div>
    </form>
  );
}
