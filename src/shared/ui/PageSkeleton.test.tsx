import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { renderWithProviders as render } from '@/shared/test/render';
import { PageSkeleton } from './PageSkeleton';

describe('PageSkeleton', () => {
  it('renders a status region with the loading label', () => {
    render(<PageSkeleton />);
    const region = screen.getByRole('status', { name: 'Загрузка' });
    expect(region).toBeInTheDocument();
    expect(region).toHaveAttribute('aria-busy', 'true');
  });

  it('renders 4 skeleton placeholder blocks', () => {
    render(<PageSkeleton />);
    const blocks = screen.getByRole('status').querySelectorAll('.mantine-Skeleton-root');
    expect(blocks).toHaveLength(4);
  });
});
