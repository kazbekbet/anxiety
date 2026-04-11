import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export interface ExposureStep {
  id: string;
  text: string;
  suds: number; // 0-100
  completed: boolean;
  completedAt?: string;
  note?: string;
}

export interface ExposureHierarchy {
  id: string;
  title: string;
  steps: ExposureStep[];
  createdAt: string;
}

interface ExposureState {
  hierarchies: ExposureHierarchy[];
  addHierarchy: (title: string) => string;
  removeHierarchy: (id: string) => void;
  addStep: (hierarchyId: string, text: string, suds: number) => void;
  toggleStep: (hierarchyId: string, stepId: string, note?: string) => void;
  removeStep: (hierarchyId: string, stepId: string) => void;
}

export const useExposure = create<ExposureState>()(
  persist(
    (set) => ({
      hierarchies: [],
      addHierarchy: (title) => {
        const id = uuidv4();
        set((state) => ({
          hierarchies: [
            { id, title, steps: [], createdAt: new Date().toISOString() },
            ...state.hierarchies,
          ],
        }));
        return id;
      },
      removeHierarchy: (id) =>
        set((state) => ({
          hierarchies: state.hierarchies.filter((h) => h.id !== id),
        })),
      addStep: (hierarchyId, text, suds) =>
        set((state) => ({
          hierarchies: state.hierarchies.map((h) =>
            h.id === hierarchyId
              ? {
                  ...h,
                  steps: [...h.steps, { id: uuidv4(), text, suds, completed: false }].sort(
                    (a, b) => a.suds - b.suds,
                  ),
                }
              : h,
          ),
        })),
      toggleStep: (hierarchyId, stepId, note) =>
        set((state) => ({
          hierarchies: state.hierarchies.map((h) =>
            h.id === hierarchyId
              ? {
                  ...h,
                  steps: h.steps.map((s) =>
                    s.id === stepId
                      ? { ...s, completed: !s.completed, completedAt: !s.completed ? new Date().toISOString() : undefined, note: note ?? s.note }
                      : s,
                  ),
                }
              : h,
          ),
        })),
      removeStep: (hierarchyId, stepId) =>
        set((state) => ({
          hierarchies: state.hierarchies.map((h) =>
            h.id === hierarchyId
              ? { ...h, steps: h.steps.filter((s) => s.id !== stepId) }
              : h,
          ),
        })),
    }),
    { name: 'exposure-hierarchies', storage: createJSONStorage(() => localStorage) },
  ),
);
