import { describe, it, expect } from 'vitest';
import { techniques } from './data';
import type { TechniqueSituation } from '@/shared/types';

const validSituations: TechniqueSituation[] = ['panic', 'rumination', 'deep-work'];

describe('techniques data', () => {
  it('contains techniques', () => {
    expect(techniques.length).toBeGreaterThan(0);
  });

  it('each technique has required fields', () => {
    for (const t of techniques) {
      expect(t.id).toBeTruthy();
      expect(t.title).toBeTruthy();
      expect(t.description).toBeTruthy();
      expect(['cbt', 'existential']).toContain(t.category);
      expect(t.steps.length).toBeGreaterThan(0);
    }
  });

  it('has both CBT and existential techniques', () => {
    const cbt = techniques.filter((t) => t.category === 'cbt');
    const existential = techniques.filter((t) => t.category === 'existential');
    expect(cbt.length).toBeGreaterThan(0);
    expect(existential.length).toBeGreaterThan(0);
  });

  it('every technique has a valid situation field', () => {
    for (const t of techniques) {
      expect(validSituations).toContain(t.situation);
    }
  });

  it('contains defusion-leaves technique', () => {
    expect(techniques.find((t) => t.id === 'defusion-leaves')).toBeDefined();
  });

  it('contains defusion-radio technique', () => {
    expect(techniques.find((t) => t.id === 'defusion-radio')).toBeDefined();
  });

  it('contains defusion-thanks technique', () => {
    expect(techniques.find((t) => t.id === 'defusion-thanks')).toBeDefined();
  });

  it.each(validSituations)('situation "%s" has at least 2 techniques', (situation) => {
    const count = techniques.filter((t) => t.situation === situation).length;
    expect(count).toBeGreaterThanOrEqual(2);
  });
});
