import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/widgets/header';
import { ThemeToggle } from '@/widgets/theme-toggle';
import { Card, Button, LevelIndicator, Modal } from '@/shared/ui';
import { useAnxietyEntries } from '@/entities/anxiety';
import { LogAnxietyForm } from '@/features/log-anxiety';
import { techniques } from '@/entities/technique';
import { getLevelBgColor, getLevelTextColor } from '@/shared/lib/level-colors';

const QUICK_LEVELS = [
  { range: '1-2', level: 2, label: 'Спокойно' },
  { range: '3-4', level: 4, label: 'Легко' },
  { range: '5-6', level: 6, label: 'Средне' },
  { range: '7-8', level: 8, label: 'Сильно' },
  { range: '9-10', level: 10, label: 'Паника' },
];

export function HomePage() {
  const entries = useAnxietyEntries((s) => s.entries);
  const addEntry = useAnxietyEntries((s) => s.addEntry);
  const latestEntry = entries[0] ?? null;
  const [showForm, setShowForm] = useState(false);
  const [tapped, setTapped] = useState<number | null>(null);
  const navigate = useNavigate();

  const quickTechniques = techniques.slice(0, 3);

  const handleQuickTap = (level: number) => {
    addEntry({ level, note: '', triggers: [] });
    setTapped(level);
    setTimeout(() => setTapped(null), 1500);
  };

  return (
    <div className="space-y-4">
      <Header title="Anxiety Tracker" subtitle="Как вы себя чувствуете?" action={<ThemeToggle />} />

      {/* One-tap check-in */}
      <Card>
        <p className="mb-3 text-sm font-medium text-subtle text-center">Быстрая запись</p>
        <div className="flex gap-2">
          {QUICK_LEVELS.map((q) => (
            <button
              key={q.level}
              onClick={() => handleQuickTap(q.level)}
              className={`flex flex-1 flex-col items-center gap-1 rounded-xl py-2 transition-all active:scale-95 ${getLevelBgColor(q.level)} ${getLevelTextColor(q.level)} ${tapped === q.level ? 'ring-2 ring-accent scale-95' : ''}`}
            >
              <span className="text-lg font-bold">{q.range}</span>
              <span className="text-[10px] leading-tight">{q.label}</span>
            </button>
          ))}
        </div>
        {tapped && (
          <p className="mt-2 text-center text-xs text-accent-fg animate-pulse">
            Записано!
          </p>
        )}
      </Card>

      {latestEntry && (
        <Card className="flex items-center gap-4">
          <LevelIndicator level={latestEntry.level} />
          <div>
            <p className="text-sm text-muted">Последняя запись</p>
            <p className="text-sm font-medium text-fg">{latestEntry.level}/10</p>
          </div>
        </Card>
      )}

      <Button fullWidth variant="secondary" onClick={() => setShowForm(true)}>
        + Подробная запись
      </Button>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-fg">Быстрые техники</h2>
          <button
            onClick={() => navigate('/techniques')}
            className="text-sm text-accent-fg hover:underline"
          >
            Все
          </button>
        </div>
        <div className="space-y-2">
          {quickTechniques.map((t) => (
            <Card
              key={t.id}
              className="flex cursor-pointer items-center gap-3 active:scale-[0.98] transition-transform"
              onClick={() => navigate('/techniques')}
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-soft text-accent-fg">
                {t.category === 'cbt' ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z" />
                  </svg>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-fg text-sm">{t.title}</p>
                <p className="text-xs text-faint">{t.duration}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Modal open={showForm} onClose={() => setShowForm(false)} title="Новая запись">
        <LogAnxietyForm
          onSubmit={(data) => {
            addEntry(data);
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      </Modal>
    </div>
  );
}
