import { HashRouter, Routes, Route } from 'react-router-dom';
import { BottomNav } from '@/widgets/bottom-nav';
import { HomePage } from '@/pages/home';
import { DiaryPage } from '@/pages/diary';
import { TechniquesPage } from '@/pages/techniques';
import { StatsPage } from '@/pages/stats';

export function App() {
  return (
    <HashRouter>
      <div className="mx-auto min-h-screen max-w-lg px-4 pb-20">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/diary" element={<DiaryPage />} />
          <Route path="/techniques" element={<TechniquesPage />} />
          <Route path="/stats" element={<StatsPage />} />
        </Routes>
      </div>
      <BottomNav />
    </HashRouter>
  );
}
