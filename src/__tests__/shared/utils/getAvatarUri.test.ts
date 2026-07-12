/**
 * Tests pour la génération des avatars DiceBear
 */
import { describe, it, expect } from 'vitest';
import { getAvatarDataUri } from '@/shared/utils/getAvatarUri';

describe('getAvatarUri', () => {
  describe('getAvatarDataUri', () => {
    it('should return a valid data URI', () => {
      const result = getAvatarDataUri('test-seed');
      expect(result).toMatch(/^data:image\/svg\+xml;utf8,/);
    });

    it('should return different URIs for different seeds', () => {
      const result1 = getAvatarDataUri('seed-1');
      const result2 = getAvatarDataUri('seed-2');
      expect(result1).not.toBe(result2);
    });

    it('should return same URI for same seed', () => {
      const result1 = getAvatarDataUri('same-seed');
      const result2 = getAvatarDataUri('same-seed');
      expect(result1).toBe(result2);
    });
  });
});
