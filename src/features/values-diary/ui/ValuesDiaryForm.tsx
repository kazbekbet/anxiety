import { useState } from 'react';
import {
  Badge,
  Button,
  Group,
  SimpleGrid,
  Slider,
  Stack,
  Stepper,
  Text,
  Textarea,
  Title,
  UnstyledButton,
} from '@mantine/core';
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

  const canNext =
    step === 0 ? selectedValues.length >= 1 : step === 1 ? true : action.trim().length > 0;

  return (
    <Stack gap="md">
      <Stepper active={step} size="xs" iconSize={20} allowNextStepsSelect={false}>
        <Stepper.Step />
        <Stepper.Step />
        <Stepper.Step />
      </Stepper>

      {step === 0 && (
        <Stack gap="sm">
          <Stack gap={4}>
            <Title order={3} fz="md" fw={500}>
              Что для вас действительно важно?
            </Title>
            <Text fz="sm" c="dimmed">
              Выберите до 5 ценностей
            </Text>
          </Stack>
          <SimpleGrid cols={2} spacing="xs">
            {VALUE_OPTIONS.map((v) => {
              const isSelected = selectedValues.includes(v.id);
              return (
                <UnstyledButton
                  key={v.id}
                  onClick={() => toggleValue(v.id)}
                  p="sm"
                  style={{
                    borderRadius: 'var(--mantine-radius-md)',
                    borderWidth: 2,
                    borderStyle: 'solid',
                    borderColor: isSelected
                      ? 'var(--mantine-primary-color-filled)'
                      : 'transparent',
                    background: isSelected
                      ? 'var(--mantine-primary-color-light)'
                      : 'var(--mantine-color-default-hover)',
                    color: isSelected
                      ? 'var(--mantine-primary-color-light-color)'
                      : 'var(--mantine-color-text)',
                    transition: 'all 150ms ease',
                  }}
                >
                  <Group gap="xs" wrap="nowrap">
                    <Text fz="lg" component="span">
                      {v.icon}
                    </Text>
                    <Text fz="sm" fw={500} component="span">
                      {v.label}
                    </Text>
                  </Group>
                </UnstyledButton>
              );
            })}
          </SimpleGrid>
        </Stack>
      )}

      {step === 1 && (
        <Stack gap="sm">
          <Stack gap={4}>
            <Title order={3} fz="md" fw={500}>
              Насколько вы живёте в согласии?
            </Title>
            <Text fz="sm" c="dimmed">
              Оцените каждую ценность
            </Text>
          </Stack>
          <Stack gap="md">
            {selectedValues.map((id) => {
              const v = VALUE_OPTIONS.find((o) => o.id === id);
              if (!v) return null;
              const value = scores[id] ?? 5;
              return (
                <Stack key={id} gap={4}>
                  <Group justify="space-between" wrap="nowrap">
                    <Text fz="sm" fw={500}>
                      {v.icon} {v.label}
                    </Text>
                    <Text fz="sm" fw={700} c="brand">
                      {value}/10
                    </Text>
                  </Group>
                  <Slider
                    min={1}
                    max={10}
                    step={1}
                    value={value}
                    onChange={(val) => setScores({ ...scores, [id]: val })}
                    label={null}
                  />
                </Stack>
              );
            })}
          </Stack>
        </Stack>
      )}

      {step === 2 && (
        <Stack gap="sm">
          <Stack gap={4}>
            <Title order={3} fz="md" fw={500}>
              Одно действие на эту неделю
            </Title>
            <Text fz="sm" c="dimmed">
              Что вы можете сделать в согласии с вашими ценностями?
            </Text>
          </Stack>
          <Textarea
            value={action}
            onChange={(e) => setAction(e.currentTarget.value)}
            placeholder="Например: позвонить маме, прогуляться в парке, написать в дневник..."
            rows={3}
            autoFocus
          />
          {selectedValues.length > 0 && (
            <Group gap={4}>
              {selectedValues.map((id) => {
                const v = VALUE_OPTIONS.find((o) => o.id === id);
                return v ? (
                  <Badge key={id} variant="light" radius="xl" size="sm">
                    {v.icon} {v.label}
                  </Badge>
                ) : null;
              })}
            </Group>
          )}
        </Stack>
      )}

      <Group gap="sm" wrap="nowrap">
        <Button
          variant="subtle"
          fullWidth
          onClick={step === 0 ? onCancel : () => setStep(step - 1)}
        >
          {step === 0 ? 'Отмена' : 'Назад'}
        </Button>
        <Button
          fullWidth
          disabled={!canNext}
          onClick={step === 2 ? handleSubmit : () => setStep(step + 1)}
        >
          {step === 2 ? 'Сохранить' : 'Далее'}
        </Button>
      </Group>
    </Stack>
  );
}
