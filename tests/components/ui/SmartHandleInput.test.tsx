import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
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

  it('debounces API validation calls', async () => {
    mockFetchResponse(true);
    
    const onChange = vi.fn();
    const { rerender } = render(
      <SmartHandleInput
        value="validhandle"
        onChange={onChange}
      />
    );

    // Change value multiple times rapidly
    rerender(<SmartHandleInput value="validhandle1" onChange={onChange} />);
    rerender(<SmartHandleInput value="validhandle2" onChange={onChange} />);
    rerender(<SmartHandleInput value="validhandle3" onChange={onChange} />);

    // Should not have called fetch yet (debounced)
    expect(global.fetch).not.toHaveBeenCalled();

    // Fast-forward past debounce time
    vi.advanceTimersByTime(600);

    // Should have only called fetch once with the latest value
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('validhandle3'),
      expect.any(Object)
    );
  });

  it('shows available status when API confirms handle is available', async () => {
    mockFetchResponse(true);
    
    const onChange = vi.fn();
    render(
      <SmartHandleInput
        value="availablehandle"
        onChange={onChange}
      />
    );

    // Fast-forward past debounce time
    vi.advanceTimersByTime(600);
    
    // Wait for the API validation to complete
    await waitFor(() => {
      expect(screen.getByText(/@availablehandle is available!/i)).toBeInTheDocument();
    });
  });

  it('shows taken status when API confirms handle is taken', async () => {
    mockFetchResponse(false, 'Handle already taken');
    
    const onChange = vi.fn();
    render(
      <SmartHandleInput
        value="takenhandle"
        onChange={onChange}
      />
    );

    // Fast-forward past debounce time
    vi.advanceTimersByTime(600);
    
    // Wait for the API validation to complete
    await waitFor(() => {
      expect(screen.getByText(/Handle already taken/i)).toBeInTheDocument();
    });
  });

  it('cancels previous API requests when value changes', async () => {
    const abortMock = vi.fn();
    global.AbortController = vi.fn().mockImplementation(() => ({
      signal: { aborted: false },
      abort: abortMock,
    }));

    mockFetchResponse(true);
    
    const onChange = vi.fn();
    const { rerender } = render(
      <SmartHandleInput
        value="handle1"
        onChange={onChange}
      />
    );

    // Fast-forward a bit but not past full debounce
    vi.advanceTimersByTime(100);
    
    // Change value before first request completes
    rerender(<SmartHandleInput value="handle2" onChange={onChange} />);
    
    // Should have called abort on the previous controller
    expect(abortMock).toHaveBeenCalled();
  });
});
