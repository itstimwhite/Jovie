import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchInstagramProfileImage } from './instagram-image-fetcher';

// Mock fetch
global.fetch = vi.fn();
global.AbortController = vi.fn(() => ({
  abort: vi.fn(),
  signal: 'mock-signal',
}));

describe('Instagram Image Fetcher', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return error for empty handle', async () => {
    const result = await fetchInstagramProfileImage('');
    expect(result.success).toBe(false);
    expect(result.error).toContain('Invalid Instagram handle');
  });

  it('should successfully fetch image via oEmbed', async () => {
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
    
    // Verify fetch was called with correct URL
    expect(global.fetch).toHaveBeenCalledTimes(1);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('https://api.microlink.io/?url='),
      expect.objectContaining({
        signal: 'mock-signal',
      })
    );
  });

  it('should fall back to Open Graph when oEmbed fails', async () => {
    // Mock failed oEmbed response
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 404,
    });
    
    // Mock successful Open Graph response
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: {
          image: {
            url: 'https://example.com/og-image.jpg',
          },
        },
      }),
    });

    const result = await fetchInstagramProfileImage('username');
    
    expect(result.success).toBe(true);
    expect(result.imageUrl).toBe('https://example.com/og-image.jpg');
    expect(result.source).toBe('opengraph');
    
    // Verify fetch was called twice (oEmbed + Open Graph)
    expect(global.fetch).toHaveBeenCalledTimes(2);
  });

  it('should fall back to HTML parsing when oEmbed and Open Graph fail', async () => {
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
    
    // Mock successful HTML parsing response
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        data: {
          screenshot: {
            url: 'https://example.com/screenshot.jpg',
          },
        },
      }),
    });

    const result = await fetchInstagramProfileImage('username');
    
    expect(result.success).toBe(true);
    expect(result.imageUrl).toBe('https://example.com/screenshot.jpg');
    expect(result.source).toBe('html');
    
    // Verify fetch was called three times (oEmbed + Open Graph + HTML)
    expect(global.fetch).toHaveBeenCalledTimes(3);
  });

  it('should return error when all methods fail', async () => {
    // Mock failed responses for all methods
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 404,
    });
    
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 500,
    });
    
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 503,
    });

    const result = await fetchInstagramProfileImage('username');
    
    expect(result.success).toBe(false);
    expect(result.error).toContain('Could not fetch Instagram profile image');
    
    // Verify fetch was called three times (all methods attempted)
    expect(global.fetch).toHaveBeenCalledTimes(3);
  });

  it('should handle fetch timeout', async () => {
    // Mock AbortController to simulate timeout
    (global.AbortController as any).mockImplementation(() => ({
      abort: vi.fn(),
      signal: 'mock-signal',
    }));
    
    // Mock fetch to throw AbortError
    (global.fetch as any).mockRejectedValueOnce(new DOMException('The operation was aborted', 'AbortError'));

    const result = await fetchInstagramProfileImage('username');
    
    expect(result.success).toBe(false);
    expect(result.error).toContain('Error fetching Instagram profile image');
  });

  it('should normalize Instagram handle before fetching', async () => {
    // Mock successful response
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

    // Use handle with @ prefix
    const result = await fetchInstagramProfileImage('@username');
    
    expect(result.success).toBe(true);
    expect(result.imageUrl).toBe('https://example.com/profile.jpg');
    
    // Verify fetch was called with normalized handle
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('instagram.com/username/'),
      expect.any(Object)
    );
  });
});

