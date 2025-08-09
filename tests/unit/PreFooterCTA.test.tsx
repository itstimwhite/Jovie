import { render, screen } from '@testing-library/react';
import { PreFooterCTA } from '@/components/PreFooterCTA';

describe('PreFooterCTA', () => {
  it('renders the main headline text', () => {
    render(<PreFooterCTA />);
    
    expect(
      screen.getByText('Launch your artist page in minutes. Convert visitors into fans.')
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
    
    const heading = screen.getByText('Launch your artist page in minutes. Convert visitors into fans.');
    expect(heading).toHaveAttribute('id', 'cta-heading');
  });

  it('applies correct styling classes for emphasis', () => {
    render(<PreFooterCTA />);
    
    const headline = screen.getByText('Launch your artist page in minutes. Convert visitors into fans.');
    
    // Check that the headline has semibold font weight for better emphasis
    expect(headline).toHaveClass('font-semibold');
    
    // Check that it has appropriate text sizing
    expect(headline).toHaveClass('text-lg', 'md:text-xl');
  });

  it('has proper responsive layout structure', () => {
    render(<PreFooterCTA />);
    
    const section = screen.getByRole('region');
    expect(section).toBeInTheDocument();
    
    const link = screen.getByRole('link', { name: /claim your handle/i });
    expect(link).toHaveAttribute('href', '/sign-up');
  });
});