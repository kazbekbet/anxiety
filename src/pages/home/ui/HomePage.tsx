import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ActionIcon,
  Box,
  Button,
  Group,
  Modal,
  Paper,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
  UnstyledButton,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Sparkline } from '@mantine/charts';
import { Header } from '@/widgets/header';
import { ThemeToggle } from '@/widgets/theme-toggle';
import { useAnxietyEntries } from '@/entities/anxiety';
import { LogAnxietyForm } from '@/features/log-anxiety';
import { WorryTimer } from '@/features/worry-time';
import { techniques } from '@/entities/technique';
import { sparklineData, trendDirection } from '@/shared/lib/insights';
import { generateSmartInsight } from '@/shared/lib/smart-insights';
import { useAssessmentResults, assessments } from '@/entities/assessment';

const QUICK_LEVELS = [
  { range: '1-2', level: 2, label: 'Спокойно' },
  { range: '3-4', level: 4, label: 'Легко' },
  { range: '5-6', level: 6, label: 'Средне' },
  { range: '7-8', level: 8, label: 'Сильно' },
  { range: '9-10', level: 10, label: 'Паника' },
];

const CRISIS_PHONE = '8-800-2000-122';

interface Recommendation {
  text: string;
  route: string;
  level: 'calm' | 'mild' | 'moderate' | 'severe' | 'crisis';
}

function getRecommendation(level: number): Recommendation {
  if (level <= 3) return { text: 'Всё хорошо. Запишите мысли в дневник?', route: '/diary', level: 'calm' };
  if (level <= 5) return { text: 'Попробуйте дыхание по квадрату', route: '/techniques', level: 'mild' };
  if (level <= 7) return { text: 'Рекомендуем дыхание 4-7-8', route: '/techniques', level: 'moderate' };
  if (level <= 9) return { text: 'Начните с дыхания, потом — Worry Time', route: '/techniques', level: 'severe' };
  return { text: 'Вы не одиноки. Обратитесь за помощью', route: '', level: 'crisis' };
}

function levelColor(level: number) {
  if (level <= 3) return 'calm';
  if (level <= 5) return 'yellow';
  if (level <= 7) return 'orange';
  return 'warm';
}

export function HomePage() {
  const entries = useAnxietyEntries((s) => s.entries);
  const addEntry = useAnxietyEntries((s) => s.addEntry);
  const latestEntry = entries[0] ?? null;
  const [formOpened, formActions] = useDisclosure(false);
  const [worryOpened, worryActions] = useDisclosure(false);
  const [tapped, setTapped] = useState<number | null>(null);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const navigate = useNavigate();

  const quickTechniques = techniques.slice(0, 3);
  const assessmentResults = useAssessmentResults((s) => s.results);
  const [dismissedBanner, setDismissedBanner] = useState(false);

  const showTestBanner = (() => {
    if (dismissedBanner) return false;
    const gad7 = assessments.find((t) => t.id === 'gad7');
    if (!gad7) return false;
    const lastGad7 = assessmentResults.find((r) => r.testId === 'gad7');
    if (!lastGad7) return true;
    const daysSince = Math.floor(
      (new Date().getTime() - new Date(lastGad7.timestamp).getTime()) / 86400000,
    );
    return daysSince >= gad7.intervalDays;
  })();

  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 6) return { title: 'Не спится?', sub: 'Здесь безопасно' };
    if (h < 12) return { title: 'Доброе утро', sub: 'Как вы сегодня?' };
    if (h < 18) return { title: 'Добрый день', sub: 'Проверьте своё состояние' };
    if (h < 22) return { title: 'Добрый вечер', sub: 'Время подвести итоги дня' };
    return { title: 'Поздний вечер', sub: 'Всё в порядке' };
  })();

  const sparkData = useMemo(() => sparklineData(entries), [entries]);
  const trend = useMemo(() => trendDirection(entries), [entries]);
  const smartInsight = useMemo(() => generateSmartInsight(entries), [entries]);

  const handleQuickTap = (level: number) => {
    addEntry({ level, note: '', triggers: [] });
    setTapped(level);
    setRecommendation(getRecommendation(level));
    if ('vibrate' in navigator) navigator.vibrate(level <= 4 ? 10 : level <= 7 ? 20 : 40);
    setTimeout(() => setTapped(null), 1500);
  };

  const lastDigest = entries.length >= 3 ? localStorage.getItem('last-digest-shown') : null;
  const daysSinceDigest = lastDigest
    ? Math.floor((new Date().getTime() - new Date(lastDigest).getTime()) / 86400000)
    : 999;
  const showDigestBanner = entries.length >= 3 && daysSinceDigest >= 7;

  const insightColor =
    smartInsight?.type === 'positive'
      ? 'calm'
      : smartInsight?.type === 'suggestion'
        ? 'brand'
        : 'gray';

  return (
    <Stack gap="md">
      <Header title={greeting.title} subtitle={greeting.sub} action={<ThemeToggle />} />

      {/* SOS button */}
      <Paper
        withBorder
        radius="lg"
        p="md"
        bg="var(--mantine-color-warm-light)"
        onClick={() => window.open(`tel:${CRISIS_PHONE}`)}
        style={{ cursor: 'pointer' }}
      >
        <Group gap="sm" wrap="nowrap">
          <ThemeIcon color="warm" radius="md" size={40}>
            <Text fw={700} fz="xs" c="white">
              SOS
            </Text>
          </ThemeIcon>
          <Stack gap={2} flex={1} miw={0}>
            <Text fz="sm" fw={500} c="var(--mantine-color-warm-light-color)">
              Если сейчас очень плохо
            </Text>
            <Text fz="xs" c="var(--mantine-color-warm-light-color)" opacity={0.85}>
              Телефон доверия: {CRISIS_PHONE}
            </Text>
          </Stack>
        </Group>
      </Paper>

      {/* One-tap check-in */}
      <Paper withBorder radius="lg" p="md">
        <Stack gap="sm">
          <Text fz="sm" fw={500} c="dimmed" ta="center">
            Быстрая запись
          </Text>
          <SimpleGrid cols={5} spacing="xs">
            {QUICK_LEVELS.map((q) => {
              const color = levelColor(q.level);
              const isTapped = tapped === q.level;
              return (
                <UnstyledButton
                  key={q.level}
                  onClick={() => handleQuickTap(q.level)}
                  p="xs"
                  bg={`var(--mantine-color-${color}-light)`}
                  style={{
                    borderRadius: 'var(--mantine-radius-md)',
                    transition: 'transform 120ms ease',
                    transform: isTapped ? 'scale(0.95)' : undefined,
                    outline: isTapped ? '2px solid var(--mantine-color-brand-5)' : undefined,
                  }}
                >
                  <Stack gap={4} align="center">
                    <Text
                      fz="sm"
                      fw={700}
                      c={`var(--mantine-color-${color}-light-color)`}
                      lh={1}
                    >
                      {q.range}
                    </Text>
                    <Text
                      fz={10}
                      fw={500}
                      c={`var(--mantine-color-${color}-light-color)`}
                      opacity={0.85}
                      lh={1.1}
                    >
                      {q.label}
                    </Text>
                  </Stack>
                </UnstyledButton>
              );
            })}
          </SimpleGrid>

          {recommendation && (
            <Paper key={recommendation.text} radius="md" p="sm" bg="var(--app-surface-muted)">
              <Stack gap="xs">
                <Text fz="sm" c="dimmed">
                  {recommendation.text}
                </Text>
                {recommendation.level === 'crisis' ? (
                  <Button
                    component="a"
                    href={`tel:${CRISIS_PHONE}`}
                    color="warm"
                    fullWidth
                    size="sm"
                  >
                    Позвонить: {CRISIS_PHONE}
                  </Button>
                ) : (
                  <Button
                    fullWidth
                    variant="light"
                    size="sm"
                    onClick={() => navigate(recommendation.route)}
                  >
                    {recommendation.level === 'calm' ? 'Открыть дневник' : 'Начать технику'}
                  </Button>
                )}
              </Stack>
            </Paper>
          )}

          {tapped && !recommendation && (
            <Text key={tapped} fz="xs" c="brand.6" ta="center">
              ✓ Записано
            </Text>
          )}
        </Stack>
      </Paper>

      {/* Digest banner */}
      {showDigestBanner && (
        <Paper
          withBorder
          radius="lg"
          p="md"
          bg="var(--mantine-color-brand-light)"
          onClick={() => {
            localStorage.setItem('last-digest-shown', new Date().toISOString());
            navigate('/digest');
          }}
          style={{ cursor: 'pointer' }}
        >
          <Group gap="sm" wrap="nowrap">
            <ThemeIcon color="brand" radius="md" size={40}>
              <Text fw={700} fz="xs" c="white">
                7д
              </Text>
            </ThemeIcon>
            <Stack gap={2} flex={1} miw={0}>
              <Text fz="sm" fw={500} c="var(--mantine-color-brand-light-color)">
                Итоги недели
              </Text>
              <Text fz="xs" c="dimmed">
                Посмотрите вашу динамику
              </Text>
            </Stack>
          </Group>
        </Paper>
      )}

      {/* Smart insight */}
      {smartInsight && (
        <Paper
          withBorder
          radius="lg"
          p="md"
          bg={`var(--mantine-color-${insightColor}-light)`}
        >
          <Text fz="sm" c={`var(--mantine-color-${insightColor}-light-color)`}>
            {smartInsight.text}
          </Text>
        </Paper>
      )}

      {/* Test banner */}
      {showTestBanner && (
        <Paper withBorder radius="lg" p="md" bg="var(--mantine-color-brand-light)">
          <Group gap="sm" wrap="nowrap">
            <ThemeIcon color="brand" radius="md" size={40}>
              <Text fw={700} fz="md" c="white">
                ?
              </Text>
            </ThemeIcon>
            <Stack gap={2} flex={1} miw={0}>
              <Text fz="sm" fw={500} c="var(--mantine-color-brand-light-color)">
                Оцените тревожность
              </Text>
              <Text fz="xs" c="dimmed">
                GAD-7 — займёт 2 минуты
              </Text>
            </Stack>
            <Button variant="light" size="xs" onClick={() => navigate('/stats/tests/gad7')}>
              Пройти
            </Button>
            <ActionIcon
              variant="subtle"
              color="gray"
              size="sm"
              onClick={() => setDismissedBanner(true)}
              aria-label="Скрыть"
            >
              ✕
            </ActionIcon>
          </Group>
        </Paper>
      )}

      {/* Latest entry with sparkline */}
      {latestEntry && (
        <Paper withBorder radius="lg" p="md">
          <Group gap="md" wrap="nowrap">
            <ThemeIcon
              color={levelColor(latestEntry.level)}
              variant="light"
              radius="xl"
              size={48}
            >
              <Text fw={700} fz="md" c={`var(--mantine-color-${levelColor(latestEntry.level)}-light-color)`}>
                {latestEntry.level}
              </Text>
            </ThemeIcon>
            <Stack gap={2} flex={1} miw={0}>
              <Text fz="sm" c="dimmed">
                Последняя запись
              </Text>
              <Group gap={4}>
                <Text fz="sm" fw={500}>
                  {latestEntry.level}/10
                </Text>
                {trend && (
                  <Text
                    fz="sm"
                    fw={500}
                    c={trend === 'down' ? 'calm.6' : trend === 'up' ? 'warm.6' : undefined}
                  >
                    {trend === 'up' ? '↑' : trend === 'down' ? '↓' : ''}
                  </Text>
                )}
              </Group>
            </Stack>
            {sparkData.filter((v) => v > 0).length >= 2 && (
              <Box w={80} h={28}>
                <Sparkline
                  w={80}
                  h={28}
                  data={sparkData}
                  color="brand"
                  curveType="natural"
                  fillOpacity={0.4}
                />
              </Box>
            )}
          </Group>
        </Paper>
      )}

      <Button fullWidth variant="light" onClick={formActions.open}>
        + Подробная запись
      </Button>

      {/* Worry Time card */}
      <Paper
        withBorder
        radius="lg"
        p="md"
        onClick={worryActions.open}
        style={{ cursor: 'pointer' }}
      >
        <Group gap="sm" wrap="nowrap">
          <ThemeIcon color="brand" variant="light" radius="md" size={40}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
          </ThemeIcon>
          <Stack gap={2} flex={1} miw={0}>
            <Text fz="sm" fw={500}>
              Время беспокойства
            </Text>
            <Text fz="xs" c="dimmed">
              Запланированная сессия для тревожных мыслей
            </Text>
          </Stack>
        </Group>
      </Paper>

      <Stack gap="xs">
        <Group justify="space-between" align="center">
          <Title order={2} fz="lg" fw={600}>
            Быстрые техники
          </Title>
          <Button
            variant="subtle"
            size="compact-sm"
            onClick={() => navigate('/techniques')}
          >
            Все
          </Button>
        </Group>
        <Stack gap="xs">
          {quickTechniques.map((t) => (
            <Paper
              key={t.id}
              withBorder
              radius="lg"
              p="md"
              onClick={() => navigate('/techniques')}
              style={{ cursor: 'pointer' }}
            >
              <Group gap="sm" wrap="nowrap">
                <ThemeIcon color="brand" variant="light" radius="md" size={40}>
                  {t.category === 'cbt' ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 16v-4" />
                      <path d="M12 8h.01" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
                    </svg>
                  )}
                </ThemeIcon>
                <Stack gap={2} flex={1} miw={0}>
                  <Text fz="sm" fw={500}>
                    {t.title}
                  </Text>
                  <Text fz="xs" c="dimmed">
                    {t.duration}
                  </Text>
                </Stack>
              </Group>
            </Paper>
          ))}
        </Stack>
      </Stack>

      <Modal
        opened={formOpened}
        onClose={formActions.close}
        title="Новая запись"
        centered
      >
        <LogAnxietyForm
          onSubmit={(data) => {
            addEntry(data);
            formActions.close();
          }}
          onCancel={formActions.close}
        />
      </Modal>

      <Modal
        opened={worryOpened}
        onClose={worryActions.close}
        title="Время беспокойства"
        centered
      >
        <WorryTimer onClose={worryActions.close} />
      </Modal>
    </Stack>
  );
}
