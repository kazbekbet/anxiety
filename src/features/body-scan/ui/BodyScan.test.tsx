import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BodyScan } from './BodyScan';

describe('BodyScan', () => {
  it('renders body zones', () => {
    render(<BodyScan onComplete={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.getByLabelText('Голова')).toBeInTheDocument();
    expect(screen.getByLabelText('Горло')).toBeInTheDocument();
    expect(screen.getByLabelText('Грудь')).toBeInTheDocument();
    expect(screen.getByLabelText('Левое плечо')).toBeInTheDocument();
    expect(screen.getByLabelText('Правое плечо')).toBeInTheDocument();
    expect(screen.getByLabelText('Живот')).toBeInTheDocument();
    expect(screen.getByLabelText('Левая рука')).toBeInTheDocument();
    expect(screen.getByLabelText('Правая рука')).toBeInTheDocument();
    expect(screen.getByLabelText('Левая нога')).toBeInTheDocument();
    expect(screen.getByLabelText('Правая нога')).toBeInTheDocument();
  });

  it('disables "Завершить" button when no zones are selected', () => {
    render(<BodyScan onComplete={vi.fn()} onCancel={vi.fn()} />);
    const doneButton = screen.getByText('Завершить (0)');
    expect(doneButton.closest('button')).toBeDisabled();
  });

  it('shows sensation picker when a zone is clicked', async () => {
    render(<BodyScan onComplete={vi.fn()} onCancel={vi.fn()} />);
    await userEvent.click(screen.getByLabelText('Голова'));
    expect(screen.getByText(/Голова — что вы чувствуете/)).toBeInTheDocument();
    expect(screen.getByText('Напряжение')).toBeInTheDocument();
    expect(screen.getByText('Давление')).toBeInTheDocument();
  });

  it('selects a zone with sensation and enables "Завершить"', async () => {
    render(<BodyScan onComplete={vi.fn()} onCancel={vi.fn()} />);
    await userEvent.click(screen.getByLabelText('Грудь'));
    await userEvent.click(screen.getByText('Давление'));
    await userEvent.click(screen.getByText('Готово'));
    const doneButton = screen.getByText('Завершить (1)');
    expect(doneButton.closest('button')).not.toBeDisabled();
  });

  it('calls onComplete with selected zones when "Завершить" is clicked', async () => {
    const onComplete = vi.fn();
    render(<BodyScan onComplete={onComplete} onCancel={vi.fn()} />);
    await userEvent.click(screen.getByLabelText('Грудь'));
    await userEvent.click(screen.getByText('Напряжение'));
    await userEvent.click(screen.getByText('Готово'));
    await userEvent.click(screen.getByText('Завершить (1)'));
    expect(onComplete).toHaveBeenCalledOnce();
    expect(onComplete).toHaveBeenCalledWith([
      { zone: 'chest', sensation: 'Напряжение', intensity: 3 },
    ]);
  });

  it('calls onCancel when "Отмена" is clicked', async () => {
    const onCancel = vi.fn();
    render(<BodyScan onComplete={vi.fn()} onCancel={onCancel} />);
    await userEvent.click(screen.getByText('Отмена'));
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it('deselects a zone when clicking it again after sensation was chosen', async () => {
    render(<BodyScan onComplete={vi.fn()} onCancel={vi.fn()} />);
    await userEvent.click(screen.getByLabelText('Живот'));
    await userEvent.click(screen.getByText('Жжение'));
    await userEvent.click(screen.getByText('Готово'));
    expect(screen.getByText('Завершить (1)')).toBeInTheDocument();
    await userEvent.click(screen.getByLabelText('Живот'));
    expect(screen.getByText('Завершить (0)')).toBeInTheDocument();
  });
});
