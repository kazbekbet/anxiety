import { useState } from 'react';
import { Header } from '@/widgets/header';
import { Modal, Button } from '@/shared/ui';
import { useAnxietyEntries, AnxietyCard } from '@/entities/anxiety';
import { LogAnxietyForm } from '@/features/log-anxiety';

export function DiaryPage() {
  const { entries, addEntry, removeEntry } = useAnxietyEntries();
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="space-y-4">
      <Header title="Дневник" subtitle={`${entries.length} записей`} />

      <Button fullWidth onClick={() => setShowForm(true)}>
        + Новая запись
      </Button>

      {entries.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-lg text-slate-400">Пока пусто</p>
          <p className="mt-1 text-sm text-slate-400">
            Нажмите кнопку выше, чтобы добавить первую запись
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <AnxietyCard key={entry.id} entry={entry} onDelete={removeEntry} />
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
