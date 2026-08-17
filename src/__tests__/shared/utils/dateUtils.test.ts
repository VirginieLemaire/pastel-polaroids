/**
 * Tests pour les utilitaires de date
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { DAY_MS, isoDaysAgo } from '@/shared/utils/dateUtils';

describe('dateUtils', () => {
  let mockDateNow: () => number;
  let realDateNow: () => number;

  beforeEach(() => {
    // Sauvegarder la vraie implémentation de Date.now
    realDateNow = Date.now;
    // Fixer une date de référence pour les tests
    const mockNow = new Date('2024-06-15T12:00:00.000Z');
    mockDateNow = () => mockNow.getTime();
    Date.now = mockDateNow;
  });

  afterEach(() => {
    // Restaurer la vraie implémentation
    Date.now = realDateNow;
  });

  describe('DAY_MS', () => {
    it('should be equal to 24 hours in milliseconds', () => {
      expect(DAY_MS).toBe(24 * 60 * 60 * 1000);
    });

    it('should be 86400000', () => {
      expect(DAY_MS).toBe(86400000);
    });
  });

  describe('isoDaysAgo', () => {
    it('should return current date in ISO format when daysAgo is 0', () => {
      const result = isoDaysAgo(0);
      expect(result).toBe('2024-06-15T12:00:00.000Z');
    });

    it('should return date 1 day ago in ISO format', () => {
      const result = isoDaysAgo(1);
      expect(result).toBe('2024-06-14T12:00:00.000Z');
    });

    it('should return date 5 days ago in ISO format', () => {
      const result = isoDaysAgo(5);
      expect(result).toBe('2024-06-10T12:00:00.000Z');
    });

    it('should return date 100 days ago in ISO format', () => {
      const result = isoDaysAgo(100);
      expect(result).toBe('2024-03-07T12:00:00.000Z');
    });

    it('should return date in the future when daysAgo is negative', () => {
      const result = isoDaysAgo(-5);
      expect(result).toBe('2024-06-20T12:00:00.000Z');
    });

    it('should return a valid ISO string', () => {
      const result = isoDaysAgo(3);
      // Vérifier que le résultat est une date ISO valide
      const parsedDate = new Date(result);
      expect(parsedDate.toISOString()).toBe(result);
      expect(Number.isNaN(parsedDate.getTime())).toBe(false);
    });

    it('should handle large numbers of days', () => {
      const result = isoDaysAgo(365);
      expect(result).toBe('2023-06-16T12:00:00.000Z');
    });

    it('should handle fractional days', () => {
      const result = isoDaysAgo(1.5);
      // 1.5 jours = 1 jour + 12 heures
      expect(result).toBe('2024-06-14T00:00:00.000Z');
    });

    it('should handle very small fractional days', () => {
      const result = isoDaysAgo(0.5);
      // 0.5 jours = 12 heures
      expect(result).toBe('2024-06-15T00:00:00.000Z');
    });
  });
});
