import { Group, Paper, Progress, Stack, Text, Title } from '@mantine/core';
import { useValuesStore, VALUE_OPTIONS } from '@/features/values-diary';

export function ValuesWidget() {
  const entries = useValuesStore((s) => s.entries);
  const latest = entries[0];

  if (!latest) return null;

  return (
    <Paper withBorder radius="lg" p="md">
      <Stack gap="sm">
        <Title order={3} fz="md" fw={600}>
          Ваши ценности
        </Title>

        <Stack gap="xs">
          {latest.values.map((v) => {
            const opt = VALUE_OPTIONS.find((o) => o.id === v.valueId);
            if (!opt) return null;
            return (
              <Group key={v.valueId} gap="sm" wrap="nowrap" align="center">
                <Text fz="lg" component="span">
                  {opt.icon}
                </Text>
                <Stack gap={2} flex={1}>
                  <Group justify="space-between" wrap="nowrap">
                    <Text fz="sm">{opt.label}</Text>
                    <Text fz="xs" c="dimmed">
                      {v.score}/10
                    </Text>
                  </Group>
                  <Progress value={v.score * 10} color="brand" size="sm" radius="xl" />
                </Stack>
              </Group>
            );
          })}
        </Stack>

        {latest.action && (
          <Paper radius="md" p="xs" bg="var(--mantine-color-default-hover)">
            <Stack gap={2}>
              <Text fz="xs" c="dimmed">
                Действие на неделю
              </Text>
              <Text fz="sm">{latest.action}</Text>
            </Stack>
          </Paper>
        )}
      </Stack>
    </Paper>
  );
}
