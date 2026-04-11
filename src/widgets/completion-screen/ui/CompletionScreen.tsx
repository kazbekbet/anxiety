import { Button, Card } from '@/shared/ui';

interface CompletionScreenProps {
  elapsedSeconds: number;
  /** For thought records: show "Было: N/10 -> Стало: M/10" */
  thoughtRecordDiff?: { before: number; after: number };
  onClose: () => void;
}

export function CompletionScreen({
  elapsedSeconds,
  thoughtRecordDiff,
  onClose,
}: CompletionScreenProps) {
  const minutes = Math.max(1, Math.round(elapsedSeconds / 60));

  return (
    <div className="space-y-4">
      <Card className="bg-emerald-50 text-center dark:bg-emerald-950">
        <div className="mb-2 text-4xl">&#10003;</div>
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-50">
          Отлично!
        </h3>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
          Вы практиковали {minutes}{' '}
          {minutes === 1
            ? 'минуту'
            : minutes >= 2 && minutes <= 4
              ? 'минуты'
              : 'минут'}
        </p>

        {thoughtRecordDiff && (
          <div className="mt-3 rounded-xl bg-slate-100 p-3 text-sm text-slate-700 dark:bg-slate-700 dark:text-slate-300">
            <p>
              Было: <strong>{thoughtRecordDiff.before}/10</strong> &rarr; Стало:{' '}
              <strong>{thoughtRecordDiff.after}/10</strong>
            </p>
          </div>
        )}
      </Card>

      <Button type="button" fullWidth onClick={onClose}>
        Закрыть
      </Button>
    </div>
  );
}
