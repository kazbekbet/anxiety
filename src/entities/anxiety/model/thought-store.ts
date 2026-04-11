import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { ThoughtRecord } from '@/shared/types';
import { getFromStorage, saveToStorage } from '@/shared/lib/storage';

const STORAGE_KEY = 'thought-records';

export function useThoughtRecords() {
  const [records, setRecords] = useState<ThoughtRecord[]>(() =>
    getFromStorage<ThoughtRecord[]>(STORAGE_KEY, []),
  );

  const persist = useCallback((next: ThoughtRecord[]) => {
    setRecords(next);
    saveToStorage(STORAGE_KEY, next);
  }, []);

  const addRecord = useCallback(
    (data: Omit<ThoughtRecord, 'id' | 'timestamp'>) => {
      const record: ThoughtRecord = {
        ...data,
        id: uuidv4(),
        timestamp: new Date().toISOString(),
      };
      persist([record, ...records]);
    },
    [records, persist],
  );

  const removeRecord = useCallback(
    (id: string) => {
      persist(records.filter((r) => r.id !== id));
    },
    [records, persist],
  );

  return { records, addRecord, removeRecord };
}
