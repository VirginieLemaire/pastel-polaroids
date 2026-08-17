/**
 * Tests pour les schémas Zod des votes
 */
import { describe, it, expect } from 'vitest';
import { ratingSchema, castVoteSchema } from '@/features/votes/schemas';

describe('votes/schemas', () => {
  describe('ratingSchema', () => {
    it('should accept all valid ratings (1-5)', () => {
      const validRatings = [1, 2, 3, 4, 5];
      validRatings.forEach((rating) => {
        const result = ratingSchema.safeParse(rating);
        expect(result.success).toBe(true);
        expect(result.data).toBe(rating);
      });
    });

    it('should reject rating of 0', () => {
      const result = ratingSchema.safeParse(0);
      expect(result.success).toBe(false);
    });

    it('should reject rating of 6', () => {
      const result = ratingSchema.safeParse(6);
      expect(result.success).toBe(false);
    });

    it('should reject negative rating', () => {
      const result = ratingSchema.safeParse(-1);
      expect(result.success).toBe(false);
    });

    it('should reject non-integer rating', () => {
      const result = ratingSchema.safeParse(3.5);
      expect(result.success).toBe(false);
    });

    it('should reject string rating', () => {
      const result = ratingSchema.safeParse('3');
      expect(result.success).toBe(false);
    });

    it('should reject null rating', () => {
      const result = ratingSchema.safeParse(null);
      expect(result.success).toBe(false);
    });

    it('should reject undefined rating', () => {
      const result = ratingSchema.safeParse(undefined);
      expect(result.success).toBe(false);
    });
  });

  describe('castVoteSchema', () => {
    it('should validate correct vote data', () => {
      const validData = {
        photoId: 'photo-1',
        contestId: 'contest-1',
        rating: 3,
      };
      
      const result = castVoteSchema.safeParse(validData);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(validData);
    });

    it('should reject empty photoId', () => {
      const invalidData = {
        photoId: '',
        contestId: 'contest-1',
        rating: 3,
      };
      
      const result = castVoteSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0]!.path).toContain('photoId');
    });

    it('should reject missing photoId', () => {
      const invalidData = {
        contestId: 'contest-1',
        rating: 3,
      };
      
      const result = castVoteSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0]!.path).toContain('photoId');
    });

    it('should reject empty contestId', () => {
      const invalidData = {
        photoId: 'photo-1',
        contestId: '',
        rating: 3,
      };
      
      const result = castVoteSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0]!.path).toContain('contestId');
    });

    it('should reject missing contestId', () => {
      const invalidData = {
        photoId: 'photo-1',
        rating: 3,
      };
      
      const result = castVoteSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0]!.path).toContain('contestId');
    });

    it('should reject missing rating', () => {
      const invalidData = {
        photoId: 'photo-1',
        contestId: 'contest-1',
      };
      
      const result = castVoteSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0]!.path).toContain('rating');
    });

    it('should reject invalid rating values', () => {
      const invalidRatings = [0, 6, -1, 3.5, '3'];
      invalidRatings.forEach((rating) => {
        const invalidData = {
          photoId: 'photo-1',
          contestId: 'contest-1',
          rating,
        };
        const result = castVoteSchema.safeParse(invalidData);
        expect(result.success).toBe(false);
        expect(result.error?.issues[0]!.path).toContain('rating');
      });
    });

    it('should reject non-string photoId', () => {
      const invalidData = {
        photoId: 123,
        contestId: 'contest-1',
        rating: 3,
      };
      
      const result = castVoteSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0]!.path).toContain('photoId');
    });

    it('should reject non-string contestId', () => {
      const invalidData = {
        photoId: 'photo-1',
        contestId: 123,
        rating: 3,
      };
      
      const result = castVoteSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
      expect(result.error?.issues[0]!.path).toContain('contestId');
    });

    it('should accept all valid ratings (1-5)', () => {
      const validRatings = [1, 2, 3, 4, 5];
      
      validRatings.forEach((rating) => {
        const data = {
          photoId: 'photo-1',
          contestId: 'contest-1',
          rating,
        };
        const result = castVoteSchema.safeParse(data);
        expect(result.success).toBe(true);
        expect(result.data!.rating).toBe(rating);
      });
    });
  });
});
