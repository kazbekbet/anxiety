import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import type { TestResult } from '@/shared/types';

interface AssessmentState {
  results: TestResult[];
  addResult: (data: Omit<TestResult, 'id' | 'timestamp'>) => void;
}

export const useAssessmentResults = create<AssessmentState>()(
  persist(
    (set) => ({
      results: [],
      addResult: (data) =>
        set((state) => ({
          results: [
            { ...data, id: uuidv4(), timestamp: new Date().toISOString() },
            ...state.results,
          ],
        })),
    }),
    { name: 'assessment-results', version: 1, storage: createJSONStorage(() => localStorage) },
  ),
);
