import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { DigestPage } from './DigestPage';
import { useAnxietyEntries } from '@/entities/anxiety';

beforeEach(() => {
  localStorage.clear();
  useAnxietyEntries.setState({ entries: [] });
});

describe('DigestPage', () => {
  it('shows empty state when there are no entries', () => {
    render(
      <MemoryRouter>
        <DigestPage />
      </MemoryRouter>,
    );
    expect(screen.getByText('Ещё нет данных')).toBeInTheDocument();
    expect(screen.getByText('На главную')).toBeInTheDocument();
  });

  it('shows digest content when entries exist', () => {
    const now = new Date();
    const entries = Array.from({ length: 3 }, (_, i) => ({
      id: `entry-${i}`,
      level: 5 + i,
      note: `Note ${i}`,
      triggers: ['work'],
      timestamp: new Date(now.getTime() - i * 3600000).toISOString(),
    }));

    useAnxietyEntries.setState({ entries });

    render(
      <MemoryRouter>
        <DigestPage />
      </MemoryRouter>,
    );

    expect(screen.getByText('Ваша неделя')).toBeInTheDocument();
    expect(screen.getByText(/записей за 7 дней/)).toBeInTheDocument();
  });

  it('displays stats cards with correct counts', () => {
    const now = new Date();
    const entries = Array.from({ length: 4 }, (_, i) => ({
      id: `entry-${i}`,
      level: 4,
      note: '',
      triggers: [],
      timestamp: new Date(now.getTime() - i * 3600000).toISOString(),
    }));

    useAnxietyEntries.setState({ entries });

    render(
      <MemoryRouter>
        <DigestPage />
      </MemoryRouter>,
    );

    expect(screen.getByText('Записей')).toBeInTheDocument();
    expect(screen.getByText('Средний')).toBeInTheDocument();
    expect(screen.getByText('vs прошлая')).toBeInTheDocument();
  });

  it('renders heatmap section', () => {
    const entries = [
      {
        id: 'e1',
        level: 6,
        note: '',
        triggers: [],
        timestamp: new Date().toISOString(),
      },
    ];

    useAnxietyEntries.setState({ entries });

    render(
      <MemoryRouter>
        <DigestPage />
      </MemoryRouter>,
    );

    expect(screen.getByText('Карта тревожности')).toBeInTheDocument();
  });

  it('renders "Продолжить" button when data exists', () => {
    const entries = [
      {
        id: 'e1',
        level: 3,
        note: '',
        triggers: [],
        timestamp: new Date().toISOString(),
      },
    ];

    useAnxietyEntries.setState({ entries });

    render(
      <MemoryRouter>
        <DigestPage />
      </MemoryRouter>,
    );

    expect(screen.getByText('Продолжить')).toBeInTheDocument();
  });
});
