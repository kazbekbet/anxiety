import { Button, Paper, Stack, Text, ThemeIcon, Title } from '@mantine/core';

interface CompletionScreenProps {
  elapsedSeconds: number;
  thoughtRecordDiff?: { before: number; after: number };
  onClose: () => void;
  /** Текст кнопки закрытия. По умолчанию «Закрыть» (для модалки). На странице передавайте «К техникам». */
  closeLabel?: string;
}

export function CompletionScreen({
  elapsedSeconds,
  thoughtRecordDiff,
  onClose,
  closeLabel = 'Закрыть',
}: CompletionScreenProps) {
  const minutes = Math.max(1, Math.round(elapsedSeconds / 60));
  const minutesLabel =
    minutes === 1 ? 'минуту' : minutes >= 2 && minutes <= 4 ? 'минуты' : 'минут';

  return (
    <Stack gap="md">
      <Paper withBorder radius="lg" p="md" bg="var(--mantine-color-calm-light)">
        <Stack gap="xs" align="center">
          <ThemeIcon color="calm" variant="light" radius="xl" size={56}>
            <Text fz="xl" fw={700}>
              ✓
            </Text>
          </ThemeIcon>
          <Title order={3} fz="lg" fw={600}>
            Отлично!
          </Title>
          <Text fz="sm" c="var(--mantine-color-calm-light-color)" ta="center">
            Вы практиковали {minutes} {minutesLabel}
          </Text>
          {thoughtRecordDiff && (
            <Paper
              withBorder={false}
              radius="md"
              p="sm"
              bg="var(--mantine-color-default-hover)"
              w="100%"
            >
              <Text fz="sm" ta="center">
                Было: <strong>{thoughtRecordDiff.before}/10</strong> &rarr; Стало:{' '}
                <strong>{thoughtRecordDiff.after}/10</strong>
              </Text>
            </Paper>
          )}
        </Stack>
      </Paper>
      <Button type="button" fullWidth onClick={onClose}>
        {closeLabel}
      </Button>
    </Stack>
  );
}
