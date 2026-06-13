import CoverImage from "./CoverImage";
import ImagePlaceHolder from "./ImagePlaceHolder";
import VoteStars from "./VoteStars";
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
      className={`inline-block w-64 bg-background brutal-border brutal-shadow-lg p-3 pb-10 select-none ${
        interactive ? "cursor-pointer hover:-translate-y-1 transition-transform" : ""
      }`}
    >
      {/* Badge gagnant (en haut à droite, absolu par rapport à la carte) */}
      <div className="relative">
        {isWinner && <WinnerBadge />}
        
        <div
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
        </div>
      </div>
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
    </div>
  );
};

export default PolaroidCard;
