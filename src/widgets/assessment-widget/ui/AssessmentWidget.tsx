import { useNavigate } from 'react-router-dom';
import { Anchor, Button, Group, Paper, Progress, Stack, Text, Title } from '@mantine/core';
import { allAssessments, getLevel } from '@/entities/assessment';
import { useAssessmentResults } from '@/entities/assessment';
import { formatEntryDate } from '@/shared/lib/date';
import { levelColorToNumber, daysSince } from '@/shared/lib/assessment-utils';

function levelProgressColor(level: number) {
  if (level <= 3) return 'teal';
  if (level <= 5) return 'yellow';
  if (level <= 7) return 'orange';
  return 'red';
}

export function AssessmentWidget() {
  const results = useAssessmentResults((s) => s.results);
  const navigate = useNavigate();

  const testCards = allAssessments.slice(0, 2).map((test) => {
    const lastResult = results.find((r) => r.testId === test.id);
    const days = lastResult ? daysSince(lastResult.timestamp) : null;
    const level = lastResult ? getLevel(test, lastResult.score) : null;
    return { test, lastResult, days, level };
  });

  return (
    <Paper withBorder radius="lg" p="md">
      <Stack gap="sm">
        <Title order={3} fz="md" fw={600}>
          Психологические тесты
        </Title>

        <Stack gap="sm">
          {testCards.map(({ test, lastResult, days, level }) => {
            const numericLevel = level ? levelColorToNumber(level.color) : 0;
            return (
              <Paper
                key={test.id}
                radius="md"
                p="sm"
                bg="var(--mantine-color-default-hover)"
              >
                <Stack gap="xs">
                  <Group justify="space-between" wrap="nowrap">
                    <Text fz="sm" fw={500}>
                      {test.shortTitle}
                    </Text>
                    <Text fz="xs" c="dimmed">
                      {lastResult ? formatEntryDate(lastResult.timestamp) : 'не пройден'}
                    </Text>
                  </Group>

                  {lastResult && level ? (
                    <Stack gap={4}>
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
                        {days !== null && days >= test.intervalDays && (
                          <Anchor
                            component="button"
                            fz="xs"
                            fw={500}
                            onClick={() => navigate(`/stats/tests/${test.id}`)}
                          >
                            Пройти снова
                          </Anchor>
                        )}
                      </Group>
                    </Stack>
                  ) : (
                    <Button
                      variant="light"
                      fullWidth
                      onClick={() => navigate(`/stats/tests/${test.id}`)}
                    >
                      Пройти тест
                    </Button>
                  )}
                </Stack>
              </Paper>
            );
          })}
        </Stack>
      </Stack>
    </Paper>
  );
}
