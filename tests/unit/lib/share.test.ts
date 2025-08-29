import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { isShareSupported, shareContent } from '@/lib/share';
import { toast } from 'sonner';

// Mock the toast module
vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
  },
}));

describe('share utilities', () => {
  // Setup and teardown
  beforeEach(() => {
    // Reset all mocks before each test
    vi.resetAllMocks();
  });

  afterEach(() => {
    // Restore all mocks after each test
    vi.restoreAllMocks();
  });

  describe('isShareSupported', () => {
    it('should return true when navigator.share is available', () => {
      // Mock navigator.share
      Object.defineProperty(global.navigator, 'share', {
        value: vi.fn(),
        configurable: true,
      });

      expect(isShareSupported()).toBe(true);
    });

    it('should return false when navigator.share is not available', () => {
      // Mock navigator without share
      Object.defineProperty(global.navigator, 'share', {
        value: undefined,
        configurable: true,
      });

      expect(isShareSupported()).toBe(false);
    });
  });

  describe('shareContent', () => {
    it('should use Web Share API when available', async () => {
      // Mock navigator.share
      const mockShare = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(global.navigator, 'share', {
        value: mockShare,
        configurable: true,
      });

      const onSuccess = vi.fn();
      const result = await shareContent({
        url: 'https://example.com',
        title: 'Test Title',
        text: 'Test Text',
        onSuccess,
      });

      expect(mockShare).toHaveBeenCalledWith({
        url: 'https://example.com',
        title: 'Test Title',
        text: 'Test Text',
      });
      expect(onSuccess).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should fall back to clipboard when Web Share API is not available', async () => {
      // Mock navigator without share
      Object.defineProperty(global.navigator, 'share', {
        value: undefined,
        configurable: true,
      });

      // Mock clipboard
      const mockWriteText = vi.fn().mockResolvedValue(undefined);
      Object.defineProperty(global.navigator, 'clipboard', {
        value: { writeText: mockWriteText },
        configurable: true,
      });

      const onSuccess = vi.fn();
      const result = await shareContent({
        url: 'https://example.com',
        onSuccess,
      });

      expect(mockWriteText).toHaveBeenCalledWith('https://example.com');
      expect(toast.success).toHaveBeenCalledWith('Link copied to clipboard!');
      expect(onSuccess).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should handle Web Share API errors gracefully', async () => {
      // Mock navigator.share with rejection
      const mockShare = vi.fn().mockRejectedValue(new Error('Share failed'));
      Object.defineProperty(global.navigator, 'share', {
        value: mockShare,
        configurable: true,
      });

      const onError = vi.fn();
      const result = await shareContent({
        url: 'https://example.com',
        onError,
      });

      expect(mockShare).toHaveBeenCalled();
      expect(onError).toHaveBeenCalledWith(expect.any(Error));
      expect(result).toBe(false);
    });

    it('should not call onError when user cancels share', async () => {
      // Mock navigator.share with AbortError
      const abortError = new Error('User cancelled');
      abortError.name = 'AbortError';
      const mockShare = vi.fn().mockRejectedValue(abortError);

      Object.defineProperty(global.navigator, 'share', {
        value: mockShare,
        configurable: true,
      });

      const onError = vi.fn();
      const result = await shareContent({
        url: 'https://example.com',
        onError,
      });

      expect(mockShare).toHaveBeenCalled();
      expect(onError).not.toHaveBeenCalled();
      expect(result).toBe(false);
    });
  });
});

