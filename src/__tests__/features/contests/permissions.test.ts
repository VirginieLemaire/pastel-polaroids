/**
 * Tests pour les permissions des concours
 * Focus sur les 3 états réels : Submission, Vote, Closed.
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { canEditContest, canDeleteContest } from '@/features/contests/permissions';
import type { Contest } from '@/features/contests/types';
import { isoDaysAgo } from '@/shared/utils/dateUtils';
import { getContestStatus } from '@/features/contests';

describe('contests/permissions', () => {
  // On définit une date de référence fixe pour tous les calculs
  const MOCK_NOW_DATE = new Date('2024-06-15T12:00:00.000Z');
  const MOCK_NOW_TS = MOCK_NOW_DATE.getTime();
  
  const AUTHOR_ID = 'user-1';
  const GUEST_ID = 'user-99';

  let realDateNow: () => number;

  beforeEach(() => {
    // On sauvegarde l'original
    realDateNow = Date.now;
    // On force Date.now() à renvoyer notre date de test
    // Cela impactera isoDaysAgo (si pas de paramètre) ET getContestStatus/permissions
    vi.spyOn(Date, 'now').mockReturnValue(MOCK_NOW_TS);
  });

  afterEach(() => {
    // On restaure l'original
    (Date.now as any).mockRestore();
  });

  const createContest = (
    authorId: string,
    daysAgo: number,
    submissionDays = 7,
    voteDays = 3
  ): Contest => ({
    id: 'test-contest',
    name: 'Test Contest',
    authorId,
    description: 'A test contest',
    coverImage: 'https://example.com/image.jpg',
    submissionDays,
    voteDays,
    // On peut maintenant utiliser isoDaysAgo sans passer MOCK_NOW explicitement,
    // car Date.now() est mocké globalement. Mais le passer explicitement reste plus sûr.
    createdAt: isoDaysAgo(daysAgo, MOCK_NOW_DATE),
    photos: [],
  });

  // Scénarios réalistes basés sur ton cycle de vie standard (7j sub + 3j vote)
  const scenarios = [
    // --- Phase Submission (J+2) : Auteur = OK, Tiers = KO ---
    { daysAgo: 2, user: AUTHOR_ID, expected: true, label: 'Auteur en submission' },
    { daysAgo: 2, user: GUEST_ID, expected: false, label: 'Tiers en submission' },
    
    // --- Phase Vote (J+8) : Auteur = OK, Tiers = KO ---
    { daysAgo: 8, user: AUTHOR_ID, expected: true, label: 'Auteur en vote' },
    { daysAgo: 8, user: GUEST_ID, expected: false, label: 'Tiers en vote' },

    // --- Phase Closed (J+11) : Tout le monde = KO ---
    { daysAgo: 11, user: AUTHOR_ID, expected: false, label: 'Auteur en closed' },
    { daysAgo: 11, user: GUEST_ID, expected: false, label: 'Tiers en closed' },
  ];

  describe('Règles de permission (Édition & Suppression)', () => {
    it('doit appliquer les règles métier cohérentes pour édition et suppression', () => {
      scenarios.forEach(({ daysAgo, user, expected, label }) => {
        const contest = createContest(AUTHOR_ID, daysAgo);

        const canEdit = canEditContest(contest, user);
        const canDelete = canDeleteContest(contest, user);
        
        // 1. Vérifie que la fonction retourne bien ce qu'on attend pour ce scénario
        expect(canEdit, `Erreur sur canEdit pour le scénario : ${label}`).toBe(expected);
        expect(canDelete, `Erreur sur canDelete pour le scénario : ${label}`).toBe(expected);
        
        // 2. Vérifie que les deux fonctions restent parfaitement synchronisées
        expect(canEdit).toBe(canDelete);
      });
    });
  });
});