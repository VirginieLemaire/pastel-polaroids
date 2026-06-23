import type { Contest } from "@/features/contests";
import { getContestStatus } from "@/features/contests/contestStatus";
import type { Photo } from "./types";

export const MAX_PHOTOS_PER_USER = 3;

/** L'utilisateur peut soumettre si le concours est en phase soumission et sous la limite. */
export const canUserSubmit = (contest: Omit<Contest, 'photos'>, userPhotosCount: number): boolean =>
  getContestStatus(contest) === "submission" && userPhotosCount < MAX_PHOTOS_PER_USER;

/** L'auteur peut éditer sa photo uniquement pendant la phase soumission. */
export const canEditPhoto = (photo: Photo, contest: Omit<Contest, 'photos'>, userId: string): boolean =>
  getContestStatus(contest) === "submission" && photo.authorId === userId;

/** Idem suppression : auteur + phase soumission. */
export const canDeletePhoto = (photo: Photo, contest: Omit<Contest, 'photos'>, userId: string): boolean =>
  canEditPhoto(photo, contest, userId);
