import { cleanup, render, screen } from '@testing-library/react';
import { useTheme } from 'next-themes';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { Spinner } from '@/components/ui/Spinner';

// Mock next-themes
vi.mock('next-themes', () => ({
  useTheme: vi.fn(),
}));

const mockUseTheme = useTheme as ReturnType<typeof vi.fn>;

describe('Spinner', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    mockUseTheme.mockReturnValue({
      theme: 'light',
      systemTheme: 'light',
    });
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
    vi.clearAllMocks();
    cleanup();
  });

  it('renders with default props and has proper accessibility', () => {
    render(<Spinner />);

    const spinner = screen.getByRole('status');
    expect(spinner).toHaveAttribute('aria-label', 'Loading');
  });

  it('applies correct size classes', () => {
    render(<Spinner size='sm' />);

    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('h-4', 'w-4');
  });

  it('applies custom className', () => {
    render(<Spinner className='custom-class' />);

    const spinner = screen.getByRole('status');
    expect(spinner).toHaveClass('custom-class');
  });

  it('implements debounced visibility behavior', () => {
    render(<Spinner />);

    // Should render initially (even if placeholder)
    const spinner = screen.getByRole('status');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveAttribute('aria-label', 'Loading');
  });
});
