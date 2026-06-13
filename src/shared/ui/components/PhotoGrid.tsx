import { useMemo } from "react";
import PolaroidCard from "./PolaroidCard";
import DisplayStars from "./DisplayStars";
import WinnerBadge from "./WinnerBadge";
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

interface PhotoGridProps {
  /** Liste des photos à afficher */
  photos: PhotoWithResults[];
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
    if (filter.minRating !== undefined) {
      result = result.filter((p) => (p.averageRating ?? 0) >= filter.minRating);
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
      {sortedPhotos.map((photoWithResults) => {
        const photo = photoWithResults.photo;
        const isOwnPhoto = "authorId" in photo;
        const photoId = photo.id;
        const contestId = contest.id;

        return (
          <li key={photoId} className="flex flex-col items-center gap-2">
            <div className="relative">
              {/* Badge gagnant si applicable */}
              {showWinnerBadge && photoWithResults.isWinner && <WinnerBadge />}

              {/* Carte Polaroid */}
              <PolaroidCard
                imageUrl={photo.imageUrl}
                title={photo.title}
                description={photo.description}
                showEmptyStars={mode === "vote"}
                photoId={photoId}
                contestId={contestId}
                rotation={getRotation(1, -1, photoId)}
                onClick={() => onPhotoClick?.(photo)}
              />
            </div>

            {/* Affichage des résultats en mode "results" */}
            {mode === "results" && photoWithResults.averageRating !== undefined && (
              <div className="text-center">
                <DisplayStars
                  rating={photoWithResults.averageRating}
                  showRatingText
                  size={4}
                />
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
