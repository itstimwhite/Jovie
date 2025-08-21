/**
 * Tests for client-side username validation
 */

import { validateUsernameClient, shouldValidateWithAPI } from '../client-username';

describe('client-username validation', () => {
  describe('validateUsernameClient', () => {
    it('should validate format for valid usernames', () => {
      const result = validateUsernameClient('testuser');
      expect(result.isFormatValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should reject usernames with invalid characters', () => {
      const result = validateUsernameClient('test@user');
      expect(result.isFormatValid).toBe(false);
      expect(result.error).toContain('can only contain');
    });

    it('should reject usernames that are too short', () => {
      const result = validateUsernameClient('ab');
      expect(result.isFormatValid).toBe(false);
      expect(result.error).toContain('at least 3 characters');
    });

    it('should reject usernames that start with numbers', () => {
      const result = validateUsernameClient('123test');
      expect(result.isFormatValid).toBe(false);
      expect(result.error).toContain('must start with a letter');
    });

    it('should accept valid usernames with hyphens', () => {
      const result = validateUsernameClient('test-user');
      expect(result.isFormatValid).toBe(true);
      expect(result.error).toBeUndefined();
    });

    it('should provide suggestions for invalid usernames', () => {
      const result = validateUsernameClient('test@user!');
      expect(result.suggestions).toBeDefined();
      expect(result.suggestions!.length).toBeGreaterThan(0);
    });
  });

  describe('shouldValidateWithAPI', () => {
    it('should return true for valid format usernames', () => {
      expect(shouldValidateWithAPI('testuser')).toBe(true);
    });

    it('should return false for invalid format usernames', () => {
      expect(shouldValidateWithAPI('te')).toBe(false);
      expect(shouldValidateWithAPI('test@user')).toBe(false);
    });
  });
});