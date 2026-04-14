import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Group, Text, UnstyledButton } from '@mantine/core';
import { navItems } from '../model/navItems';

function isItemActive(currentPath: string, to: string): boolean {
  if (to === '/') return currentPath === '/';
  return currentPath === to || currentPath.startsWith(`${to}/`);
}

export function BottomNav() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <Box
      component="nav"
      hiddenFrom="lg"
      pos="fixed"
      bottom={0}
      left={0}
      right={0}
      style={{
        zIndex: 40,
        borderTop: '1px solid var(--app-border-soft)',
        background: 'var(--mantine-color-body)',
        backdropFilter: 'blur(8px)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <Group
        gap={0}
        wrap="nowrap"
        style={{ marginInline: 'auto', maxWidth: 512 }}
      >
        {navItems.map((item) => {
          const active = isItemActive(pathname, item.to);
          return (
            <UnstyledButton
              key={item.to}
              onClick={() => navigate(item.to)}
              aria-label={item.label}
              aria-current={active ? 'page' : undefined}
              style={{
                position: 'relative',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 2,
                paddingTop: 8,
                paddingBottom: 8,
                transition: 'color 200ms',
                color: active
                  ? 'var(--mantine-color-brand-5)'
                  : 'var(--mantine-color-dimmed)',
              }}
            >
              <Box
                style={{
                  transition: 'transform 200ms',
                  transform: active ? 'scale(1.1)' : 'scale(1)',
                  display: 'flex',
                }}
              >
                {item.icon}
              </Box>
              <Text size="xs" inherit>
                {item.label}
              </Text>
              {active && (
                <Box
                  style={{
                    position: 'absolute',
                    bottom: 2,
                    height: 2,
                    width: 32,
                    borderRadius: 999,
                    background: 'var(--mantine-color-brand-5)',
                    transition: 'all 300ms',
                  }}
                />
              )}
            </UnstyledButton>
          );
        })}
      </Group>
    </Box>
  );
}
