import CoverImage from "./CoverImage";
import ImagePlaceHolder from "./ImagePlaceHolder";
import VoteStars from "./VoteStars";
import DisplayStars from "./DisplayStars";
import WinnerBadge from "./WinnerBadge";

interface PolaroidCardProps {
  imageUrl?: string;
  title?: string;
  description?: string;
  showEmptyStars?: boolean;
  photoId?: string;
  contestId?: string;
  rotation?: number;
  onClick?: () => void;
  /** Si true, affiche le badge "photo gagnante" */
  isWinner?: boolean;
  /** Note moyenne à afficher (pour le mode résultats) */
  averageRating?: number;
}

const PolaroidCard = ({
  imageUrl,
  title,
  description,
  showEmptyStars,
  photoId,
  contestId,
  rotation = 0,
  onClick,
  isWinner = false,
  averageRating,
}: PolaroidCardProps) => {
  const interactive = !!onClick;
  return (
    <div
      role={interactive ? "button" : undefined}
      tabIndex={interactive ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        interactive
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
      style={{ transform: `rotate(${rotation}deg)` }}
      className={`inline-block w-64 bg-white brutal-border brutal-shadow-lg p-3 pb-10 select-none relative ${
        interactive ? "cursor-pointer hover:-translate-y-1 transition-transform" : ""
      }`}
    >
      <figure
        className="w-56 h-56 overflow-hidden relative bg-background"
        aria-label={title || "Photo"}
      >
        {imageUrl ? (
          <CoverImage
            src={imageUrl}
            alt={title || "Photo sans titre"}
            priority={true}
            className="h-full"
          />
        ) : (
          <ImagePlaceHolder className="h-full" />
        )}
      </figure>
      {title && (
        <p className="mt-3 text-center font-mono text-sm break-words">{title}</p>
      )}
      {showEmptyStars && photoId && contestId && (
        <VoteStars photoId={photoId} contestId={contestId} />
      )}
      {description && (
        <p className="mt-1 text-center font-mono text-xs text-muted-foreground break-words">
          {description.length > 80 ? `${description.slice(0, 80).trimEnd()}…` : description}
        </p>
      )}
      {/* Note moyenne en bas de la carte (pour le mode résultats) */}
      {averageRating !== undefined && (
        <div className="mt-2 flex justify-center">
          <DisplayStars rating={averageRating} showRatingText size={4} />
        </div>
      )}
      {/* Badge gagnant sous la note */}
      {isWinner && (
        <div className="mt-2 flex justify-center">
          <WinnerBadge />
        </div>
      )}
    </div>
  );
};

export default PolaroidCard;
