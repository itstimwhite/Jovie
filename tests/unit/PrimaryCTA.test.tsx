import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import PrimaryCTA from '@/components/ui/PrimaryCTA';

// Mock the Spinner component
vi.mock('@/components/ui/Spinner', () => ({
  Spinner: ({ size, variant, className }: any) => (
    <div 
      data-testid="spinner" 
      data-size={size} 
      data-variant={variant}
      className={className}
    >
      Loading...
    </div>
  ),
}));

describe('PrimaryCTA', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(cleanup);

  it('renders correctly with default props', () => {
    render(<PrimaryCTA ariaLabel="Test button">Click me</PrimaryCTA>);
    
    const button = screen.getByRole('button', { name: 'Test button' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Click me');
    expect(button).not.toBeDisabled();
  });

  it('applies correct base classes for premium styling', () => {
    render(<PrimaryCTA ariaLabel="Test button">Click me</PrimaryCTA>);
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('relative', 'inline-flex', 'items-center', 'justify-center');
    expect(button).toHaveClass('font-semibold', 'tracking-tight');
    expect(button).toHaveClass('rounded-xl', 'shadow-lg');
    expect(button).toHaveClass('transition-all', 'duration-200', 'ease-out');
    expect(button).toHaveClass('focus-visible:outline-none', 'focus-visible:ring-2');
  });

  it('applies correct color classes for light and dark mode', () => {
    render(<PrimaryCTA ariaLabel="Test button">Click me</PrimaryCTA>);
    
    const button = screen.getByRole('button');
    // Light mode colors
    expect(button).toHaveClass('bg-gray-900', 'text-white');
    expect(button).toHaveClass('hover:bg-gray-800');
    // Dark mode colors
    expect(button).toHaveClass('dark:bg-white', 'dark:text-gray-900');
    expect(button).toHaveClass('dark:hover:bg-gray-50');
  });

  it('renders with different sizes', () => {
    const { rerender } = render(
      <PrimaryCTA ariaLabel="Large button" size="lg">Large</PrimaryCTA>
    );
    
    let button = screen.getByRole('button');
    expect(button).toHaveClass('min-h-[56px]', 'px-8', 'text-base');
    expect(button).toHaveClass('sm:min-h-[60px]', 'sm:px-10', 'sm:text-lg');

    rerender(
      <PrimaryCTA ariaLabel="Medium button" size="md">Medium</PrimaryCTA>
    );
    
    button = screen.getByRole('button');
    expect(button).toHaveClass('min-h-[48px]', 'px-6', 'text-sm');
  });

  it('handles fullWidth prop correctly', () => {
    const { rerender } = render(
      <PrimaryCTA ariaLabel="Full width" fullWidth>Full</PrimaryCTA>
    );
    
    let button = screen.getByRole('button');
    expect(button).toHaveClass('w-full');

    rerender(
      <PrimaryCTA ariaLabel="Not full width" fullWidth={false}>Not Full</PrimaryCTA>
    );
    
    button = screen.getByRole('button');
    expect(button).not.toHaveClass('w-full');
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(
      <PrimaryCTA ariaLabel="Click me" onClick={handleClick}>
        Click me
      </PrimaryCTA>
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('can be disabled', () => {
    const handleClick = vi.fn();
    render(
      <PrimaryCTA ariaLabel="Disabled" disabled onClick={handleClick}>
        Disabled
      </PrimaryCTA>
    );

    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-disabled', 'true');
    
    fireEvent.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('shows loading state correctly', async () => {
    render(
      <PrimaryCTA ariaLabel="Normal" loadingLabel="Loading..." loading>
        Submit
      </PrimaryCTA>
    );

    const button = screen.getByRole('button');
    
    // Button should be disabled when loading
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-disabled', 'true');
    expect(button).toHaveAttribute('aria-label', 'Loading...');
    
    // Original content should be hidden
    const contentSpan = button.querySelector('span:first-child');
    expect(contentSpan).toHaveClass('opacity-0');
    
    // Spinner should be visible
    const spinner = screen.getByTestId('spinner');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveAttribute('data-size', 'sm');
    expect(spinner).toHaveAttribute('data-variant', 'dark');
  });

  it('does not show spinner when not loading', () => {
    render(
      <PrimaryCTA ariaLabel="Not loading" loading={false}>
        Submit
      </PrimaryCTA>
    );

    const button = screen.getByRole('button');
    
    // Button should not be disabled
    expect(button).not.toBeDisabled();
    
    // Original content should be visible
    const contentSpan = button.querySelector('span:first-child');
    expect(contentSpan).toHaveClass('opacity-100');
    
    // Spinner should not be present
    expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
  });

  it('prevents clicks when loading', () => {
    const handleClick = vi.fn();
    render(
      <PrimaryCTA ariaLabel="Loading" loading onClick={handleClick}>
        Submit
      </PrimaryCTA>
    );

    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('uses loadingLabel when provided and loading', () => {
    const { rerender } = render(
      <PrimaryCTA 
        ariaLabel="Submit form" 
        loadingLabel="Submitting form..." 
        loading={false}
      >
        Submit
      </PrimaryCTA>
    );

    let button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Submit form');

    rerender(
      <PrimaryCTA 
        ariaLabel="Submit form" 
        loadingLabel="Submitting form..." 
        loading={true}
      >
        Submit
      </PrimaryCTA>
    );

    button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Submitting form...');
  });

  it('falls back to ariaLabel when loading but no loadingLabel provided', () => {
    render(
      <PrimaryCTA ariaLabel="Submit form" loading>
        Submit
      </PrimaryCTA>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Submit form');
  });

  it('applies custom className', () => {
    render(
      <PrimaryCTA ariaLabel="Custom" className="custom-class">
        Custom
      </PrimaryCTA>
    );
    
    const button = screen.getByRole('button');
    expect(button).toHaveClass('custom-class');
  });

  it('supports different button types', () => {
    const { rerender } = render(
      <PrimaryCTA ariaLabel="Submit" type="submit">Submit</PrimaryCTA>
    );
    
    let button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'submit');

    rerender(
      <PrimaryCTA ariaLabel="Reset" type="reset">Reset</PrimaryCTA>
    );
    
    button = screen.getByRole('button');
    expect(button).toHaveAttribute('type', 'reset');
  });

  it('supports autoFocus', () => {
    render(
      <PrimaryCTA ariaLabel="Auto focus" autoFocus>Focus me</PrimaryCTA>
    );
    
    const button = screen.getByRole('button');
    expect(button).toHaveFocus();
  });

  it('applies opacity when loading for visual feedback', () => {
    render(
      <PrimaryCTA ariaLabel="Loading" loading>
        Submit
      </PrimaryCTA>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveClass('opacity-80');
  });

  it('maintains fixed dimensions to prevent layout shift', () => {
    const { rerender } = render(
      <PrimaryCTA ariaLabel="Normal state">Submit</PrimaryCTA>
    );
    
    const button = screen.getByRole('button');
    // Check that minimum height is always maintained
    expect(button).toHaveClass('min-h-[56px]'); // Large size default
    
    rerender(
      <PrimaryCTA ariaLabel="Loading state" loading>Submit</PrimaryCTA>
    );
    
    // Dimensions should remain the same
    expect(button).toHaveClass('min-h-[56px]');
  });

  it('has proper accessibility attributes for screen readers', () => {
    render(
      <PrimaryCTA 
        ariaLabel="Accessible button" 
        loadingLabel="Loading content..."
        loading
        id="accessible-btn"
        dataTestId="cta-button"
      >
        Content
      </PrimaryCTA>
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Loading content...');
    expect(button).toHaveAttribute('aria-disabled', 'true');
    expect(button).toHaveAttribute('id', 'accessible-btn');
    expect(button).toHaveAttribute('data-testid', 'cta-button');
    
    // Spinner should be hidden from screen readers
    const spinnerContainer = button.querySelector('[aria-hidden="true"]');
    expect(spinnerContainer).toBeInTheDocument();
  });
});