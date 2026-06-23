/**
 * Utilitaires pour la manipulation des dates.
 */

export const DAY_MS = 24 * 60 * 60 * 1000;

export const isoDaysAgo = (daysAgo: number) =>
  new Date(Date.now() - daysAgo * DAY_MS).toISOString();
