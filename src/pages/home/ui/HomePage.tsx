import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/widgets/header';
import { Card, Button, LevelIndicator, Modal } from '@/shared/ui';
import { useAnxietyEntries } from '@/entities/anxiety';
import { LogAnxietyForm } from '@/features/log-anxiety';
import { techniques } from '@/entities/technique';

export function HomePage() {
  const { latestEntry, addEntry } = useAnxietyEntries();
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  const quickTechniques = techniques.slice(0, 3);

  return (
    <div className="space-y-4">
      <Header title="Anxiety Tracker" subtitle="Как вы себя чувствуете?" />

      <Card className="text-center">
        {latestEntry ? (
          <div className="flex flex-col items-center gap-3">
            <p className="text-sm text-slate-500">Последняя запись</p>
            <LevelIndicator level={latestEntry.level} size="lg" />
            <p className="text-sm text-slate-600">
              Уровень тревожности: <strong>{latestEntry.level}/10</strong>
            </p>
          </div>
        ) : (
          <div className="py-4">
            <p className="text-slate-500">Пока нет записей</p>
            <p className="mt-1 text-sm text-slate-400">Начните отслеживать тревожность</p>
          </div>
        )}
      </Card>

      <Button fullWidth onClick={() => setShowForm(true)}>
        + Записать уровень тревожности
      </Button>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">Быстрые техники</h2>
          <button
            onClick={() => navigate('/techniques')}
            className="text-sm text-indigo-500 hover:text-indigo-600"
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
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-500">
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
                <p className="font-medium text-slate-900 text-sm">{t.title}</p>
                <p className="text-xs text-slate-400">{t.duration}</p>
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
