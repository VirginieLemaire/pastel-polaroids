import CoverImage from "./CoverImage";
import ImagePlaceHolder from "./ImagePlaceHolder";

interface PolaroidCardProps {
  imageUrl?: string;
  title?: string;
  description?: string;
  rotation?: number;
  onClick?: () => void;
}

const PolaroidCard = ({
  imageUrl,
  title,
  description,
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
      {description && (
        <p className="mt-1 text-center font-mono text-xs text-muted-foreground break-words">
          {description.length > 80 ? `${description.slice(0, 80).trimEnd()}…` : description}
        </p>
      )}
    </div>
  );
};

export default PolaroidCard;
