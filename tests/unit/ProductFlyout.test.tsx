import { describe, it, expect, afterEach, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { ProductFlyout } from '@/components/organisms/ProductFlyout';
import { useRef } from 'react';

// Mock the features data to avoid dependency issues
vi.mock('@/lib/features', () => ({
  FEATURES: [
    {
      slug: 'smart-conversions',
      title: 'Smart Conversions',
      blurb: 'AI-optimized CTAs and layouts that adapt automatically.',
      href: '/features/smart-conversions',
      Icon: () => <svg data-testid="test-icon" />,
      colorVar: '--accent-conv',
    },
    {
      slug: 'real-time-analytics',
      title: 'Real-Time Analytics',
      blurb: 'Instant, reliable insights aligned with your ad platforms.',
      href: '/features/analytics',
      Icon: () => <svg data-testid="test-icon" />,
      colorVar: '--accent-analytics',
    },
  ],
}));

// Test wrapper component that provides the required ref
function TestWrapper({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const triggerRef = useRef<HTMLButtonElement>(null);

  return (
    <div>
      <button ref={triggerRef}>Product</button>
      <ProductFlyout
        isOpen={isOpen}
        onClose={onClose}
        triggerRef={triggerRef}
      />
    </div>
  );
}

describe('ProductFlyout', () => {
  afterEach(cleanup);

  const mockOnClose = vi.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  it('renders when open', () => {
    render(<TestWrapper isOpen={true} onClose={mockOnClose} />);

    const flyout = screen.getByRole('menu');
    expect(flyout).toBeInTheDocument();
  });

  it('does not render when closed', () => {
    render(<TestWrapper isOpen={false} onClose={mockOnClose} />);

    const flyout = screen.queryByRole('menu');
    expect(flyout).not.toBeInTheDocument();
  });

  it('renders feature items', () => {
    render(<TestWrapper isOpen={true} onClose={mockOnClose} />);

    expect(screen.getByText('Smart Conversions')).toBeInTheDocument();
    expect(screen.getByText('Real-Time Analytics')).toBeInTheDocument();
  });

  it('has correct accessibility attributes', () => {
    render(<TestWrapper isOpen={true} onClose={mockOnClose} />);

    const flyout = screen.getByRole('menu');
    expect(flyout).toHaveAttribute('aria-labelledby', 'product-trigger');
  });

  it('closes on Escape key', () => {
    render(<TestWrapper isOpen={true} onClose={mockOnClose} />);

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(mockOnClose).toHaveBeenCalled();
  });
});
