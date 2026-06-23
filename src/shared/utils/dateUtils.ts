/**
 * Utilitaires pour la manipulation des dates.
 */

export const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Retourne une date ISO correspondant à "daysAgo" jours avant la date de référence.
 * Si aucune référence n'est fournie, utilise la date actuelle (Date.now()).
 * 
 * @param daysAgo Nombre de jours dans le passé
 * @param referenceDate Date de référence (optionnel, défaut: now)
 */
export const isoDaysAgo = (daysAgo: number, referenceDate: Date = new Date(Date.now())): string => {
  return new Date(referenceDate.getTime() - daysAgo * DAY_MS).toISOString();
};

// Optionnel : Utile pour les dates de fin
export const isoDaysFromNow = (daysFromNow: number, referenceDate: Date = new Date(Date.now())): string => {
  return new Date(referenceDate.getTime() + daysFromNow * DAY_MS).toISOString();
};
