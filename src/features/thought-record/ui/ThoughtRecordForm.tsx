import { useState } from 'react';
import { Button } from '@/shared/ui';
import {
  type CognitiveDistortion,
  COGNITIVE_DISTORTION_LABELS,
  type ThoughtRecord,
} from '@/shared/types';
import { getLevelBgColor, getLevelTextColor } from '@/shared/lib/level-colors';

interface ThoughtRecordFormProps {
  onSubmit: (data: Omit<ThoughtRecord, 'id' | 'timestamp'>) => void;
  onCancel: () => void;
}

const ALL_DISTORTIONS = Object.keys(COGNITIVE_DISTORTION_LABELS) as CognitiveDistortion[];

export function ThoughtRecordForm({ onSubmit, onCancel }: ThoughtRecordFormProps) {
  const [step, setStep] = useState(0);
  const [situation, setSituation] = useState('');
  const [automaticThought, setAutomaticThought] = useState('');
  const [emotion, setEmotion] = useState('');
  const [emotionIntensity, setEmotionIntensity] = useState(5);
  const [cognitiveDistortions, setCognitiveDistortions] = useState<CognitiveDistortion[]>([]);
  const [alternativeThought, setAlternativeThought] = useState('');
  const [newEmotionIntensity, setNewEmotionIntensity] = useState(5);

  const toggleDistortion = (d: CognitiveDistortion) => {
    setCognitiveDistortions((prev) =>
      prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d],
    );
  };

  const handleSubmit = () => {
    onSubmit({
      situation,
      automaticThought,
      emotion,
      emotionIntensity,
      cognitiveDistortions,
      alternativeThought,
      newEmotionIntensity,
    });
  };

  const canNext = () => {
    if (step === 0) return situation.trim().length > 0;
    if (step === 1) return automaticThought.trim().length > 0;
    if (step === 2) return emotion.trim().length > 0;
    if (step === 3) return cognitiveDistortions.length > 0;
    if (step === 4) return alternativeThought.trim().length > 0;
    return true;
  };

  const steps = [
    <div key="situation">
      <h3 className="mb-1 font-medium text-slate-900">Шаг 1: Ситуация</h3>
      <p className="mb-3 text-sm text-slate-500">Опишите ситуацию, которая вызвала тревогу</p>
      <textarea
        value={situation}
        onChange={(e) => setSituation(e.target.value)}
        placeholder="Что произошло?"
        rows={3}
        className="w-full resize-none rounded-xl border border-slate-200 p-3 text-sm placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
        autoFocus
      />
    </div>,
    <div key="thought">
      <h3 className="mb-1 font-medium text-slate-900">Шаг 2: Автоматическая мысль</h3>
      <p className="mb-3 text-sm text-slate-500">Какая мысль возникла первой?</p>
      <textarea
        value={automaticThought}
        onChange={(e) => setAutomaticThought(e.target.value)}
        placeholder="Я подумал(а), что..."
        rows={3}
        className="w-full resize-none rounded-xl border border-slate-200 p-3 text-sm placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
        autoFocus
      />
    </div>,
    <div key="emotion">
      <h3 className="mb-1 font-medium text-slate-900">Шаг 3: Эмоция</h3>
      <p className="mb-3 text-sm text-slate-500">Какую эмоцию вы почувствовали?</p>
      <input
        value={emotion}
        onChange={(e) => setEmotion(e.target.value)}
        placeholder="Например: страх, тревога, стыд"
        className="mb-4 w-full rounded-xl border border-slate-200 p-3 text-sm placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
        autoFocus
      />
      <label className="mb-2 block text-sm text-slate-600">Интенсивность</label>
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={1}
          max={10}
          value={emotionIntensity}
          onChange={(e) => setEmotionIntensity(Number(e.target.value))}
          className="flex-1 accent-indigo-500"
        />
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${getLevelBgColor(emotionIntensity)} ${getLevelTextColor(emotionIntensity)}`}
        >
          {emotionIntensity}
        </div>
      </div>
    </div>,
    <div key="distortions">
      <h3 className="mb-1 font-medium text-slate-900">Шаг 4: Когнитивные искажения</h3>
      <p className="mb-3 text-sm text-slate-500">Какие ловушки мышления вы заметили?</p>
      <div className="flex flex-wrap gap-2">
        {ALL_DISTORTIONS.map((d) => (
          <button
            key={d}
            type="button"
            onClick={() => toggleDistortion(d)}
            className={`rounded-full px-3 py-1.5 text-sm transition-colors ${
              cognitiveDistortions.includes(d)
                ? 'bg-indigo-500 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {COGNITIVE_DISTORTION_LABELS[d]}
          </button>
        ))}
      </div>
    </div>,
    <div key="alternative">
      <h3 className="mb-1 font-medium text-slate-900">Шаг 5: Альтернативная мысль</h3>
      <p className="mb-3 text-sm text-slate-500">Как можно переформулировать мысль?</p>
      <textarea
        value={alternativeThought}
        onChange={(e) => setAlternativeThought(e.target.value)}
        placeholder="Более реалистичный взгляд..."
        rows={3}
        className="w-full resize-none rounded-xl border border-slate-200 p-3 text-sm placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
        autoFocus
      />
    </div>,
    <div key="result">
      <h3 className="mb-1 font-medium text-slate-900">Шаг 6: Переоценка</h3>
      <p className="mb-3 text-sm text-slate-500">
        Какова интенсивность эмоции теперь?
      </p>
      <div className="flex items-center gap-3">
        <input
          type="range"
          min={1}
          max={10}
          value={newEmotionIntensity}
          onChange={(e) => setNewEmotionIntensity(Number(e.target.value))}
          className="flex-1 accent-indigo-500"
        />
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full font-bold ${getLevelBgColor(newEmotionIntensity)} ${getLevelTextColor(newEmotionIntensity)}`}
        >
          {newEmotionIntensity}
        </div>
      </div>
      <div className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
        <p>
          Было: <strong>{emotionIntensity}/10</strong> → Стало:{' '}
          <strong>{newEmotionIntensity}/10</strong>
        </p>
      </div>
    </div>,
  ];

  const totalSteps = steps.length;
  const isLast = step === totalSteps - 1;

  return (
    <div className="space-y-4">
      <div className="flex gap-1">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full ${i <= step ? 'bg-indigo-500' : 'bg-slate-200'}`}
          />
        ))}
      </div>

      {steps[step]}

      <div className="flex gap-3">
        <Button
          type="button"
          variant="ghost"
          fullWidth
          onClick={step === 0 ? onCancel : () => setStep(step - 1)}
        >
          {step === 0 ? 'Отмена' : 'Назад'}
        </Button>
        <Button
          type="button"
          fullWidth
          disabled={!canNext()}
          onClick={isLast ? handleSubmit : () => setStep(step + 1)}
        >
          {isLast ? 'Сохранить' : 'Далее'}
        </Button>
      </div>
    </div>
  );
}
