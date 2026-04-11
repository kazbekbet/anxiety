import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAnxietyEntries } from './store';

describe('useAnxietyEntries', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts with empty entries', () => {
    const { result } = renderHook(() => useAnxietyEntries());
    expect(result.current.entries).toEqual([]);
    expect(result.current.latestEntry).toBeNull();
  });

  it('adds an entry', () => {
    const { result } = renderHook(() => useAnxietyEntries());

    act(() => {
      result.current.addEntry({ level: 7, note: 'Test', triggers: ['Работа'] });
    });

    expect(result.current.entries).toHaveLength(1);
    expect(result.current.entries[0].level).toBe(7);
    expect(result.current.entries[0].note).toBe('Test');
    expect(result.current.latestEntry?.level).toBe(7);
  });

  it('removes an entry', () => {
    const { result } = renderHook(() => useAnxietyEntries());

    act(() => {
      result.current.addEntry({ level: 5, note: '', triggers: [] });
    });

    const id = result.current.entries[0].id;

    act(() => {
      result.current.removeEntry(id);
    });

    expect(result.current.entries).toHaveLength(0);
  });

  it('persists entries to localStorage', () => {
    const { result } = renderHook(() => useAnxietyEntries());

    act(() => {
      result.current.addEntry({ level: 3, note: 'Persisted', triggers: [] });
    });

    const stored = JSON.parse(localStorage.getItem('anxiety-entries') ?? '[]');
    expect(stored).toHaveLength(1);
    expect(stored[0].note).toBe('Persisted');
  });
});
