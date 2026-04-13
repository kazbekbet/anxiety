import type { ReactNode } from 'react';
import { Group, Stack, Text, Title } from '@mantine/core';

interface HeaderProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}

export function Header({ title, subtitle, action }: HeaderProps) {
  return (
    <Group
      component="header"
      justify="space-between"
      align="flex-start"
      wrap="nowrap"
      pt="md"
      pb="xs"
    >
      <Stack gap={2}>
        <Title order={1} fz={24} fw={700}>
          {title}
        </Title>
        {subtitle && (
          <Text fz="sm" c="dimmed">
            {subtitle}
          </Text>
        )}
      </Stack>
      {action}
    </Group>
  );
}
