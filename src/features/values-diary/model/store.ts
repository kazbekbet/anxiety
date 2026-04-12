import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { ValueEntry } from '@/shared/types';

interface ValuesState {
  entries: ValueEntry[];
  addEntry: (data: Omit<ValueEntry, 'id' | 'timestamp'>) => void;
}

export const useValuesStore = create<ValuesState>()(
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
    }),
    { name: 'values-diary', storage: createJSONStorage(() => localStorage) },
  ),
);
