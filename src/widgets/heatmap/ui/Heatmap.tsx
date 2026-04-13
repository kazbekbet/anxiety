import { useMemo } from 'react';
import { startOfDay, subDays, format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { Box, Group, Stack, Text } from '@mantine/core';
import type { AnxietyEntry } from '@/shared/types';

interface HeatmapProps {
  entries: AnxietyEntry[];
}

function getCellBackground(level: number): string {
  if (level === 0) return 'var(--mantine-color-default-hover)';
  if (level <= 3) return 'var(--mantine-color-calm-5)';
  if (level <= 5) return 'var(--mantine-color-yellow-5)';
  if (level <= 7) return 'var(--mantine-color-orange-5)';
  return 'var(--mantine-color-warm-5)';
}

const PERIODS = ['Утро', 'День', 'Вечер'] as const;

export function Heatmap({ entries }: HeatmapProps) {
  const data = useMemo(() => {
    const today = startOfDay(new Date());
    const days = Array.from({ length: 7 }, (_, i) => subDays(today, 6 - i));

    return days.map((day) => {
      const dayStart = day.getTime();
      const dayEnd = dayStart + 86400000;
      const dayEntries = entries.filter((e) => {
        const t = new Date(e.timestamp).getTime();
        return t >= dayStart && t < dayEnd;
      });

      const periods = [0, 0, 0]; // morning, afternoon, evening
      const counts = [0, 0, 0];
      for (const e of dayEntries) {
        const h = new Date(e.timestamp).getHours();
        const idx = h < 12 ? 0 : h < 18 ? 1 : 2;
        periods[idx] += e.level;
        counts[idx]++;
      }

      return {
        label: format(day, 'EE', { locale: ru }),
        cells: periods.map((sum, i) => (counts[i] > 0 ? Math.round(sum / counts[i]) : 0)),
      };
    });
  }, [entries]);

  return (
    <Stack gap={4}>
      <Group gap={4} wrap="nowrap">
        <Box w={40} />
        {data.map((d, i) => (
          <Text key={i} fz={10} c="dimmed" ta="center" style={{ flex: 1 }}>
            {d.label}
          </Text>
        ))}
      </Group>
      {PERIODS.map((period, row) => (
        <Group key={period} gap={4} wrap="nowrap">
          <Text w={40} fz={10} c="dimmed">
            {period}
          </Text>
          {data.map((d, col) => (
            <Box
              key={col}
              style={{
                flex: 1,
                aspectRatio: '1 / 1',
                borderRadius: 'var(--mantine-radius-sm)',
                background: getCellBackground(d.cells[row]),
              }}
              title={d.cells[row] > 0 ? `${d.label} ${period}: ${d.cells[row]}/10` : ''}
            />
          ))}
        </Group>
      ))}
    </Stack>
  );
}
