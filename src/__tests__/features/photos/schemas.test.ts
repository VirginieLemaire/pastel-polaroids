/**
 * Tests de contrat pour le schéma de création de photo.
 * On vérifie les règles métier critiques, pas le fonctionnement interne de Zod.
 */
import { describe, it, expect } from 'vitest';
import { createPhotoSchema } from '@/features/photos/schemas';

describe('Photo Schema - Business Rules', () => {
  const baseValidData = {
    contestId: 'contest-1',
    title: 'Mon Titre',
    imageUrl: 'https://example.com/photo.jpg',
  };

  it('valide une soumission correcte avec description optionnelle', () => {
    const data = { ...baseValidData, description: 'Superbe photo !' };
    const result = createPhotoSchema.safeParse(data);
    
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.title).toBe('Mon Titre'); 
    }
  });

  it('rejette un titre dépassant la limite métier de 80 caractères', () => {
    const data = { ...baseValidData, title: 'a'.repeat(81) };
    const result = createPhotoSchema.safeParse(data);

    expect(result.success).toBe(false);
    expect(result.error?.issues.some(i => i.path.includes('title'))).toBe(true);
  });

  it('rejette une URL d\'image non sécurisée ou invalide (ftp, etc)', () => {
    const data = { ...baseValidData, imageUrl: 'ftp://malware.com/virus.jpg' };
    const result = createPhotoSchema.safeParse(data);

    expect(result.success).toBe(false);
    expect(result.error?.issues.some(i => i.path.includes('imageUrl'))).toBe(true);
  });

  it('nettoie automatiquement les espaces superflus (Feature UX)', () => {
    const data = { ...baseValidData, title: '  Titre sale  ' };
    const result = createPhotoSchema.safeParse(data);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.title).toBe('Titre sale'); // Vérification de la transformation
    }
  });

  it(`rejette la soumission si aucune image n'est fournie (Règle métier critique)`, () => {
    // Cas 1 : Champ manquant
    const dataMissingImage = {
      contestId: 'contest-1',
      title: 'Titre sans photo',
      // imageUrl est absent
    };
    
    const resultMissing = createPhotoSchema.safeParse(dataMissingImage);
    expect(resultMissing.success).toBe(false);
    expect(resultMissing.error?.issues.some(i => i.path.includes('imageUrl'))).toBe(true);

    // Cas 2 : Champ vide (chaîne vide)
    const dataEmptyImage = {
      contestId: 'contest-1',
      title: 'Titre avec image vide',
      imageUrl: '', 
    };

    const resultEmpty = createPhotoSchema.safeParse(dataEmptyImage);
    expect(resultEmpty.success).toBe(false);
    expect(resultEmpty.error?.issues.some(i => i.path.includes('imageUrl'))).toBe(true);
    // Optionnel : vérifier le message d'erreur spécifique
    expect(resultEmpty.error?.issues.find(i => i.path.includes('imageUrl'))?.message).toContain('requise');
  });
});