import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ProgressCard } from './ProgressCard';
import { useAnxietyEntries } from '@/entities/anxiety/model/store';
import { useThoughtRecords } from '@/entities/anxiety/model/thought-store';

function makeEntry(level: number, dayOffset: number) {
  const d = new Date();
  d.setDate(d.getDate() - dayOffset);
  return {
    id: `e-${level}-${dayOffset}-${Math.random()}`,
    level,
    note: '',
    triggers: [],
    timestamp: d.toISOString(),
  };
}

function makeThoughtRecord(emotionIntensity: number, newEmotionIntensity: number) {
  return {
    id: `tr-${Math.random()}`,
    situation: 'test',
    automaticThought: 'bad',
    emotion: 'anxiety',
    emotionIntensity,
    cognitiveDistortions: ['catastrophizing' as const],
    alternativeThought: 'ok',
    newEmotionIntensity,
    timestamp: new Date().toISOString(),
  };
}

describe('ProgressCard', () => {
  beforeEach(() => {
    localStorage.clear();
    useAnxietyEntries.setState({ entries: [] });
    useThoughtRecords.setState({ records: [] });
  });

  it('renders nothing when no entries and no records', () => {
    const { container } = render(<ProgressCard />);
    expect(container.innerHTML).toBe('');
  });

  it('shows "add more entries" message when between 1 and 6 entries (with thought records to prevent early null)', () => {
    useAnxietyEntries.setState({
      entries: [makeEntry(5, 0), makeEntry(4, 1), makeEntry(3, 2)],
    });
    useThoughtRecords.setState({
      records: [makeThoughtRecord(8, 4)],
    });

    render(<ProgressCard />);
    expect(screen.getByText(/Добавьте ещё 4 записей/)).toBeInTheDocument();
  });

  it('shows anxiety progress when >= 7 entries', () => {
    const entries = Array.from({ length: 10 }, (_, i) =>
      makeEntry(i < 5 ? 8 : 3, 10 - i),
    );
    useAnxietyEntries.setState({ entries });

    render(<ProgressCard />);
    expect(screen.getByText('Уровень тревожности')).toBeInTheDocument();
    expect(screen.getByText(/Улучшение на/)).toBeInTheDocument();
  });

  it('shows worsening when last entries are higher', () => {
    // First 7 low, last 7 high
    const entries = [
      ...Array.from({ length: 7 }, (_, i) => makeEntry(2, 20 - i)),
      ...Array.from({ length: 7 }, (_, i) => makeEntry(9, 6 - i)),
    ];
    useAnxietyEntries.setState({ entries });

    render(<ProgressCard />);
    expect(screen.getByText(/Рост на/)).toBeInTheDocument();
  });

  it('shows thought effectiveness when records exist', () => {
    useThoughtRecords.setState({
      records: [makeThoughtRecord(8, 4), makeThoughtRecord(6, 2)],
    });

    render(<ProgressCard />);
    expect(screen.getByText('Эффективность записей мыслей')).toBeInTheDocument();
    expect(screen.getByText(/Среднее снижение интенсивности/)).toBeInTheDocument();
  });
});
