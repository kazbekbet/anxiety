import { describe, it, expect, beforeEach } from 'vitest';
import { useValuesStore } from './store';

describe('useValuesStore (zustand)', () => {
  beforeEach(() => {
    localStorage.clear();
    useValuesStore.setState({ entries: [] });
  });

  it('starts with empty entries', () => {
    expect(useValuesStore.getState().entries).toEqual([]);
  });

  it('adds an entry with generated id and timestamp', () => {
    useValuesStore.getState().addEntry({
      values: [{ valueId: 'family', score: 8 }],
      action: 'Call mom',
    });

    const { entries } = useValuesStore.getState();
    expect(entries).toHaveLength(1);
    expect(entries[0].values).toEqual([{ valueId: 'family', score: 8 }]);
    expect(entries[0].action).toBe('Call mom');
    expect(entries[0].id).toBeDefined();
    expect(entries[0].timestamp).toBeDefined();
  });

  it('prepends new entries (newest first)', () => {
    useValuesStore.getState().addEntry({
      values: [{ valueId: 'health', score: 5 }],
      action: 'First',
    });
    useValuesStore.getState().addEntry({
      values: [{ valueId: 'career', score: 7 }],
      action: 'Second',
    });

    const { entries } = useValuesStore.getState();
    expect(entries).toHaveLength(2);
    expect(entries[0].action).toBe('Second');
    expect(entries[1].action).toBe('First');
  });

  it('generates unique ids for each entry', () => {
    useValuesStore.getState().addEntry({
      values: [{ valueId: 'family', score: 8 }],
      action: 'Action 1',
    });
    useValuesStore.getState().addEntry({
      values: [{ valueId: 'health', score: 6 }],
      action: 'Action 2',
    });

    const { entries } = useValuesStore.getState();
    expect(entries[0].id).not.toBe(entries[1].id);
  });

  it('supports multiple values in a single entry', () => {
    useValuesStore.getState().addEntry({
      values: [
        { valueId: 'family', score: 8 },
        { valueId: 'health', score: 6 },
        { valueId: 'creativity', score: 9 },
      ],
      action: 'Multi-value entry',
    });

    const { entries } = useValuesStore.getState();
    expect(entries[0].values).toHaveLength(3);
  });

  it('persists entries to localStorage', () => {
    useValuesStore.getState().addEntry({
      values: [{ valueId: 'freedom', score: 7 }],
      action: 'Travel',
    });

    const stored = JSON.parse(localStorage.getItem('values-diary') ?? '{}');
    expect(stored.state.entries).toHaveLength(1);
    expect(stored.state.entries[0].action).toBe('Travel');
  });
});
