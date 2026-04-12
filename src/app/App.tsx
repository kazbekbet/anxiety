import { useState } from 'react';
import { HashRouter } from 'react-router-dom';
import { ThemeProvider } from '@/shared/lib/theme.tsx';
import { AppErrorBoundary } from './ErrorBoundary';
import { OnboardingFlow } from './OnboardingFlow';
import { AppRoutes } from './routes/AppRoutes';

export function App() {
  const [onboarded, setOnboarded] = useState(
    () => localStorage.getItem('onboarded') === '1',
  );

  if (!onboarded) {
    return (
      <AppErrorBoundary>
        <ThemeProvider>
          <OnboardingFlow
            onComplete={() => {
              localStorage.setItem('onboarded', '1');
              setOnboarded(true);
            }}
          />
        </ThemeProvider>
      </AppErrorBoundary>
    );
  }

  return (
    <AppErrorBoundary>
      <ThemeProvider>
        <HashRouter>
          <AppRoutes />
        </HashRouter>
      </ThemeProvider>
    </AppErrorBoundary>
  );
}
