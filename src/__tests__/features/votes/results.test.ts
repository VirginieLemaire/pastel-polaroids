/**
 * Tests pour les calculs de résultats de vote
 */
import { describe, it, expect } from 'vitest';
import {
  NEUTRAL_RATING,
  getExpectedVoterIds,
  getPhotoAverageRating,
  getRankedPhotos,
  getWinners,
  isPhotoWinner,
} from '@/features/votes/results';
import type { Rating, Vote } from '@/features/votes/types';
import type { Photo } from '@/features/photos';

// Fixtures réutilisables
const createPhoto = (id: string, authorId: string): Photo => ({
  id,
  title: `Photo ${id}`,
  description: '',
  imageUrl: '',
  authorId,
  contestId: 'contest-1',
  createdAt: '2024-01-01T00:00:00.000Z',
});

const createVote = (photoId: string, voterId: string, rating: Rating): Vote => ({
  id: `vote-${photoId}-${voterId}`,
  photoId,
  contestId: 'contest-1',
  voterId,
  rating,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
});

const photos = [
  createPhoto('photo-1', 'user-1'),
  createPhoto('photo-2', 'user-2'),
  createPhoto('photo-3', 'user-3'),
];

const expectedVoterIds = ['user-1', 'user-2', 'user-3'];

describe('votes/results', () => {
  describe('NEUTRAL_RATING', () => {
    it('should be 2.5 (middle of 1-5 scale)', () => {
      expect(NEUTRAL_RATING).toBe(2.5);
    });
  });

  describe('getExpectedVoterIds', () => {
    it('should return empty array when no photos', () => {
      const result = getExpectedVoterIds([]);
      expect(result).toEqual([]);
    });

    it('should return unique author IDs', () => {
      const result = getExpectedVoterIds(photos);
      expect(result).toEqual(['user-1', 'user-2', 'user-3']);
    });

    it('should remove duplicate author IDs', () => {
      const photosWithDuplicates = [
        createPhoto('photo-1', 'user-1'),
        createPhoto('photo-2', 'user-1'),
        createPhoto('photo-3', 'user-2'),
      ];
      const result = getExpectedVoterIds(photosWithDuplicates);
      expect(result).toEqual(['user-1', 'user-2']);
    });
  });

  describe('getPhotoAverageRating', () => {
    it('should return null when photo has no votes and no expected voters', () => {
      const result = getPhotoAverageRating('photo-1', [], []);
      expect(result).toBeNull();
    });

    it('should return neutral rating when photo has no votes but has expected voters', () => {
      const result = getPhotoAverageRating('photo-1', [], expectedVoterIds);
      expect(result).toBe(NEUTRAL_RATING);
    });

    it('should calculate average from actual votes when all voters voted', () => {
      const votes = [
        createVote('photo-1', 'user-1', 4),
        createVote('photo-1', 'user-2', 5),
        createVote('photo-1', 'user-3', 3),
      ];
      const result = getPhotoAverageRating('photo-1', votes, expectedVoterIds);
      // (4 + 5 + 3) / 3 = 4
      expect(result).toBe(4);
    });

    it('should add neutral ratings for missing voters', () => {
      const votes = [createVote('photo-1', 'user-1', 5)];
      const result = getPhotoAverageRating('photo-1', votes, expectedVoterIds);
      // (5 + 2.5 + 2.5) / 3 = 10 / 3 ≈ 3.333...
      expect(result).toBeCloseTo(10 / 3);
    });

    it('should ignore votes for other photos', () => {
      const votes = [
        createVote('photo-1', 'user-1', 5),
        createVote('photo-2', 'user-1', 1), // Other photo
        createVote('photo-1', 'user-2', 5),
      ];
      const result = getPhotoAverageRating('photo-1', votes, ['user-1', 'user-2']);
      // (5 + 5) / 2 = 5
      expect(result).toBe(5);
    });

    it('should return correct average with minimum rating (1)', () => {
      const votes = [
        createVote('photo-1', 'user-1', 1),
        createVote('photo-1', 'user-2', 1),
        createVote('photo-1', 'user-3', 1),
      ];
      const result = getPhotoAverageRating('photo-1', votes, expectedVoterIds);
      expect(result).toBe(1);
    });

    it('should return correct average with maximum rating (5)', () => {
      const votes = [
        createVote('photo-1', 'user-1', 5),
        createVote('photo-1', 'user-2', 5),
        createVote('photo-1', 'user-3', 5),
      ];
      const result = getPhotoAverageRating('photo-1', votes, expectedVoterIds);
      expect(result).toBe(5);
    });
  });

  describe('getRankedPhotos', () => {
    it('should return empty array when no photos', () => {
      const result = getRankedPhotos([], [], []);
      expect(result).toEqual([]);
    });

    it('should return photos sorted by average rating descending', () => {
      const votes = [
        createVote('photo-1', 'user-1', 5),
        createVote('photo-1', 'user-2', 5),
        createVote('photo-1', 'user-3', 5),
        createVote('photo-2', 'user-1', 3),
        createVote('photo-2', 'user-2', 3),
        createVote('photo-2', 'user-3', 3),
        createVote('photo-3', 'user-1', 4),
        createVote('photo-3', 'user-2', 4),
        createVote('photo-3', 'user-3', 4),
      ];

      const result = getRankedPhotos(photos, votes, expectedVoterIds);

      // photo-1: 5, photo-3: 4, photo-2: 3
      expect(result).toHaveLength(3);
      expect(result[0].photo.id).toBe('photo-1');
      expect(result[0].averageRating).toBe(5);
      expect(result[1].photo.id).toBe('photo-3');
      expect(result[1].averageRating).toBe(4);
      expect(result[2].photo.id).toBe('photo-2');
      expect(result[2].averageRating).toBe(3);
    });

    it('should maintain ex-aequo order when ratings are equal', () => {
      const votes = [
        createVote('photo-1', 'user-1', 4),
        createVote('photo-1', 'user-2', 4),
        createVote('photo-1', 'user-3', 4),
        createVote('photo-2', 'user-1', 4),
        createVote('photo-2', 'user-2', 4),
        createVote('photo-2', 'user-3', 4),
        createVote('photo-3', 'user-1', 4),
        createVote('photo-3', 'user-2', 4),
        createVote('photo-3', 'user-3', 4),
      ];

      const result = getRankedPhotos(photos, votes, expectedVoterIds);

      // All photos have rating 4, order should be preserved
      expect(result).toHaveLength(3);
      expect(result.every(r => r.averageRating === 4)).toBe(true);
      expect(result[0].photo.id).toBe('photo-1');
      expect(result[1].photo.id).toBe('photo-2');
      expect(result[2].photo.id).toBe('photo-3');
    });
  });

  describe('getWinners', () => {
    it('should return empty array when no photos', () => {
      const result = getWinners([], [], []);
      expect(result).toEqual([]);
    });

    it('should return single winner when one photo has highest rating', () => {
      const votes = [
        createVote('photo-1', 'user-1', 5),
        createVote('photo-1', 'user-2', 5),
        createVote('photo-1', 'user-3', 5),
        createVote('photo-2', 'user-1', 4),
        createVote('photo-2', 'user-2', 4),
        createVote('photo-2', 'user-3', 4),
        createVote('photo-3', 'user-1', 3),
        createVote('photo-3', 'user-2', 3),
        createVote('photo-3', 'user-3', 3),
      ];

      const result = getWinners(photos, votes, expectedVoterIds);

      expect(result).toHaveLength(1);
      expect(result[0].photo.id).toBe('photo-1');
      expect(result[0].averageRating).toBe(5);
    });

    it('should return all winners when there is a tie for first place', () => {
      const votes = [
        createVote('photo-1', 'user-1', 5),
        createVote('photo-1', 'user-2', 5),
        createVote('photo-1', 'user-3', 5),
        createVote('photo-2', 'user-1', 5),
        createVote('photo-2', 'user-2', 5),
        createVote('photo-2', 'user-3', 5),
        createVote('photo-3', 'user-1', 4),
        createVote('photo-3', 'user-2', 4),
        createVote('photo-3', 'user-3', 4),
      ];

      const result = getWinners(photos, votes, expectedVoterIds);

      expect(result).toHaveLength(2);
      expect(result.map(w => w.photo.id)).toContain('photo-1');
      expect(result.map(w => w.photo.id)).toContain('photo-2');
      expect(result.every(w => w.averageRating === 5)).toBe(true);
    });

    it('should return all photos when all have same rating', () => {
      const votes = [
        createVote('photo-1', 'user-1', 4),
        createVote('photo-2', 'user-1', 4),
        createVote('photo-3', 'user-1', 4),
        createVote('photo-1', 'user-2', 4),
        createVote('photo-2', 'user-2', 4),
        createVote('photo-3', 'user-2', 4),
        createVote('photo-1', 'user-3', 4),
        createVote('photo-2', 'user-3', 4),
        createVote('photo-3', 'user-3', 4),
      ];

      const result = getWinners(photos, votes, expectedVoterIds);

      expect(result).toHaveLength(3);
      expect(result.map(w => w.photo.id)).toEqual(['photo-1', 'photo-2', 'photo-3']);
    });
  });

  describe('isPhotoWinner', () => {
    it('should return true for winning photo', () => {
      const votes = [
        createVote('photo-1', 'user-1', 5),
        createVote('photo-1', 'user-2', 5),
        createVote('photo-1', 'user-3', 5),
        createVote('photo-2', 'user-1', 4),
        createVote('photo-2', 'user-2', 4),
        createVote('photo-2', 'user-3', 4),
        createVote('photo-3', 'user-1', 3),
        createVote('photo-3', 'user-2', 3),
        createVote('photo-3', 'user-3', 3),
      ];

      const result = isPhotoWinner('photo-1', photos, votes, expectedVoterIds);
      expect(result).toBe(true);
    });

    it('should return false for non-winning photo', () => {
      const votes = [
        createVote('photo-1', 'user-1', 5),
        createVote('photo-1', 'user-2', 5),
        createVote('photo-1', 'user-3', 5),
        createVote('photo-2', 'user-1', 4),
        createVote('photo-2', 'user-2', 4),
        createVote('photo-2', 'user-3', 4),
        createVote('photo-3', 'user-1', 3),
        createVote('photo-3', 'user-2', 3),
        createVote('photo-3', 'user-3', 3),
      ];

      const result = isPhotoWinner('photo-2', photos, votes, expectedVoterIds);
      expect(result).toBe(false);
    });

    it('should return false for non-existent photo', () => {
      const result = isPhotoWinner('non-existent', photos, [], expectedVoterIds);
      expect(result).toBe(false);
    });
  });
});
