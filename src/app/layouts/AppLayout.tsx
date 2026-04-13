import { Box, Container, useMantineTheme } from '@mantine/core';
import { useTheme } from '@/shared/lib/theme-context';
import { SideNav } from '@/widgets/side-nav';
import { BottomNav } from '@/widgets/bottom-nav';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const theme = useMantineTheme();
  const { resolved } = useTheme();
  const background =
    resolved === 'dark' ? theme.other.bodyGradientDark : theme.other.bodyGradientLight;

  return (
    <Box mih="100vh" style={{ background }}>
      <SideNav />
      <Box
        component="main"
        style={{
          minHeight: '100vh',
          paddingTop: 'max(1rem, env(safe-area-inset-top))',
          paddingBottom: 'calc(5rem + env(safe-area-inset-bottom))',
          paddingLeft: 'max(1rem, env(safe-area-inset-left))',
          paddingRight: 'max(1rem, env(safe-area-inset-right))',
        }}
      >
        <Container size="sm" px={0}>
          {children}
        </Container>
      </Box>
      <BottomNav />
    </Box>
  );
}
