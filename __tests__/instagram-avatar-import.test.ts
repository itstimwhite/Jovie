import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchInstagramProfileImage } from '@/lib/instagram-image-fetcher';
import { processRemoteImage } from '@/lib/remote-image-processor';
import { validateInstagramHandle, normalizeInstagramHandle } from '@/lib/instagram-utils';

// Define types for mocked global objects
interface MockedFetch {
  mockResolvedValueOnce: (value: unknown) => MockedFetch;
  mockReset: () => void;
}

interface MockedFormData {
  append: (name: string, value: string | Blob) => void;
}

// Mock fetch
global.fetch = vi.fn() as unknown as typeof fetch & MockedFetch;
global.AbortController = vi.fn(() => ({
  abort: vi.fn(),
  signal: 'mock-signal',
})) as unknown as typeof AbortController;

// Mock FormData
global.FormData = vi.fn(() => ({
  append: vi.fn(),
})) as unknown as typeof FormData;

// Mock File
global.File = vi.fn((content: Array<unknown>, name: string, options?: { type?: string }) => ({
  name,
  type: options?.type || 'image/jpeg',
  size: (content[0] as { size?: number })?.size || 1024,
})) as unknown as typeof File;

describe('Instagram Avatar Import', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('Instagram Handle Validation', () => {
    it('should validate correct Instagram handles', () => {
      expect(validateInstagramHandle('username').isValid).toBe(true);
      expect(validateInstagramHandle('@username').isValid).toBe(true);
      expect(validateInstagramHandle('instagram.com/username').isValid).toBe(true);
      expect(validateInstagramHandle('https://www.instagram.com/username/').isValid).toBe(true);
    });

    it('should reject invalid Instagram handles', () => {
      expect(validateInstagramHandle('').isValid).toBe(false);
      expect(validateInstagramHandle('a'.repeat(31)).isValid).toBe(false);
      expect(validateInstagramHandle('user-name').isValid).toBe(false);
      expect(validateInstagramHandle('user..name').isValid).toBe(false);
      expect(validateInstagramHandle('.username').isValid).toBe(false);
      expect(validateInstagramHandle('_username').isValid).toBe(false);
      expect(validateInstagramHandle('username.').isValid).toBe(false);
      expect(validateInstagramHandle('username_').isValid).toBe(false);
      expect(validateInstagramHandle('instagram').isValid).toBe(false);
    });

    it('should normalize Instagram handles correctly', () => {
      expect(normalizeInstagramHandle('@username')).toBe('username');
      expect(normalizeInstagramHandle('instagram.com/username')).toBe('username');
      expect(normalizeInstagramHandle('https://instagram.com/username')).toBe('username');
      expect(normalizeInstagramHandle('https://www.instagram.com/username')).toBe('username');
      expect(normalizeInstagramHandle('username/')).toBe('username');
      expect(normalizeInstagramHandle('username?hl=en')).toBe('username');
      expect(normalizeInstagramHandle('https://www.instagram.com/@username/?hl=en')).toBe('username');
    });
  });

  describe('Instagram Profile Image Fetching', () => {
    it('should fetch Instagram profile image successfully', async () => {
      // Mock successful oEmbed response
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            author: {
              image: {
                url: 'https://example.com/profile.jpg',
              },
            },
          },
        }),
      });

      const result = await fetchInstagramProfileImage('username');
      
      expect(result.success).toBe(true);
      expect(result.imageUrl).toBe('https://example.com/profile.jpg');
      expect(result.source).toBe('oembed');
    });

    it('should handle fetch failures gracefully', async () => {
      // Mock failed oEmbed response
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 404,
      });
      
      // Mock failed Open Graph response
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });
      
      // Mock failed HTML parsing response
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 503,
      });

      const result = await fetchInstagramProfileImage('username');
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Could not fetch Instagram profile image');
    });
  });

  describe('Remote Image Processing', () => {
    it('should process and upload remote image successfully', async () => {
      // Mock successful image fetch
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        headers: {
          get: (name: string) => {
            if (name === 'content-type') return 'image/jpeg';
            if (name === 'content-length') return '1024'; // 1KB
            return null;
          },
        },
        blob: async () => ({ 
          size: 1024, 
          type: 'image/jpeg' 
        }),
      });
      
      // Mock successful sign-upload API call
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          cloudName: 'demo',
          apiKey: 'mock-api-key',
          timestamp: 1234567890,
          signature: 'mock-signature',
          upload_preset: 'mock-preset',
        }),
      });
      
      // Mock successful Cloudinary upload
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          public_id: 'avatars/user123/image123',
          secure_url: 'https://res.cloudinary.com/demo/image/upload/v1/avatars/user123/image123.jpg',
        }),
      });
      
      const result = await processRemoteImage({
        userId: 'user123',
        sourceUrl: 'https://example.com/image.jpg',
      });
      
      expect(result.success).toBe(true);
      expect(result.imageUrl).toBe('https://res.cloudinary.com/demo/image/upload/v1/avatars/user123/image123.jpg');
      expect(result.thumbnailUrl).toBe('https://res.cloudinary.com/demo/image/upload/c_fill,g_face,h_256,w_256/v1/avatars/user123/image123.jpg');
    });

    it('should handle processing errors gracefully', async () => {
      // Mock successful image fetch
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        headers: {
          get: (name: string) => {
            if (name === 'content-type') return 'image/jpeg';
            return null;
          },
        },
        blob: async () => ({ 
          size: 1024, 
          type: 'image/jpeg' 
        }),
      });
      
      // Mock failed sign-upload API call
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
      });
      
      const result = await processRemoteImage({
        userId: 'user123',
        sourceUrl: 'https://example.com/image.jpg',
      });
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('Failed to sign upload');
    });
  });

  describe('End-to-End Instagram Avatar Import', () => {
    it('should successfully import Instagram avatar', async () => {
      // This test would simulate the entire flow from the API endpoint
      // In a real test, we would mock the API call and verify the result
      // For now, we'll just verify that the individual components work as expected
      
      // 1. Validate and normalize Instagram handle
      const handle = '@testuser';
      const validation = validateInstagramHandle(handle);
      const normalizedHandle = normalizeInstagramHandle(handle);
      
      expect(validation.isValid).toBe(true);
      expect(normalizedHandle).toBe('testuser');
      
      // 2. Mock fetch Instagram profile image
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          data: {
            author: {
              image: {
                url: 'https://example.com/profile.jpg',
              },
            },
          },
        }),
      });
      
      const fetchResult = await fetchInstagramProfileImage(normalizedHandle);
      
      expect(fetchResult.success).toBe(true);
      expect(fetchResult.imageUrl).toBe('https://example.com/profile.jpg');
      
      // 3. Mock process and upload image
      // Reset fetch mock for the next calls
      (global.fetch as any).mockReset();
      
      // Mock successful image fetch
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        headers: {
          get: (name: string) => {
            if (name === 'content-type') return 'image/jpeg';
            if (name === 'content-length') return '1024';
            return null;
          },
        },
        blob: async () => ({ 
          size: 1024, 
          type: 'image/jpeg' 
        }),
      });
      
      // Mock successful sign-upload API call
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          cloudName: 'demo',
          apiKey: 'mock-api-key',
          timestamp: 1234567890,
          signature: 'mock-signature',
        }),
      });
      
      // Mock successful Cloudinary upload
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          public_id: 'avatars/user123/image123',
          secure_url: 'https://res.cloudinary.com/demo/image/upload/v1/avatars/user123/image123.jpg',
        }),
      });
      
      const processResult = await processRemoteImage({
        userId: 'user123',
        sourceUrl: fetchResult.imageUrl!,
      });
      
      expect(processResult.success).toBe(true);
      expect(processResult.imageUrl).toBe('https://res.cloudinary.com/demo/image/upload/v1/avatars/user123/image123.jpg');
    });
  });
});
