import { ActionIcon, Anchor, Badge, Group, Paper, Progress, Stack, Text } from '@mantine/core';
import type { Technique } from '@/shared/types';

interface TechniqueCardProps {
  technique: Technique;
  onStart: (technique: Technique) => void;
  locked?: boolean;
  unlockProgress?: { current: number; required: number };
  onManualUnlock?: () => void;
}

const categoryBadge = {
  cbt: { color: 'brand', label: 'КПТ' },
  existential: { color: 'grape', label: 'Экзистенциальная' },
} as const;

function LockIcon() {
  return (
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
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function ChevronIcon() {
  return (
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
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

export function TechniqueCard({
  technique,
  onStart,
  locked,
  unlockProgress,
  onManualUnlock,
}: TechniqueCardProps) {
  const badge = categoryBadge[technique.category];

  if (locked) {
    return (
      <Paper withBorder radius="lg" p="md" opacity={0.65}>
        <Group gap="sm" align="flex-start" wrap="nowrap">
          <Stack gap={4} flex={1} miw={0}>
            <Group gap="xs" wrap="nowrap">
              <Badge color={badge.color} variant="light" radius="xl" size="sm">
                {badge.label}
              </Badge>
              <Text fz="xs" c="dimmed">
                {technique.duration}
              </Text>
            </Group>
            <Text fw={600}>{technique.title}</Text>
            {unlockProgress && (
              <Stack gap={4} mt={4}>
                <Progress
                  value={(unlockProgress.current / unlockProgress.required) * 100}
                  color="brand"
                  size="sm"
                  radius="xl"
                />
                <Text fz="xs" c="dimmed">
                  Ещё {unlockProgress.required - unlockProgress.current} раз для разблокировки
                </Text>
              </Stack>
            )}
            {onManualUnlock && (
              <Anchor component="button" fz="xs" onClick={onManualUnlock} mt={4}>
                Разблокировать
              </Anchor>
            )}
          </Stack>
          <ActionIcon
            component="div"
            variant="default"
            radius="md"
            size={40}
            style={{ cursor: 'default' }}
          >
            <LockIcon />
          </ActionIcon>
        </Group>
      </Paper>
    );
  }

  return (
    <Paper
      withBorder
      radius="lg"
      p="md"
      onClick={() => onStart(technique)}
      style={{ cursor: 'pointer', transition: 'transform 150ms ease' }}
    >
      <Group gap="sm" align="flex-start" wrap="nowrap">
        <Stack gap={4} flex={1} miw={0}>
          <Group gap="xs" wrap="nowrap">
            <Badge color={badge.color} variant="light" radius="xl" size="sm">
              {badge.label}
            </Badge>
            <Text fz="xs" c="dimmed">
              {technique.duration}
            </Text>
          </Group>
          <Text fw={600}>{technique.title}</Text>
          <Text fz="sm" c="dimmed" lineClamp={2}>
            {technique.description}
          </Text>
        </Stack>
        <ActionIcon variant="light" color="brand" radius="md" size={40} aria-label="Открыть">
          <ChevronIcon />
        </ActionIcon>
      </Group>
    </Paper>
  );
}
