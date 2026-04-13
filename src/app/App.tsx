import { HashRouter } from 'react-router-dom';
import { ThemeProvider } from '@/shared/lib/theme.tsx';
import { AppErrorBoundary } from './ErrorBoundary';
import { MantineThemeProvider, OnboardingProvider } from './providers';
import { AppRoutes } from './routes/AppRoutes';

export function App() {
  return (
    <AppErrorBoundary>
      <ThemeProvider>
        <MantineThemeProvider>
          <OnboardingProvider>
            <HashRouter>
              <AppRoutes />
            </HashRouter>
          </OnboardingProvider>
        </MantineThemeProvider>
      </ThemeProvider>
    </AppErrorBoundary>
  );
}
