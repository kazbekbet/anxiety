import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders as render } from '@/shared/test/render';
import { Heatmap } from './Heatmap';
import type { AnxietyEntry } from '@/shared/types';

function makeEntry(overrides: Partial<AnxietyEntry> = {}): AnxietyEntry {
  return {
    id: '1',
    level: 5,
    note: '',
    triggers: [],
    timestamp: new Date().toISOString(),
    ...overrides,
  };
}

describe('Heatmap', () => {
  it('renders the three period labels', () => {
    render(<Heatmap entries={[]} />);
    expect(screen.getByText('Утро')).toBeInTheDocument();
    expect(screen.getByText('День')).toBeInTheDocument();
    expect(screen.getByText('Вечер')).toBeInTheDocument();
  });

  it('renders 7 day columns', () => {
    const { container } = render(<Heatmap entries={[]} />);
    // 3 period rows x 7 cells = 21 colored cells
    const cells = container.querySelectorAll('[title]');
    expect(cells).toHaveLength(21);
  });

  it('renders with entries and creates title attributes for non-zero cells', () => {
    const now = new Date();
    // Create a morning entry for today
    const morningDate = new Date(now);
    morningDate.setHours(9, 0, 0, 0);

    const entries = [
      makeEntry({ id: '1', level: 7, timestamp: morningDate.toISOString() }),
    ];

    const { container } = render(<Heatmap entries={entries} />);
    // Should have at least one cell with a non-empty title (indicating data)
    const cellsWithTitle = container.querySelectorAll('[title]');
    const nonEmptyTitles = Array.from(cellsWithTitle).filter(
      (el) => el.getAttribute('title') !== '',
    );
    expect(nonEmptyTitles.length).toBeGreaterThan(0);
  });

  it('renders empty cells (no title) when there are no entries', () => {
    const { container } = render(<Heatmap entries={[]} />);
    const cellsWithTitle = container.querySelectorAll('[title]');
    const nonEmptyTitles = Array.from(cellsWithTitle).filter(
      (el) => el.getAttribute('title') !== '',
    );
    expect(nonEmptyTitles).toHaveLength(0);
  });
});
