import { describe, it, expect, beforeEach } from 'vitest';
import { useAnxietyEntries } from './store';

describe('useAnxietyEntries (zustand)', () => {
  beforeEach(() => {
    localStorage.clear();
    useAnxietyEntries.setState({ entries: [] });
  });

  it('starts with empty entries', () => {
    expect(useAnxietyEntries.getState().entries).toEqual([]);
  });

  it('adds an entry', () => {
    useAnxietyEntries.getState().addEntry({ level: 7, note: 'Test', triggers: ['Работа'] });

    const { entries } = useAnxietyEntries.getState();
    expect(entries).toHaveLength(1);
    expect(entries[0].level).toBe(7);
    expect(entries[0].note).toBe('Test');
  });

  it('updates an entry', () => {
    useAnxietyEntries.getState().addEntry({ level: 5, note: 'Old', triggers: [] });
    const id = useAnxietyEntries.getState().entries[0].id;

    useAnxietyEntries.getState().updateEntry(id, { note: 'New', level: 3 });

    const updated = useAnxietyEntries.getState().entries[0];
    expect(updated.note).toBe('New');
    expect(updated.level).toBe(3);
  });

  it('removes an entry', () => {
    useAnxietyEntries.getState().addEntry({ level: 5, note: '', triggers: [] });
    const id = useAnxietyEntries.getState().entries[0].id;

    useAnxietyEntries.getState().removeEntry(id);
    expect(useAnxietyEntries.getState().entries).toHaveLength(0);
  });

  it('persists entries to localStorage', () => {
    useAnxietyEntries.getState().addEntry({ level: 3, note: 'Persisted', triggers: [] });

    const stored = JSON.parse(localStorage.getItem('anxiety-entries') ?? '{}');
    expect(stored.state.entries).toHaveLength(1);
    expect(stored.state.entries[0].note).toBe('Persisted');
  });
});
