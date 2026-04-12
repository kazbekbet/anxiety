import { useState, useMemo } from 'react';
import { startOfDay } from 'date-fns';
import { Header } from '@/widgets/header';
import { Modal, Button } from '@/shared/ui';
import { useAnxietyEntries, AnxietyCard } from '@/entities/anxiety';
import { ValuesDiaryForm } from '@/features/values-diary';
import { LogAnxietyForm } from '@/features/log-anxiety';
import { formatEntryDate } from '@/shared/lib/date';
import type { AnxietyEntry } from '@/shared/types';

export function DiaryPage() {
  const entries = useAnxietyEntries((s) => s.entries);
  const addEntry = useAnxietyEntries((s) => s.addEntry);
  const removeEntry = useAnxietyEntries((s) => s.removeEntry);
  const [showForm, setShowForm] = useState(false);
  const [showValues, setShowValues] = useState(false);

  const grouped = useMemo(() => {
    const groups: { date: string; label: string; entries: AnxietyEntry[] }[] = [];
    let currentKey = '';

    for (const entry of entries) {
      const key = startOfDay(new Date(entry.timestamp)).toISOString();
      if (key !== currentKey) {
        currentKey = key;
        groups.push({ date: key, label: formatEntryDate(entry.timestamp), entries: [entry] });
      } else {
        groups[groups.length - 1].entries.push(entry);
      }
    }
    return groups;
  }, [entries]);

  return (
    <div className="space-y-4">
      <Header title="Дневник" subtitle={`${entries.length} записей`} />

      <div className="flex gap-2">
        <Button fullWidth onClick={() => setShowForm(true)}>
          + Запись
        </Button>
        <Button fullWidth variant="secondary" onClick={() => setShowValues(true)}>
          Ценности
        </Button>
      </div>

      {entries.length === 0 ? (
        <div className="flex flex-col items-center py-12 text-center px-4">
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="mb-5 text-accent-soft opacity-80">
            <rect x="16" y="12" width="48" height="56" rx="8" fill="currentColor"/>
            <rect x="26" y="28" width="28" height="3" rx="1.5" fill="white" opacity="0.6"/>
            <rect x="26" y="36" width="20" height="3" rx="1.5" fill="white" opacity="0.4"/>
            <rect x="26" y="44" width="24" height="3" rx="1.5" fill="white" opacity="0.4"/>
          </svg>
          <p className="text-base font-semibold text-fg">Ваш дневник ждёт вас</p>
          <p className="mt-2 text-sm text-muted max-w-[260px] leading-relaxed">
            Записывайте моменты тревоги — это помогает увидеть паттерны и стать спокойнее
          </p>
          <Button className="mt-6" onClick={() => setShowForm(true)}>
            Добавить первую запись
          </Button>
        </div>
      ) : (
        <div className="space-y-5">
          {grouped.map((group) => (
            <div key={group.date}>
              <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-faint">
                {group.label}
              </p>
              <div className="space-y-3">
                {group.entries.map((entry) => (
                  <AnxietyCard key={entry.id} entry={entry} onDelete={removeEntry} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={showForm} onClose={() => setShowForm(false)} title="Новая запись">
        <LogAnxietyForm
          onSubmit={(data) => {
            addEntry(data);
            setShowForm(false);
          }}
          onCancel={() => setShowForm(false)}
        />
      </Modal>

      <Modal open={showValues} onClose={() => setShowValues(false)} title="Дневник ценностей">
        <ValuesDiaryForm
          onComplete={() => setShowValues(false)}
          onCancel={() => setShowValues(false)}
        />
      </Modal>
    </div>
  );
}
