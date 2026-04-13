import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { subDays, startOfDay, isWithinInterval } from 'date-fns';
import {
  Box,
  Button,
  Center,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { Heatmap } from '@/widgets/heatmap';
import { useAnxietyEntries } from '@/entities/anxiety';
import { filterByPeriod, averageLevel } from '@/shared/lib/insights';
import { generateSmartInsight } from '@/shared/lib/smart-insights';

const LEGEND_COLORS = ['calm.5', 'yellow.5', 'orange.5', 'warm.5'];

export function DigestPage() {
  const entries = useAnxietyEntries((s) => s.entries);
  const navigate = useNavigate();

  const weekEntries = useMemo(() => filterByPeriod(entries, '7d'), [entries]);
  const prevWeekEntries = useMemo(() => {
    const now = new Date();
    const start = startOfDay(subDays(now, 13));
    const end = startOfDay(subDays(now, 6));
    return entries.filter((e) => isWithinInterval(new Date(e.timestamp), { start, end }));
  }, [entries]);

  const weekAvg = averageLevel(weekEntries);
  const prevAvg = averageLevel(prevWeekEntries);
  const delta = prevWeekEntries.length > 0 ? weekAvg - prevAvg : null;
  const insight = useMemo(() => generateSmartInsight(entries), [entries]);

  if (weekEntries.length === 0) {
    return (
      <Center mih="100vh" px="md">
        <Paper withBorder radius="lg" p="md" w="100%" maw={480}>
          <Stack gap="sm" align="center">
            <Title order={2} fz="lg" fw={600}>
              Ещё нет данных
            </Title>
            <Text fz="sm" c="dimmed" ta="center">
              Начните записывать тревогу, чтобы увидеть еженедельный дайджест
            </Text>
            <Button onClick={() => navigate('/', { replace: true })}>На главную</Button>
          </Stack>
        </Paper>
      </Center>
    );
  }

  const deltaColor =
    delta === null ? 'dimmed' : delta < 0 ? 'calm.6' : delta > 0 ? 'warm.6' : 'dimmed';

  return (
    <Stack gap="md" px="md" pb="md" pt="lg" maw={480} mx="auto" mih="100vh">
      <Stack gap={4}>
        <Title order={1} fz={24} fw={700}>
          Ваша неделя
        </Title>
        <Text fz="sm" c="dimmed">
          {weekEntries.length} записей за 7 дней
        </Text>
      </Stack>

      <SimpleGrid cols={3} spacing="xs">
        <Paper withBorder radius="lg" p="md">
          <Stack gap={2} align="center">
            <Text fz={24} fw={700} c="brand.6">
              {weekEntries.length}
            </Text>
            <Text fz="xs" c="dimmed">
              Записей
            </Text>
          </Stack>
        </Paper>
        <Paper withBorder radius="lg" p="md">
          <Stack gap={2} align="center">
            <Text fz={24} fw={700} c="brand.6">
              {weekAvg.toFixed(1)}
            </Text>
            <Text fz="xs" c="dimmed">
              Средний
            </Text>
          </Stack>
        </Paper>
        <Paper withBorder radius="lg" p="md">
          <Stack gap={2} align="center">
            {delta !== null ? (
              <Text fz={24} fw={700} c={deltaColor}>
                {delta > 0 ? '+' : ''}
                {delta.toFixed(1)}
              </Text>
            ) : (
              <Text fz={24} fw={700} c="dimmed">
                —
              </Text>
            )}
            <Text fz="xs" c="dimmed">
              vs прошлая
            </Text>
          </Stack>
        </Paper>
      </SimpleGrid>

      <Paper withBorder radius="lg" p="md">
        <Stack gap="sm">
          <Text fw={600}>Карта тревожности</Text>
          <Heatmap entries={entries} />
          <Group gap="xs">
            <Text fz={10} c="dimmed">
              Спокойно
            </Text>
            <Group gap={2}>
              {LEGEND_COLORS.map((c) => (
                <Box
                  key={c}
                  w={12}
                  h={12}
                  bg={c}
                  style={{ borderRadius: 'var(--mantine-radius-sm)' }}
                />
              ))}
            </Group>
            <Text fz={10} c="dimmed">
              Тревожно
            </Text>
          </Group>
        </Stack>
      </Paper>

      {insight && (
        <Paper
          withBorder
          radius="lg"
          p="md"
          bg={
            insight.type === 'positive'
              ? 'calm.0'
              : insight.type === 'suggestion'
                ? 'brand.0'
                : undefined
          }
        >
          <Text
            fz="sm"
            c={
              insight.type === 'positive'
                ? 'calm.8'
                : insight.type === 'suggestion'
                  ? 'brand.8'
                  : undefined
            }
          >
            {insight.text}
          </Text>
        </Paper>
      )}

      <Button fullWidth onClick={() => navigate('/', { replace: true })}>
        Продолжить
      </Button>
    </Stack>
  );
}
