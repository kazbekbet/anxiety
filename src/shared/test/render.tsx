import type { ReactElement, ReactNode } from 'react';
import { render, type RenderOptions, type RenderResult } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';
import { cssVariablesResolver, mantineTheme } from '@/app/providers/mantine/theme';

// eslint-disable-next-line react-refresh/only-export-components
const Wrapper = ({ children }: { children: ReactNode }) => (
  <MantineProvider
    theme={mantineTheme}
    forceColorScheme="light"
    cssVariablesResolver={cssVariablesResolver}
  >
    {children}
  </MantineProvider>
);

/**
 * Drop-in replacement for `@testing-library/react`'s `render` that wraps the
 * rendered tree in {@link MantineProvider}. All new component tests should
 * prefer this helper over the raw `render` export.
 */
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>,
): RenderResult {
  return render(ui, { wrapper: Wrapper, ...options });
}
