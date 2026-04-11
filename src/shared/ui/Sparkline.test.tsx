import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { Sparkline } from './Sparkline';

describe('Sparkline', () => {
  it('renders null when fewer than 2 positive values', () => {
    const { container } = render(<Sparkline data={[0, 0, 0, 0, 5, 0, 0]} />);
    expect(container.querySelector('svg')).toBeNull();
  });

  it('renders null for all-zero data', () => {
    const { container } = render(<Sparkline data={[0, 0, 0]} />);
    expect(container.querySelector('svg')).toBeNull();
  });

  it('renders an SVG with polyline when data has >= 2 positive values', () => {
    const { container } = render(<Sparkline data={[3, 5, 2, 7, 4, 6, 3]} />);
    const svg = container.querySelector('svg');
    expect(svg).not.toBeNull();
    const polyline = svg!.querySelector('polyline');
    expect(polyline).not.toBeNull();
    expect(polyline!.getAttribute('points')).toBeTruthy();
  });

  it('uses default width and height', () => {
    const { container } = render(<Sparkline data={[3, 5, 2, 7, 4, 6, 3]} />);
    const svg = container.querySelector('svg');
    expect(svg!.getAttribute('width')).toBe('120');
    expect(svg!.getAttribute('height')).toBe('32');
  });

  it('applies custom width and height', () => {
    const { container } = render(
      <Sparkline data={[3, 5, 2, 7]} width={200} height={50} />,
    );
    const svg = container.querySelector('svg');
    expect(svg!.getAttribute('width')).toBe('200');
    expect(svg!.getAttribute('height')).toBe('50');
  });

  it('applies custom className', () => {
    const { container } = render(
      <Sparkline data={[1, 2, 3]} className="my-class" />,
    );
    const svg = container.querySelector('svg');
    expect(svg!.classList.contains('my-class')).toBe(true);
  });

  it('has aria-hidden="true"', () => {
    const { container } = render(<Sparkline data={[1, 2, 3]} />);
    const svg = container.querySelector('svg');
    expect(svg!.getAttribute('aria-hidden')).toBe('true');
  });
});
