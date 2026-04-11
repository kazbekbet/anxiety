import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/widgets/header';
import { Card, Modal } from '@/shared/ui';
import { techniques, TechniqueCard, useProgression } from '@/entities/technique';
import { useThoughtRecords } from '@/entities/anxiety';
import { ThoughtRecordForm } from '@/features/thought-record';
import { GroundingExercise } from '@/features/grounding';
import { BreathingExercise } from '@/features/breathing';
import { BodyScan } from '@/features/body-scan';
import { TippExercise } from '@/features/tipp';
import { StopSkill } from '@/features/stop-skill';
import { PmrExercise } from '@/features/pmr';
import { CompletionScreen } from '@/widgets/completion-screen';
import { TechniqueSteps } from './TechniqueSteps';
import type { Technique, TechniqueSituation } from '@/shared/types';

type Tab = 'all' | TechniqueSituation;

interface CompletionData {
  elapsedSeconds: number;
  thoughtRecordDiff?: { before: number; after: number };
}

const TABS: { key: Tab; label: string }[] = [
  { key: 'all', label: 'Все' },
  { key: 'panic', label: 'Прямо сейчас' },
  { key: 'rumination', label: 'Крутятся мысли' },
  { key: 'deep-work', label: 'Разобраться' },
];

export function TechniquesPage() {
  const [tab, setTab] = useState<Tab>('all');
  const [activeTechnique, setActiveTechnique] = useState<Technique | null>(null);
  const [completion, setCompletion] = useState<CompletionData | null>(null);
  const addRecord = useThoughtRecords((s) => s.addRecord);
  const { recordUsage, isUnlocked, getUsageCount, manualUnlock } = useProgression();
  const startTimeRef = useRef<number>(0);

  const filtered = tab === 'all' ? techniques : techniques.filter((t) => t.situation === tab);

  const handleStart = (technique: Technique) => {
    startTimeRef.current = Date.now();
    setActiveTechnique(technique);
    setCompletion(null);
  };

  const handleComplete = () => {
    const elapsedSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);
    if (activeTechnique) recordUsage(activeTechnique.id);
    setCompletion({ elapsedSeconds });
  };

  const handleClose = () => {
    setActiveTechnique(null);
    setCompletion(null);
  };

  const renderTechniqueContent = () => {
    if (!activeTechnique) return null;

    if (completion) {
      return (
        <CompletionScreen
          elapsedSeconds={completion.elapsedSeconds}
          thoughtRecordDiff={completion.thoughtRecordDiff}
          onClose={handleClose}
        />
      );
    }

    if (activeTechnique.id === 'thought-record') {
      return (
        <ThoughtRecordForm
          onSubmit={(data) => {
            addRecord(data);
            const elapsedSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);
            setCompletion({
              elapsedSeconds,
              thoughtRecordDiff: { before: data.emotionIntensity, after: data.newEmotionIntensity },
            });
          }}
          onCancel={handleClose}
        />
      );
    }

    if (activeTechnique.id === 'grounding-54321') {
      return <GroundingExercise onComplete={handleComplete} onCancel={handleClose} />;
    }

    if (activeTechnique.id === 'body-scan') {
      return <BodyScan onComplete={() => handleComplete()} onCancel={handleClose} />;
    }

    if (activeTechnique.id === 'tipp') {
      return <TippExercise onComplete={handleComplete} onCancel={handleClose} />;
    }

    if (activeTechnique.id === 'stop-skill') {
      return <StopSkill onComplete={handleComplete} onCancel={handleClose} />;
    }

    if (activeTechnique.id === 'pmr') {
      return <PmrExercise onComplete={handleComplete} onCancel={handleClose} />;
    }

    if (activeTechnique.id === 'box-breathing' || activeTechnique.id === 'breathing-478') {
      return (
        <BreathingExercise
          techniqueId={activeTechnique.id}
          onComplete={(elapsedSeconds) => setCompletion({ elapsedSeconds })}
          onCancel={handleClose}
        />
      );
    }

    return <TechniqueSteps technique={activeTechnique} onComplete={handleComplete} />;
  };

  return (
    <div className="space-y-4">
      <Header title="Техники" subtitle="Выберите, что вы чувствуете" />

      <div className="flex gap-2 overflow-x-auto scrollbar-none -mx-1 px-1">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              tab === t.key ? 'bg-accent text-white' : 'bg-elevated text-subtle hover:bg-hover'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((t) => {
          const uc = t.unlockCondition;
          const unlocked = isUnlocked(t.id, uc?.requiredId, uc?.uses);
          const progress = uc ? { current: getUsageCount(uc.requiredId), required: uc.uses } : undefined;
          return (
            <TechniqueCard
              key={t.id}
              technique={t}
              onStart={handleStart}
              locked={!unlocked}
              unlockProgress={!unlocked ? progress : undefined}
              onManualUnlock={!unlocked ? () => manualUnlock(t.id) : undefined}
            />
          );
        })}
      </div>

      {/* Exposure hierarchy link */}
      {(tab === 'all' || tab === 'deep-work') && (
        <Link to="/exposure" className="block">
          <Card className="flex items-center gap-3 active:scale-[0.98] transition-transform">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent-fg text-lg">
              ↗
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-fg text-sm">Лестница страха</p>
              <p className="text-xs text-muted">Пошаговая экспозиция к тревожным ситуациям</p>
            </div>
          </Card>
        </Link>
      )}

      <Modal
        open={!!activeTechnique}
        onClose={handleClose}
        title={completion ? 'Завершено' : (activeTechnique?.title ?? '')}
      >
        {renderTechniqueContent()}
      </Modal>
    </div>
  );
}
