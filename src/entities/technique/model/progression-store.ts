import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface ProgressionState {
  usageCounts: Record<string, number>;
  manualUnlocks: string[];
  recordUsage: (techniqueId: string) => void;
  manualUnlock: (techniqueId: string) => void;
  isUnlocked: (techniqueId: string, requiredId?: string, requiredUses?: number) => boolean;
  getUsageCount: (techniqueId: string) => number;
}

export const useProgression = create<ProgressionState>()(
  persist(
    (set, get) => ({
      usageCounts: {},
      manualUnlocks: [],
      recordUsage: (techniqueId) =>
        set((state) => ({
          usageCounts: {
            ...state.usageCounts,
            [techniqueId]: (state.usageCounts[techniqueId] ?? 0) + 1,
          },
        })),
      manualUnlock: (techniqueId) =>
        set((state) => ({
          manualUnlocks: [...state.manualUnlocks, techniqueId],
        })),
      isUnlocked: (techniqueId, requiredId, requiredUses) => {
        if (!requiredId || !requiredUses) return true;
        const state = get();
        if (state.manualUnlocks.includes(techniqueId)) return true;
        return (state.usageCounts[requiredId] ?? 0) >= requiredUses;
      },
      getUsageCount: (techniqueId) => get().usageCounts[techniqueId] ?? 0,
    }),
    { name: 'technique-progression', storage: createJSONStorage(() => localStorage) },
  ),
);
