import { useRef, useState, useMemo } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { techniques, useProgression } from '@/entities/technique';
import { BreathingExercise } from '@/features/breathing';
import { GroundingExercise } from '@/features/grounding';
import { BodyScan } from '@/features/body-scan';
import { TippExercise } from '@/features/tipp';
import { PmrExercise } from '@/features/pmr';
import { CompletionScreen } from '@/widgets/completion-screen';
import { TechniquePageLayout } from './TechniquePageLayout';

interface CompletionData {
  elapsedSeconds: number;
}

export function TechniquePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { recordUsage } = useProgression();
  const startTimeRef = useRef<number>(new Date().getTime());
  const [completion, setCompletion] = useState<CompletionData | null>(null);

  const technique = useMemo(() => techniques.find((t) => t.id === id), [id]);

  if (!technique || technique.renderMode !== 'page') {
    return <Navigate to="/techniques" replace />;
  }

  const handleComplete = (elapsedSeconds?: number) => {
    const elapsed = elapsedSeconds ?? Math.round((new Date().getTime() - startTimeRef.current) / 1000);
    recordUsage(technique.id);
    setCompletion({ elapsedSeconds: elapsed });
  };

  const handleCancel = () => navigate('/techniques');
  const handleClose = () => navigate('/techniques', { replace: true });

  const renderContent = () => {
    if (completion) {
      return (
        <CompletionScreen
          elapsedSeconds={completion.elapsedSeconds}
          closeLabel="К техникам"
          onClose={handleClose}
        />
      );
    }

    if (technique.id === 'grounding-54321') {
      return <GroundingExercise onComplete={() => handleComplete()} onCancel={handleCancel} />;
    }

    if (technique.id === 'body-scan') {
      return <BodyScan onComplete={() => handleComplete()} onCancel={handleCancel} />;
    }

    if (technique.id === 'tipp') {
      return <TippExercise onComplete={() => handleComplete()} onCancel={handleCancel} />;
    }

    if (technique.id === 'pmr') {
      return <PmrExercise onComplete={() => handleComplete()} onCancel={handleCancel} />;
    }

    if (technique.id === 'box-breathing' || technique.id === 'breathing-478') {
      return (
        <BreathingExercise
          techniqueId={technique.id}
          onComplete={(elapsedSeconds) => handleComplete(elapsedSeconds)}
          onCancel={handleCancel}
        />
      );
    }

    return null;
  };

  return (
    <TechniquePageLayout title={completion ? 'Завершено' : technique.title}>
      {renderContent()}
    </TechniquePageLayout>
  );
}
