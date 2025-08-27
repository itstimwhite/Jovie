import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { useRef } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { ProductFlyout } from '@/components/organisms/ProductFlyout';

// Mock the features data to avoid dependency issues
vi.mock('@/lib/features', () => ({
  FEATURES: [
    {
      slug: 'smart-conversions',
      title: 'Smart Conversions',
      blurb: 'AI-optimized CTAs and layouts that adapt in real time.',
      href: '/features/smart-conversions',
      Icon: () => <svg data-testid='test-icon' />,
      colorVar: '--accent-conv',
      aiPowered: true,
    },
    {
      slug: 'real-time-analytics',
      title: 'Real-Time Analytics',
      blurb: 'Instant insights, always aligned with your ad platforms.',
      href: '/features/analytics',
      Icon: () => <svg data-testid='test-icon' />,
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

    // Use getAllByText since features appear in both desktop and mobile layouts
    expect(screen.getAllByText('Smart Conversions')).toHaveLength(2);
    expect(screen.getAllByText('Real-Time Analytics')).toHaveLength(2);
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
