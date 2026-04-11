import { useState } from 'react';
import { Button, StepProgress, inputClass } from '@/shared/ui';
import { VALUE_OPTIONS } from '../model/data';
import { useValuesStore } from '../model/store';

interface ValuesDiaryFormProps {
  onComplete: () => void;
  onCancel: () => void;
}

export function ValuesDiaryForm({ onComplete, onCancel }: ValuesDiaryFormProps) {
  const addEntry = useValuesStore((s) => s.addEntry);
  const [step, setStep] = useState(0);
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [action, setAction] = useState('');

  const toggleValue = (id: string) => {
    setSelectedValues((prev) =>
      prev.includes(id) ? prev.filter((v) => v !== id) : prev.length < 5 ? [...prev, id] : prev,
    );
  };

  const handleSubmit = () => {
    addEntry({
      values: selectedValues.map((v) => ({ valueId: v, score: scores[v] ?? 5 })),
      action: action.trim(),
    });
    onComplete();
  };

  const canNext = step === 0 ? selectedValues.length >= 1 : step === 1 ? true : action.trim().length > 0;

  const steps = [
    // Step 1: Choose values
    <div key="values">
      <h3 className="mb-1 font-medium text-fg">Что для вас действительно важно?</h3>
      <p className="mb-4 text-sm text-muted">Выберите до 5 ценностей</p>
      <div className="grid grid-cols-2 gap-2">
        {VALUE_OPTIONS.map((v) => (
          <button
            key={v.id}
            onClick={() => toggleValue(v.id)}
            className={`flex items-center gap-2 rounded-xl px-3 py-3 text-left text-sm transition-all ${
              selectedValues.includes(v.id)
                ? 'bg-accent-soft border-2 border-accent text-accent-soft-fg'
                : 'bg-elevated text-subtle border-2 border-transparent'
            }`}
          >
            <span className="text-lg">{v.icon}</span>
            <span className="font-medium">{v.label}</span>
          </button>
        ))}
      </div>
    </div>,

    // Step 2: Rate alignment
    <div key="scores">
      <h3 className="mb-1 font-medium text-fg">Насколько вы живёте в согласии?</h3>
      <p className="mb-4 text-sm text-muted">Оцените каждую ценность</p>
      <div className="space-y-4">
        {selectedValues.map((id) => {
          const v = VALUE_OPTIONS.find((o) => o.id === id);
          if (!v) return null;
          return (
            <div key={id}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-fg">{v.icon} {v.label}</span>
                <span className="text-sm font-bold text-accent-fg">{scores[id] ?? 5}/10</span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                value={scores[id] ?? 5}
                onChange={(e) => setScores({ ...scores, [id]: Number(e.target.value) })}
                className="w-full accent-indigo-500"
              />
            </div>
          );
        })}
      </div>
    </div>,

    // Step 3: Action
    <div key="action">
      <h3 className="mb-1 font-medium text-fg">Одно действие на эту неделю</h3>
      <p className="mb-4 text-sm text-muted">Что вы можете сделать в согласии с вашими ценностями?</p>
      <textarea
        value={action}
        onChange={(e) => setAction(e.target.value)}
        placeholder="Например: позвонить маме, прогуляться в парке, написать в дневник..."
        rows={3}
        className={inputClass}
        autoFocus
      />
      {selectedValues.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {selectedValues.map((id) => {
            const v = VALUE_OPTIONS.find((o) => o.id === id);
            return v ? (
              <span key={id} className="rounded-full bg-accent-soft px-2 py-0.5 text-xs text-accent-fg">
                {v.icon} {v.label}
              </span>
            ) : null;
          })}
        </div>
      )}
    </div>,
  ];

  return (
    <div className="space-y-4">
      <StepProgress total={3} current={step} />
      {steps[step]}
      <div className="flex gap-3">
        <Button variant="ghost" fullWidth onClick={step === 0 ? onCancel : () => setStep(step - 1)}>
          {step === 0 ? 'Отмена' : 'Назад'}
        </Button>
        <Button fullWidth disabled={!canNext} onClick={step === 2 ? handleSubmit : () => setStep(step + 1)}>
          {step === 2 ? 'Сохранить' : 'Далее'}
        </Button>
      </div>
    </div>
  );
}
