import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock React's useEffect to avoid hook issues in testing
vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  return {
    ...actual,
    useEffect: vi.fn(),
  };
});

const Error = (await import('@/app/[handle]/error')).default;

describe('Profile Error Page', () => {
  const mockError = {
    name: 'TestError',
    message: 'Test error message',
    stack: 'test stack trace',
  } as Error;
  const mockReset = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    document.body.innerHTML = '';
  });

  it('renders error message with accessibility attributes', () => {
    const { container } = render(<Error error={mockError} reset={mockReset} />);

    // Check main error message
    const errorTitle = screen.getByText('Something went wrong!');
    expect(errorTitle).toBeInTheDocument();
    expect(errorTitle).toHaveAttribute('id', 'error-title');

    // Check description has proper aria relationship
    const description = screen.getByText(
      /We encountered an error while loading this artist profile/
    );
    expect(description).toHaveAttribute('aria-describedby', 'error-title');
  });

  it('has proper ARIA live region for screen readers', () => {
    render(<Error error={mockError} reset={mockReset} />);

    const liveRegion = screen.getByLabelText(
      'Error loading artist profile. Please try again.'
    );
    expect(liveRegion).toHaveAttribute('aria-live', 'assertive');
    expect(liveRegion).toHaveClass('sr-only');
  });

  it('has proper SVG accessibility attributes', () => {
    render(<Error error={mockError} reset={mockReset} />);

    const errorIcon = document.querySelector('svg');
    expect(errorIcon).toHaveAttribute('aria-hidden', 'true');
  });
});
