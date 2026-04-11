import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LogAnxietyForm } from './LogAnxietyForm';

describe('LogAnxietyForm', () => {
  it('renders the form', () => {
    render(<LogAnxietyForm onSubmit={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.getByText('Уровень тревожности')).toBeInTheDocument();
    expect(screen.getByText('Триггеры')).toBeInTheDocument();
    expect(screen.getByText('Заметка')).toBeInTheDocument();
  });

  it('submits with default level', async () => {
    const onSubmit = vi.fn();
    render(<LogAnxietyForm onSubmit={onSubmit} onCancel={vi.fn()} />);

    await userEvent.click(screen.getByRole('button', { name: 'Сохранить' }));

    expect(onSubmit).toHaveBeenCalledWith({
      level: 5,
      note: '',
      triggers: [],
    });
  });

  it('calls onCancel', async () => {
    const onCancel = vi.fn();
    render(<LogAnxietyForm onSubmit={vi.fn()} onCancel={onCancel} />);

    await userEvent.click(screen.getByRole('button', { name: 'Отмена' }));
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it('toggles triggers', async () => {
    const onSubmit = vi.fn();
    render(<LogAnxietyForm onSubmit={onSubmit} onCancel={vi.fn()} />);

    await userEvent.click(screen.getByText('Работа'));
    await userEvent.click(screen.getByText('Здоровье'));
    await userEvent.click(screen.getByRole('button', { name: 'Сохранить' }));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        triggers: ['Работа', 'Здоровье'],
      }),
    );
  });
});
