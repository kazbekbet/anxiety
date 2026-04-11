import { useState, useCallback, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { startOfDay } from 'date-fns';
import type { AnxietyEntry } from '@/shared/types';
import { getFromStorage, saveToStorage } from '@/shared/lib/storage';

const STORAGE_KEY = 'anxiety-entries';

export function useAnxietyEntries() {
  const [entries, setEntries] = useState<AnxietyEntry[]>(() =>
    getFromStorage<AnxietyEntry[]>(STORAGE_KEY, []),
  );

  const persist = useCallback((next: AnxietyEntry[]) => {
    setEntries(next);
    saveToStorage(STORAGE_KEY, next);
  }, []);

  const addEntry = useCallback(
    (data: Omit<AnxietyEntry, 'id' | 'timestamp'>) => {
      const entry: AnxietyEntry = {
        ...data,
        id: uuidv4(),
        timestamp: new Date().toISOString(),
      };
      persist([entry, ...entries]);
    },
    [entries, persist],
  );

  const removeEntry = useCallback(
    (id: string) => {
      persist(entries.filter((e) => e.id !== id));
    },
    [entries, persist],
  );

  const averageByDay = useMemo(() => {
    const groups = new Map<string, number[]>();
    for (const entry of entries) {
      const key = startOfDay(new Date(entry.timestamp)).toISOString();
      const arr = groups.get(key) ?? [];
      arr.push(entry.level);
      groups.set(key, arr);
    }
    const result = new Map<string, number>();
    for (const [key, levels] of groups) {
      result.set(key, Math.round(levels.reduce((a, b) => a + b, 0) / levels.length));
    }
    return result;
  }, [entries]);

  const latestEntry = entries[0] ?? null;

  return { entries, addEntry, removeEntry, averageByDay, latestEntry };
}
