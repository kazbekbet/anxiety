import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { OnboardingFlow } from './OnboardingFlow';

describe('OnboardingFlow', () => {
  it('renders the first step initially', () => {
    render(<OnboardingFlow onComplete={vi.fn()} />);
    expect(screen.getByText('Вы не одиноки')).toBeInTheDocument();
    expect(screen.getByText('Далее')).toBeInTheDocument();
    expect(screen.getByText('Пропустить')).toBeInTheDocument();
  });

  it('advances to the next step on "Далее" click', async () => {
    render(<OnboardingFlow onComplete={vi.fn()} />);
    await userEvent.click(screen.getByText('Далее'));
    expect(screen.getByText('Как это работает')).toBeInTheDocument();
  });

  it('shows "Начать" on the last step and hides "Пропустить"', async () => {
    render(<OnboardingFlow onComplete={vi.fn()} />);
    // Navigate to last step (step 0 -> 1 -> 2)
    await userEvent.click(screen.getByText('Далее'));
    await userEvent.click(screen.getByText('Далее'));
    expect(screen.getByText('Всё приватно')).toBeInTheDocument();
    expect(screen.getByText('Начать')).toBeInTheDocument();
    expect(screen.queryByText('Пропустить')).not.toBeInTheDocument();
  });

  it('calls onComplete when "Начать" is clicked on the last step', async () => {
    const onComplete = vi.fn();
    render(<OnboardingFlow onComplete={onComplete} />);
    await userEvent.click(screen.getByText('Далее'));
    await userEvent.click(screen.getByText('Далее'));
    await userEvent.click(screen.getByText('Начать'));
    expect(onComplete).toHaveBeenCalledOnce();
  });

  it('calls onComplete when "Пропустить" is clicked', async () => {
    const onComplete = vi.fn();
    render(<OnboardingFlow onComplete={onComplete} />);
    await userEvent.click(screen.getByText('Пропустить'));
    expect(onComplete).toHaveBeenCalledOnce();
  });

  it('renders 3 progress dots', () => {
    const { container } = render(<OnboardingFlow onComplete={vi.fn()} />);
    const dots = container.querySelectorAll('.rounded-full.h-2');
    expect(dots).toHaveLength(3);
  });
});
