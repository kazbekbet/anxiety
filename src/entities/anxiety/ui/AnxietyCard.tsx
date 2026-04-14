import { useState } from 'react';
import {
  ActionIcon,
  Anchor,
  Badge,
  Box,
  Group,
  Paper,
  Progress,
  Stack,
  Text,
} from '@mantine/core';
import type { AnxietyEntry } from '@/shared/types';
import { formatEntryDate, formatTime } from '@/shared/lib/date';

interface AnxietyCardProps {
  entry: AnxietyEntry;
  onDelete?: (id: string) => void;
}

function levelColor(level: number) {
  if (level <= 3) return 'calm';
  if (level <= 5) return 'yellow';
  if (level <= 7) return 'orange';
  return 'warm';
}

function LevelIndicator({ level }: { level: number }) {
  const color = levelColor(level);
  return (
    <ActionIcon
      component="div"
      variant="light"
      color={color}
      radius="xl"
      size={48}
      style={{ flexShrink: 0, cursor: 'default' }}
      aria-label={`Уровень тревожности ${level} из 10`}
    >
      <Text fw={700} fz="md" c={`${color}.7`}>
        {level}
      </Text>
    </ActionIcon>
  );
}

export function AnxietyCard({ entry, onDelete }: AnxietyCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <Paper withBorder radius="lg" p="md">
      <Group gap="sm" align="flex-start" wrap="nowrap">
        <LevelIndicator level={entry.level} />
        <Stack gap={6} flex={1} miw={0}>
          <Group justify="space-between" wrap="nowrap">
            <Text fz="sm" fw={500}>
              {formatEntryDate(entry.timestamp)}
            </Text>
            <Text fz="xs" c="dimmed">
              {formatTime(entry.timestamp)}
            </Text>
          </Group>
          <Progress
            value={entry.level * 10}
            color={levelColor(entry.level)}
            size="sm"
            radius="xl"
          />
          {entry.note && (
            <Text fz="sm" c="dimmed" lineClamp={2}>
              {entry.note}
            </Text>
          )}
          {entry.triggers.length > 0 && (
            <Group gap={6}>
              {entry.triggers.map((t) => (
                <Badge key={t} color="brand" variant="light" radius="xl" size="sm">
                  {t}
                </Badge>
              ))}
            </Group>
          )}
          {onDelete && (
            <Box>
              {confirmDelete ? (
                <Group gap="xs">
                  <Text fz="xs" c="red">
                    Удалить запись?
                  </Text>
                  <Anchor
                    component="button"
                    c="red"
                    fz="xs"
                    fw={500}
                    onClick={() => onDelete(entry.id)}
                  >
                    Да
                  </Anchor>
                  <Anchor
                    component="button"
                    c="dimmed"
                    fz="xs"
                    onClick={() => setConfirmDelete(false)}
                  >
                    Нет
                  </Anchor>
                </Group>
              ) : (
                <Anchor
                  component="button"
                  c="dimmed"
                  fz="xs"
                  onClick={() => setConfirmDelete(true)}
                >
                  Удалить
                </Anchor>
              )}
            </Box>
          )}
        </Stack>
      </Group>
    </Paper>
  );
}
