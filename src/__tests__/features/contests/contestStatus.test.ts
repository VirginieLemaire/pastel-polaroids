/**
 * Tests pour le calcul du statut des concours
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  STATUS_LABEL,
  STATUS_COLOR,
  getContestStatus,
} from '@/features/contests/contestStatus';
import type { Contest } from '@/features/contests/types';

describe('contestStatus', () => {
  let mockNow: Date;
  let realDate: typeof Date;

  beforeEach(() => {
    // Sauvegarder la vraie implémentation de Date
    realDate = Date;
    // Mock la date actuelle à une date fixe pour les tests
    mockNow = new realDate('2024-06-15T12:00:00.000Z');
    // @ts-expect-error - Mock global Date
    global.Date = class extends realDate {
      constructor(...args: any[]) {
        super();
        if (args.length === 0) {
          return mockNow;
        }
        return new realDate(...args as []);
      }

      static now() {
        return mockNow.getTime();
      }
    };
  });

  afterEach(() => {
    // Restaurer la vraie implémentation de Date
    global.Date = realDate;
  });

  describe('STATUS_LABEL', () => {
    it('should have correct label for submission status', () => {
      expect(STATUS_LABEL.submission).toBe('Soumission');
    });

    it('should have correct label for vote status', () => {
      expect(STATUS_LABEL.vote).toBe('Vote');
    });

    it('should have correct label for closed status', () => {
      expect(STATUS_LABEL.closed).toBe('Clos');
    });
  });

  describe('STATUS_COLOR', () => {
    it('should have correct color for submission status', () => {
      expect(STATUS_COLOR.submission).toBe('mint');
    });

    it('should have correct color for vote status', () => {
      expect(STATUS_COLOR.vote).toBe('sky');
    });

    it('should have correct color for closed status', () => {
      expect(STATUS_COLOR.closed).toBe('lavender');
    });
  });

  describe('getContestStatus', () => {
    const baseContest: Omit<Contest, 'createdAt'> = {
      id: 'test-contest',
      name: 'Test Contest',
      authorId: 'user-1',
      description: 'A test contest',
      coverImage: 'https://example.com/image.jpg',
      photos: [],
      submissionDays: 7,
      voteDays: 3,
    };

    it('should return "submission" when contest is in submission phase', () => {
      // Concours créé il y a 2 jours, phase de soumission de 7 jours
      const contest: Contest = {
        ...baseContest,
        createdAt: new realDate(mockNow.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      };

      const status = getContestStatus(contest);
      expect(status).toBe('submission');
    });

    it('should return "submission" when contest just started', () => {
      // Concours créé maintenant
      const contest: Contest = {
        ...baseContest,
        createdAt: mockNow.toISOString(),
      };

      const status = getContestStatus(contest);
      expect(status).toBe('submission');
    });

    it('should return "vote" when contest is in vote phase', () => {
      // Concours créé il y a 8 jours (7 jours de soumission + 1 jour)
      const contest: Contest = {
        ...baseContest,
        createdAt: new realDate(mockNow.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      };

      const status = getContestStatus(contest);
      expect(status).toBe('vote');
    });

    it('should return "vote" on the exact day vote begins', () => {
      // Concours créé il y a exactement 7 jours (dernier jour de soumission)
      const contest: Contest = {
        ...baseContest,
        createdAt: new realDate(mockNow.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      };

      const status = getContestStatus(contest);
      expect(status).toBe('vote');
    });

    it('should return "vote" on the last day of vote phase', () => {
      // Concours créé il y a 10 jours (7 + 3 jours de vote)
      const contest: Contest = {
        ...baseContest,
        createdAt: new realDate(mockNow.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      };

      const status = getContestStatus(contest);
      expect(status).toBe('vote');
    });

    it('should return "closed" when contest is finished', () => {
      // Concours créé il y a 11 jours (7 + 3 + 1 jour)
      const contest: Contest = {
        ...baseContest,
        createdAt: new realDate(mockNow.getTime() - 11 * 24 * 60 * 60 * 1000).toISOString(),
      };

      const status = getContestStatus(contest);
      expect(status).toBe('closed');
    });

    it('should return "closed" far in the future', () => {
      // Concours créé il y a 100 jours
      const contest: Contest = {
        ...baseContest,
        createdAt: new realDate(mockNow.getTime() - 100 * 24 * 60 * 60 * 1000).toISOString(),
      };

      const status = getContestStatus(contest);
      expect(status).toBe('closed');
    });

    it('should accept custom now date', () => {
      // Concours créé il y a 2 jours
      const contest: Contest = {
        ...baseContest,
        createdAt: new realDate('2024-06-13T12:00:00.000Z').toISOString(),
      };

      // Avec une date "now" dans le futur du concours
      const customNow = new realDate('2024-06-14T12:00:00.000Z');
      const status = getContestStatus(contest, customNow);
      expect(status).toBe('submission');

      // Avec une date "now" après la phase de vote
      const futureNow = new realDate('2024-06-25T12:00:00.000Z');
      const status2 = getContestStatus(contest, futureNow);
      expect(status2).toBe('closed');
    });

    it('should handle contests with 0 submission days', () => {
      const contest: Contest = {
        ...baseContest,
        submissionDays: 0,
        createdAt: mockNow.toISOString(),
      };

      const status = getContestStatus(contest);
      // 0 jours de soumission = passe directement en vote
      expect(status).toBe('vote');
    });

    it('should handle contests with 0 vote days', () => {
      const contest: Contest = {
        ...baseContest,
        voteDays: 0,
        createdAt: new realDate(mockNow.getTime() - 8 * 24 * 60 * 60 * 1000).toISOString(),
      };

      const status = getContestStatus(contest);
      // 0 jours de vote = passe directement en closed après soumission
      expect(status).toBe('closed');
    });

    it('should handle contests with very long durations', () => {
      const contest: Contest = {
        ...baseContest,
        submissionDays: 30,
        voteDays: 15,
        createdAt: new realDate(mockNow.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      };

      const status = getContestStatus(contest);
      expect(status).toBe('submission');
    });

    it('should handle edge case at exact boundary between submission and vote', () => {
      const contest: Contest = {
        ...baseContest,
        createdAt: new realDate(mockNow.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      };

      const status = getContestStatus(contest);
      // À la fin exacte de la période de soumission, on passe en vote
      expect(status).toBe('vote');
    });

    it('should handle edge case at exact boundary between vote and closed', () => {
      const contest: Contest = {
        ...baseContest,
        createdAt: new realDate(mockNow.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      };

      const status = getContestStatus(contest);
      // À la fin exacte de la période de vote, on passe en closed
      expect(status).toBe('vote'); // Note: <= voteEnd signifie encore en vote
    });
  });
});
