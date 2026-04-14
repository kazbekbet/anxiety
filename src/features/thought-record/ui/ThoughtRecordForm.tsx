import { useState } from 'react';
import {
  Button,
  Chip,
  Group,
  Paper,
  Progress,
  Slider,
  Stack,
  Text,
  TextInput,
  Textarea,
  ThemeIcon,
  Title,
} from '@mantine/core';
import {
  type CognitiveDistortion,
  COGNITIVE_DISTORTION_LABELS,
  type ThoughtRecord,
} from '@/shared/types';

interface ThoughtRecordFormProps {
  onSubmit: (data: Omit<ThoughtRecord, 'id' | 'timestamp'>) => void;
  onCancel: () => void;
}

const ALL_DISTORTIONS = Object.keys(COGNITIVE_DISTORTION_LABELS) as CognitiveDistortion[];

function levelColor(level: number): string {
  if (level <= 3) return 'calm';
  if (level <= 5) return 'yellow';
  if (level <= 7) return 'orange';
  return 'warm';
}

export function ThoughtRecordForm({ onSubmit, onCancel }: ThoughtRecordFormProps) {
  const [step, setStep] = useState(0);
  const [situation, setSituation] = useState('');
  const [automaticThought, setAutomaticThought] = useState('');
  const [emotion, setEmotion] = useState('');
  const [emotionIntensity, setEmotionIntensity] = useState(5);
  const [cognitiveDistortions, setCognitiveDistortions] = useState<CognitiveDistortion[]>([]);
  const [alternativeThought, setAlternativeThought] = useState('');
  const [newEmotionIntensity, setNewEmotionIntensity] = useState(5);

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

  const emotionColor = levelColor(emotionIntensity);
  const newEmotionColor = levelColor(newEmotionIntensity);

  const steps = [
    <Stack key="situation" gap="xs">
      <Title order={3} fz="md" fw={500}>
        Шаг 1: Ситуация
      </Title>
      <Text fz="sm" c="dimmed">
        Опишите ситуацию, которая вызвала тревогу
      </Text>
      <Textarea
        value={situation}
        onChange={(e) => setSituation(e.currentTarget.value)}
        placeholder="Что произошло?"
        autosize
        minRows={3}
        autoFocus
      />
    </Stack>,
    <Stack key="thought" gap="xs">
      <Title order={3} fz="md" fw={500}>
        Шаг 2: Автоматическая мысль
      </Title>
      <Text fz="sm" c="dimmed">
        Какая мысль возникла первой?
      </Text>
      <Textarea
        value={automaticThought}
        onChange={(e) => setAutomaticThought(e.currentTarget.value)}
        placeholder="Я подумал(а), что..."
        autosize
        minRows={3}
        autoFocus
      />
    </Stack>,
    <Stack key="emotion" gap="xs">
      <Title order={3} fz="md" fw={500}>
        Шаг 3: Эмоция
      </Title>
      <Text fz="sm" c="dimmed">
        Какую эмоцию вы почувствовали?
      </Text>
      <TextInput
        value={emotion}
        onChange={(e) => setEmotion(e.currentTarget.value)}
        placeholder="Например: страх, тревога, стыд"
        autoFocus
      />
      <Text component="label" fz="sm" c="dimmed" mt="xs">
        Интенсивность
      </Text>
      <Group gap="md" align="center" wrap="nowrap">
        <Slider
          value={emotionIntensity}
          onChange={setEmotionIntensity}
          min={1}
          max={10}
          step={1}
          color={emotionColor}
          flex={1}
          label={null}
        />
        <ThemeIcon color={emotionColor} variant="light" radius="xl" size={40}>
          <Text fw={700} c={`${emotionColor}.7`}>
            {emotionIntensity}
          </Text>
        </ThemeIcon>
      </Group>
    </Stack>,
    <Stack key="distortions" gap="xs">
      <Title order={3} fz="md" fw={500}>
        Шаг 4: Когнитивные искажения
      </Title>
      <Text fz="sm" c="dimmed">
        Какие ловушки мышления вы заметили?
      </Text>
      <Chip.Group
        multiple
        value={cognitiveDistortions}
        onChange={(v) => setCognitiveDistortions(v as CognitiveDistortion[])}
      >
        <Group gap="xs">
          {ALL_DISTORTIONS.map((d) => (
            <Chip key={d} value={d} variant="light" radius="xl" size="sm">
              {COGNITIVE_DISTORTION_LABELS[d]}
            </Chip>
          ))}
        </Group>
      </Chip.Group>
    </Stack>,
    <Stack key="alternative" gap="xs">
      <Title order={3} fz="md" fw={500}>
        Шаг 5: Альтернативная мысль
      </Title>
      <Text fz="sm" c="dimmed">
        Как можно переформулировать мысль?
      </Text>
      <Textarea
        value={alternativeThought}
        onChange={(e) => setAlternativeThought(e.currentTarget.value)}
        placeholder="Более реалистичный взгляд..."
        autosize
        minRows={3}
        autoFocus
      />
    </Stack>,
    <Stack key="result" gap="xs">
      <Title order={3} fz="md" fw={500}>
        Шаг 6: Переоценка
      </Title>
      <Text fz="sm" c="dimmed">
        Какова интенсивность эмоции теперь?
      </Text>
      <Group gap="md" align="center" wrap="nowrap">
        <Slider
          value={newEmotionIntensity}
          onChange={setNewEmotionIntensity}
          min={1}
          max={10}
          step={1}
          color={newEmotionColor}
          flex={1}
          label={null}
        />
        <ThemeIcon color={newEmotionColor} variant="light" radius="xl" size={40}>
          <Text fw={700} c={`${newEmotionColor}.7`}>
            {newEmotionIntensity}
          </Text>
        </ThemeIcon>
      </Group>
      <Paper withBorder={false} radius="md" p="sm" mt="sm" bg="gray.0">
        <Text fz="sm">
          Было: <strong>{emotionIntensity}/10</strong> → Стало:{' '}
          <strong>{newEmotionIntensity}/10</strong>
        </Text>
      </Paper>
    </Stack>,
  ];

  const totalSteps = steps.length;
  const isLast = step === totalSteps - 1;
  const progressValue = ((step + 1) / totalSteps) * 100;

  return (
    <Stack gap="md">
      <Progress value={progressValue} radius="xl" />
      {steps[step]}
      <Group gap="sm" grow>
        <Button
          type="button"
          variant="subtle"
          onClick={step === 0 ? onCancel : () => setStep(step - 1)}
        >
          {step === 0 ? 'Отмена' : 'Назад'}
        </Button>
        <Button
          type="button"
          disabled={!canNext()}
          onClick={isLast ? handleSubmit : () => setStep(step + 1)}
        >
          {isLast ? 'Сохранить' : 'Далее'}
        </Button>
      </Group>
    </Stack>
  );
}
