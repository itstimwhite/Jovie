import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { ClaimHandleForm } from '@/components/home/ClaimHandleForm';
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';

// Mock dependencies
vi.mock('@clerk/nextjs', () => ({
  useAuth: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

// Mock fetch for handle checking
global.fetch = vi.fn();

const mockPush = vi.fn();
const mockPrefetch = vi.fn();
const mockUseAuth = vi.mocked(useAuth);
const mockUseRouter = vi.mocked(useRouter);

describe('ClaimHandleForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseRouter.mockReturnValue({
      push: mockPush,
      prefetch: mockPrefetch,
    } as any);
    mockUseAuth.mockReturnValue({
      isSignedIn: false,
    } as any);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('prevents layout jumps with consistent spacing', () => {
    render(<ClaimHandleForm />);

    // Check that helper text container exists with min-height
    const helperContainer = document.querySelector('[aria-live="polite"]');
    expect(helperContainer).toBeInTheDocument();
    expect(helperContainer).toHaveClass('min-h-[1.125rem]');

    // Check that preview container exists with min-height
    const previewContainer = document.querySelector('#handle-preview-text');
    expect(previewContainer).toBeInTheDocument();
    expect(previewContainer).toHaveClass('min-h-[1.25rem]');
  });

  test('has proper accessibility attributes', () => {
    render(<ClaimHandleForm />);

    const input = screen.getByLabelText('Claim your handle');
    expect(input).toHaveAttribute('aria-describedby', 'handle-preview-text');
    expect(input).toHaveAttribute('aria-invalid', 'false');

    // Check aria-live region exists
    const liveRegion = document.querySelector('[aria-live="polite"]');
    expect(liveRegion).not.toBeNull();
  });

  test('tap-to-copy functionality with proper keyboard support', async () => {
    // Mock successful handle check
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ available: true }),
    });

    // Mock clipboard API
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: vi.fn(),
      },
      writable: true,
    });

    render(<ClaimHandleForm />);

    const input = screen.getByLabelText('Claim your handle');
    fireEvent.change(input, { target: { value: 'testhandle' } });

    // Wait for availability check
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/handle/check?handle=testhandle',
        expect.any(Object)
      );
    });

    // Wait for the Available badge to appear
    await waitFor(() => {
      const availableText = screen.getByText('Available');
      expect(availableText).toBeInTheDocument();
    });

    // Test click functionality on the URL preview
    const copyButton = screen.getByRole('button', {
      name: 'Copy profile URL jov.ie/testhandle',
    });
    fireEvent.click(copyButton);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      'jov.ie/testhandle'
    );

    // Test keyboard support
    fireEvent.keyDown(copyButton, { key: 'Enter' });
    expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(2);

    fireEvent.keyDown(copyButton, { key: ' ' });
    expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(3);
  });

  test('validation messages update aria attributes correctly', async () => {
    // Mock handle taken response
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ available: false }),
    });

    render(<ClaimHandleForm />);

    const input = screen.getByLabelText('Claim your handle');
    fireEvent.change(input, { target: { value: 'taken-handle' } });

    // Wait for validation
    await waitFor(() => {
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input).toHaveAttribute('aria-describedby', 'handle-helper-text');
    });

    // Check that error message appears in helper text
    await waitFor(() => {
      const alertMessage = screen.getByRole('alert');
      expect(alertMessage).toHaveTextContent('Handle already taken');
    });
  });

  test('shake animation triggers on invalid submission', () => {
    render(<ClaimHandleForm />);

    const form = document.querySelector('form') as HTMLFormElement;
    expect(form).not.toBeNull();
    const input = screen.getByLabelText('Claim your handle');

    // Try to submit with invalid handle
    fireEvent.change(input, { target: { value: 'ab' } }); // Too short
    fireEvent.submit(form);

    // Check that shake class is added
    expect(input.parentElement).toHaveClass('jv-shake');
  });
});
