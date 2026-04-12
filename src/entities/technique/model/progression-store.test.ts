import { describe, it, expect, beforeEach } from 'vitest';
import { useProgression } from './progression-store';

describe('useProgression (zustand)', () => {
  beforeEach(() => {
    localStorage.clear();
    useProgression.setState({ usageCounts: {}, manualUnlocks: [] });
  });

  it('starts with empty usageCounts and manualUnlocks', () => {
    const state = useProgression.getState();
    expect(state.usageCounts).toEqual({});
    expect(state.manualUnlocks).toEqual([]);
  });

  describe('recordUsage', () => {
    it('increments usage count for a technique', () => {
      useProgression.getState().recordUsage('breathing');
      expect(useProgression.getState().usageCounts['breathing']).toBe(1);
    });

    it('increments usage count multiple times', () => {
      useProgression.getState().recordUsage('breathing');
      useProgression.getState().recordUsage('breathing');
      useProgression.getState().recordUsage('breathing');
      expect(useProgression.getState().usageCounts['breathing']).toBe(3);
    });

    it('tracks different techniques independently', () => {
      useProgression.getState().recordUsage('breathing');
      useProgression.getState().recordUsage('breathing');
      useProgression.getState().recordUsage('grounding');
      expect(useProgression.getState().usageCounts['breathing']).toBe(2);
      expect(useProgression.getState().usageCounts['grounding']).toBe(1);
    });
  });

  describe('getUsageCount', () => {
    it('returns 0 for unknown technique', () => {
      expect(useProgression.getState().getUsageCount('unknown')).toBe(0);
    });

    it('returns the recorded count', () => {
      useProgression.getState().recordUsage('breathing');
      useProgression.getState().recordUsage('breathing');
      expect(useProgression.getState().getUsageCount('breathing')).toBe(2);
    });
  });

  describe('manualUnlock', () => {
    it('adds technique to manualUnlocks', () => {
      useProgression.getState().manualUnlock('advanced-cbt');
      expect(useProgression.getState().manualUnlocks).toContain('advanced-cbt');
    });

    it('can unlock multiple techniques', () => {
      useProgression.getState().manualUnlock('advanced-cbt');
      useProgression.getState().manualUnlock('exposure');
      expect(useProgression.getState().manualUnlocks).toEqual(['advanced-cbt', 'exposure']);
    });
  });

  describe('isUnlocked', () => {
    it('returns true when no requiredId or requiredUses', () => {
      expect(useProgression.getState().isUnlocked('breathing')).toBe(true);
      expect(useProgression.getState().isUnlocked('breathing', undefined, undefined)).toBe(true);
    });

    it('returns false when required uses not met', () => {
      expect(useProgression.getState().isUnlocked('advanced', 'breathing', 3)).toBe(false);
    });

    it('returns true when required uses are met', () => {
      useProgression.getState().recordUsage('breathing');
      useProgression.getState().recordUsage('breathing');
      useProgression.getState().recordUsage('breathing');
      expect(useProgression.getState().isUnlocked('advanced', 'breathing', 3)).toBe(true);
    });

    it('returns true when technique is manually unlocked regardless of usage', () => {
      useProgression.getState().manualUnlock('advanced');
      expect(useProgression.getState().isUnlocked('advanced', 'breathing', 3)).toBe(true);
    });

    it('returns false when required uses are partially met', () => {
      useProgression.getState().recordUsage('breathing');
      useProgression.getState().recordUsage('breathing');
      expect(useProgression.getState().isUnlocked('advanced', 'breathing', 3)).toBe(false);
    });
  });
});
