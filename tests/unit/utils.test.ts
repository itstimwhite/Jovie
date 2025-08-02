import { describe, it, expect } from 'vitest';
import {
  cn,
  slugify,
  generateHandle,
  extractSpotifyId,
  detectPlatformFromUA,
} from '@/lib/utils';

describe('utils', () => {
  describe('cn', () => {
    it('should merge class names correctly', () => {
      expect(cn('bg-red-500', 'text-white')).toBe('bg-red-500 text-white');
      expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500');
    });
  });

  describe('slugify', () => {
    it('should convert text to slug', () => {
      expect(slugify('Hello World')).toBe('hello-world');
      expect(slugify('Artist Name!!!')).toBe('artist-name');
      expect(slugify('  spaces  ')).toBe('spaces');
    });
  });

  describe('generateHandle', () => {
    it('should generate handle from name', () => {
      expect(generateHandle('The Beatles')).toBe('the-beatles');
      expect(generateHandle('')).toBe('artist');
    });
  });

  describe('extractSpotifyId', () => {
    it('should extract ID from Spotify URLs', () => {
      expect(
        extractSpotifyId(
          'https://open.spotify.com/artist/4Z8W4fKeB5YxbusRsdQVPb'
        )
      ).toBe('4Z8W4fKeB5YxbusRsdQVPb');
      expect(extractSpotifyId('spotify:artist:4Z8W4fKeB5YxbusRsdQVPb')).toBe(
        '4Z8W4fKeB5YxbusRsdQVPb'
      );
      expect(extractSpotifyId('4Z8W4fKeB5YxbusRsdQVPb')).toBe(
        '4Z8W4fKeB5YxbusRsdQVPb'
      );
      expect(extractSpotifyId('invalid-url')).toBeNull();
    });
  });

  describe('detectPlatformFromUA', () => {
    it('should detect platform from user agent', () => {
      expect(
        detectPlatformFromUA(
          'Mozilla/5.0 (iPhone; CPU iPhone OS 14_7_1 like Mac OS X)'
        )
      ).toBe('ios');
      expect(detectPlatformFromUA('Mozilla/5.0 (Linux; Android 10)')).toBe(
        'android'
      );
      expect(
        detectPlatformFromUA('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)')
      ).toBe('macos');
      expect(detectPlatformFromUA('Mozilla/5.0 (Windows NT 10.0)')).toBe(
        'windows'
      );
      expect(detectPlatformFromUA('Mozilla/5.0 (X11; Linux x86_64)')).toBe(
        'web'
      );
      expect(detectPlatformFromUA(undefined)).toBeNull();
    });
  });
});
