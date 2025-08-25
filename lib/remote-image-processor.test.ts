import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { processRemoteImage } from './remote-image-processor';

// Mock fetch
global.fetch = vi.fn();
global.AbortController = vi.fn(() => ({
  abort: vi.fn(),
  signal: 'mock-signal',
}));

// Mock FormData
global.FormData = vi.fn(() => ({
  append: vi.fn(),
}));

// Mock File
global.File = vi.fn((content, name, options) => ({
  name,
  type: options?.type || 'image/jpeg',
  size: content[0]?.size || 1024,
}));

describe('Remote Image Processor', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return error for empty source URL', async () => {
    const result = await processRemoteImage({
      userId: 'user123',
      sourceUrl: '',
    });
    
    expect(result.success).toBe(false);
    expect(result.error).toContain('Source URL is required');
  });

  it('should block private IP addresses', async () => {
    const privateIps = [
      'http://127.0.0.1/image.jpg',
      'http://10.0.0.1/image.jpg',
      'http://172.16.0.1/image.jpg',
      'http://192.168.1.1/image.jpg',
      'http://localhost/image.jpg',
    ];
    
    for (const ip of privateIps) {
      const result = await processRemoteImage({
        userId: 'user123',
        sourceUrl: ip,
      });
      
      expect(result.success).toBe(false);
      expect(result.error).toContain('private IP address');
    }
  });

  it('should handle fetch errors', async () => {
    (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));
    
    const result = await processRemoteImage({
      userId: 'user123',
      sourceUrl: 'https://example.com/image.jpg',
    });
    
    expect(result.success).toBe(false);
    expect(result.error).toContain('Network error');
  });

  it('should handle non-200 responses', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 404,
    });
    
    const result = await processRemoteImage({
      userId: 'user123',
      sourceUrl: 'https://example.com/image.jpg',
    });
    
    expect(result.success).toBe(false);
    expect(result.error).toContain('Failed to fetch image: HTTP 404');
  });

  it('should validate content type', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      headers: {
        get: (name: string) => name === 'content-type' ? 'text/html' : null,
      },
    });
    
    const result = await processRemoteImage({
      userId: 'user123',
      sourceUrl: 'https://example.com/image.jpg',
    });
    
    expect(result.success).toBe(false);
    expect(result.error).toContain('Invalid content type');
  });

  it('should check file size from headers', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      headers: {
        get: (name: string) => {
          if (name === 'content-type') return 'image/jpeg';
          if (name === 'content-length') return '3000000'; // 3MB
          return null;
        },
      },
    });
    
    const result = await processRemoteImage({
      userId: 'user123',
      sourceUrl: 'https://example.com/image.jpg',
      maxSizeBytes: 2 * 1024 * 1024, // 2MB
    });
    
    expect(result.success).toBe(false);
    expect(result.error).toContain('Image too large');
  });

  it('should successfully process and upload an image', async () => {
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
    expect(result.publicId).toBe('avatars/user123/image123');
    
    // Verify fetch was called three times (image fetch, sign-upload, cloudinary upload)
    expect(global.fetch).toHaveBeenCalledTimes(3);
  });

  it('should handle Cloudinary upload errors', async () => {
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
    
    // Mock failed Cloudinary upload
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 400,
    });
    
    const result = await processRemoteImage({
      userId: 'user123',
      sourceUrl: 'https://example.com/image.jpg',
    });
    
    expect(result.success).toBe(false);
    expect(result.error).toContain('Upload failed: HTTP 400');
  });
});

