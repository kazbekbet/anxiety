import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from './App';

describe('App', () => {
  it('renders home page by default', () => {
    render(<App />);
    expect(screen.getByText('Быстрая запись')).toBeInTheDocument();
  });

  it('navigates to diary page', async () => {
    render(<App />);
    await userEvent.click(screen.getByText('Дневник'));
    expect(screen.getByText('0 записей')).toBeInTheDocument();
  });

  it('navigates to techniques page', async () => {
    render(<App />);
    await userEvent.click(screen.getByText('Техники'));
    expect(screen.getByText('Инструменты для работы с тревогой')).toBeInTheDocument();
  });

  it('navigates to stats page', async () => {
    render(<App />);
    await userEvent.click(screen.getByText('Статистика'));
    expect(screen.getByText('Ваш прогресс')).toBeInTheDocument();
  });
});
