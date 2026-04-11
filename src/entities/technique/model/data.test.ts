import { describe, it, expect } from 'vitest';
import { techniques } from './data';

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
});
