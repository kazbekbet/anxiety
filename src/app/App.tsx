import { HashRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/shared/lib/theme.tsx';
import { BottomNav } from '@/widgets/bottom-nav';
import { HomePage } from '@/pages/home';
import { DiaryPage } from '@/pages/diary';
import { TechniquesPage } from '@/pages/techniques';
import { StatsPage } from '@/pages/stats';

export function App() {
  return (
    <ThemeProvider>
      <HashRouter>
        <div className="mx-auto min-h-screen max-w-lg bg-surface pb-20 pt-[max(1rem,env(safe-area-inset-top))] pl-[max(1rem,env(safe-area-inset-left))] pr-[max(1rem,env(safe-area-inset-right))]">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/diary" element={<DiaryPage />} />
            <Route path="/techniques" element={<TechniquesPage />} />
            <Route path="/stats" element={<StatsPage />} />
          </Routes>
        </div>
        <BottomNav />
      </HashRouter>
    </ThemeProvider>
  );
}
