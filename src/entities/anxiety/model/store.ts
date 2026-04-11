import { useMemo } from 'react';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { startOfDay } from 'date-fns';
import type { AnxietyEntry } from '@/shared/types';

interface AnxietyEntriesState {
  entries: AnxietyEntry[];
  addEntry: (data: Omit<AnxietyEntry, 'id' | 'timestamp'>) => void;
  updateEntry: (id: string, data: Partial<Omit<AnxietyEntry, 'id' | 'timestamp'>>) => void;
  removeEntry: (id: string) => void;
}

export const useAnxietyEntries = create<AnxietyEntriesState>()(
  persist(
    (set) => ({
      entries: [],
      addEntry: (data) =>
        set((state) => ({
          entries: [
            { ...data, id: uuidv4(), timestamp: new Date().toISOString() },
            ...state.entries,
          ],
        })),
      updateEntry: (id, data) =>
        set((state) => ({
          entries: state.entries.map((e) => (e.id === id ? { ...e, ...data } : e)),
        })),
      removeEntry: (id) =>
        set((state) => ({
          entries: state.entries.filter((e) => e.id !== id),
        })),
    }),
    {
      name: 'anxiety-entries',
      version: 1,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

export function useAverageByDay() {
  const entries = useAnxietyEntries((s) => s.entries);
  return useMemo(() => {
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
}
