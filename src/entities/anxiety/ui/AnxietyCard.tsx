import type { AnxietyEntry } from '@/shared/types';
import { Card, LevelIndicator, LevelBar } from '@/shared/ui';
import { formatEntryDate, formatTime } from '@/shared/lib/date';

interface AnxietyCardProps {
  entry: AnxietyEntry;
  onDelete?: (id: string) => void;
}

export function AnxietyCard({ entry, onDelete }: AnxietyCardProps) {
  return (
    <Card className="flex gap-3">
      <LevelIndicator level={entry.level} />
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700">
            {formatEntryDate(entry.timestamp)}
          </span>
          <span className="text-xs text-slate-400">{formatTime(entry.timestamp)}</span>
        </div>
        <LevelBar level={entry.level} />
        {entry.note && <p className="mt-1.5 text-sm text-slate-600 line-clamp-2">{entry.note}</p>}
        {entry.triggers.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {entry.triggers.map((t) => (
              <span key={t} className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs text-indigo-600">
                {t}
              </span>
            ))}
          </div>
        )}
        {onDelete && (
          <button
            onClick={() => onDelete(entry.id)}
            className="mt-2 text-xs text-slate-400 hover:text-red-500 transition-colors"
          >
            Удалить
          </button>
        )}
      </div>
    </Card>
  );
}
