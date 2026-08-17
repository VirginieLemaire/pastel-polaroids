import { useMemo, type ReactNode } from "react";
import PolaroidCard from "./PolaroidCard";
import type { Contest } from "@/features/contests/types";
import type { Photo } from "@/features/photos/types";
import type { VisiblePhoto, AnonymousPhoto } from "@/features/photos/visibility";

/**
 * Type étendu pour une photo avec ses résultats de vote.
 */
export interface PhotoWithResults {
  photo: Photo | VisiblePhoto | AnonymousPhoto;
  averageRating?: number;
  isWinner?: boolean;
}

/**
 * Type pour une photo avec des actions personnalisées.
 */
export interface PhotoWithActions {
  photo: Photo | VisiblePhoto | AnonymousPhoto;
  averageRating?: number;
  isWinner?: boolean;
  actions?: ReactNode;
}

interface PhotoGridProps {
  /** Liste des photos à afficher */
  photos: (PhotoWithResults | PhotoWithActions)[];
  /** Concours associé */
  contest: Contest;
  /** Mode d'affichage : détermine le comportement des étoiles */
  mode?: "submission" | "vote" | "results";
  /** Activer/désactiver l'affichage du badge gagnant */
  showWinnerBadge?: boolean;
  /** Callback quand on clique sur une photo */
  onPhotoClick?: (photo: Photo | VisiblePhoto | AnonymousPhoto) => void;
  /** Options de filtrage */
  filter?: {
    onlyWinners?: boolean;
    minRating?: number;
  };
  /** Tri des photos */
  sortBy?: "rating" | "date" | "title";
  /** Classe CSS supplémentaire pour la grille */
  className?: string;
}

/**
 * Composant design system pour afficher une grille de photos.
 * Réutilisable dans PhotosPage et ResultsPage.
 * 
 * @example
 * // Dans PhotosPage (mode vote)
 * <PhotoGrid
 *   photos={visiblePhotos.map(p => ({ photo: p }))}
 *   contest={contest}
 *   mode="vote"
 *   onPhotoClick={(p) => setDetail(p)}
 * />
 * 
 * @example
 * // Dans ResultsPage (mode résultats)
 * <PhotoGrid
 *   photos={photosWithResults}
 *   contest={contest}
 *   mode="results"
 *   showWinnerBadge
 *   sortBy="rating"
 * />
 */
export default function PhotoGrid({
  photos,
  contest,
  mode = "vote",
  showWinnerBadge = false,
  onPhotoClick,
  filter = {},
  sortBy = "date",
  className = "",
}: PhotoGridProps) {
  // Appliquer les filtres
  const filteredPhotos = useMemo(() => {
    let result = [...photos];

    // Filtre : seulement les gagnantes
    if (filter.onlyWinners) {
      result = result.filter((p) => p.isWinner);
    }

    // Filtre : note minimum
    const minRating = filter.minRating;
    if (minRating !== undefined) {
      result = result.filter((p) => (p.averageRating ?? 0) >= minRating);
    }

    return result;
  }, [photos, filter.onlyWinners, filter.minRating]);

  // Appliquer le tri
  const sortedPhotos = useMemo(() => {
    const sorted = [...filteredPhotos];

    sorted.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return (b.averageRating ?? 0) - (a.averageRating ?? 0);
        case "date":
          return new Date(b.photo.createdAt).getTime() - new Date(a.photo.createdAt).getTime();
        case "title":
          return (a.photo.title ?? "").localeCompare(b.photo.title ?? "");
        default:
          return 0;
      }
    });

    return sorted;
  }, [filteredPhotos, sortBy]);

  // Fonction pour générer une rotation aléatoire stable
  const getRotation = (max: number, min: number, seed: string): number => {
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    return (Math.abs(hash) % (max - min + 1)) + min;
  };

  return (
    <ul className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center ${className}`}>
      {sortedPhotos.map((photoWithResultsOrActions) => {
        const photo = photoWithResultsOrActions.photo;
        const photoId = photo.id;
        const contestId = contest.id;
        const isWinner = photoWithResultsOrActions.isWinner;
        const averageRating = photoWithResultsOrActions.averageRating;
        const actions = "actions" in photoWithResultsOrActions 
          ? photoWithResultsOrActions.actions 
          : null;

        return (
          <li key={photoId} className="flex flex-col items-center gap-2">
            {/* Carte Polaroid avec badge gagnant et note intégrés */}
            <PolaroidCard
              imageUrl={photo.imageUrl}
              title={photo.title}
              description={photo.description}
              showEmptyStars={mode === "vote"}
              photoId={photoId}
              contestId={contestId}
              rotation={getRotation(1, -1, photoId)}
              onClick={() => onPhotoClick?.(photo)}
              isWinner={showWinnerBadge && isWinner}
              averageRating={mode === "results" ? averageRating : undefined}
            />

            {/* Actions personnalisées (si fournies) - seulement en mode non-results */}
            {actions && mode !== "results" && (
              <div className="flex gap-2">{actions}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
