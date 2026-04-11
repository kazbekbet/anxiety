import { useCallback } from 'react';
import { format } from 'date-fns';
import { Button } from '@/shared/ui';
import type { AnxietyEntry, ThoughtRecord } from '@/shared/types';

interface ExportButtonProps {
  entries: AnxietyEntry[];
  records: ThoughtRecord[];
}

export function ExportButton({ entries, records }: ExportButtonProps) {
  const handleExport = useCallback(() => {
    const data = { entries, thoughtRecords: records };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const dateStr = format(new Date(), 'yyyy-MM-dd');
    const a = document.createElement('a');
    a.href = url;
    a.download = `anxiety-data-${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [entries, records]);

  return (
    <Button variant="secondary" fullWidth onClick={handleExport}>
      Экспортировать данные
    </Button>
  );
}
