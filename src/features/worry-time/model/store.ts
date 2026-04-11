import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { getFromStorage, saveToStorage } from '@/shared/lib/storage';

export interface WorrySession {
  id: string;
  duration: number; // minutes
  text: string;
  timestamp: string;
}

const STORAGE_KEY = 'worry-sessions';

export function useWorryTime() {
  const [sessions, setSessions] = useState<WorrySession[]>(() =>
    getFromStorage<WorrySession[]>(STORAGE_KEY, []),
  );

  const persist = useCallback((next: WorrySession[]) => {
    setSessions(next);
    saveToStorage(STORAGE_KEY, next);
  }, []);

  const addSession = useCallback(
    (data: Omit<WorrySession, 'id' | 'timestamp'>) => {
      const session: WorrySession = {
        ...data,
        id: uuidv4(),
        timestamp: new Date().toISOString(),
      };
      persist([session, ...sessions]);
    },
    [sessions, persist],
  );

  return { sessions, addSession };
}
