import { useMemo } from 'react';
import { Group, Paper, Stack, Text, Title } from '@mantine/core';
import { useAnxietyEntries, useThoughtRecords } from '@/entities/anxiety';

export function ProgressCard() {
  const entries = useAnxietyEntries((s) => s.entries);
  const records = useThoughtRecords((s) => s.records);

  const anxietyProgress = useMemo(() => {
    if (entries.length < 7) return null;
    const sorted = [...entries].sort(
      (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
    );
    const first7 = sorted.slice(0, 7);
    const last7 = sorted.slice(-7);
    const firstAvg = first7.reduce((sum, e) => sum + e.level, 0) / first7.length;
    const lastAvg = last7.reduce((sum, e) => sum + e.level, 0) / last7.length;
    const diff = firstAvg - lastAvg;
    const percentChange = firstAvg > 0 ? Math.round((diff / firstAvg) * 100) : 0;
    return {
      firstAvg: Math.round(firstAvg * 10) / 10,
      lastAvg: Math.round(lastAvg * 10) / 10,
      percentChange,
      improved: diff > 0,
    };
  }, [entries]);

  const thoughtEffectiveness = useMemo(() => {
    if (records.length === 0) return null;
    const reductions = records.map((r) => r.emotionIntensity - r.newEmotionIntensity);
    return Math.round((reductions.reduce((sum, r) => sum + r, 0) / reductions.length) * 10) / 10;
  }, [records]);

  if (!anxietyProgress && thoughtEffectiveness === null) return null;

  return (
    <Paper withBorder radius="lg" p="md">
      <Stack gap="sm">
        <Title order={3} fz="md" fw={600}>
          Прогресс
        </Title>

        {anxietyProgress && (
          <Paper radius="md" p="sm" bg="var(--mantine-color-default-hover)">
            <Stack gap={4}>
              <Text fz="sm" c="dimmed">
                Уровень тревожности
              </Text>
              <Group gap="xs" fz="sm">
                <Text fw={500}>Было: {anxietyProgress.firstAvg}</Text>
                <Text c="dimmed">→</Text>
                <Text fw={500}>Сейчас: {anxietyProgress.lastAvg}</Text>
              </Group>
              <Text fz="sm" fw={500} c={anxietyProgress.improved ? 'teal' : 'red'}>
                {anxietyProgress.improved
                  ? `Улучшение на ${anxietyProgress.percentChange}%`
                  : anxietyProgress.percentChange === 0
                    ? 'Без изменений'
                    : `Рост на ${Math.abs(anxietyProgress.percentChange)}%`}
              </Text>
            </Stack>
          </Paper>
        )}

        {thoughtEffectiveness !== null && records.length > 0 && (
          <Paper radius="md" p="sm" bg="var(--mantine-color-default-hover)">
            <Stack gap={4}>
              <Text fz="sm" c="dimmed">
                Эффективность записей мыслей
              </Text>
              <Text fz="sm">
                Среднее снижение интенсивности:{' '}
                <Text span fw={600} c="brand">
                  {thoughtEffectiveness > 0 ? `-${thoughtEffectiveness}` : thoughtEffectiveness}
                </Text>{' '}
                баллов
              </Text>
              <Text fz="xs" c="dimmed">
                На основе {records.length} {records.length === 1 ? 'записи' : 'записей'}
              </Text>
            </Stack>
          </Paper>
        )}

        {!anxietyProgress && entries.length > 0 && entries.length < 7 && (
          <Text fz="sm" c="dimmed">
            Добавьте ещё {7 - entries.length} записей для отслеживания прогресса
          </Text>
        )}
      </Stack>
    </Paper>
  );
}
