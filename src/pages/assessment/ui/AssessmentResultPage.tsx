import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Badge,
  Box,
  Button,
  Center,
  Container,
  Paper,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { getTestById, getLevel, useAssessmentResults } from '@/entities/assessment';
import { TestGauge } from './TestGauge';

const LEVEL_COLOR: Record<string, string> = {
  emerald: 'calm',
  amber: 'yellow',
  orange: 'orange',
  red: 'warm',
};

interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color: string;
}

function Sparkline({ data, width = 120, height = 32, color }: SparklineProps) {
  if (data.length < 2) return null;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = Math.max(max - min, 1);
  const stepX = width / (data.length - 1);
  const points = data
    .map((v, i) => {
      const x = i * stepX;
      const y = height - ((v - min) / range) * height;
      return `${x},${y}`;
    })
    .join(' ');
  return (
    <Box component="svg" width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <polyline
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </Box>
  );
}

export function AssessmentResultPage() {
  const { testId } = useParams<{ testId: string }>();
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const results = useAssessmentResults((s) => s.results);
  const test = getTestById(testId ?? '');

  const testResults = useMemo(
    () => results.filter((r) => r.testId === testId).reverse(),
    [results, testId],
  );

  const latest = testResults[testResults.length - 1];

  if (!test || !latest) {
    return (
      <Center mih="100vh" px="md">
        <Paper withBorder radius="lg" p="md" w="100%" maw={480} ta="center">
          <Stack gap="md" align="center">
            <Text c="dimmed">Результат не найден</Text>
            <Button onClick={() => navigate('/stats', { replace: true })}>
              К статистике
            </Button>
          </Stack>
        </Paper>
      </Center>
    );
  }

  const level = getLevel(test, latest.score);
  const sparkData = testResults.map((r) => r.score);
  const prevResult = testResults.length >= 2 ? testResults[testResults.length - 2] : null;
  const delta = prevResult ? latest.score - prevResult.score : null;
  const badgeColor = LEVEL_COLOR[level.color] ?? 'brand';
  const sparkColor =
    theme.colors[badgeColor]?.[5] ?? 'var(--mantine-primary-color-filled)';

  const deltaColor: string =
    delta === null
      ? 'dimmed'
      : delta > 0
        ? 'warm.6'
        : delta < 0
          ? 'calm.6'
          : 'dimmed';

  return (
    <Container size="sm" px="md" pb="lg" pt="lg" mih="100vh">
      <Stack gap="md" mih="100vh">
        <Title order={1} fz="xl" fw={700} ta="center">
          {test.shortTitle} — результат
        </Title>

        {/* Gauge */}
        <Paper withBorder radius="lg" p="lg">
          <Stack gap="sm" align="center">
            <TestGauge score={latest.score} maxScore={test.maxScore} color={level.color} />

            <Badge color={badgeColor} variant="light" size="lg" radius="xl">
              {level.label}
            </Badge>

            {delta !== null && (
              <Text fz="sm" c={deltaColor}>
                {delta > 0 ? `+${delta}` : delta} к прошлому разу{' '}
                {delta > 0 ? '↑' : delta < 0 ? '↓' : ''}
              </Text>
            )}

            {testResults.length >= 2 && (
              <Box mt="xs">
                <Sparkline data={sparkData} width={120} height={32} color={sparkColor} />
              </Box>
            )}

            {testResults.length === 1 && (
              <Text fz="xs" c="dimmed" ta="center" maw={240} mt="xs">
                Это ваш первый результат. Пройдите тест снова через {test.intervalDays} дней,
                чтобы отследить динамику.
              </Text>
            )}
          </Stack>
        </Paper>

        {/* Disclaimer */}
        <Paper withBorder radius="lg" p="md" bg="var(--mantine-color-default-hover)">
          <Stack gap="xs">
            <Text fz="xs" c="dimmed">
              Этот опросник — инструмент самонаблюдения, не медицинский тест.
              Результаты не являются диагнозом и не заменяют консультацию специалиста.
              При устойчивом ухудшении состояния обратитесь к психологу или психиатру.
            </Text>
            <Text fz="xs" c="dimmed">
              {test.attribution}
            </Text>
          </Stack>
        </Paper>

        {/* Actions */}
        <Stack gap="xs" mt="auto">
          {(level.color === 'orange' || level.color === 'red') && (
            <Button
              fullWidth
              variant="light"
              onClick={() => navigate('/techniques', { replace: true })}
            >
              Изучить техники снижения тревожности
            </Button>
          )}
          <Button fullWidth onClick={() => navigate('/stats', { replace: true })}>
            К статистике
          </Button>
        </Stack>
      </Stack>
    </Container>
  );
}
