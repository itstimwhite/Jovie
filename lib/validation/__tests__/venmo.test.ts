import { describe, it, expect } from 'vitest';
import { validateVenmoHandle } from '../venmo';

describe('validateVenmoHandle', () => {
  it('should return isValid true for valid handles', () => {
    const validHandles = [
      'username',
      '@username',
      'user123',
      'user-name',
      'user_name',
      'a', // Minimum length
      'a'.repeat(32), // Maximum length
    ];

    validHandles.forEach(handle => {
      const result = validateVenmoHandle(handle);
      expect(result.isValid).toBe(true);
      expect(result.error).toBeUndefined();
    });
  });

  it('should normalize handles by removing @ prefix', () => {
    const result1 = validateVenmoHandle('username');
    expect(result1.normalizedHandle).toBe('username');

    const result2 = validateVenmoHandle('@username');
    expect(result2.normalizedHandle).toBe('username');
  });

  it('should return isValid true for empty handles', () => {
    const emptyHandles = [
      '',
      null,
      undefined,
      '   ', // Just whitespace
    ];

    emptyHandles.forEach(handle => {
      const result = validateVenmoHandle(handle as any);
      expect(result.isValid).toBe(true);
      expect(result.normalizedHandle).toBe('');
    });
  });

  it('should return isValid false for handles that are too long', () => {
    const handle = 'a'.repeat(33); // 33 characters
    const result = validateVenmoHandle(handle);
    
    expect(result.isValid).toBe(false);
    expect(result.error).toContain('32 characters or less');
  });

  it('should return isValid false for handles with invalid characters', () => {
    const invalidHandles = [
      'user name', // Space
      'user.name', // Period
      'user$name', // Dollar sign
      'user#name', // Hash
      'user&name', // Ampersand
      'user@name', // @ in the middle
    ];

    invalidHandles.forEach(handle => {
      const result = validateVenmoHandle(handle);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('can only contain');
    });
  });
});

