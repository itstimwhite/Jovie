import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { TipJar } from '@/components/profile/TipJar';
import { loadStripe } from '@stripe/stripe-js';
import { ToastProvider } from '@/components/providers/ToastProvider';

vi.mock('@stripe/stripe-js', () => ({
  loadStripe: vi.fn(),
}));

const mockedLoadStripe = loadStripe as unknown as ReturnType<typeof vi.fn>;

describe('TipJar', () => {
  afterEach(() => {
    cleanup();
    vi.clearAllMocks();
    delete process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  });

  it('renders tip buttons on supported devices', async () => {
    const show = vi.fn();
    const paymentRequest = {
      canMakePayment: vi.fn().mockResolvedValue(true),
      show,
    };
    mockedLoadStripe.mockResolvedValue({
      paymentRequest: () => paymentRequest,
    });

    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = 'pk_test';

    render(
      <ToastProvider>
        <TipJar handle="tim" artistName="Tim" />
      </ToastProvider>
    );

    expect(await screen.findByText('$2 Tip')).toBeInTheDocument();
    fireEvent.click(screen.getByText('$2 Tip'));
    expect(show).toHaveBeenCalled();
  });

  it('renders QR fallback when PaymentRequest unsupported', async () => {
    const paymentRequest = {
      canMakePayment: vi.fn().mockResolvedValue(null),
    };
    mockedLoadStripe.mockResolvedValue({
      paymentRequest: () => paymentRequest,
    });

    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = 'pk_test';

    render(
      <ToastProvider>
        <TipJar handle="tim" artistName="Tim" />
      </ToastProvider>
    );

    expect(
      await screen.findByText('Scan to tip via Apple Pay')
    ).toBeInTheDocument();
  });
});
