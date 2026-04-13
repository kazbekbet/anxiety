import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Stack, Tooltip, UnstyledButton } from '@mantine/core';
import { navItems } from '@/widgets/bottom-nav/model/navItems';

function isItemActive(currentPath: string, to: string): boolean {
  if (to === '/') return currentPath === '/';
  return currentPath === to || currentPath.startsWith(`${to}/`);
}

export function SideNav() {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <Box
      component="nav"
      visibleFrom="lg"
      pos="fixed"
      top={0}
      left={0}
      bottom={0}
      w={64}
      py="md"
      style={{
        zIndex: 40,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        borderRight: '1px solid var(--app-border-soft)',
        background: 'var(--mantine-color-body)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <Stack gap={4} align="center">
        {navItems.map((item) => {
          const active = isItemActive(pathname, item.to);
          return (
            <Tooltip key={item.to} label={item.label} position="right" withArrow>
              <UnstyledButton
                onClick={() => navigate(item.to)}
                aria-label={item.label}
                aria-current={active ? 'page' : undefined}
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 48,
                  height: 48,
                  borderRadius: 'var(--mantine-radius-lg)',
                  transition: 'background-color 200ms, color 200ms',
                  color: active
                    ? 'var(--mantine-color-brand-5)'
                    : 'var(--mantine-color-dimmed)',
                  background: active
                    ? 'var(--mantine-color-brand-light)'
                    : 'transparent',
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.background =
                      'var(--mantine-color-default-hover)';
                    e.currentTarget.style.color = 'var(--mantine-color-text)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'var(--mantine-color-dimmed)';
                  }
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
                {active && (
                  <Box
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      height: 24,
                      width: 2,
                      borderRadius: 999,
                      background: 'var(--mantine-color-brand-5)',
                    }}
                  />
                )}
              </UnstyledButton>
            </Tooltip>
          );
        })}
      </Stack>
    </Box>
  );
}
