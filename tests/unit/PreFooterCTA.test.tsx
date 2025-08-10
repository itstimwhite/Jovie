import { describe, it, expect, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { PreFooterCTA } from '@/components/PreFooterCTA';

describe('PreFooterCTA', () => {
  afterEach(cleanup);

  it('renders the main headline text', () => {
    render(<PreFooterCTA />);

    expect(
      screen.getByText(
        'Launch your artist page in minutes. Convert visitors into fans.'
      )
    ).toBeInTheDocument();
  });

  it('renders the CTA button with correct text', () => {
    render(<PreFooterCTA />);

    expect(
      screen.getByRole('link', { name: /claim your handle/i })
    ).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<PreFooterCTA />);

    const section = screen.getByRole('region');
    expect(section).toHaveAttribute('aria-labelledby', 'cta-heading');

    const heading = screen.getByText(
      'Launch your artist page in minutes. Convert visitors into fans.'
    );
    expect(heading).toHaveAttribute('id', 'cta-heading');
  });

  it('applies correct styling classes for emphasis', () => {
    render(<PreFooterCTA />);

    const headline = screen.getByText(
      'Launch your artist page in minutes. Convert visitors into fans.'
    );

    // Check that the headline has bold font weight for strong emphasis
    expect(headline).toHaveClass('font-bold');

    // Check that it has appropriate text sizing and tracking
    expect(headline).toHaveClass('text-xl', 'md:text-2xl', 'tracking-tight');
  });

  it('has proper responsive layout structure', () => {
    render(<PreFooterCTA />);

    const section = screen.getByRole('region');
    expect(section).toBeInTheDocument();

    const link = screen.getByRole('link', { name: /claim your handle/i });
    expect(link).toHaveAttribute('href', '/sign-up');
  });
});
