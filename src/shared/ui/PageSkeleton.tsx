import { Skeleton, Stack } from '@mantine/core';

export function PageSkeleton() {
  return (
    <Stack
      role="status"
      aria-busy
      aria-label="Загрузка"
      gap="md"
      p="md"
      pt="xl"
      mx="auto"
      maw={512}
    >
      <Skeleton height={48} width={192} radius="lg" />
      <Skeleton height={128} radius="lg" />
      <Skeleton height={48} radius="lg" />
      <Skeleton height={96} radius="lg" />
    </Stack>
  );
}
