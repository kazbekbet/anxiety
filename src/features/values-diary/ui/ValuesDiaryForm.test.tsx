import { describe, it, expect, beforeEach, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders as render } from '@/shared/test/render';
import userEvent from '@testing-library/user-event';
import { ValuesDiaryForm } from './ValuesDiaryForm';
import { useValuesStore } from '../model/store';

describe('ValuesDiaryForm', () => {
  const onComplete = vi.fn();
  const onCancel = vi.fn();

  beforeEach(() => {
    localStorage.clear();
    useValuesStore.setState({ entries: [] });
    onComplete.mockClear();
    onCancel.mockClear();
  });

  it('renders step 1 with value selection', () => {
    render(<ValuesDiaryForm onComplete={onComplete} onCancel={onCancel} />);
    expect(screen.getByText('Что для вас действительно важно?')).toBeInTheDocument();
    expect(screen.getByText('Выберите до 5 ценностей')).toBeInTheDocument();
  });

  it('renders value options', () => {
    render(<ValuesDiaryForm onComplete={onComplete} onCancel={onCancel} />);
    expect(screen.getByText('Семья')).toBeInTheDocument();
    expect(screen.getByText('Здоровье')).toBeInTheDocument();
    expect(screen.getByText('Карьера')).toBeInTheDocument();
  });

  it('shows cancel button on step 1', () => {
    render(<ValuesDiaryForm onComplete={onComplete} onCancel={onCancel} />);
    expect(screen.getByRole('button', { name: 'Отмена' })).toBeInTheDocument();
  });

  it('calls onCancel when cancel button is clicked on step 1', async () => {
    const user = userEvent.setup();
    render(<ValuesDiaryForm onComplete={onComplete} onCancel={onCancel} />);
    await user.click(screen.getByRole('button', { name: 'Отмена' }));
    expect(onCancel).toHaveBeenCalledOnce();
  });

  it('disables "Далее" button when no value is selected', () => {
    render(<ValuesDiaryForm onComplete={onComplete} onCancel={onCancel} />);
    const nextButton = screen.getByRole('button', { name: 'Далее' });
    expect(nextButton).toBeDisabled();
  });

  it('enables "Далее" button after selecting a value', async () => {
    const user = userEvent.setup();
    render(<ValuesDiaryForm onComplete={onComplete} onCancel={onCancel} />);
    await user.click(screen.getByText('Семья'));
    const nextButton = screen.getByRole('button', { name: 'Далее' });
    expect(nextButton).not.toBeDisabled();
  });

  it('navigates to step 2 when clicking "Далее" after selecting a value', async () => {
    const user = userEvent.setup();
    render(<ValuesDiaryForm onComplete={onComplete} onCancel={onCancel} />);
    await user.click(screen.getByText('Семья'));
    await user.click(screen.getByRole('button', { name: 'Далее' }));
    expect(screen.getByText('Насколько вы живёте в согласии?')).toBeInTheDocument();
  });

  it('shows "Назад" button on step 2', async () => {
    const user = userEvent.setup();
    render(<ValuesDiaryForm onComplete={onComplete} onCancel={onCancel} />);
    await user.click(screen.getByText('Семья'));
    await user.click(screen.getByRole('button', { name: 'Далее' }));
    expect(screen.getByRole('button', { name: 'Назад' })).toBeInTheDocument();
  });

  it('goes back to step 1 when clicking "Назад" on step 2', async () => {
    const user = userEvent.setup();
    render(<ValuesDiaryForm onComplete={onComplete} onCancel={onCancel} />);
    await user.click(screen.getByText('Семья'));
    await user.click(screen.getByRole('button', { name: 'Далее' }));
    await user.click(screen.getByRole('button', { name: 'Назад' }));
    expect(screen.getByText('Что для вас действительно важно?')).toBeInTheDocument();
  });

  it('navigates to step 3 (action)', async () => {
    const user = userEvent.setup();
    render(<ValuesDiaryForm onComplete={onComplete} onCancel={onCancel} />);
    await user.click(screen.getByText('Семья'));
    await user.click(screen.getByRole('button', { name: 'Далее' }));
    await user.click(screen.getByRole('button', { name: 'Далее' }));
    expect(screen.getByText('Одно действие на эту неделю')).toBeInTheDocument();
  });

  it('disables "Сохранить" when action is empty on step 3', async () => {
    const user = userEvent.setup();
    render(<ValuesDiaryForm onComplete={onComplete} onCancel={onCancel} />);
    await user.click(screen.getByText('Семья'));
    await user.click(screen.getByRole('button', { name: 'Далее' }));
    await user.click(screen.getByRole('button', { name: 'Далее' }));
    expect(screen.getByRole('button', { name: 'Сохранить' })).toBeDisabled();
  });

  it('enables "Сохранить" when action is filled, then saves and calls onComplete', async () => {
    const user = userEvent.setup();
    render(<ValuesDiaryForm onComplete={onComplete} onCancel={onCancel} />);
    await user.click(screen.getByText('Семья'));
    await user.click(screen.getByRole('button', { name: 'Далее' }));
    await user.click(screen.getByRole('button', { name: 'Далее' }));

    await user.type(screen.getByPlaceholderText(/позвонить маме/), 'Walk in the park');
    expect(screen.getByRole('button', { name: 'Сохранить' })).not.toBeDisabled();

    await user.click(screen.getByRole('button', { name: 'Сохранить' }));
    expect(onComplete).toHaveBeenCalledOnce();
    expect(useValuesStore.getState().entries).toHaveLength(1);
  });
});
