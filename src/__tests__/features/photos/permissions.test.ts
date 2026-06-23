/**
 * Tests pour les permissions des photos
 * Approche : Tester les règles métier, pas toutes les combinaisons possibles.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  MAX_PHOTOS_PER_USER,
  canUserSubmit,
  canEditPhoto,
  canDeletePhoto,
} from '@/features/photos/permissions';
import type { Contest } from '@/features/contests/types';
import { DAY_MS } from '@/shared/utils/dateUtils';

describe('photos/permissions', () => {
  let mockNow: Date;
  let realDate: typeof Date;

  beforeEach(() => {
    realDate = global.Date;
    mockNow = new realDate('2024-06-15T12:00:00.000Z');
    // @ts-expect-error - Mock global Date
    global.Date = class extends realDate {
      constructor(...args: Parameters<typeof Date>) {
        super();
        if (args.length === 0) return mockNow;
        return new realDate(...args);
      }
      static now() { return mockNow.getTime(); }
    };
  });

  afterEach(() => {
    global.Date = realDate;
  });

  // Helpers
  const createContest = (daysAgo: number, submissionDays = 7, voteDays = 3): Omit<Contest, 'photos'> => ({
    id: 'test-contest',
    name: 'Test Contest',
    authorId: 'user-1',
    description: 'A test contest',
    coverImage: 'https://example.com/image.jpg',
    submissionDays,
    voteDays,
    createdAt: new realDate(mockNow.getTime() - daysAgo * DAY_MS).toISOString(),
  });

  const createPhoto = (authorId: string, contestId = 'test-contest'): Photo => ({
    id: 'test-photo',
    title: 'Test Photo',
    description: 'A test photo',
    imageUrl: 'https://example.com/photo.jpg',
    authorId,
    contestId,
    createdAt: mockNow.toISOString(),
  });

  describe('MAX_PHOTOS_PER_USER', () => {
    it('doit être égal à 3', () => {
      expect(MAX_PHOTOS_PER_USER).toBe(3);
    });
  });

  describe('canUserSubmit', () => {
    it('autorise la soumission si count < MAX et phase = submission', () => {
      const contest = createContest(2); // Submission
      expect(canUserSubmit(contest, 0)).toBe(true);
      expect(canUserSubmit(contest, 2)).toBe(true); // Limite basse
    });

    it('refuse la soumission si count >= MAX (même en phase submission)', () => {
      const contest = createContest(2);
      expect(canUserSubmit(contest, 3)).toBe(false); // Limite exacte
      expect(canUserSubmit(contest, 5)).toBe(false); // Au-delà
    });

    it('refuse la soumission hors phase de submission (vote ou closed)', () => {
      const voteContest = createContest(8);
      const closedContest = createContest(11);
      
      expect(canUserSubmit(voteContest, 0)).toBe(false);
      expect(canUserSubmit(closedContest, 0)).toBe(false);
    });

    it('gère la frontière exacte : fin de soumission = début de vote (refus)', () => {
      const contest = createContest(7); // Exactement à la frontière
      expect(canUserSubmit(contest, 0)).toBe(false);
    });
  });

  describe('canEditPhoto & canDeletePhoto', () => {
    // On teste les deux ensemble car la logique métier est identique (Auteur + Phase Submission)
    const testCases = [
      { phase: 'submission', days: 2, expected: true },
      { phase: 'vote', days: 8, expected: false },
      { phase: 'closed', days: 11, expected: false },
    ];

    testCases.forEach(({ phase, days, expected }) => {
      it(`[${phase}] l'auteur peut éditer/supprimer : ${expected}`, () => {
        const contest = createContest(days);
        const photo = createPhoto('user-1'); // Auteur = user-1

        expect(canEditPhoto(photo, contest, 'user-1')).toBe(expected);
        expect(canDeletePhoto(photo, contest, 'user-1')).toBe(expected);
      });

      it(`[${phase}] un tiers NE PEUT PAS éditer/supprimer (toujours false)`, () => {
        const contest = createContest(days);
        const photo = createPhoto('user-1'); // Auteur = user-1

        expect(canEditPhoto(photo, contest, 'user-99')).toBe(false);
        expect(canDeletePhoto(photo, contest, 'user-99')).toBe(false);
      });
    });
  });
});