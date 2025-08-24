import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { TipSection } from './TipSection';
import { ToastProvider } from '@/components/providers/ToastProvider';

// Mock the useToast hook
const mockShowToast = jest.fn();
jest.mock('@/components/ui/ToastContainer', () => {
  const originalModule = jest.requireActual('@/components/ui/ToastContainer');
  return {
    ...originalModule,
    useToast: () => ({
      showToast: mockShowToast,
      hideToast: jest.fn(),
      clearToasts: jest.fn(),
    }),
  };
});

describe('TipSection', () => {
  const mockOnStripePayment = jest.fn();
  const mockOnVenmoPayment = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows success toast when Stripe payment succeeds', async () => {
    mockOnStripePayment.mockResolvedValueOnce(undefined);

    render(
      <ToastProvider>
        <TipSection
          handle="artist123"
          artistName="Test Artist"
          onStripePayment={mockOnStripePayment}
        />
      </ToastProvider>
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
      <ToastProvider>
        <TipSection
          handle="artist123"
          artistName="Test Artist"
          onStripePayment={mockOnStripePayment}
        />
      </ToastProvider>
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
      <ToastProvider>
        <TipSection
          handle="artist123"
          artistName="Test Artist"
          onStripePayment={mockOnStripePayment}
          venmoLink="https://venmo.com/user"
          onVenmoPayment={mockOnVenmoPayment}
        />
      </ToastProvider>
    );

    expect(screen.getByText('Choose payment method')).toBeInTheDocument();
    expect(screen.getByText('Pay with Apple Pay / Card')).toBeInTheDocument();
    expect(screen.getByText('Pay with Venmo')).toBeInTheDocument();
  });
});
