/**
 * Tests pour les utilitaires des concours
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  formatDate,
  getNextStepText,
  statusCorrespondingActionText,
  toOgImageUrl,
  buildContestMeta,
} from '@/features/contests/utils';
import { DAY_MS } from '@/shared/utils/dateUtils';
import type { Contest } from '@/features/contests/types';

describe('contests/utils', () => {
  let mockNow: Date;
  let realDate: typeof Date;

  beforeEach(() => {
    realDate = Date;
    mockNow = new realDate('2024-06-15T12:00:00.000Z');
    // @ts-expect-error - Mock global Date
    global.Date = class extends realDate {
      constructor(...args: Parameters<typeof Date>) {
        super();
        if (args.length === 0) {
          return mockNow;
        }
        return new realDate(...args);
      }

      static override now() {
        return mockNow.getTime();
      }
    };
  });

  afterEach(() => {
    global.Date = realDate;
  });

  describe('formatDate', () => {
    it('should format ISO date string in DD/MM/YYYY format', () => {
      const isoDate = '2024-06-15T12:00:00.000Z';
      const result = formatDate(isoDate);
      expect(result).toBe('15 juin 2024');
    });

    it('should format timestamp in DD/MM/YYYY format', () => {
      const timestamp = new realDate('2024-06-15T12:00:00.000Z').getTime();
      const result = formatDate(timestamp);
      expect(result).toBe('15 juin 2024');
    });

    it('should format different months correctly', () => {
      expect(formatDate('2024-01-01T00:00:00.000Z')).toBe('1 janvier 2024');
      expect(formatDate('2024-02-14T00:00:00.000Z')).toBe('14 février 2024');
      expect(formatDate('2024-03-20T00:00:00.000Z')).toBe('20 mars 2024');
      expect(formatDate('2024-12-25T00:00:00.000Z')).toBe('25 décembre 2024');
    });

    it('should format dates with different years', () => {
      expect(formatDate('2023-06-15T00:00:00.000Z')).toBe('15 juin 2023');
      expect(formatDate('2025-06-15T00:00:00.000Z')).toBe('15 juin 2025');
    });

    it('should handle current date', () => {
      const result = formatDate(mockNow.getTime());
      expect(result).toBe('15 juin 2024');
    });
  });

  describe('getNextStepText', () => {
    const baseContest: Omit<Contest, 'photos' |'createdAt'> = {
      id: 'test-contest',
      name: 'Test Contest',
      authorId: 'user-1',
      description: 'A test contest',
      coverImage: 'https://example.com/image.jpg',
      submissionDays: 7,
      voteDays: 3,
    };

    it('should return submission phase text with correct date', () => {
      // Concours créé il y a 2 jours (en phase de soumission)
      const contest: Omit<Contest, 'photos'> = {
        ...baseContest,
        createdAt: new realDate(mockNow.getTime() - 2 * DAY_MS).toISOString(),
      };

      const result = getNextStepText(contest, 'submission');
      expect(result).toContain('début des votes le');
      // Le vote commence dans 5 jours (7 - 2)
      // Note: Le format dépend de la locale, donc on vérifie juste que ça contient une date
      expect(result).toMatch(/début des votes le \d+ (janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre) \d{4}/);
    });

    it('should return vote phase text with correct date', () => {
      // Concours créé il y a 8 jours (en phase de vote)
      const contest: Omit<Contest, 'photos'> = {
        ...baseContest,
        createdAt: new realDate(mockNow.getTime() - 8 * DAY_MS).toISOString(),
      };

      const result = getNextStepText(contest, 'vote');
      expect(result).toContain('résultats le');
      // Les résultats arrivent dans 2 jours (10 - 8 = 2 jours de vote restants)
      expect(result).toContain('17 juin 2024');
    });

    it('should return closed phase text with correct date', () => {
      // Concours créé il y a 15 jours (en phase closed)
      const contest: Omit<Contest, 'photos'> = {
        ...baseContest,
        createdAt: new realDate(mockNow.getTime() - 15 * DAY_MS).toISOString(),
      };

      const result = getNextStepText(contest, 'closed');
      expect(result).toContain('Concours terminé le');
      // Note: Le format dépend de la locale et du fuseau horaire
      expect(result).toMatch(/Concours terminé le \d+ (janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre) \d{4}/);
    });

    it('should return empty string for unknown status', () => {
      // @ts-expect-error - Testing with invalid status
      const result = getNextStepText(baseContest, 'unknown');
      expect(result).toBe('');
    });

    it('should handle contest with 0 submission days', () => {
      const contest: Omit<Contest, 'photos'> = {
        ...baseContest,
        submissionDays: 0,
        createdAt: mockNow.toISOString(),
      };

      const result = getNextStepText(contest, 'vote');
      expect(result).toContain('résultats le');
    });
  });

  describe('statusCorrespondingActionText', () => {
    it('should have correct action text for submission status', () => {
      expect(statusCorrespondingActionText.submission).toBe('Soumettre une photo');
    });

    it('should have correct action text for vote status', () => {
      expect(statusCorrespondingActionText.vote).toBe('Voter');
    });

    it('should have correct action text for closed status', () => {
      expect(statusCorrespondingActionText.closed).toBe('Voir les photos');
    });
  });

  describe('toOgImageUrl', () => {
    it('should force a 1200x630 crop on an Unsplash URL', () => {
      const url =
        'https://images.unsplash.com/photo-123?q=80&w=1368&auto=format&fit=crop&ixlib=rb-4.1.0';
      const result = new URL(toOgImageUrl(url));
      expect(result.searchParams.get('w')).toBe('1200');
      expect(result.searchParams.get('h')).toBe('630');
      expect(result.searchParams.get('fit')).toBe('crop');
    });

    it('should leave non-Unsplash URLs untouched', () => {
      const url = 'https://example.com/cover.jpg?w=100';
      expect(toOgImageUrl(url)).toBe(url);
    });

    it('should return the input unchanged if it is not a valid URL', () => {
      expect(toOgImageUrl('not-a-url')).toBe('not-a-url');
    });
  });

  describe('buildContestMeta', () => {
    const contest: Pick<Contest, 'name' | 'description' | 'coverImage'> = {
      name: "Vacances d'été",
      description: "Les meilleurs souvenirs de l'été en famille.",
      coverImage: 'https://images.unsplash.com/photo-123?w=1368&fit=crop',
    };

    it('should return the generic fallback when no contest is given', () => {
      const meta = buildContestMeta(null);
      expect(meta.title).toBe('Détail du thème — Photo de Famille');
      expect(meta.description).toContain('Découvrez le thème du concours');
      expect(meta.image).toBeUndefined();
    });

    it('should build a title and description from the contest', () => {
      const meta = buildContestMeta(contest);
      expect(meta.title).toBe("Concours photo : Vacances d'été");
      expect(meta.description).toBe("Les meilleurs souvenirs de l'été en famille.");
    });

    it('should fall back to the generic description when the contest has none', () => {
      const meta = buildContestMeta({ ...contest, description: undefined });
      expect(meta.description).toContain('Découvrez le thème du concours');
    });

    it('should include a cropped og:image for an http(s) cover image', () => {
      const meta = buildContestMeta(contest);
      expect(meta.image).toContain('images.unsplash.com');
      expect(meta.image).toContain('h=630');
    });

    it('should omit og:image for a data: URI cover image', () => {
      const meta = buildContestMeta({ ...contest, coverImage: 'data:image/png;base64,abc' });
      expect(meta.image).toBeUndefined();
    });

    it('should omit og:image when there is no cover image', () => {
      const meta = buildContestMeta({ ...contest, coverImage: undefined });
      expect(meta.image).toBeUndefined();
    });
  });
});
