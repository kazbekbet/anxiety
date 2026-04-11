import { describe, it, expect, beforeEach } from 'vitest';
import { useExposure } from './store';

const store = useExposure;

beforeEach(() => {
  localStorage.clear();
  store.setState({ hierarchies: [] });
});

describe('useExposure store', () => {
  // --- addHierarchy ---

  it('addHierarchy adds a hierarchy and returns its id', () => {
    const id = store.getState().addHierarchy('Социальные ситуации');
    const { hierarchies } = store.getState();

    expect(id).toBeDefined();
    expect(typeof id).toBe('string');
    expect(hierarchies).toHaveLength(1);
    expect(hierarchies[0].title).toBe('Социальные ситуации');
    expect(hierarchies[0].steps).toEqual([]);
    expect(hierarchies[0].createdAt).toBeDefined();
  });

  it('addHierarchy prepends new hierarchies (newest first)', () => {
    store.getState().addHierarchy('Первая');
    store.getState().addHierarchy('Вторая');
    const { hierarchies } = store.getState();

    expect(hierarchies).toHaveLength(2);
    expect(hierarchies[0].title).toBe('Вторая');
    expect(hierarchies[1].title).toBe('Первая');
  });

  // --- removeHierarchy ---

  it('removeHierarchy removes the correct hierarchy', () => {
    const id1 = store.getState().addHierarchy('Первая');
    store.getState().addHierarchy('Вторая');

    store.getState().removeHierarchy(id1);
    const { hierarchies } = store.getState();

    expect(hierarchies).toHaveLength(1);
    expect(hierarchies[0].title).toBe('Вторая');
  });

  it('removeHierarchy with unknown id does nothing', () => {
    store.getState().addHierarchy('Единственная');
    store.getState().removeHierarchy('non-existent-id');

    expect(store.getState().hierarchies).toHaveLength(1);
  });

  // --- addStep ---

  it('addStep adds a step to the correct hierarchy', () => {
    const id = store.getState().addHierarchy('Страхи');
    store.getState().addStep(id, 'Позвонить незнакомцу', 40);

    const hierarchy = store.getState().hierarchies.find((h) => h.id === id)!;
    expect(hierarchy.steps).toHaveLength(1);
    expect(hierarchy.steps[0].text).toBe('Позвонить незнакомцу');
    expect(hierarchy.steps[0].suds).toBe(40);
    expect(hierarchy.steps[0].completed).toBe(false);
  });

  it('addStep sorts steps by suds ascending', () => {
    const id = store.getState().addHierarchy('Страхи');
    store.getState().addStep(id, 'Высокая тревога', 80);
    store.getState().addStep(id, 'Низкая тревога', 20);
    store.getState().addStep(id, 'Средняя тревога', 50);

    const hierarchy = store.getState().hierarchies.find((h) => h.id === id)!;
    expect(hierarchy.steps.map((s) => s.suds)).toEqual([20, 50, 80]);
    expect(hierarchy.steps.map((s) => s.text)).toEqual([
      'Низкая тревога',
      'Средняя тревога',
      'Высокая тревога',
    ]);
  });

  // --- toggleStep ---

  it('toggleStep marks a step as completed', () => {
    const id = store.getState().addHierarchy('Страхи');
    store.getState().addStep(id, 'Шаг 1', 30);

    const stepId = store.getState().hierarchies[0].steps[0].id;
    store.getState().toggleStep(id, stepId);

    const step = store.getState().hierarchies[0].steps[0];
    expect(step.completed).toBe(true);
    expect(step.completedAt).toBeDefined();
  });

  it('toggleStep uncompletes a completed step', () => {
    const id = store.getState().addHierarchy('Страхи');
    store.getState().addStep(id, 'Шаг 1', 30);

    const stepId = store.getState().hierarchies[0].steps[0].id;
    store.getState().toggleStep(id, stepId); // complete
    store.getState().toggleStep(id, stepId); // uncomplete

    const step = store.getState().hierarchies[0].steps[0];
    expect(step.completed).toBe(false);
    expect(step.completedAt).toBeUndefined();
  });

  it('toggleStep saves a note when provided', () => {
    const id = store.getState().addHierarchy('Страхи');
    store.getState().addStep(id, 'Шаг 1', 30);

    const stepId = store.getState().hierarchies[0].steps[0].id;
    store.getState().toggleStep(id, stepId, 'Было страшно, но справился');

    const step = store.getState().hierarchies[0].steps[0];
    expect(step.note).toBe('Было страшно, но справился');
  });

  // --- removeStep ---

  it('removeStep removes the correct step', () => {
    const id = store.getState().addHierarchy('Страхи');
    store.getState().addStep(id, 'Шаг 1', 30);
    store.getState().addStep(id, 'Шаг 2', 60);

    const stepId = store.getState().hierarchies[0].steps[0].id;
    store.getState().removeStep(id, stepId);

    const hierarchy = store.getState().hierarchies[0];
    expect(hierarchy.steps).toHaveLength(1);
    expect(hierarchy.steps[0].text).toBe('Шаг 2');
  });

  // --- persist ---

  it('persists hierarchies to localStorage', () => {
    store.getState().addHierarchy('Persist test');

    const raw = localStorage.getItem('exposure-hierarchies');
    expect(raw).not.toBeNull();

    const parsed = JSON.parse(raw!);
    expect(parsed.state.hierarchies).toHaveLength(1);
    expect(parsed.state.hierarchies[0].title).toBe('Persist test');
  });
});
