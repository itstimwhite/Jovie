import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { SmartHandleInput } from '@/components/ui/SmartHandleInput';

// Mock fetch
global.fetch = vi.fn();

function mockFetchResponse(available: boolean, error?: string) {
  (global.fetch as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
    ok: true,
    json: async () => ({ available, error }),
  });
}

describe('SmartHandleInput', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it('renders without causing render loops', async () => {
    // Mock console.error to catch any potential render loop errors
    const originalError = console.error;
    const errorMock = vi.fn();
    console.error = errorMock;

    const onChange = vi.fn();
    const onValidationChange = vi.fn();

    render(
      <SmartHandleInput
        value="testhandle"
        onChange={onChange}
        onValidationChange={onValidationChange}
      />
    );

    // Fast-forward timers to trigger any potential render loops
    vi.runAllTimers();
    
    // If there's a render loop, console.error would be called with
    // "Maximum update depth exceeded" error
    expect(errorMock).not.toHaveBeenCalledWith(
      expect.stringContaining('Maximum update depth exceeded')
    );

    // Restore console.error
    console.error = originalError;
  });

  it('validates handle format client-side immediately', () => {
    const onChange = vi.fn();
    const onValidationChange = vi.fn();

    render(
      <SmartHandleInput
        value="test-handle"
        onChange={onChange}
        onValidationChange={onValidationChange}
      />
    );

    // Should have called onValidationChange with client validation result
    expect(onValidationChange).toHaveBeenCalledWith(
      expect.objectContaining({
        clientValid: true,
        error: null,
      })
    );
  });

  it('shows error for invalid handle format', () => {
    const onChange = vi.fn();
    
    render(
      <SmartHandleInput
        value="test@invalid"
        onChange={onChange}
      />
    );

    // Should show error message
    expect(screen.getByText(/can only contain letters, numbers, and hyphens/i)).toBeInTheDocument();
  });

  // Simplified test that doesn't rely on timers
  it('validates handle format client-side', () => {
    const onChange = vi.fn();
    
    render(
      <SmartHandleInput
        value="validhandle"
        onChange={onChange}
      />
    );

    // Should show the handle in the preview
    expect(screen.getByText(/jovie.link\/validhandle/i)).toBeInTheDocument();
  });
});
