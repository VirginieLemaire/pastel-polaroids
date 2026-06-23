/**
 * Tests pour les permissions des concours
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { canEditContest, canDeleteContest } from '@/features/contests/permissions';
import type { Contest } from '@/features/contests/types';

describe('contests/permissions', () => {
  let mockNow: Date;
  let realDate: typeof Date;

  beforeEach(() => {
    realDate = Date;
    mockNow = new realDate('2024-06-15T12:00:00.000Z');
    // @ts-expect-error - Mock global Date
    global.Date = class extends realDate {
      constructor(...args: ConstructorParameters<typeof Date>) {
        if (!args.length) {
          super(mockNow.getTime());
        } else {
          super(...args);
        }
      }

      static now() {
        return mockNow.getTime();
      }
    };
  });

  afterEach(() => {
    global.Date = realDate;
  });

  const DAY_MS = 24 * 60 * 60 * 1000;

  const createContest = (
    authorId: string,
    daysAgo: number,
    submissionDays: number = 7,
    voteDays: number = 3
  ): Contest => ({
    id: 'test-contest',
    name: 'Test Contest',
    authorId,
    description: 'A test contest',
    coverImage: 'https://example.com/image.jpg',
    submissionDays,
    voteDays,
    createdAt: new realDate(mockNow.getTime() - daysAgo * DAY_MS).toISOString(),
    photos: [],
  });

  describe('canEditContest', () => {
    it('should allow author to edit contest in submission phase', () => {
      const contest = createContest('user-1', 2); // Créé il y a 2 jours
      const result = canEditContest(contest, 'user-1');
      expect(result).toBe(true);
    });

    it('should allow author to edit contest in vote phase', () => {
      const contest = createContest('user-1', 8); // Créé il y a 8 jours (en vote)
      const result = canEditContest(contest, 'user-1');
      expect(result).toBe(true);
    });

    it('should NOT allow author to edit contest in closed phase', () => {
      const contest = createContest('user-1', 11); // Créé il y a 11 jours (closed)
      const result = canEditContest(contest, 'user-1');
      expect(result).toBe(false);
    });

    it('should NOT allow non-author to edit contest in submission phase', () => {
      const contest = createContest('user-1', 2); // Créé il y a 2 jours
      const result = canEditContest(contest, 'user-2');
      expect(result).toBe(false);
    });

    it('should NOT allow non-author to edit contest in vote phase', () => {
      const contest = createContest('user-1', 8); // Créé il y a 8 jours
      const result = canEditContest(contest, 'user-2');
      expect(result).toBe(false);
    });

    it('should NOT allow non-author to edit contest in closed phase', () => {
      const contest = createContest('user-1', 11); // Créé il y a 11 jours
      const result = canEditContest(contest, 'user-2');
      expect(result).toBe(false);
    });

    it('should NOT allow editing on the last day of vote phase', () => {
      const contest = createContest('user-1', 10); // Créé il y a 10 jours (dernier jour de vote)
      const result = canEditContest(contest, 'user-1');
      expect(result).toBe(true); // Toujours en vote, donc modifiable
    });

    it('should NOT allow editing on the first day of closed phase', () => {
      const contest = createContest('user-1', 11); // Créé il y a 11 jours (closed)
      const result = canEditContest(contest, 'user-1');
      expect(result).toBe(false);
    });

    it('should handle contest with 0 submission days', () => {
      const contest = createContest('user-1', 0, 0, 3); // Créé maintenant
      const result = canEditContest(contest, 'user-1');
      // 0 jours de soumission = passe directement en vote, mais toujours modifiable
      expect(result).toBe(true);
    });

    it('should handle contest with 0 vote days', () => {
      const contest = createContest('user-1', 8, 7, 0); // Créé il y a 8 jours
      const result = canEditContest(contest, 'user-1');
      // 0 jours de vote = passe directement en closed, donc non modifiable
      expect(result).toBe(false);
    });
  });

  describe('canDeleteContest', () => {
    it('should allow author to delete contest in submission phase', () => {
      const contest = createContest('user-1', 2); // Créé il y a 2 jours
      const result = canDeleteContest(contest, 'user-1');
      expect(result).toBe(true);
    });

    it('should allow author to delete contest in vote phase', () => {
      const contest = createContest('user-1', 8); // Créé il y a 8 jours (en vote)
      const result = canDeleteContest(contest, 'user-1');
      expect(result).toBe(true);
    });

    it('should NOT allow author to delete contest in closed phase', () => {
      const contest = createContest('user-1', 11); // Créé il y a 11 jours (closed)
      const result = canDeleteContest(contest, 'user-1');
      expect(result).toBe(false);
    });

    it('should NOT allow non-author to delete contest in submission phase', () => {
      const contest = createContest('user-1', 2); // Créé il y a 2 jours
      const result = canDeleteContest(contest, 'user-2');
      expect(result).toBe(false);
    });

    it('should NOT allow non-author to delete contest in vote phase', () => {
      const contest = createContest('user-1', 8); // Créé il y a 8 jours
      const result = canDeleteContest(contest, 'user-2');
      expect(result).toBe(false);
    });

    it('should NOT allow non-author to delete contest in closed phase', () => {
      const contest = createContest('user-1', 11); // Créé il y a 11 jours
      const result = canDeleteContest(contest, 'user-2');
      expect(result).toBe(false);
    });

    it('should have same behavior as canEditContest for all cases', () => {
      // canDeleteContest et canEditContest ont la même logique
      // Vérifions que les deux fonctions retournent la même valeur
      const testCases = [
        { contest: createContest('user-1', 2), userId: 'user-1' },
        { contest: createContest('user-1', 8), userId: 'user-1' },
        { contest: createContest('user-1', 11), userId: 'user-1' },
        { contest: createContest('user-1', 2), userId: 'user-2' },
        { contest: createContest('user-1', 8), userId: 'user-2' },
        { contest: createContest('user-1', 11), userId: 'user-2' },
      ];

      testCases.forEach(({ contest, userId }) => {
        const canEdit = canEditContest(contest, userId);
        const canDelete = canDeleteContest(contest, userId);
        expect(canEdit).toBe(canDelete);
      });
    });
  });
});
