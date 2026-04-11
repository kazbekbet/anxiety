import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { ThoughtRecord } from '@/shared/types';

interface ThoughtRecordsState {
  records: ThoughtRecord[];
  addRecord: (data: Omit<ThoughtRecord, 'id' | 'timestamp'>) => void;
  removeRecord: (id: string) => void;
}

export const useThoughtRecords = create<ThoughtRecordsState>()(
  persist(
    (set) => ({
      records: [],
      addRecord: (data) =>
        set((state) => ({
          records: [
            { ...data, id: uuidv4(), timestamp: new Date().toISOString() },
            ...state.records,
          ],
        })),
      removeRecord: (id) =>
        set((state) => ({
          records: state.records.filter((r) => r.id !== id),
        })),
    }),
    {
      name: 'thought-records',
      version: 1,
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
