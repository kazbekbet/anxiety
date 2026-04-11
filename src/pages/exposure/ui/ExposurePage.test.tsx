import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ExposurePage } from './ExposurePage';
import { useExposure } from '@/features/exposure';

beforeEach(() => {
  localStorage.clear();
  useExposure.setState({ hierarchies: [] });
});

describe('ExposurePage', () => {
  it('renders the heading "Лестница страха"', () => {
    render(<MemoryRouter><ExposurePage /></MemoryRouter>);
    expect(screen.getByText('Лестница страха')).toBeInTheDocument();
  });

  it('shows empty state when there are no hierarchies', () => {
    render(<MemoryRouter><ExposurePage /></MemoryRouter>);
    expect(screen.getByText('Создайте первую лестницу страха')).toBeInTheDocument();
  });

  it('renders the "Новая лестница" button', () => {
    render(<MemoryRouter><ExposurePage /></MemoryRouter>);
    expect(screen.getByText(/Новая лестница/)).toBeInTheDocument();
  });
});
