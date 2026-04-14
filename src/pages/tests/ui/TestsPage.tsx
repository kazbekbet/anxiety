import { useNavigate } from 'react-router-dom';
import {
  Button,
  Group,
  Paper,
  Progress,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { Header } from '@/widgets/header';
import { allAssessments, getLevel, useAssessmentResults } from '@/entities/assessment';
import { formatEntryDate } from '@/shared/lib/date';
import { levelColorToNumber, daysSince } from '@/shared/lib/assessment-utils';

function levelProgressColor(level: number) {
  if (level <= 3) return 'calm';
  if (level <= 5) return 'yellow';
  if (level <= 7) return 'orange';
  return 'warm';
}

export function TestsPage() {
  const results = useAssessmentResults((s) => s.results);
  const navigate = useNavigate();

  return (
    <Stack gap="md">
      <Header title="Тесты" subtitle="Стандартизированные опросники" />

      <Paper withBorder radius="lg" p="md" bg="var(--mantine-color-default-hover)">
        <Text fz="xs" c="dimmed">
          Тесты — инструмент самонаблюдения, не медицинский диагноз.
          Проходите регулярно для отслеживания динамики.
        </Text>
      </Paper>

      <Stack gap="sm">
        {allAssessments.map((test) => {
          const lastResult = results.find((r) => r.testId === test.id);
          const days = lastResult ? daysSince(lastResult.timestamp) : null;
          const level = lastResult ? getLevel(test, lastResult.score) : null;
          const isDue = days === null || days >= test.intervalDays;
          const numericLevel = level ? levelColorToNumber(level.color) : 0;

          return (
            <Paper key={test.id} withBorder radius="lg" p="md">
              <Stack gap="sm">
                <Stack gap="xs">
                  <Group gap="xs" align="baseline" wrap="nowrap">
                    <Title order={3} fz="md" fw={600}>
                      {test.shortTitle}
                    </Title>
                    <Text fz="xs" c="dimmed">
                      {test.questionCount} вопросов
                    </Text>
                  </Group>
                  <Text fz="sm" c="dimmed">
                    {test.description}
                  </Text>

                  {lastResult && level ? (
                    <Stack gap={6}>
                      <Group gap="xs" wrap="nowrap" align="center">
                        <Progress
                          flex={1}
                          value={numericLevel * 10}
                          color={levelProgressColor(numericLevel)}
                          size="sm"
                          radius="xl"
                        />
                        <Text fz="xs" fw={500}>
                          {lastResult.score}/{test.maxScore}
                        </Text>
                      </Group>
                      <Group justify="space-between" wrap="nowrap">
                        <Text fz="xs" c="dimmed">
                          {level.label}
                        </Text>
                        <Text fz="xs" c="dimmed">
                          {formatEntryDate(lastResult.timestamp)}
                        </Text>
                      </Group>
                    </Stack>
                  ) : null}
                </Stack>

                <Button
                  fullWidth
                  variant={isDue ? 'filled' : 'light'}
                  onClick={() => navigate(`/stats/tests/${test.id}`)}
                >
                  {lastResult ? (isDue ? 'Пройти снова' : 'Пройти ещё раз') : 'Пройти тест'}
                </Button>
              </Stack>
            </Paper>
          );
        })}
      </Stack>
    </Stack>
  );
}
