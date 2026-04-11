import { describe, it, expect, beforeEach } from 'vitest';
import { getFromStorage, saveToStorage } from './storage';

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns fallback when key does not exist', () => {
    expect(getFromStorage('missing', [])).toEqual([]);
  });

  it('saves and retrieves data', () => {
    saveToStorage('key', { a: 1 });
    expect(getFromStorage('key', null)).toEqual({ a: 1 });
  });

  it('returns fallback on corrupted data', () => {
    localStorage.setItem('bad', 'not-json{');
    expect(getFromStorage('bad', 'fallback')).toBe('fallback');
  });
});
