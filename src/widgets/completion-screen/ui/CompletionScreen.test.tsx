import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders as render } from '@/shared/test/render';
import userEvent from '@testing-library/user-event';
import { CompletionScreen } from './CompletionScreen';

describe('CompletionScreen', () => {
  it('renders with elapsed time in minutes', () => {
    render(<CompletionScreen elapsedSeconds={180} onClose={() => {}} />);
    expect(screen.getByText('Отлично!')).toBeInTheDocument();
    expect(screen.getByText(/3 минуты/)).toBeInTheDocument();
  });

  it('shows 1 минуту for very short sessions', () => {
    render(<CompletionScreen elapsedSeconds={10} onClose={() => {}} />);
    expect(screen.getByText(/1 минуту/)).toBeInTheDocument();
  });

  it('shows минут for 5+ minutes', () => {
    render(<CompletionScreen elapsedSeconds={600} onClose={() => {}} />);
    expect(screen.getByText(/10 минут/)).toBeInTheDocument();
  });

  it('renders thoughtRecordDiff when provided', () => {
    render(
      <CompletionScreen
        elapsedSeconds={120}
        thoughtRecordDiff={{ before: 8, after: 3 }}
        onClose={() => {}}
      />,
    );
    expect(screen.getByText(/Было:/)).toBeInTheDocument();
    expect(screen.getByText(/8\/10/)).toBeInTheDocument();
    expect(screen.getByText(/3\/10/)).toBeInTheDocument();
  });

  it('does not render thoughtRecordDiff when not provided', () => {
    render(<CompletionScreen elapsedSeconds={120} onClose={() => {}} />);
    expect(screen.queryByText(/Было:/)).not.toBeInTheDocument();
  });

  it('calls onClose when button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<CompletionScreen elapsedSeconds={120} onClose={onClose} />);

    await user.click(screen.getByText('Закрыть'));
    expect(onClose).toHaveBeenCalledOnce();
  });
});
