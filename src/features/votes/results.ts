import type { Vote } from "./types";
import type { Photo } from "@/features/photos/types";

/**
 * Note neutre attribuée pour les votes manquants (quand un votant n'a pas noté une photo).
 * Valeur : 2.5 (moyenne de l'échelle 1-5)
 */
export const NEUTRAL_RATING = 2.5;

/**
 * Récupère les IDs des votants attendus pour un concours.
 * Règle : les votants = tous les auteurs qui ont soumit au moins une photo au concours.
 */
export const getExpectedVoterIds = (photos: Photo[]): string[] => {
  const voterIds = new Set<string>();
  for (const photo of photos) {
    voterIds.add(photo.authorId);
  }
  return Array.from(voterIds);
};

/**
 * Calcule la note moyenne d'une photo en tenant compte des votes manquants.
 * - Les votes réels sont utilisés tels quels
 * - Pour chaque votant manquant, on ajoute un vote neutre (NEUTRAL_RATING)
 * - Retourne null si aucune photo n'existe
 * 
 * @param photoId - ID de la photo à noter
 * @param votes - Liste de tous les votes existants
 * @param expectedVoterIds - Liste des IDs des users qui DOIVENT voter
 * @returns Note moyenne (entre 1 et 5) ou null
 */
export const getPhotoAverageRating = (
  photoId: string,
  votes: Vote[],
  expectedVoterIds: string[]
): number | null => {
  const actualVotes = votes.filter((v) => v.photoId === photoId);
  const actualVoterIds = new Set(actualVotes.map((v) => v.voterId));

  // Votes réels
  const realRatings = actualVotes.map((v) => v.rating);

  // Votes neutres à ajouter pour les votants manquants
  const missingVoterIds = expectedVoterIds.filter((id) => !actualVoterIds.has(id));
  const neutralRatings = Array(missingVoterIds.length).fill(NEUTRAL_RATING);

  // Tous les ratings (réels + neutres)
  const allRatings = [...realRatings, ...neutralRatings];

  if (allRatings.length === 0) return null;

  const sum = allRatings.reduce((acc, r) => acc + r, 0);
  return sum / allRatings.length;
};

/**
 * Retourne les photos classées par note moyenne (ordre décroissant).
 * Gère les ex-aequo : si deux photos ont la même note, elles apparaissent
 * dans le même ordre (pas de priorisation artificielle).
 * 
 * @param photos - Liste des photos à classer
 * @param votes - Liste de tous les votes
 * @param expectedVoterIds - Liste des IDs des votants attendus
 * @returns Tableau de { photo, averageRating } trié par note décroissante
 */
export const getRankedPhotos = (
  photos: Photo[],
  votes: Vote[],
  expectedVoterIds: string[]
): { photo: Photo; averageRating: number }[] => {
  return photos
    .map((photo) => ({
      photo,
      averageRating: getPhotoAverageRating(photo.id, votes, expectedVoterIds) ?? 0,
    }))
    .sort((a, b) => b.averageRating - a.averageRating);
};

/**
 * Retourne le ou les gagnants (photos avec la meilleure note).
 * En cas d'ex-aequo, retourne TOUTES les photos avec la meilleure note.
 * 
 * @param photos - Liste des photos du concours
 * @param votes - Liste de tous les votes
 * @param expectedVoterIds - Liste des IDs des votants attendus
 * @returns Tableau des gagnants (peut être vide, ou contenir plusieurs photos)
 */
export const getWinners = (
  photos: Photo[],
  votes: Vote[],
  expectedVoterIds: string[]
): { photo: Photo; averageRating: number }[] => {
  const ranked = getRankedPhotos(photos, votes, expectedVoterIds);
  if (ranked.length === 0) return [];

  const bestRating = ranked[0].averageRating;
  return ranked.filter((r) => r.averageRating === bestRating);
};

/**
 * Vérifie si une photo est gagnante.
 * 
 * @param photoId - ID de la photo à vérifier
 * @param photos - Liste de toutes les photos du concours
 * @param votes - Liste de tous les votes
 * @param expectedVoterIds - Liste des IDs des votants attendus
 * @returns true si la photo est gagnante (ou l'une des gagnantes en cas d'ex-aequo)
 */
export const isPhotoWinner = (
  photoId: string,
  photos: Photo[],
  votes: Vote[],
  expectedVoterIds: string[]
): boolean => {
  const winners = getWinners(photos, votes, expectedVoterIds);
  return winners.some((w) => w.photo.id === photoId);
};
