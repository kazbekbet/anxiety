import { useState, useMemo } from 'react';
import { startOfDay } from 'date-fns';
import { Box, Button, Center, Group, Modal, Stack, Text } from '@mantine/core';
import { Header } from '@/widgets/header';
import { useAnxietyEntries, AnxietyCard } from '@/entities/anxiety';
import { ValuesDiaryForm } from '@/features/values-diary';
import { LogAnxietyForm } from '@/features/log-anxiety';
import { formatEntryDate } from '@/shared/lib/date';
import type { AnxietyEntry } from '@/shared/types';

export function DiaryPage() {
  const entries = useAnxietyEntries((s) => s.entries);
  const addEntry = useAnxietyEntries((s) => s.addEntry);
  const removeEntry = useAnxietyEntries((s) => s.removeEntry);
  const [showForm, setShowForm] = useState(false);
  const [showValues, setShowValues] = useState(false);

  const grouped = useMemo(() => {
    const groups: { date: string; label: string; entries: AnxietyEntry[] }[] = [];
    let currentKey = '';

    for (const entry of entries) {
      const key = startOfDay(new Date(entry.timestamp)).toISOString();
      if (key !== currentKey) {
        currentKey = key;
        groups.push({ date: key, label: formatEntryDate(entry.timestamp), entries: [entry] });
      } else {
        groups[groups.length - 1].entries.push(entry);
      }
    }
    return groups;
  }, [entries]);

  return (
    <Stack gap="md">
      <Header title="Дневник" subtitle={`${entries.length} записей`} />

      <Group gap="xs" grow>
        <Button onClick={() => setShowForm(true)}>+ Запись</Button>
        <Button variant="light" onClick={() => setShowValues(true)}>
          Ценности
        </Button>
      </Group>

      {entries.length === 0 ? (
        <Center px="md" py={48}>
          <Stack align="center" gap="xs">
            <Box c="brand.3" mb="sm" style={{ opacity: 0.8 }}>
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                <rect x="16" y="12" width="48" height="56" rx="8" fill="currentColor" />
                <rect x="26" y="28" width="28" height="3" rx="1.5" fill="white" opacity="0.6" />
                <rect x="26" y="36" width="20" height="3" rx="1.5" fill="white" opacity="0.4" />
                <rect x="26" y="44" width="24" height="3" rx="1.5" fill="white" opacity="0.4" />
              </svg>
            </Box>
            <Text fz="md" fw={600} ta="center">
              Ваш дневник ждёт вас
            </Text>
            <Text fz="sm" c="dimmed" ta="center" maw={260}>
              Записывайте моменты тревоги — это помогает увидеть паттерны и стать спокойнее
            </Text>
            <Button mt="md" onClick={() => setShowForm(true)}>
              Добавить первую запись
            </Button>
          </Stack>
        </Center>
      ) : (
        <Stack gap="lg">
          {grouped.map((group) => (
            <Stack key={group.date} gap="xs">
              <Text fz="xs" fw={600} c="dimmed" tt="uppercase" style={{ letterSpacing: '0.05em' }}>
                {group.label}
              </Text>
              <Stack gap="sm">
                {group.entries.map((entry) => (
                  <AnxietyCard key={entry.id} entry={entry} onDelete={removeEntry} />
                ))}
              </Stack>
            </Stack>
          ))}
        </Stack>
      )}

      <Modal
        opened={showForm}
        onClose={() => setShowForm(false)}
        title="Новая запись"
        centered
        radius="lg"
      >
        <LogAnxietyForm
          onSubmit={(data) => {
            addEntry(data);
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      </Modal>

      <Modal
        opened={showValues}
        onClose={() => setShowValues(false)}
        title="Дневник ценностей"
        centered
        radius="lg"
      >
        <ValuesDiaryForm
          onComplete={() => setShowValues(false)}
          onCancel={() => setShowValues(false)}
        />
      </Modal>
    </Stack>
  );
}
