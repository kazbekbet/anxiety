import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export interface WorrySession {
  id: string;
  duration: number;
  text: string;
  timestamp: string;
}

interface WorryTimeState {
  sessions: WorrySession[];
  addSession: (data: Omit<WorrySession, 'id' | 'timestamp'>) => void;
}

export const useWorryTime = create<WorryTimeState>()(
  persist(
    (set) => ({
      sessions: [],
      addSession: (data) =>
        set((state) => ({
          sessions: [
            { ...data, id: uuidv4(), timestamp: new Date().toISOString() },
            ...state.sessions,
          ],
        })),
    }),
    { name: 'worry-sessions', version: 1, storage: createJSONStorage(() => localStorage) },
  ),
);
