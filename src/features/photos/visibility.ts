import type { Contest } from "@/features/contests";
import { getContestStatus } from "@/features/contests/contestStatus";
import type { Photo } from "./types";

/**
 * Photo anonymisée : retournée en phase `vote` pour les photos des autres.
 * `authorId` est volontairement absent du type pour éviter toute fuite (cf. ACCESS_CONTROL_RULES).
 */
export type AnonymousPhoto = Omit<Photo, "authorId">;

export type VisiblePhoto = Photo | AnonymousPhoto;

/** Retire le champ `authorId` d'une photo (anonymisation stricte pour la phase vote). */
export const anonymizePhoto = (photo: Photo): AnonymousPhoto => {
  const { authorId: _omit, ...rest } = photo;
  return rest;
};

/**
 * Retourne les photos visibles par `userId` selon la phase du concours :
 * - submission : uniquement ses propres photos
 * - vote       : toutes les photos, anonymisées sauf les siennes
 * - closed     : toutes les photos, auteurs visibles
 */
export const getVisiblePhotos = (
  photos: Photo[],
  contest: Contest,
  userId: string,
): VisiblePhoto[] => {
  const status = getContestStatus(contest);
  switch (status) {
    case "submission":
      return photos.filter((p) => p.authorId === userId);
    case "vote":
      return photos.map((p) => (p.authorId === userId ? p : anonymizePhoto(p)));
    case "closed":
      return photos;
  }
};

/** Type guard : la photo expose-t-elle son auteur ? */
export const isAuthoredPhoto = (photo: VisiblePhoto): photo is Photo =>
  "authorId" in photo;

/**
 * Photo visible avec ses résultats de vote (pour la phase closed).
 * Étend VisiblePhoto avec la note moyenne et le statut de gagnante.
 */
export interface VisiblePhotoWithResults {
  photo: VisiblePhoto;
  averageRating: number;
  isWinner: boolean;
}
