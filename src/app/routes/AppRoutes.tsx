import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { PageSkeleton } from '@/shared/ui/PageSkeleton';
import { AppLayout } from '../layouts/AppLayout';

const HomePage = lazy(() => import('@/pages/home').then((m) => ({ default: m.HomePage })));
const DiaryPage = lazy(() => import('@/pages/diary').then((m) => ({ default: m.DiaryPage })));
const TechniquesPage = lazy(() => import('@/pages/techniques').then((m) => ({ default: m.TechniquesPage })));
const StatsPage = lazy(() => import('@/pages/stats').then((m) => ({ default: m.StatsPage })));
const TestsPage = lazy(() => import('@/pages/tests').then((m) => ({ default: m.TestsPage })));
const ExposurePage = lazy(() => import('@/pages/exposure').then((m) => ({ default: m.ExposurePage })));
const DigestPage = lazy(() => import('@/pages/digest').then((m) => ({ default: m.DigestPage })));
const AssessmentPage = lazy(() => import('@/pages/assessment').then((m) => ({ default: m.AssessmentPage })));
const AssessmentResultPage = lazy(() => import('@/pages/assessment').then((m) => ({ default: m.AssessmentResultPage })));
const TechniquePage = lazy(() => import('@/pages/technique').then((m) => ({ default: m.TechniquePage })));

export function AppRoutes() {
  const fallback = <PageSkeleton />;

  return (
    <Routes>
      <Route
        path="/technique/:id"
        element={<Suspense fallback={fallback}><TechniquePage /></Suspense>}
      />
      <Route
        path="/digest"
        element={<Suspense fallback={fallback}><DigestPage /></Suspense>}
      />
      <Route
        path="/stats/tests/:testId"
        element={<Suspense fallback={fallback}><AssessmentPage /></Suspense>}
      />
      <Route
        path="/stats/tests/:testId/result"
        element={<Suspense fallback={fallback}><AssessmentResultPage /></Suspense>}
      />
      <Route
        path="*"
        element={
          <AppLayout>
            <Suspense fallback={fallback}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/diary" element={<DiaryPage />} />
                <Route path="/techniques" element={<TechniquesPage />} />
                <Route path="/stats" element={<StatsPage />} />
                <Route path="/tests" element={<TestsPage />} />
                <Route path="/exposure" element={<ExposurePage />} />
              </Routes>
            </Suspense>
          </AppLayout>
        }
      />
    </Routes>
  );
}
