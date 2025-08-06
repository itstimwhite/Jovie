import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { LogoLink } from '@/components/atoms/LogoLink';

describe('LogoLink', () => {
  afterEach(cleanup);

  it('renders with default props', () => {
    render(<LogoLink />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/');
  });

  it('renders with custom href', () => {
    render(<LogoLink href="/custom" />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/custom');
  });

  it('renders with custom className', () => {
    render(<LogoLink className="custom-class" />);

    const link = screen.getByRole('link');
    expect(link).toHaveClass('custom-class');
  });

  it('renders logo with specified size', () => {
    render(<LogoLink logoSize="lg" />);

    const svg = screen.getByRole('link').querySelector('svg');
    expect(svg).toHaveClass('h-12');
  });
});
