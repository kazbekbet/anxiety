import { useState } from 'react';
import {
  ActionIcon,
  Button,
  Chip,
  Group,
  Slider,
  Stack,
  Text,
  TextInput,
  Textarea,
  ThemeIcon,
} from '@mantine/core';
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

function levelColor(level: number) {
  if (level <= 3) return 'calm';
  if (level <= 5) return 'yellow';
  if (level <= 7) return 'orange';
  return 'warm';
}

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

  const color = levelColor(level);

  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="lg">
        <Stack gap="xs">
          <Text component="label" fz="sm" fw={500} c="dimmed">
            Уровень тревожности
          </Text>
          <Group gap="md" align="center" wrap="nowrap">
            <Slider
              value={level}
              onChange={setLevel}
              min={1}
              max={10}
              step={1}
              color={color}
              flex={1}
              label={null}
            />
            <ThemeIcon color={color} variant="light" radius="xl" size={48}>
              <Text fw={700} fz="lg" c={`${color}.7`}>
                {level}
              </Text>
            </ThemeIcon>
          </Group>
          <Group justify="space-between">
            <Text fz="xs" c="dimmed">
              Спокойствие
            </Text>
            <Text fz="xs" c="dimmed">
              Паника
            </Text>
          </Group>
        </Stack>

        <Stack gap="xs">
          <Text component="label" fz="sm" fw={500} c="dimmed">
            Триггеры
          </Text>
          <Chip.Group multiple value={triggers} onChange={setTriggers}>
            <Group gap="xs">
              {allTriggers.map((t) => (
                <Chip key={t} value={t} variant="light" radius="xl" size="sm">
                  {t}
                </Chip>
              ))}
            </Group>
          </Chip.Group>
          <Group gap="xs" wrap="nowrap">
            <TextInput
              flex={1}
              size="sm"
              value={newTrigger}
              onChange={(e) => setNewTrigger(e.currentTarget.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addCustomTrigger();
                }
              }}
              placeholder="Свой триггер..."
            />
            <ActionIcon
              type="button"
              variant="light"
              size="lg"
              radius="md"
              onClick={addCustomTrigger}
              aria-label="Добавить триггер"
            >
              +
            </ActionIcon>
          </Group>
        </Stack>

        <Textarea
          label="Заметка"
          value={note}
          onChange={(e) => setNote(e.currentTarget.value)}
          placeholder="Что вы чувствуете?"
          rows={3}
          styles={{ label: { fontWeight: 500 } }}
        />

        <Group gap="sm" grow>
          <Button type="button" variant="subtle" onClick={onCancel}>
            Отмена
          </Button>
          <Button type="submit">Сохранить</Button>
        </Group>
      </Stack>
    </form>
  );
}
