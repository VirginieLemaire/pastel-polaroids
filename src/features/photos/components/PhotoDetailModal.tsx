import { useEffect } from "react";
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
}: PhotoDetailModalProps) => {
  if (!photo) return null;
  const status = getContestStatus(contest);
  const authored = isAuthoredPhoto(photo);
  // Anonymat strict en phase vote : pas de nom d'auteur pour les photos des autres.
  const showAuthor = authored && (status === "submission" || status === "closed");

  return (
    <Modal open={photo !== null} onClose={onClose} title={photo.title || "Photo"}>
      <div className="space-y-4">
        {/* Image avec badge gagnant */}
        <div className="w-full brutal-border bg-background relative">
          <CoverImage
            src={photo.imageUrl}
            alt={photo.title || "Photo sans titre"}
            priority={true}
            className="w-full max-h-[60vh]"
          />
          {/* Badge gagnant sur l'image */}
          {isWinner && <WinnerBadge className="top-2 right-2" />}
        </div>

        <dl className="font-mono text-sm space-y-2">
          {photo.description && (
            <div>
              <dt className="text-xs text-muted-foreground">Description</dt>
              <dd className="break-words whitespace-pre-wrap">{photo.description}</dd>
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
          
          <div>
            <dt className="text-xs text-muted-foreground">Soumise le</dt>
            <dd>{formatDate(photo.createdAt)}</dd>
          </div>
        </dl>
      </div>
    </Modal>
  );
};

export default PhotoDetailModal;
