/**
 * Tests pour la visibilité des photos
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  anonymizePhoto,
  getVisiblePhotos,
  isAuthoredPhoto,
} from '@/features/photos/visibility';
import type { Contest } from '@/features/contests/types';
import { Photo } from '@/features/photos';

describe('photos/visibility', () => {
  let mockNow: Date;
  let realDate: typeof Date;
  const DAY_MS = 24 * 60 * 60 * 1000;

  // Setup du mock de date (gardé propre)
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
      static override now() { return mockNow.getTime(); }
    };
  });

  afterEach(() => {
    global.Date = realDate;
  });

  // Helpers de création (DRY)
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

  const createPhoto = (authorId: string, contestId = 'test-contest', id = 'photo-1'): Photo => ({
    id,
    title: 'Test Photo',
    description: 'A test photo',
    imageUrl: 'https://example.com/photo.jpg',
    authorId,
    contestId,
    createdAt: mockNow.toISOString(),
  });

  describe('anonymizePhoto', () => {
    it('doit retourner une photo sans authorId mais avec toutes les autres données intactes', () => {
      const original = createPhoto('user-123');
      
      const anonymized = anonymizePhoto(original);

      // 1. Vérification structurelle : on compare avec l'objet attendu (sans authorId)
      // C'est plus robuste que de tester chaque champ individuellement
      expect(anonymized).toEqual({
        id: original.id,
        title: original.title,
        description: original.description,
        imageUrl: original.imageUrl,
        contestId: original.contestId,
        createdAt: original.createdAt,
      });

      // 2. Vérification explicite de l'absence de la clé sensible (Runtime check)
      // On utilise toHaveProperty avec la négation pour éviter l'erreur TS
      expect(anonymized).not.toHaveProperty('authorId');
    });

    it('ne doit pas muter l\'objet original (Immutabilité)', () => {
      const original = createPhoto('user-123');
      const originalAuthorId = original.authorId;

      anonymizePhoto(original);

      expect(original.authorId).toBe(originalAuthorId);
      expect(original).toHaveProperty('authorId', 'user-123');
    });
  });

  describe('getVisiblePhotos', () => {
    it('phase de soumission : retourne uniquement les photos de l\'utilisateur (avec authorId)', () => {
      const contest = createContest(2); // Phase submission
      const photos = [
        createPhoto('user-1', 'test-contest', 'p1'),
        createPhoto('user-1', 'test-contest', 'p2'),
        createPhoto('user-2', 'test-contest', 'p3'),
      ];

      const visible = getVisiblePhotos(photos, contest, 'user-1');

      expect(visible).toHaveLength(2);
      expect(visible).toEqual(expect.arrayContaining([
        expect.objectContaining({ id: 'p1', authorId: 'user-1' }),
        expect.objectContaining({ id: 'p2', authorId: 'user-1' }),
      ]));
    });

    it('phase de vote : anonymise les photos des autres, garde les siennes', () => {
      const contest = createContest(8); // Phase vote (2j submission + 3j vote = début vote à J+7, donc J+8 c'est vote)
      const photos = [
        createPhoto('user-1', 'test-contest', 'mine'),
        createPhoto('user-2', 'test-contest', 'other1'),
        createPhoto('user-3', 'test-contest', 'other2'),
      ];

      const visible = getVisiblePhotos(photos, contest, 'user-1');

      expect(visible).toHaveLength(3);

      // La mienne
      const mine = visible.find(p => p.id === 'mine');
      expect(mine).toHaveProperty('authorId', 'user-1');

      // Les autres (anonymisées)
      const others = visible.filter(p => p.id !== 'mine');
      others.forEach(photo => {
        expect(photo).not.toHaveProperty('authorId');
        expect(photo).toHaveProperty('id'); // Juste pour vérifier qu'on a bien une photo
      });
    });

    it('phase terminée : toutes les photos sont visibles avec leur auteur', () => {
      const contest = createContest(15); // Phase closed
      const photos = [
        createPhoto('user-1', 'test-contest', 'p1'),
        createPhoto('user-2', 'test-contest', 'p2'),
      ];

      const visible = getVisiblePhotos(photos, contest, 'user-1');

      expect(visible).toHaveLength(2);
      // Toutes doivent avoir un authorId
      visible.forEach(p => expect(p).toHaveProperty('authorId'));
    });

    it('gère les tableaux vides', () => {
      expect(getVisiblePhotos([], createContest(2), 'user-1')).toEqual([]);
    });
  });

  describe('isAuthoredPhoto', () => {
    it('retourne true si authorId est présent', () => {
      expect(isAuthoredPhoto(createPhoto('user-1'))).toBe(true);
    });

    it('retourne false si authorId est absent', () => {
      const anonymous = {
        id: '1',
        title: 'Test',
        description: 'Desc',
        imageUrl: 'url',
        contestId: 'c1',
        createdAt: new Date().toISOString(),
        // Pas de authorId
      };
      expect(isAuthoredPhoto(anonymous)).toBe(false);
    });

    it('agit comme un Type Guard (vérification de compilation + runtime)', () => {
      const photo = createPhoto('user-1');
      
      if (isAuthoredPhoto(photo)) {
        // Si ce test compile, c'est que le Type Guard fonctionne
        expect(photo.authorId).toBe('user-1');
      } else {
        throw new Error('Type guard failed');
      }
    });
  });
});