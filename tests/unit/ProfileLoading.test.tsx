import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import Loading from '@/app/[handle]/loading';

describe('Profile Loading Page', () => {
  beforeEach(() => {
    // Clean up between tests
    document.body.innerHTML = '';
  });

  it('renders loading skeleton with accessibility labels', () => {
    render(<Loading />);

    // Check that screen reader announcement is present
    expect(screen.getByText('Loading artist profile...')).toBeInTheDocument();

    // Check that loading elements have proper accessibility attributes
    expect(
      screen.getByRole('img', { name: 'Loading artist profile image' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('text', { name: 'Loading artist name' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('text', { name: 'Loading artist tagline' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Loading action button' })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('navigation', { name: 'Loading social media links' })
    ).toBeInTheDocument();
  });

  it('has proper ARIA live region for screen readers', () => {
    render(<Loading />);

    const liveRegion = screen.getByLabelText('Loading artist profile...');
    expect(liveRegion).toHaveAttribute('aria-live', 'polite');
    expect(liveRegion).toHaveClass('sr-only');
  });
});
