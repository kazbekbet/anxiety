import { Button, Card } from '@/shared/ui';

interface CompletionScreenProps {
  elapsedSeconds: number;
  thoughtRecordDiff?: { before: number; after: number };
  onClose: () => void;
  /** Текст кнопки закрытия. По умолчанию «Закрыть» (для модалки). На странице передавайте «К техникам». */
  closeLabel?: string;
}

export function CompletionScreen({ elapsedSeconds, thoughtRecordDiff, onClose, closeLabel = 'Закрыть' }: CompletionScreenProps) {
  const minutes = Math.max(1, Math.round(elapsedSeconds / 60));

  return (
    <div className="space-y-4">
      <Card className="bg-emerald-50 text-center dark:bg-emerald-950">
        <div className="mb-2 text-4xl">&#10003;</div>
        <h3 className="text-lg font-semibold text-fg">Отлично!</h3>
        <p className="mt-1 text-sm text-muted">
          Вы практиковали {minutes} {minutes === 1 ? 'минуту' : minutes >= 2 && minutes <= 4 ? 'минуты' : 'минут'}
        </p>
        {thoughtRecordDiff && (
          <div className="mt-3 rounded-xl bg-elevated p-3 text-sm text-subtle">
            <p>Было: <strong>{thoughtRecordDiff.before}/10</strong> &rarr; Стало: <strong>{thoughtRecordDiff.after}/10</strong></p>
          </div>
        )}
      </Card>
      <Button type="button" fullWidth onClick={onClose}>{closeLabel}</Button>
    </div>
  );
}
