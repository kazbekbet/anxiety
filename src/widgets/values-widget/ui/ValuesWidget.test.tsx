import { describe, it, expect, beforeEach } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders as render } from '@/shared/test/render';
import { ValuesWidget } from './ValuesWidget';
import { useValuesStore } from '@/features/values-diary';

describe('ValuesWidget', () => {
  beforeEach(() => {
    localStorage.clear();
    useValuesStore.setState({ entries: [] });
  });

  it('renders nothing when there are no entries', () => {
    render(<ValuesWidget />);
    expect(screen.queryByText('Ваши ценности')).not.toBeInTheDocument();
  });

  it('renders the heading when an entry exists', () => {
    useValuesStore.setState({
      entries: [
        {
          id: '1',
          values: [{ valueId: 'family', score: 8 }],
          action: 'Call mom',
          timestamp: new Date().toISOString(),
        },
      ],
    });

    render(<ValuesWidget />);
    expect(screen.getByText('Ваши ценности')).toBeInTheDocument();
  });

  it('displays the value label and score from the latest entry', () => {
    useValuesStore.setState({
      entries: [
        {
          id: '1',
          values: [{ valueId: 'family', score: 8 }],
          action: '',
          timestamp: new Date().toISOString(),
        },
      ],
    });

    render(<ValuesWidget />);
    expect(screen.getByText('Семья')).toBeInTheDocument();
    expect(screen.getByText('8/10')).toBeInTheDocument();
  });

  it('displays multiple values from the latest entry', () => {
    useValuesStore.setState({
      entries: [
        {
          id: '1',
          values: [
            { valueId: 'family', score: 8 },
            { valueId: 'health', score: 6 },
          ],
          action: '',
          timestamp: new Date().toISOString(),
        },
      ],
    });

    render(<ValuesWidget />);
    expect(screen.getByText('Семья')).toBeInTheDocument();
    expect(screen.getByText('Здоровье')).toBeInTheDocument();
    expect(screen.getByText('8/10')).toBeInTheDocument();
    expect(screen.getByText('6/10')).toBeInTheDocument();
  });

  it('displays the action when present', () => {
    useValuesStore.setState({
      entries: [
        {
          id: '1',
          values: [{ valueId: 'family', score: 7 }],
          action: 'Go for a walk',
          timestamp: new Date().toISOString(),
        },
      ],
    });

    render(<ValuesWidget />);
    expect(screen.getByText('Действие на неделю')).toBeInTheDocument();
    expect(screen.getByText('Go for a walk')).toBeInTheDocument();
  });

  it('does not display action section when action is empty', () => {
    useValuesStore.setState({
      entries: [
        {
          id: '1',
          values: [{ valueId: 'family', score: 7 }],
          action: '',
          timestamp: new Date().toISOString(),
        },
      ],
    });

    render(<ValuesWidget />);
    expect(screen.queryByText('Действие на неделю')).not.toBeInTheDocument();
  });

  it('shows only the latest entry (first in array)', () => {
    useValuesStore.setState({
      entries: [
        {
          id: '2',
          values: [{ valueId: 'career', score: 9 }],
          action: 'Latest action',
          timestamp: new Date().toISOString(),
        },
        {
          id: '1',
          values: [{ valueId: 'family', score: 5 }],
          action: 'Older action',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
        },
      ],
    });

    render(<ValuesWidget />);
    expect(screen.getByText('Карьера')).toBeInTheDocument();
    expect(screen.getByText('Latest action')).toBeInTheDocument();
    expect(screen.queryByText('Older action')).not.toBeInTheDocument();
  });
});
