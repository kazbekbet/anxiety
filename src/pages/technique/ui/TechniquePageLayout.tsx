import type { ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { ActionIcon, Box, Container, Group, Title } from '@mantine/core';

interface TechniquePageLayoutProps {
  title: string;
  children: ReactNode;
}

export function TechniquePageLayout({ title, children }: TechniquePageLayoutProps) {
  const navigate = useNavigate();

  const handleBack = () => navigate('/techniques');

  return (
    <Container
      size="sm"
      px="md"
      style={{
        minHeight: '100dvh',
        paddingTop: 'max(0px, env(safe-area-inset-top))',
        paddingBottom: 'max(1.25rem, env(safe-area-inset-bottom))',
        paddingLeft: 'max(1rem, env(safe-area-inset-left))',
        paddingRight: 'max(1rem, env(safe-area-inset-right))',
      }}
    >
      <Group component="header" gap="sm" align="center" py="md" wrap="nowrap">
        <ActionIcon
          type="button"
          onClick={handleBack}
          aria-label="Назад к техникам"
          variant="subtle"
          color="gray"
          radius="xl"
          size="lg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </ActionIcon>
        <Title order={1} fz="lg" fw={600} lh={1.2}>
          {title}
        </Title>
      </Group>

      <Box>{children}</Box>
    </Container>
  );
}
