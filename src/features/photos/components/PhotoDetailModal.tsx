import { useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Modal from "@/shared/ui/components/Modal";
import BrutalButton from "@/shared/ui/components/BrutalButton";
import type { Contest } from "@/features/contests";
import { getContestStatus } from "@/features/contests/contestStatus";
import { getUserName } from "@/features/user";
import { isAuthoredPhoto, type VisiblePhoto } from "../visibility";
import PhotoImagePanel from "./PhotoImagePanel";
import PhotoInfoPanel from "./PhotoInfoPanel";

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
  // Anonymat strict en phase vote : pas de nom d'auteur pour les photos des autres.
  const showAuthor =
    (status === "submission" || status === "closed") && isAuthoredPhoto(photo);
  const authorName = showAuthor ? getUserName(photo.authorId) : undefined;
  const hasNavigation = Boolean(onPrev || onNext);

  return (
    <Modal
      open={photo !== null}
      onClose={onClose}
      title={photo.title || "Photo"}
      size="lg"
      headerActions={
        hasNavigation ? (
          <nav
            aria-label="Navigation entre les photos"
            className="flex items-center gap-2"
          >
            <BrutalButton
              type="button"
              color="sky"
              size="sm"
              shape="round"
              icon={<ChevronLeft size={16} aria-hidden="true" />}
              onClick={onPrev}
              disabled={!onPrev}
              aria-disabled={!onPrev}
              aria-label="Photo précédente"
              aria-controls={imageId}
              aria-describedby={
                positionLabel ? "photo-position-label" : undefined
              }
            />
            {positionLabel && (
              <p
                id="photo-position-label"
                className="font-mono text-xs text-muted-foreground whitespace-nowrap"
                aria-live="polite"
              >
                {positionLabel}
              </p>
            )}
            <BrutalButton
              type="button"
              color="sky"
              size="sm"
              shape="round"
              icon={<ChevronRight size={16} aria-hidden="true" />}
              onClick={onNext}
              disabled={!onNext}
              aria-disabled={!onNext}
              aria-label="Photo suivante"
              aria-controls={imageId}
              aria-describedby={
                positionLabel ? "photo-position-label" : undefined
              }
            />
          </nav>
        ) : undefined
      }
    >
      <div className="flex flex-col md:h-full md:grid md:grid-cols-[2fr_1fr] gap-4 md:gap-6">
        <PhotoImagePanel ref={imageRef} photo={photo} imageId={imageId} />
        <PhotoInfoPanel
          photo={photo}
          contest={contest}
          authorName={authorName}
          averageRating={averageRating}
          isWinner={isWinner}
        />
      </div>
    </Modal>
  );
};

export default PhotoDetailModal;
