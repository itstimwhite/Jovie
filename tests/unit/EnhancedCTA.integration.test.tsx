import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest';
import { render, screen, cleanup, fireEvent, waitFor } from '@testing-library/react';
import PrimaryCTA from '@/components/ui/PrimaryCTA';
import { ListenNow } from '@/components/profile/ListenNow';

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

// Mock fetch for ListenNow component
global.fetch = vi.fn();

describe('Enhanced CTA Button Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock successful fetch
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    });
    // Mock window.open
    Object.defineProperty(window, 'open', {
      writable: true,
      value: vi.fn(),
    });
  });

  afterEach(cleanup);

  describe('Layout Stability Tests', () => {
    it('maintains exact button dimensions between normal and loading states', async () => {
      render(
        <PrimaryCTA ariaLabel="Test button" loading={false}>
          Click me
        </PrimaryCTA>
      );

      const button = screen.getByRole('button');
      
      // Get initial dimensions
      const initialRect = button.getBoundingClientRect();
      const initialClasses = button.className;
      
      // Check initial state classes
      expect(button).toHaveClass('min-h-[56px]');
      expect(button).not.toHaveClass('opacity-80');

      // Cleanup and re-render in loading state
      cleanup();
      
      render(
        <PrimaryCTA ariaLabel="Test button" loading={true}>
          Click me
        </PrimaryCTA>
      );

      const loadingButton = screen.getByRole('button');
      const loadingRect = loadingButton.getBoundingClientRect();
      
      // Check loading state classes
      expect(loadingButton).toHaveClass('min-h-[56px]'); // Same height
      expect(loadingButton).toHaveClass('opacity-80'); // Loading opacity
      
      // Verify dimensions are identical (within 1px tolerance for browser rendering)
      expect(Math.abs(loadingRect.height - initialRect.height)).toBeLessThanOrEqual(1);
      expect(Math.abs(loadingRect.width - initialRect.width)).toBeLessThanOrEqual(1);
    });

    it('content and spinner transitions work correctly', () => {
      const { rerender } = render(
        <PrimaryCTA ariaLabel="Test" loading={false}>
          Content
        </PrimaryCTA>
      );

      // Normal state: content visible, no spinner
      let contentSpan = screen.getByRole('button').querySelector('span:first-child');
      expect(contentSpan).toHaveClass('opacity-100');
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();

      // Loading state: content hidden, spinner visible
      rerender(
        <PrimaryCTA ariaLabel="Test" loading={true}>
          Content
        </PrimaryCTA>
      );

      contentSpan = screen.getByRole('button').querySelector('span:first-child');
      expect(contentSpan).toHaveClass('opacity-0');
      expect(screen.getByTestId('spinner')).toBeInTheDocument();
    });
  });

  describe('Premium Styling Tests', () => {
    it('applies Apple-level styling classes correctly', () => {
      render(<PrimaryCTA ariaLabel="Premium button">Premium</PrimaryCTA>);
      
      const button = screen.getByRole('button');
      
      // Premium layout and typography
      expect(button).toHaveClass('relative', 'inline-flex', 'items-center', 'justify-center');
      expect(button).toHaveClass('font-semibold', 'tracking-tight');
      
      // Premium styling
      expect(button).toHaveClass('rounded-xl', 'shadow-lg');
      expect(button).toHaveClass('transition-all', 'duration-200', 'ease-out');
      
      // Premium colors (light mode)
      expect(button).toHaveClass('bg-gray-900', 'text-white');
      expect(button).toHaveClass('hover:bg-gray-800', 'hover:shadow-xl');
      
      // Premium colors (dark mode)
      expect(button).toHaveClass('dark:bg-white', 'dark:text-gray-900');
      expect(button).toHaveClass('dark:hover:bg-gray-50');
      
      // Accessibility
      expect(button).toHaveClass('focus-visible:outline-none', 'focus-visible:ring-2');
      expect(button).toHaveClass('select-none');
    });

    it('applies different sizes with fixed heights', () => {
      const { rerender } = render(
        <PrimaryCTA ariaLabel="Large" size="lg">Large</PrimaryCTA>
      );
      
      let button = screen.getByRole('button');
      expect(button).toHaveClass('min-h-[56px]', 'px-8', 'text-base');
      expect(button).toHaveClass('sm:min-h-[60px]', 'sm:px-10', 'sm:text-lg');

      rerender(
        <PrimaryCTA ariaLabel="Medium" size="md">Medium</PrimaryCTA>
      );
      
      button = screen.getByRole('button');
      expect(button).toHaveClass('min-h-[48px]', 'px-6', 'text-sm');
    });
  });

  describe('ListenNow Integration Tests', () => {
    it('integrates seamlessly with ListenNow component', async () => {
      render(<ListenNow handle="testartist" artistName="Test Artist" />);
      
      const button = screen.getByRole('button');
      
      // Should have proper aria-label
      expect(button).toHaveAttribute('aria-label', 'Listen to Test Artist');
      
      // Should have fixed dimensions
      expect(button).toHaveClass('min-h-[56px]');
      
      // Should show "Listen Now" text initially
      expect(button).toHaveTextContent('Listen Now');
      
      // Should not be in loading state initially
      expect(button).not.toBeDisabled();
      expect(button).not.toHaveAttribute('aria-disabled', 'true');
      
      // Content should be visible initially
      const contentSpan = button.querySelector('span:first-child');
      expect(contentSpan).toHaveClass('opacity-100');
      
      // Should not have spinner initially
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    });

    it('makes correct API call and opens window', async () => {
      render(<ListenNow handle="testartist" artistName="Test Artist" />);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      // Should make tracking call
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            handle: 'testartist',
            linkType: 'listen',
            target: 'spotify',
          }),
        });
      });
      
      // Should open window after tracking
      await waitFor(() => {
        expect(window.open).toHaveBeenCalledWith(
          '/testartist/listen',
          '_blank',
          'noopener,noreferrer'
        );
      });
    });
  });

  describe('Accessibility Integration Tests', () => {
    it('provides comprehensive accessibility features', () => {
      render(
        <PrimaryCTA 
          ariaLabel="Main action" 
          loadingLabel="Processing action..."
          loading={true}
          id="main-cta"
          dataTestId="main-cta-button"
        >
          Submit
        </PrimaryCTA>
      );

      const button = screen.getByRole('button');
      
      // Basic attributes
      expect(button).toHaveAttribute('id', 'main-cta');
      expect(button).toHaveAttribute('data-testid', 'main-cta-button');
      
      // Accessibility attributes
      expect(button).toHaveAttribute('aria-label', 'Processing action...');
      expect(button).toHaveAttribute('aria-disabled', 'true');
      
      // Loading indicator should be hidden from screen readers
      const spinnerContainer = button.querySelector('[aria-hidden="true"]');
      expect(spinnerContainer).toBeInTheDocument();
      
      // Focus-visible classes
      expect(button).toHaveClass('focus-visible:outline-none', 'focus-visible:ring-2');
    });
  });
});