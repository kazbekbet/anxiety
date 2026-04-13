import { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Anchor,
  Chip,
  Group,
  Modal,
  Paper,
  Stack,
  Text,
  ThemeIcon,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Header } from '@/widgets/header';
import { techniques, TechniqueCard, useProgression } from '@/entities/technique';
import { useThoughtRecords } from '@/entities/anxiety';
import { ThoughtRecordForm } from '@/features/thought-record';
import { StopSkill } from '@/features/stop-skill';
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
  const [opened, { open, close }] = useDisclosure(false);
  const addRecord = useThoughtRecords((s) => s.addRecord);
  const { recordUsage, isUnlocked, getUsageCount, manualUnlock } = useProgression();
  const startTimeRef = useRef<number>(0);
  const navigate = useNavigate();

  const filtered = tab === 'all' ? techniques : techniques.filter((t) => t.situation === tab);

  const handleStart = (technique: Technique) => {
    // Техники с renderMode: 'page' открываются на отдельной странице
    if (technique.renderMode === 'page') {
      navigate(`/technique/${technique.id}`);
      return;
    }
    startTimeRef.current = Date.now();
    setActiveTechnique(technique);
    setCompletion(null);
    open();
  };

  const handleComplete = () => {
    const elapsedSeconds = Math.round((Date.now() - startTimeRef.current) / 1000);
    if (activeTechnique) recordUsage(activeTechnique.id);
    setCompletion({ elapsedSeconds });
  };

  const handleClose = () => {
    setActiveTechnique(null);
    setCompletion(null);
    close();
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
            if (activeTechnique) recordUsage(activeTechnique.id);
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

    if (activeTechnique.id === 'stop-skill') {
      return <StopSkill onComplete={handleComplete} onCancel={handleClose} />;
    }

    return <TechniqueSteps technique={activeTechnique} onComplete={handleComplete} />;
  };

  return (
    <Stack gap="md">
      <Header title="Техники" subtitle="Выберите, что вы чувствуете" />

      <Chip.Group value={tab} onChange={(v) => setTab(v as Tab)}>
        <Group gap="xs" wrap="nowrap" style={{ overflowX: 'auto' }}>
          {TABS.map((t) => (
            <Chip key={t.key} value={t.key} variant="light" radius="xl" size="sm">
              {t.label}
            </Chip>
          ))}
        </Group>
      </Chip.Group>

      <Stack gap="sm">
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
      </Stack>

      {/* Exposure hierarchy link */}
      {(tab === 'all' || tab === 'deep-work') && (
        <Anchor component={Link} to="/exposure" underline="never">
          <Paper withBorder radius="lg" p="md">
            <Group gap="sm" wrap="nowrap">
              <ThemeIcon color="brand" variant="light" radius="md" size={40}>
                <Text fz="lg">↗</Text>
              </ThemeIcon>
              <Stack gap={2} style={{ minWidth: 0, flex: 1 }}>
                <Text fz="sm" fw={600}>
                  Лестница страха
                </Text>
                <Text fz="xs" c="dimmed">
                  Пошаговая экспозиция к тревожным ситуациям
                </Text>
              </Stack>
            </Group>
          </Paper>
        </Anchor>
      )}

      <Modal
        opened={opened && !!activeTechnique}
        onClose={handleClose}
        title={completion ? 'Завершено' : (activeTechnique?.title ?? '')}
        centered
        radius="lg"
      >
        {renderTechniqueContent()}
      </Modal>
    </Stack>
  );
}
