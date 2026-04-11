import { useState } from 'react';
import { Header } from '@/widgets/header';
import { Modal } from '@/shared/ui';
import { techniques, TechniqueCard } from '@/entities/technique';
import { useThoughtRecords } from '@/entities/anxiety';
import { ThoughtRecordForm } from '@/features/thought-record';
import { GroundingExercise } from '@/features/grounding';
import { TechniqueSteps } from './TechniqueSteps';
import type { Technique } from '@/shared/types';

type Tab = 'all' | 'cbt' | 'existential';

export function TechniquesPage() {
  const [tab, setTab] = useState<Tab>('all');
  const [activeTechnique, setActiveTechnique] = useState<Technique | null>(null);
  const { addRecord } = useThoughtRecords();

  const filtered =
    tab === 'all' ? techniques : techniques.filter((t) => t.category === tab);

  const tabs: { key: Tab; label: string }[] = [
    { key: 'all', label: 'Все' },
    { key: 'cbt', label: 'КПТ' },
    { key: 'existential', label: 'Экзистенциальные' },
  ];

  const handleStart = (technique: Technique) => {
    setActiveTechnique(technique);
  };

  const renderTechniqueContent = () => {
    if (!activeTechnique) return null;

    if (activeTechnique.id === 'thought-record') {
      return (
        <ThoughtRecordForm
          onSubmit={(data) => {
            addRecord(data);
            setActiveTechnique(null);
          }}
          onCancel={() => setActiveTechnique(null)}
        />
      );
    }

    if (activeTechnique.id === 'grounding-54321') {
      return (
        <GroundingExercise
          onComplete={() => setActiveTechnique(null)}
          onCancel={() => setActiveTechnique(null)}
        />
      );
    }

    return (
      <TechniqueSteps
        technique={activeTechnique}
        onComplete={() => setActiveTechnique(null)}
      />
    );
  };

  return (
    <div className="space-y-4">
      <Header title="Техники" subtitle="Инструменты для работы с тревогой" />

      <div className="flex gap-2">
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              tab === t.key
                ? 'bg-indigo-500 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((t) => (
          <TechniqueCard key={t.id} technique={t} onStart={handleStart} />
        ))}
      </div>

      <Modal
        open={!!activeTechnique}
        onClose={() => setActiveTechnique(null)}
        title={activeTechnique?.title ?? ''}
      >
        {renderTechniqueContent()}
      </Modal>
    </div>
  );
}
