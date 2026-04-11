import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { PageSkeleton } from './PageSkeleton';

describe('PageSkeleton', () => {
  it('renders without crashing', () => {
    const { container } = render(<PageSkeleton />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it('has the animate-pulse class for loading animation', () => {
    const { container } = render(<PageSkeleton />);
    expect(container.firstChild).toHaveClass('animate-pulse');
  });

  it('renders 4 skeleton placeholder blocks', () => {
    const { container } = render(<PageSkeleton />);
    const blocks = container.querySelectorAll('.bg-elevated');
    expect(blocks).toHaveLength(4);
  });

  it('renders blocks with rounded corners', () => {
    const { container } = render(<PageSkeleton />);
    const blocks = container.querySelectorAll('.rounded-2xl.bg-elevated');
    expect(blocks).toHaveLength(4);
  });
});
