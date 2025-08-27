import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TipSection } from './TipSection';

// Mock the ToastContainer module
const mockShowToast = vi.fn();
vi.mock('@/components/ui/ToastContainer', () => {
  return {
    useToast: () => ({
      showToast: mockShowToast,
      hideToast: vi.fn(),
      clearToasts: vi.fn(),
    }),
    ToastProvider: ({ children }: { children: React.ReactNode }) => (
      <>{children}</>
    ),
  };
});

// Mock the ToastProvider from providers
vi.mock('@/components/providers/ToastProvider', () => ({
  ToastProvider: ({ children }: { children: React.ReactNode }) => (
    <>{children}</>
  ),
}));

describe('TipSection', () => {
  const mockOnStripePayment = vi.fn();
  const mockOnVenmoPayment = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows success toast when Stripe payment succeeds', async () => {
    mockOnStripePayment.mockResolvedValueOnce(undefined);

    render(
      <TipSection
        handle='artist123'
        artistName='Test Artist'
        onStripePayment={mockOnStripePayment}
      />
    );

    // Find and click the $2 tip button
    const tipButton = screen.getByText('$2 Tip');
    fireEvent.click(tipButton);

    // Wait for the payment to complete
    await waitFor(() => {
      expect(mockOnStripePayment).toHaveBeenCalledWith(2);
    });

    // Verify toast was shown with success message
    expect(mockShowToast).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Thanks for the $2 tip 🎉',
        type: 'success',
      })
    );
  });

  it('shows error toast when Stripe payment fails', async () => {
    mockOnStripePayment.mockRejectedValueOnce(new Error('Payment failed'));

    render(
      <TipSection
        handle='artist123'
        artistName='Test Artist'
        onStripePayment={mockOnStripePayment}
      />
    );

    // Find and click the $2 tip button
    const tipButton = screen.getByText('$2 Tip');
    fireEvent.click(tipButton);

    // Wait for the payment to fail
    await waitFor(() => {
      expect(mockOnStripePayment).toHaveBeenCalledWith(2);
    });

    // Verify toast was shown with error message
    expect(mockShowToast).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Payment failed. Please try again.',
        type: 'error',
      })
    );
  });

  it('renders payment method selection when both Stripe and Venmo are available', () => {
    render(
      <TipSection
        handle='artist123'
        artistName='Test Artist'
        onStripePayment={mockOnStripePayment}
        venmoLink='https://venmo.com/user'
        onVenmoPayment={mockOnVenmoPayment}
      />
    );

    expect(screen.getByText('Choose payment method')).toBeInTheDocument();
    expect(screen.getByText('Pay with Apple Pay / Card')).toBeInTheDocument();
    expect(screen.getByText('Pay with Venmo')).toBeInTheDocument();
  });
});
