import DisplayStars from "@/shared/ui/components/DisplayStars";
import WinnerBadge from "@/shared/ui/components/WinnerBadge";
import type { Contest } from "@/features/contests";
import type { VisiblePhoto } from "../visibility";

interface PhotoInfoPanelProps {
  photo: VisiblePhoto;
  contest: Contest;
  /**
   * Nom de l'auteur à afficher, déjà résolu par l'appelant (anonymat
   * respecté en amont : absent tant que la photo ne doit pas exposer d'auteur).
   */
  authorName?: string;
  /** Note moyenne de la photo */
  averageRating?: number;
  /** Si true, la photo est gagnante */
  isWinner?: boolean;
}

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

/**
 * Panneau informations (1/3) du détail d'une photo : concours, auteur,
 * note moyenne, date de soumission et description.
 */
const PhotoInfoPanel = ({
  photo,
  contest,
  authorName,
  averageRating,
  isWinner = false,
}: PhotoInfoPanelProps) => {
  return (
    <dl className="flex flex-col gap-3 font-mono text-sm">
      <div>
        <dt className="text-xs text-muted-foreground">Concours</dt>
        <dd>{contest.name}</dd>
      </div>

      {authorName && (
        <div>
          <dt className="text-xs text-muted-foreground">Auteur</dt>
          <dd>{authorName}</dd>
        </div>
      )}

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
        <div>
          <dt className="text-xs text-muted-foreground">Description</dt>
          <dd className="break-words whitespace-pre-wrap">
            {photo.description}
          </dd>
        </div>
      )}
    </dl>
  );
};

export default PhotoInfoPanel;
