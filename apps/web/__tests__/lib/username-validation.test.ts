import { describe, it, expect } from 'vitest';

// Username validation rules extracted from app/api/user/route.ts
function validateUsername(username: string): { valid: boolean; error?: string } {
  if (!username || typeof username !== 'string') {
    return { valid: false, error: 'Username is required' };
  }

  const trimmedUsername = username.trim();

  if (trimmedUsername.length < 3) {
    return { valid: false, error: 'Username must be at least 3 characters' };
  }

  if (trimmedUsername.length > 20) {
    return { valid: false, error: 'Username must be 20 characters or less' };
  }

  if (!/^[a-zA-Z0-9_]+$/.test(trimmedUsername)) {
    return { valid: false, error: 'Username can only contain letters, numbers, and underscores' };
  }

  return { valid: true };
}

describe('Username Validation', () => {
  describe('valid usernames', () => {
    it('accepts lowercase letters', () => {
      expect(validateUsername('johndoe')).toEqual({ valid: true });
    });

    it('accepts uppercase letters', () => {
      expect(validateUsername('JohnDoe')).toEqual({ valid: true });
    });

    it('accepts numbers', () => {
      expect(validateUsername('john123')).toEqual({ valid: true });
    });

    it('accepts underscores', () => {
      expect(validateUsername('john_doe')).toEqual({ valid: true });
    });

    it('accepts mixed characters', () => {
      expect(validateUsername('John_Doe_123')).toEqual({ valid: true });
    });

    it('accepts minimum length of 3', () => {
      expect(validateUsername('abc')).toEqual({ valid: true });
    });

    it('accepts maximum length of 20', () => {
      expect(validateUsername('a'.repeat(20))).toEqual({ valid: true });
    });

    it('trims whitespace', () => {
      expect(validateUsername('  johndoe  ')).toEqual({ valid: true });
    });
  });

  describe('invalid usernames', () => {
    it('rejects empty string', () => {
      const result = validateUsername('');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Username is required');
    });

    it('rejects whitespace-only string', () => {
      const result = validateUsername('   ');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Username must be at least 3 characters');
    });

    it('rejects too short username', () => {
      const result = validateUsername('ab');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Username must be at least 3 characters');
    });

    it('rejects too long username', () => {
      const result = validateUsername('a'.repeat(21));
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Username must be 20 characters or less');
    });

    it('rejects spaces in username', () => {
      const result = validateUsername('john doe');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Username can only contain letters, numbers, and underscores');
    });

    it('rejects special characters (hyphen)', () => {
      const result = validateUsername('john-doe');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Username can only contain letters, numbers, and underscores');
    });

    it('rejects special characters (at sign)', () => {
      const result = validateUsername('john@doe');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Username can only contain letters, numbers, and underscores');
    });

    it('rejects special characters (period)', () => {
      const result = validateUsername('john.doe');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Username can only contain letters, numbers, and underscores');
    });

    it('rejects emoji', () => {
      const result = validateUsername('john😀');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Username can only contain letters, numbers, and underscores');
    });

    it('rejects unicode letters', () => {
      const result = validateUsername('jöhndoe');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Username can only contain letters, numbers, and underscores');
    });
  });

  describe('edge cases', () => {
    it('handles null-like values', () => {
      const result = validateUsername(null as unknown as string);
      expect(result.valid).toBe(false);
    });

    it('handles undefined', () => {
      const result = validateUsername(undefined as unknown as string);
      expect(result.valid).toBe(false);
    });

    it('accepts username starting with number', () => {
      expect(validateUsername('123abc')).toEqual({ valid: true });
    });

    it('accepts all underscores', () => {
      expect(validateUsername('___')).toEqual({ valid: true });
    });

    it('accepts all numbers', () => {
      expect(validateUsername('12345')).toEqual({ valid: true });
    });
  });
});
