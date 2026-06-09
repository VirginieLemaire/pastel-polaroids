import CoverImage from "./CoverImage";
import ImagePlaceHolder from "./ImagePlaceHolder";
import VoteStars from "./VoteStars";

interface PolaroidCardProps {
  imageUrl?: string;
  title?: string;
  description?: string;
  showEmptyStars?: boolean;
  rotation?: number;
  onClick?: () => void;
}

const PolaroidCard = ({
  imageUrl,
  title,
  description,
  showEmptyStars,
  rotation = 0,
  onClick,
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
      {title && (
        <p className="mt-3 text-center font-mono text-sm break-words">{title}</p>
      )}
      {showEmptyStars && (
        <div className="flex justify-center gap-1 mt-2" aria-hidden="true">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              viewBox="0 0 24 24"
              className="w-3.5 h-3.5 text-muted-foreground"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
              />
            </svg>
          ))}
        </div>
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
