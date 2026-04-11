import { useState } from 'react';
import { Button, ChipGroup, inputClass } from '@/shared/ui';
import { getLevelTextColor, getLevelBgColor } from '@/shared/lib/level-colors';
import { getFromStorage, saveToStorage } from '@/shared/lib/storage';

const DEFAULT_TRIGGERS = [
  'Работа',
  'Учёба',
  'Отношения',
  'Здоровье',
  'Финансы',
  'Социальные ситуации',
  'Неопределённость',
  'Сон',
];

const CUSTOM_TRIGGERS_KEY = 'custom-triggers';

interface LogAnxietyFormProps {
  onSubmit: (data: { level: number; note: string; triggers: string[] }) => void;
  onCancel: () => void;
}

export function LogAnxietyForm({ onSubmit, onCancel }: LogAnxietyFormProps) {
  const [level, setLevel] = useState(5);
  const [note, setNote] = useState('');
  const [triggers, setTriggers] = useState<string[]>([]);
  const [customTriggers, setCustomTriggers] = useState<string[]>(
    () => getFromStorage<string[]>(CUSTOM_TRIGGERS_KEY, []),
  );
  const [newTrigger, setNewTrigger] = useState('');

  const allTriggers = [...DEFAULT_TRIGGERS, ...customTriggers];

  const toggleTrigger = (t: string) => {
    setTriggers((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  };

  const addCustomTrigger = () => {
    const trimmed = newTrigger.trim();
    if (!trimmed || allTriggers.includes(trimmed)) return;
    const updated = [...customTriggers, trimmed];
    setCustomTriggers(updated);
    saveToStorage(CUSTOM_TRIGGERS_KEY, updated);
    setTriggers((prev) => [...prev, trimmed]);
    setNewTrigger('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ level, note, triggers });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="mb-2 block text-sm font-medium text-subtle">
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
        <div className="mt-1 flex justify-between text-xs text-faint">
          <span>Спокойствие</span>
          <span>Паника</span>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-subtle">Триггеры</label>
        <ChipGroup options={allTriggers} selected={triggers} onToggle={toggleTrigger} />
        <div className="mt-2 flex gap-2">
          <input
            value={newTrigger}
            onChange={(e) => setNewTrigger(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustomTrigger(); } }}
            placeholder="Свой триггер..."
            className={`${inputClass} !py-2 text-xs`}
          />
          <Button type="button" variant="secondary" className="shrink-0 !py-2 !px-3 text-xs" onClick={addCustomTrigger}>
            +
          </Button>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-subtle">Заметка</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Что вы чувствуете?"
          rows={3}
          className={inputClass}
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
