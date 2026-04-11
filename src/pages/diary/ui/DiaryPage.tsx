import { useState, useMemo } from 'react';
import { startOfDay } from 'date-fns';
import { Header } from '@/widgets/header';
import { Modal, Button } from '@/shared/ui';
import { useAnxietyEntries, AnxietyCard } from '@/entities/anxiety';
import { LogAnxietyForm } from '@/features/log-anxiety';
import { formatEntryDate } from '@/shared/lib/date';
import type { AnxietyEntry } from '@/shared/types';

export function DiaryPage() {
  const entries = useAnxietyEntries((s) => s.entries);
  const addEntry = useAnxietyEntries((s) => s.addEntry);
  const removeEntry = useAnxietyEntries((s) => s.removeEntry);
  const [showForm, setShowForm] = useState(false);

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

      <Button fullWidth onClick={() => setShowForm(true)}>
        + Новая запись
      </Button>

      {entries.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-lg text-faint">Пока пусто</p>
          <p className="mt-1 text-sm text-faint">
            Нажмите кнопку выше, чтобы добавить первую запись
          </p>
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
    </div>
  );
}
