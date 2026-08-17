import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Modal from "@/shared/ui/components/Modal";
import CoverImage from "@/shared/ui/components/CoverImage";
import DisplayStars from "@/shared/ui/components/DisplayStars";
import WinnerBadge from "@/shared/ui/components/WinnerBadge";
import BrutalButton from "@/shared/ui/components/BrutalButton";
import type { Contest } from "@/features/contests";
import { getContestStatus } from "@/features/contests/contestStatus";
import { getUserName } from "@/features/user";
import { isAuthoredPhoto, type VisiblePhoto } from "../visibility";

interface PhotoDetailModalProps {
  photo: VisiblePhoto | null;
  contest: Contest;
  onClose: () => void;
  /** Note moyenne de la photo (pour afficher dans les détails) */
  averageRating?: number;
  /** Si true, la photo est gagnante */
  isWinner?: boolean;
  /** Affiche la photo précédente de la liste (absent = pas de précédente) */
  onPrev?: () => void;
  /** Affiche la photo suivante de la liste (absent = pas de suivante) */
  onNext?: () => void;
  /** Position courante dans la liste, ex. « 2 / 8 » */
  positionLabel?: string;
}


const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

const PhotoDetailModal = ({ 
  photo, 
  contest, 
  onClose, 
  averageRating,
  isWinner = false,
  onPrev,
  onNext,
  positionLabel,
}: PhotoDetailModalProps) => {
  const imageRef = useRef<HTMLDivElement>(null);
  const prevPhotoIdRef = useRef<string | null>(null);
  const imageId = `photo-detail-image-${photo?.id ?? "empty"}`;

  // Navigation clavier entre les photos (flèches gauche / droite)
  useEffect(() => {
    if (!photo) return;
    const handleArrowKeys = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" && onPrev) {
        e.preventDefault();
        onPrev();
      }
      if (e.key === "ArrowRight" && onNext) {
        e.preventDefault();
        onNext();
      }
    };
    document.addEventListener("keydown", handleArrowKeys);
    return () => document.removeEventListener("keydown", handleArrowKeys);
  }, [photo, onPrev, onNext]);

  // Déplace le focus sur l'image lors d'une navigation Précédente/Suivante
  // afin d'annoncer le changement de contenu aux lecteurs d'écran.
  useEffect(() => {
    if (!photo) return;
    if (prevPhotoIdRef.current && prevPhotoIdRef.current !== photo.id) {
      imageRef.current?.focus();
    }
    prevPhotoIdRef.current = photo.id;
  }, [photo]);

  if (!photo) return null;
  const status = getContestStatus(contest);
  const authored = isAuthoredPhoto(photo);
  // Anonymat strict en phase vote : pas de nom d'auteur pour les photos des autres.
  const showAuthor = authored && (status === "submission" || status === "closed");
  const hasNavigation = Boolean(onPrev || onNext);

  return (
    <Modal open={photo !== null} onClose={onClose} title={photo.title || "Photo"} size="lg">
      <div className="space-y-4">

        {/* Image avec badge gagnant */}
        <div
          ref={imageRef}
          id={imageId}
          tabIndex={-1}
          aria-label={photo.title || "Photo sans titre"}
          className="w-full brutal-border bg-background relative outline-hidden focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2"
        >
          <CoverImage
            src={photo.imageUrl}
            alt=""
            priority={true}
            objectFit="contain"
            className="w-full max-h-[65vh] md:max-h-[78vh]"
          />
          {/* Badge gagnant sur l'image */}
          {isWinner && <WinnerBadge className="top-2 right-2" />}
        </div>

        {/* Navigation entre les photos */}
        {hasNavigation && (
          <nav aria-label="Navigation entre les photos" className="flex items-center justify-between gap-3">
            <BrutalButton
              type="button"
              color="sky"
              size="sm"
              icon={<ChevronLeft size={16} aria-hidden="true" />}
              onClick={onPrev}
              disabled={!onPrev}
              aria-disabled={!onPrev}
              aria-label="Photo précédente"
              aria-controls={imageId}
              aria-describedby={positionLabel ? "photo-position-label" : undefined}
            >
              <span className="hidden sm:inline">Précédente</span>
            </BrutalButton>
            {positionLabel && (
              <p id="photo-position-label" className="font-mono text-xs text-muted-foreground" aria-live="polite">
                {positionLabel}
              </p>
            )}
            <BrutalButton
              type="button"
              color="sky"
              size="sm"
              onClick={onNext}
              disabled={!onNext}
              aria-disabled={!onNext}
              aria-label="Photo suivante"
              aria-controls={imageId}
              aria-describedby={positionLabel ? "photo-position-label" : undefined}
            >
              <span className="hidden sm:inline">Suivante</span>
              <ChevronRight size={16} aria-hidden="true" />
            </BrutalButton>
          </nav>
        )}



        <dl className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-3 font-mono text-sm">
          {/* Concours */}
          <div>
            <dt className="text-xs text-muted-foreground">Concours</dt>
            <dd>{contest.name}</dd>
          </div>

          {showAuthor && (
            <div>
              <dt className="text-xs text-muted-foreground">Auteur</dt>
              <dd>{getUserName(photo.authorId)}</dd>
            </div>
          )}

          {/* Note moyenne */}
          {averageRating !== undefined && (
            <div>
              <dt className="text-xs text-muted-foreground">Note moyenne</dt>
              <dd>
                <DisplayStars rating={averageRating} showRatingText size={5} />
              </dd>
            </div>
          )}

          <div>
            <dt className="text-xs text-muted-foreground">Soumise le</dt>
            <dd>{formatDate(photo.createdAt)}</dd>
          </div>

          {/* Badge gagnant (version texte) */}
          {isWinner && (
            <div>
              <dd>
                <span className="flex items-center gap-1">
                  <WinnerBadge />
                </span>
              </dd>
            </div>
          )}

          {photo.description && (
            <div className="sm:col-span-2 md:col-span-3">
              <dt className="text-xs text-muted-foreground">Description</dt>
              <dd className="break-words whitespace-pre-wrap">{photo.description}</dd>
            </div>
          )}
        </dl>
      </div>
    </Modal>
  );
};

export default PhotoDetailModal;
