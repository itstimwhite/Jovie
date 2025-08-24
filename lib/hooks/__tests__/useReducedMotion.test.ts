import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { useReducedMotion } from '../useReducedMotion';

describe('useReducedMotion', () => {
  // Mock matchMedia
  const matchMediaMock = vi.fn();

  // Mock event listener
  const addEventListenerMock = vi.fn();
  const removeEventListenerMock = vi.fn();

  beforeEach(() => {
    // Setup mocks before each test
    global.window = {
      ...global.window,
      matchMedia: matchMediaMock,
    } as unknown;
  });

  afterEach(() => {
    // Clear mocks after each test
    vi.clearAllMocks();
  });

  it('should return false when prefers-reduced-motion is not set', () => {
    // Mock matchMedia to return no preference for reduced motion
    matchMediaMock.mockReturnValue({
      matches: false,
      addEventListener: addEventListenerMock,
      removeEventListener: removeEventListenerMock,
    });

    const { result } = renderHook(() => useReducedMotion());

    expect(result.current).toBe(false);
    expect(matchMediaMock).toHaveBeenCalledWith(
      '(prefers-reduced-motion: reduce)'
    );
    expect(addEventListenerMock).toHaveBeenCalledWith(
      'change',
      expect.any(Function)
    );
  });

  it('should return true when prefers-reduced-motion is set to reduce', () => {
    // Mock matchMedia to return preference for reduced motion
    matchMediaMock.mockReturnValue({
      matches: true,
      addEventListener: addEventListenerMock,
      removeEventListener: removeEventListenerMock,
    });

    const { result } = renderHook(() => useReducedMotion());

    expect(result.current).toBe(true);
    expect(matchMediaMock).toHaveBeenCalledWith(
      '(prefers-reduced-motion: reduce)'
    );
    expect(addEventListenerMock).toHaveBeenCalledWith(
      'change',
      expect.any(Function)
    );
  });

  it('should clean up event listener on unmount', () => {
    // Mock matchMedia to return no preference for reduced motion
    matchMediaMock.mockReturnValue({
      matches: false,
      addEventListener: addEventListenerMock,
      removeEventListener: removeEventListenerMock,
    });

    const { unmount } = renderHook(() => useReducedMotion());

    unmount();

    expect(removeEventListenerMock).toHaveBeenCalledWith(
      'change',
      expect.any(Function)
    );
  });

  it('should handle missing matchMedia gracefully', () => {
    // Mock window without matchMedia
    global.window = {
      ...global.window,
      matchMedia: undefined,
    } as unknown;

    const { result } = renderHook(() => useReducedMotion());

    // Should default to false when matchMedia is not available
    expect(result.current).toBe(false);
  });
});
