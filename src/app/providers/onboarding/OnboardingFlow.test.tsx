import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithProviders as render } from '@/shared/test/render';
import { OnboardingFlow } from './OnboardingFlow';

describe('OnboardingFlow', () => {
  it('renders the first step initially', () => {
    render(<OnboardingFlow onComplete={vi.fn()} />);
    expect(screen.getByText('Вы не одиноки')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Далее' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Пропустить' })).toBeInTheDocument();
  });

  it('advances to the next step on "Далее" click', async () => {
    render(<OnboardingFlow onComplete={vi.fn()} />);
    await userEvent.click(screen.getByRole('button', { name: 'Далее' }));
    expect(screen.getByText('Как это работает')).toBeInTheDocument();
  });

  it('shows "Начать" on the last step and hides "Пропустить"', async () => {
    render(<OnboardingFlow onComplete={vi.fn()} />);
    await userEvent.click(screen.getByRole('button', { name: 'Далее' }));
    await userEvent.click(screen.getByRole('button', { name: 'Далее' }));
    expect(screen.getByText('Всё приватно')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Начать' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Пропустить' })).not.toBeInTheDocument();
  });

  it('calls onComplete when "Начать" is clicked on the last step', async () => {
    const onComplete = vi.fn();
    render(<OnboardingFlow onComplete={onComplete} />);
    await userEvent.click(screen.getByRole('button', { name: 'Далее' }));
    await userEvent.click(screen.getByRole('button', { name: 'Далее' }));
    await userEvent.click(screen.getByRole('button', { name: 'Начать' }));
    expect(onComplete).toHaveBeenCalledOnce();
  });

  it('calls onComplete when "Пропустить" is clicked', async () => {
    const onComplete = vi.fn();
    render(<OnboardingFlow onComplete={onComplete} />);
    await userEvent.click(screen.getByRole('button', { name: 'Пропустить' }));
    expect(onComplete).toHaveBeenCalledOnce();
  });
});
