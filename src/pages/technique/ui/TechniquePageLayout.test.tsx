import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route, useLocation } from 'react-router-dom';
import { TechniquePageLayout } from './TechniquePageLayout';

function LocationDisplay() {
  const location = useLocation();
  return <div data-testid="location">{location.pathname}</div>;
}

beforeEach(() => {
  localStorage.clear();
});

describe('TechniquePageLayout', () => {
  it('renders the title', () => {
    render(
      <MemoryRouter>
        <TechniquePageLayout title="Тестовая техника">
          <p>content</p>
        </TechniquePageLayout>
      </MemoryRouter>,
    );
    expect(screen.getByRole('heading', { name: 'Тестовая техника' })).toBeInTheDocument();
  });

  it('renders children', () => {
    render(
      <MemoryRouter>
        <TechniquePageLayout title="Title">
          <p data-testid="child">hello world</p>
        </TechniquePageLayout>
      </MemoryRouter>,
    );
    expect(screen.getByTestId('child')).toHaveTextContent('hello world');
  });

  it('renders the back button with correct aria-label', () => {
    render(
      <MemoryRouter>
        <TechniquePageLayout title="Title">
          <p>content</p>
        </TechniquePageLayout>
      </MemoryRouter>,
    );
    expect(screen.getByRole('button', { name: 'Назад к техникам' })).toBeInTheDocument();
  });

  it('navigates to /techniques when the back button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/technique/tipp']}>
        <Routes>
          <Route
            path="/technique/:id"
            element={
              <TechniquePageLayout title="Title">
                <p>content</p>
              </TechniquePageLayout>
            }
          />
          <Route path="/techniques" element={<LocationDisplay />} />
        </Routes>
      </MemoryRouter>,
    );

    await user.click(screen.getByRole('button', { name: 'Назад к техникам' }));
    expect(screen.getByTestId('location')).toHaveTextContent('/techniques');
  });

  it('updates the title when the title prop changes', () => {
    const { rerender } = render(
      <MemoryRouter>
        <TechniquePageLayout title="Первый">
          <p>content</p>
        </TechniquePageLayout>
      </MemoryRouter>,
    );
    expect(screen.getByRole('heading', { name: 'Первый' })).toBeInTheDocument();

    rerender(
      <MemoryRouter>
        <TechniquePageLayout title="Завершено">
          <p>content</p>
        </TechniquePageLayout>
      </MemoryRouter>,
    );
    expect(screen.getByRole('heading', { name: 'Завершено' })).toBeInTheDocument();
  });
});
