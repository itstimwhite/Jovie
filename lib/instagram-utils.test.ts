import { describe, it, expect } from 'vitest';
import {
  validateInstagramHandle,
  normalizeInstagramHandle,
  getInstagramProfileUrl,
  getInstagramOEmbedUrl
} from './instagram-utils';

describe('Instagram Utilities', () => {
  describe('normalizeInstagramHandle', () => {
    it('should remove @ prefix', () => {
      expect(normalizeInstagramHandle('@username')).toBe('username');
    });

    it('should remove instagram.com prefix', () => {
      expect(normalizeInstagramHandle('instagram.com/username')).toBe('username');
    });

    it('should remove https://instagram.com prefix', () => {
      expect(normalizeInstagramHandle('https://instagram.com/username')).toBe('username');
    });

    it('should remove https://www.instagram.com prefix', () => {
      expect(normalizeInstagramHandle('https://www.instagram.com/username')).toBe('username');
    });

    it('should remove trailing slash', () => {
      expect(normalizeInstagramHandle('username/')).toBe('username');
    });

    it('should remove query parameters', () => {
      expect(normalizeInstagramHandle('username?hl=en')).toBe('username');
    });

    it('should handle complex cases', () => {
      expect(normalizeInstagramHandle('https://www.instagram.com/@username/?hl=en')).toBe('username');
    });

    it('should handle empty input', () => {
      expect(normalizeInstagramHandle('')).toBe('');
      expect(normalizeInstagramHandle(null as unknown as string)).toBe('');
      expect(normalizeInstagramHandle(undefined as unknown as string)).toBe('');
    });

    it('should trim whitespace', () => {
      expect(normalizeInstagramHandle(' username ')).toBe('username');
    });
  });

  describe('validateInstagramHandle', () => {
    it('should validate valid handles', () => {
      expect(validateInstagramHandle('username').isValid).toBe(true);
      expect(validateInstagramHandle('user.name').isValid).toBe(true);
      expect(validateInstagramHandle('user_name').isValid).toBe(true);
      expect(validateInstagramHandle('user123').isValid).toBe(true);
      expect(validateInstagramHandle('123user').isValid).toBe(true);
    });

    it('should validate handles with @ prefix', () => {
      expect(validateInstagramHandle('@username').isValid).toBe(true);
    });

    it('should validate handles with instagram.com prefix', () => {
      expect(validateInstagramHandle('instagram.com/username').isValid).toBe(true);
    });

    it('should reject empty handles', () => {
      const result = validateInstagramHandle('');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('cannot be empty');
    });

    it('should reject handles that are too long', () => {
      const longHandle = 'a'.repeat(31);
      const result = validateInstagramHandle(longHandle);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('cannot exceed 30 characters');
    });

    it('should reject handles with invalid characters', () => {
      const result = validateInstagramHandle('user-name');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('can only contain');
    });

    it('should reject handles with consecutive periods', () => {
      const result = validateInstagramHandle('user..name');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('consecutive periods');
    });

    it('should reject handles that start with period or underscore', () => {
      const result1 = validateInstagramHandle('.username');
      expect(result1.isValid).toBe(false);
      
      const result2 = validateInstagramHandle('_username');
      expect(result2.isValid).toBe(false);
    });

    it('should reject handles that end with period or underscore', () => {
      const result1 = validateInstagramHandle('username.');
      expect(result1.isValid).toBe(false);
      
      const result2 = validateInstagramHandle('username_');
      expect(result2.isValid).toBe(false);
    });

    it('should reject reserved handles', () => {
      const result = validateInstagramHandle('instagram');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('reserved');
    });
  });

  describe('getInstagramProfileUrl', () => {
    it('should return the correct profile URL', () => {
      expect(getInstagramProfileUrl('username')).toBe('https://www.instagram.com/username/');
    });

    it('should normalize the handle first', () => {
      expect(getInstagramProfileUrl('@username')).toBe('https://www.instagram.com/username/');
      expect(getInstagramProfileUrl('https://instagram.com/username')).toBe('https://www.instagram.com/username/');
    });

    it('should handle empty input', () => {
      expect(getInstagramProfileUrl('')).toBe('');
    });
  });

  describe('getInstagramOEmbedUrl', () => {
    it('should return the correct oEmbed URL', () => {
      const expectedUrl = `https://api.instagram.com/oembed/?url=${encodeURIComponent('https://www.instagram.com/username/')}`;
      expect(getInstagramOEmbedUrl('username')).toBe(expectedUrl);
    });

    it('should normalize the handle first', () => {
      const expectedUrl = `https://api.instagram.com/oembed/?url=${encodeURIComponent('https://www.instagram.com/username/')}`;
      expect(getInstagramOEmbedUrl('@username')).toBe(expectedUrl);
      expect(getInstagramOEmbedUrl('https://instagram.com/username')).toBe(expectedUrl);
    });

    it('should handle empty input', () => {
      expect(getInstagramOEmbedUrl('')).toBe('');
    });
  });
});

