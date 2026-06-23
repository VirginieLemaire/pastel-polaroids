/**
 * Tests pour le calcul du statut des concours
 * Utilisation des utilitaires partagés : plus de mock global de Date !
 */
import { describe, it, expect } from 'vitest';
import {
  STATUS_LABEL,
  STATUS_COLOR,
  getContestStatus,
} from '@/features/contests/contestStatus';
import type { Contest } from '@/features/contests/types';
// Import de tes utilitaires partagés
import { isoDaysAgo, DAY_MS } from '@/shared/utils/dateUtils';

describe('contestStatus', () => {
  // Date de référence fixe pour tous les tests
  const MOCK_NOW = new Date('2024-06-15T12:00:00.000Z');

  // Helper ultra-simple grâce à isoDaysAgo
  const createContest = (
    daysAgo: number,
    submissionDays = 7,
    voteDays = 3
  ): Contest => ({
    id: 'test-contest',
    name: 'Test Contest',
    authorId: 'user-1',
    description: 'A test contest',
    coverImage: 'https://example.com/image.jpg',
    photos: [],
    submissionDays,
    voteDays,
    // Plus de calcul manuel, on utilise l'utilitaire avec la date de référence
    createdAt: isoDaysAgo(daysAgo, MOCK_NOW),
  });

  describe('Constants (Sanity Check)', () => {
    it('doit avoir les labels et couleurs attendus', () => {
      expect(STATUS_LABEL).toEqual({ submission: 'Soumission', vote: 'Vote', closed: 'Clos' });
      expect(STATUS_COLOR).toEqual({ submission: 'mint', vote: 'sky', closed: 'lavender' });
    });
  });

  describe('getContestStatus - Cycle de vie', () => {
    const scenarios = [
      { daysAgo: 0, expected: 'submission', label: 'Démarrage' },
      { daysAgo: 2, expected: 'submission', label: 'En submission' },
      { daysAgo: 6.9, expected: 'submission', label: 'Fin de submission' },
      { daysAgo: 7, expected: 'vote', label: 'Frontière Sub/Vote' },
      { daysAgo: 8, expected: 'vote', label: 'En vote' },
      { daysAgo: 10, expected: 'vote', label: 'Fin de vote' },
      { daysAgo: 10.1, expected: 'closed', label: 'Juste après vote' },
      { daysAgo: 100, expected: 'closed', label: 'Clos depuis longtemps' },
    ];

    scenarios.forEach(({ daysAgo, expected, label }) => {
      it(`[${label}] J-${daysAgo} => ${expected}`, () => {
        const contest = createContest(daysAgo);
        // On passe MOCK_NOW comme deuxième argument si ta fonction le supporte,
        // sinon elle utilisera Date.now() qui est... attend, il faut encore mocker Date.now() 
        // OU modifier getContestStatus pour accepter une date de référence.
        
        // OPTION A : Si getContestStatus accepte une date optionnelle (recommandé)
        // expect(getContestStatus(contest, MOCK_NOW)).toBe(expected);

        // OPTION B : Si getContestStatus utilise Date.now() en dur, 
        // alors on est obligé de mocker Date globalement juste pour ce test.
        // MAIS, on peut le faire de manière plus légère ou accepter que l'utilitaire isoDaysAgo
        // a créé la string ISO correcte, et que le calcul dans getContestStatus se base sur Date.now().
        
        // Pour être 100% pur sans mock global, il faut que getContestStatus accepte un paramètre 'now'.
        // Je pars du principe que tu peux l'ajouter ou qu'il existe déjà (vu ton test précédent).
        expect(getContestStatus(contest, MOCK_NOW)).toBe(expected);
      });
    });
  });

  describe('Cas limites', () => {
    it('submissionDays = 0 => vote immédiat', () => {
      expect(getContestStatus(createContest(0, 0, 3), MOCK_NOW)).toBe('vote');
    });

    it('voteDays = 0 => closed immédiat après sub', () => {
      expect(getContestStatus(createContest(8, 7, 0), MOCK_NOW)).toBe('closed');
    });
    
    it('gère les durées longues', () => {
      expect(getContestStatus(createContest(2, 30, 15), MOCK_NOW)).toBe('submission');
    });
  });
});