import { useAuth } from '@clerk/nextjs';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { ClaimHandleForm } from '@/components/home/ClaimHandleForm';
import { APP_URL } from '@/constants/app';

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
    });
    mockUseAuth.mockReturnValue({
      isSignedIn: false,
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('prevents layout jumps with consistent spacing', () => {
    render(<ClaimHandleForm />);

    // Check that helper text container exists with min-height
    const helperContainer = document.querySelector('[aria-live="assertive"]');
    expect(helperContainer).toBeInTheDocument();

    // Check that preview container exists with min-height
    const previewContainer = document.querySelector('#handle-preview-text');
    expect(previewContainer).toBeInTheDocument();
    expect(previewContainer).toHaveClass('min-h-[1.25rem]');
  });

  test('has proper accessibility attributes', () => {
    render(<ClaimHandleForm />);

    const input = screen.getByRole('textbox', { name: /choose your handle/i });
    expect(input).toHaveAttribute('aria-describedby', 'handle-input-help');
    expect(input).toHaveAttribute('aria-required', 'true');

    // Check aria-live region exists
    const liveRegion = document.querySelector('[aria-live="assertive"]');
    expect(liveRegion).not.toBeNull();
    expect(liveRegion).toHaveAttribute('aria-live', 'assertive');
  });

  test('tap-to-copy functionality with proper keyboard support', async () => {
    // Mock successful handle check
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ available: true }),
    } as any);

    // Mock clipboard API only if not already defined
    const originalClipboard = navigator.clipboard;
    if (!navigator.clipboard) {
      Object.defineProperty(navigator, 'clipboard', {
        value: {
          writeText: vi.fn(),
        },
        writable: true,
        configurable: true,
      });
    } else {
      vi.spyOn(navigator.clipboard, 'writeText').mockImplementation(vi.fn());
    }

    // Cleanup function to restore original state
    const cleanup = () => {
      if (originalClipboard) {
        Object.defineProperty(navigator, 'clipboard', {
          value: originalClipboard,
          writable: true,
          configurable: true,
        });
      }
    };

    render(<ClaimHandleForm />);

    const input = screen.getByRole('textbox', { name: /choose your handle/i });
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

    // Expected domain (component strips protocol)
    const displayDomain = APP_URL.replace(/^https?:\/\//, '');

    // Test click functionality on the URL preview
    const copyButton = screen.getByRole('button', {
      name: `Copy profile URL ${displayDomain}/testhandle`,
    });
    fireEvent.click(copyButton);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
      `${displayDomain}/testhandle`
    );

    // Test keyboard support
    fireEvent.keyDown(copyButton, { key: 'Enter' });
    expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(2);

    fireEvent.keyDown(copyButton, { key: ' ' });
    expect(navigator.clipboard.writeText).toHaveBeenCalledTimes(3);

    // Cleanup
    cleanup();
  });

  test('validation messages update aria attributes correctly', async () => {
    // Mock handle taken response
    vi.mocked(global.fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ available: false }),
    } as any);

    render(<ClaimHandleForm />);

    const input = screen.getByRole('textbox', { name: /choose your handle/i });
    fireEvent.change(input, { target: { value: 'taken-handle' } });
    const form = document.querySelector('form') as HTMLFormElement;
    fireEvent.submit(form);

    // Wait for validation
    await waitFor(() => {
      expect(input).toHaveAttribute('aria-invalid', 'true');
      // FormField combines help and error IDs when error is present
      const describedBy = input.getAttribute('aria-describedby') || '';
      expect(describedBy).toContain('handle-input-help');
      expect(describedBy).toContain('handle-input-error');
    });

    // Check that the URL preview shows the invalid handle in red styling
    await waitFor(() => {
      const handleText = screen.getByText('taken-handle');
      expect(handleText).toBeInTheDocument();
      expect(handleText).toHaveClass('text-current'); // This class is applied for error state
    });
  });

  test('shake animation triggers on invalid submission', () => {
    render(<ClaimHandleForm />);

    const form = document.querySelector('form') as HTMLFormElement;
    expect(form).not.toBeNull();
    const input = screen.getByRole('textbox', { name: /choose your handle/i });

    // Try to submit with invalid handle
    fireEvent.change(input, { target: { value: 'ab' } }); // Too short
    fireEvent.submit(form);

    // Check that shake class is added
    expect(input.parentElement).toHaveClass('jv-shake');
  });
});
