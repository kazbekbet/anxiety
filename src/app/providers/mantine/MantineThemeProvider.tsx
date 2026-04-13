import type { ReactNode } from 'react';
import { MantineProvider } from '@mantine/core';
import { useTheme } from '@/shared/lib/theme-context';
import { mantineTheme } from './theme';

interface Props {
  children: ReactNode;
}

/**
 * Bridges the app-wide {@link useTheme} context with Mantine's color scheme.
 * Keeps a single source of truth for light/dark while Mantine controls its own
 * CSS variables via `data-mantine-color-scheme`.
 */
export function MantineThemeProvider({ children }: Props) {
  const { resolved } = useTheme();

  return (
    <MantineProvider theme={mantineTheme} forceColorScheme={resolved}>
      {children}
    </MantineProvider>
  );
}
