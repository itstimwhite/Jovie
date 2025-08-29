import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { isShareSupported, shareContent } from '@/lib/share';

// Mock toast
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

describe('share utilities', () => {
  const originalNavigator = global.navigator;
  const mockNavigator = {
    share: vi.fn(),
    clipboard: {
      writeText: vi.fn(),
    },
  };

  beforeEach(() => {
    // Reset mocks
    vi.resetAllMocks();

    // Mock navigator
    Object.defineProperty(global, 'navigator', {
      value: mockNavigator,
      writable: true,
    });
  });

  afterEach(() => {
    // Restore original navigator
    Object.defineProperty(global, 'navigator', {
      value: originalNavigator,
      writable: true,
    });
  });

  describe('isShareSupported', () => {
    it('should return true when navigator.share is available', () => {
      expect(isShareSupported()).toBe(true);
    });

    it('should return false when navigator.share is not available', () => {
      Object.defineProperty(global.navigator, 'share', {
        value: undefined,
      });
      expect(isShareSupported()).toBe(false);
    });
  });

  describe('shareContent', () => {
    it('should use Web Share API when available', async () => {
      mockNavigator.share.mockResolvedValueOnce(undefined);

      const result = await shareContent({
        url: 'https://example.com/tip/123',
        title: 'Support this artist',
        text: 'Help support this artist with a tip!',
      });

      expect(result).toBe(true);
      expect(mockNavigator.share).toHaveBeenCalledWith({
        url: 'https://example.com/tip/123',
        title: 'Support this artist',
        text: 'Help support this artist with a tip!',
      });
      expect(mockNavigator.clipboard.writeText).not.toHaveBeenCalled();
    });

    it('should fall back to clipboard when Web Share API is not available', async () => {
      // Remove share API
      Object.defineProperty(global.navigator, 'share', {
        value: undefined,
      });

      mockNavigator.clipboard.writeText.mockResolvedValueOnce(undefined);

      const result = await shareContent({
        url: 'https://example.com/tip/123',
      });

      expect(result).toBe(true);
      expect(mockNavigator.clipboard.writeText).toHaveBeenCalledWith(
        'https://example.com/tip/123'
      );
    });

    it('should handle Web Share API errors gracefully', async () => {
      const error = new Error('Share failed');
      mockNavigator.share.mockRejectedValueOnce(error);

      const onErrorMock = vi.fn();

      const result = await shareContent({
        url: 'https://example.com/tip/123',
        onError: onErrorMock,
      });

      expect(result).toBe(false);
      expect(onErrorMock).toHaveBeenCalledWith(error);
    });

    it('should not call onError when user cancels share', async () => {
      const abortError = new Error('User cancelled');
      abortError.name = 'AbortError';
      mockNavigator.share.mockRejectedValueOnce(abortError);

      const onErrorMock = vi.fn();

      const result = await shareContent({
        url: 'https://example.com/tip/123',
        onError: onErrorMock,
      });

      expect(result).toBe(false);
      expect(onErrorMock).not.toHaveBeenCalled();
    });
  });
});
