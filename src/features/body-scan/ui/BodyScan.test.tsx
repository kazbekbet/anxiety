import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BodyScan } from './BodyScan';

describe('BodyScan', () => {
  it('renders all body zone buttons', () => {
    render(<BodyScan onComplete={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.getByLabelText('Голова')).toBeInTheDocument();
    expect(screen.getByLabelText('Горло')).toBeInTheDocument();
    expect(screen.getByLabelText('Грудь')).toBeInTheDocument();
    expect(screen.getByLabelText('Плечи')).toBeInTheDocument();
    expect(screen.getByLabelText('Живот')).toBeInTheDocument();
    expect(screen.getByLabelText('Руки')).toBeInTheDocument();
    expect(screen.getByLabelText('Ноги')).toBeInTheDocument();
  });

  it('disables "Готово" button when no zones are selected', () => {
    render(<BodyScan onComplete={vi.fn()} onCancel={vi.fn()} />);
    const doneButton = screen.getByText('Готово (0)');
    expect(doneButton.closest('button')).toBeDisabled();
  });

  it('shows sensation picker when a zone is clicked', async () => {
    render(<BodyScan onComplete={vi.fn()} onCancel={vi.fn()} />);
    await userEvent.click(screen.getByLabelText('Голова'));
    expect(screen.getByText(/Голова — что вы чувствуете/)).toBeInTheDocument();
    expect(screen.getByText('Напряжение')).toBeInTheDocument();
    expect(screen.getByText('Давление')).toBeInTheDocument();
  });

  it('selects a zone with sensation and enables "Готово"', async () => {
    render(<BodyScan onComplete={vi.fn()} onCancel={vi.fn()} />);
    await userEvent.click(screen.getByLabelText('Грудь'));
    await userEvent.click(screen.getByText('Давление'));
    const doneButton = screen.getByText('Готово (1)');
    expect(doneButton.closest('button')).not.toBeDisabled();
  });

  it('calls onComplete with selected zones when "Готово" is clicked', async () => {
    const onComplete = vi.fn();
    render(<BodyScan onComplete={onComplete} onCancel={vi.fn()} />);
    await userEvent.click(screen.getByLabelText('Грудь'));
    await userEvent.click(screen.getByText('Напряжение'));
    await userEvent.click(screen.getByText('Готово (1)'));
    expect(onComplete).toHaveBeenCalledOnce();
    expect(onComplete).toHaveBeenCalledWith([{ zone: 'chest', sensation: 'Напряжение' }]);
  });

  it('calls onCancel when "Отмена" is clicked', async () => {
    const onCancel = vi.fn();
    render(<BodyScan onComplete={vi.fn()} onCancel={onCancel} />);
    await userEvent.click(screen.getByText('Отмена'));
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it('deselects a zone when clicking it again after sensation was chosen', async () => {
    render(<BodyScan onComplete={vi.fn()} onCancel={vi.fn()} />);
    // Select zone + sensation
    await userEvent.click(screen.getByLabelText('Живот'));
    await userEvent.click(screen.getByText('Жжение'));
    expect(screen.getByText('Готово (1)')).toBeInTheDocument();
    // Click the same zone again to deselect
    await userEvent.click(screen.getByLabelText('Живот'));
    expect(screen.getByText('Готово (0)')).toBeInTheDocument();
  });
});
