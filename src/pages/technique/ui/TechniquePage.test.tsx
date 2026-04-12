import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import { TechniquePage } from './TechniquePage';
import { useProgression } from '@/entities/technique';

function LocationDisplay() {
  const location = useLocation();
  return <div data-testid="location">{location.pathname}</div>;
}

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/technique/:id" element={<TechniquePage />} />
        <Route path="/techniques" element={<LocationDisplay />} />
      </Routes>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  localStorage.clear();
  useProgression.setState({ usageCounts: {}, manualUnlocks: [] });
});

describe('TechniquePage', () => {
  it('renders the technique title inside the layout for a valid page technique', () => {
    renderAt('/technique/tipp');
    // TIPP technique title from data.ts
    expect(screen.getByRole('heading', { name: /TIPP/i })).toBeInTheDocument();
  });

  it('renders the back button for valid page techniques', () => {
    renderAt('/technique/tipp');
    expect(screen.getByRole('button', { name: 'Назад к техникам' })).toBeInTheDocument();
  });

  it('renders the TIPP exercise content', () => {
    renderAt('/technique/tipp');
    expect(
      screen.getByText(/Выполните упражнения TIPP для быстрого снижения/i),
    ).toBeInTheDocument();
  });

  it('redirects to /techniques when the technique id is unknown', () => {
    renderAt('/technique/does-not-exist');
    expect(screen.getByTestId('location')).toHaveTextContent('/techniques');
  });

  it('redirects to /techniques for non-page techniques (e.g. acceptance)', () => {
    // "acceptance" exists but has no renderMode: 'page'
    renderAt('/technique/acceptance');
    expect(screen.getByTestId('location')).toHaveTextContent('/techniques');
  });

  it('navigates to /techniques when the back button is clicked', async () => {
    const user = userEvent.setup();
    renderAt('/technique/tipp');

    await user.click(screen.getByRole('button', { name: 'Назад к техникам' }));
    expect(screen.getByTestId('location')).toHaveTextContent('/techniques');
  });

  it('renders the grounding exercise for the grounding-54321 technique', () => {
    render(
      <MemoryRouter initialEntries={['/technique/grounding-54321']}>
        <Routes>
          <Route path="/technique/:id" element={<TechniquePage />} />
          <Route path="/techniques" element={<LocationDisplay />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByRole('heading', { name: /Заземление 5-4-3-2-1/i })).toBeInTheDocument();
  });

  it('renders the breathing exercise for the box-breathing technique', () => {
    render(
      <MemoryRouter initialEntries={['/technique/box-breathing']}>
        <Routes>
          <Route path="/technique/:id" element={<TechniquePage />} />
          <Route path="/techniques" element={<LocationDisplay />} />
        </Routes>
      </MemoryRouter>,
    );
    expect(
      screen.getByRole('heading', { name: /Дыхание по квадрату/i }),
    ).toBeInTheDocument();
  });
});
