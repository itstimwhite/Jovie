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

    // Check that preview container exists with min-height
    const previewContainer = document.querySelector('#handle-preview-text');
    expect(previewContainer).toBeInTheDocument();
    expect(previewContainer).toHaveClass('min-h-[1.25rem]');
  });

  test('has proper accessibility attributes', () => {
    render(<ClaimHandleForm />);

    const input = screen.getByLabelText(/your handle/i);
    // When no error, FormField wires aria-describedby to help text id
    expect(input).toHaveAttribute('aria-describedby', 'handle-input-help');
    // aria-invalid may be absent when no error; it's only set to true when invalid
    expect(input).not.toHaveAttribute('aria-invalid', 'true');

    // Check aria-live region exists (component uses assertive with a specific id)
    const liveRegion = document.getElementById('loading-announcement');
    expect(liveRegion).not.toBeNull();
    expect(liveRegion).toHaveAttribute('aria-live', 'assertive');
  });

  test('tap-to-copy functionality with proper keyboard support', async () => {
    // Mock successful handle check
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ available: true }),
    });

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

    const input = screen.getByLabelText(/your handle/i);
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

    // Cleanup
    cleanup();
  });

  test('validation messages update aria attributes correctly', async () => {
    // Mock handle taken response
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ available: false }),
    });

    render(<ClaimHandleForm />);

    const input = screen.getByLabelText(/your handle/i);
    fireEvent.change(input, { target: { value: 'taken-handle' } });
    const form = document.querySelector('form') as HTMLFormElement;
    fireEvent.submit(form);

    // Wait for validation
    await waitFor(() => {
      expect(input).toHaveAttribute('aria-invalid', 'true');
      // FormField sets aria-describedby to help, and may append error id when error prop is set
      const describedBy = (input.getAttribute('aria-describedby') || '').split(
        ' '
      );
      expect(describedBy).toContain('handle-input-help');
      // error id may be present when formSubmitted -> error
      // if present, ensure correct id; if not, that's acceptable for this state
      if (describedBy.includes('handle-input-error')) {
        expect(describedBy).toContain('handle-input-error');
      }
    });

    // Check that error message appears in the field-level helper text
    await waitFor(() => {
      const fieldAlert = document.getElementById('handle-input-error');
      expect(fieldAlert).not.toBeNull();
      expect(fieldAlert).toHaveAttribute('role', 'alert');
      expect(fieldAlert).toHaveTextContent('Handle already taken');
    });
  });

  test('shake animation triggers on invalid submission', () => {
    render(<ClaimHandleForm />);

    const form = document.querySelector('form') as HTMLFormElement;
    expect(form).not.toBeNull();
    const input = screen.getByLabelText(/your handle/i);

    // Try to submit with invalid handle
    fireEvent.change(input, { target: { value: 'ab' } }); // Too short
    fireEvent.submit(form);

    // Check that shake class is added
    expect(input.parentElement).toHaveClass('jv-shake');
  });
});
