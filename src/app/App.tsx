import { lazy, Suspense } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/shared/lib/theme.tsx';
import { AppErrorBoundary } from './ErrorBoundary';
import { BottomNav } from '@/widgets/bottom-nav';
import { HomePage } from '@/pages/home';
import { DiaryPage } from '@/pages/diary';
import { TechniquesPage } from '@/pages/techniques';
import { StatsPage } from '@/pages/stats';
import { TestsPage } from '@/pages/tests';

const AssessmentPage = lazy(() =>
  import('@/pages/assessment').then((m) => ({ default: m.AssessmentPage })),
);
const AssessmentResultPage = lazy(() =>
  import('@/pages/assessment').then((m) => ({ default: m.AssessmentResultPage })),
);

export function App() {
  return (
    <AppErrorBoundary>
    <ThemeProvider>
      <HashRouter>
        <Routes>
          <Route
            path="/stats/tests/:testId"
            element={<Suspense fallback={null}><AssessmentPage /></Suspense>}
          />
          <Route
            path="/stats/tests/:testId/result"
            element={<Suspense fallback={null}><AssessmentResultPage /></Suspense>}
          />
          <Route
            path="*"
            element={
              <>
                <div className="mx-auto min-h-screen max-w-lg bg-surface pb-[calc(5rem+env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))] pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))]">
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/diary" element={<DiaryPage />} />
                    <Route path="/techniques" element={<TechniquesPage />} />
                    <Route path="/stats" element={<StatsPage />} />
                    <Route path="/tests" element={<TestsPage />} />
                  </Routes>
                </div>
                <BottomNav />
              </>
            }
          />
        </Routes>
      </HashRouter>
    </ThemeProvider>
    </AppErrorBoundary>
  );
}
