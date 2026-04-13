import { useMemo, useState } from 'react';
import { startOfDay } from 'date-fns';
import {
  Center,
  Group,
  Paper,
  SegmentedControl,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { BarChart } from '@mantine/charts';
import { Header } from '@/widgets/header';
import { ProgressCard } from '@/widgets/progress-card';
import { AssessmentWidget } from '@/widgets/assessment-widget';
import { ValuesWidget } from '@/widgets/values-widget';
import { useAnxietyEntries, useAverageByDay, useThoughtRecords } from '@/entities/anxiety';
import { getLast7Days, formatShortDay } from '@/shared/lib/date';
import {
  filterByPeriod,
  averageLevel,
  topTriggers,
  buildInsights,
  averageCbtReduction,
  formatTriggerCount,
  type Period,
} from '@/shared/lib/insights';
import { ExportButton } from '@/features/export-data';

const PERIODS: { value: Period; label: string }[] = [
  { value: '7d', label: '7 дней' },
  { value: '30d', label: '30 дней' },
  { value: 'all', label: 'Всё время' },
];

const CHART_SERIES = [{ name: 'value', label: 'Уровень', color: 'brand.5' }];

function levelColor(value: number) {
  if (value <= 0) return 'gray.3';
  if (value <= 3) return 'teal.5';
  if (value <= 5) return 'yellow.5';
  if (value <= 7) return 'orange.5';
  return 'red.5';
}

function StatCard({ value, label }: { value: string | number; label: string }) {
  return (
    <Paper withBorder radius="lg" p="md">
      <Stack gap={4} align="center">
        <Text fz={24} fw={700} c="brand">
          {value}
        </Text>
        <Text fz="xs" c="dimmed">
          {label}
        </Text>
      </Stack>
    </Paper>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Paper withBorder radius="lg" p="md">
      <Stack gap="sm">
        <Title order={3} fz="md" fw={600}>
          {title}
        </Title>
        {children}
      </Stack>
    </Paper>
  );
}

export function StatsPage() {
  const entries = useAnxietyEntries((s) => s.entries);
  const records = useThoughtRecords((s) => s.records);
  const averageByDay = useAverageByDay();
  const [period, setPeriod] = useState<Period>('7d');

  const days = getLast7Days();

  const chartData = useMemo(
    () =>
      days.map((day) => {
        const key = startOfDay(day).toISOString();
        return { day: formatShortDay(day), value: averageByDay.get(key) ?? 0 };
      }),
    [days, averageByDay],
  );

  const filteredEntries = useMemo(() => filterByPeriod(entries, period), [entries, period]);
  const filteredRecords = useMemo(() => filterByPeriod(records, period), [records, period]);
  const overallAverage = useMemo(
    () => Math.round(averageLevel(filteredEntries)),
    [filteredEntries],
  );
  const maxLevel = filteredEntries.length > 0 ? Math.max(...filteredEntries.map((e) => e.level)) : 0;
  const minLevel = filteredEntries.length > 0 ? Math.min(...filteredEntries.map((e) => e.level)) : 0;
  const top3Triggers = useMemo(() => topTriggers(filteredEntries, 3), [filteredEntries]);
  const insights = useMemo(() => buildInsights(entries), [entries]);
  const cbtReduction = useMemo(() => averageCbtReduction(filteredRecords), [filteredRecords]);

  return (
    <Stack gap="md">
      <Header title="Статистика" subtitle="Ваш прогресс" />

      <SegmentedControl
        fullWidth
        radius="lg"
        value={period}
        onChange={(v) => setPeriod(v as Period)}
        data={PERIODS}
      />

      <SimpleGrid cols={3} spacing="sm">
        <StatCard value={filteredEntries.length} label="Записей" />
        <StatCard value={filteredRecords.length} label="Мыслей КПТ" />
        <StatCard value={overallAverage || '—'} label="Средний" />
      </SimpleGrid>

      <ProgressCard />

      <AssessmentWidget />

      <ValuesWidget />

      <Section title="Тревожность за 7 дней">
        {entries.length === 0 ? (
          <Center py="xl">
            <Text fz="sm" c="dimmed">
              Нет данных — добавьте записи в дневник
            </Text>
          </Center>
        ) : (
          <BarChart
            h={180}
            data={chartData}
            dataKey="day"
            series={CHART_SERIES}
            withYAxis={false}
            withTooltip
            withBarValueLabel
            yAxisProps={{ domain: [0, 10] }}
            getBarColor={(v) => levelColor(v)}
            barProps={{ radius: 6 }}
          />
        )}
      </Section>

      {top3Triggers.length > 0 && (
        <Section title="Частые триггеры">
          <Stack gap="xs">
            {top3Triggers.map((t) => (
              <Group key={t.trigger} justify="space-between" wrap="nowrap">
                <Text fz="sm">{t.trigger}</Text>
                <Text fz="sm" c="dimmed">
                  {formatTriggerCount(t.count)}
                </Text>
              </Group>
            ))}
          </Stack>
        </Section>
      )}

      {insights.length > 0 && (
        <Section title="Аналитика">
          <Stack gap="xs">
            {insights.map((text, i) => (
              <Text key={i} fz="sm" c="dimmed">
                {text}
              </Text>
            ))}
          </Stack>
        </Section>
      )}

      {cbtReduction !== null && (
        <Section title="Эффективность КПТ">
          <Text fz="sm" c="dimmed">
            КПТ-записи снижают тревогу в среднем на{' '}
            <Text span fw={600} c="bright">
              {cbtReduction.toFixed(1)}
            </Text>{' '}
            баллов
          </Text>
        </Section>
      )}

      {filteredEntries.length > 0 && (
        <Section title="Сводка">
          <Stack gap="xs">
            {(
              [
                ['Максимум', `${maxLevel}/10`],
                ['Минимум', `${minLevel}/10`],
                ['Средний', `${overallAverage}/10`],
                ['Всего записей', `${filteredEntries.length}`],
              ] as const
            ).map(([label, value]) => (
              <Group key={label} justify="space-between" wrap="nowrap">
                <Text fz="sm" c="dimmed">
                  {label}
                </Text>
                <Text fz="sm" fw={500}>
                  {value}
                </Text>
              </Group>
            ))}
          </Stack>
        </Section>
      )}

      <ExportButton entries={entries} records={records} />
    </Stack>
  );
}
