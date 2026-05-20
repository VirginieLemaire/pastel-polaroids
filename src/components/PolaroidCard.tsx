interface PolaroidCardProps {
  imageUrl?: string;
  title?: string;
  rotation?: number;
  onClick?: () => void;
}

const PolaroidCard = ({ imageUrl, title, rotation = 0, onClick }: PolaroidCardProps) => {
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
      className={`inline-block bg-background brutal-border brutal-shadow-lg p-3 pb-10 select-none ${
        interactive ? "cursor-pointer hover:-translate-y-1 transition-transform" : ""
      }`}
    >
      <div
        className="brutal-border w-56 h-56 overflow-hidden relative bg-background"
        aria-label={title || "Photo"}
      >
        {imageUrl ? (
          <img src={imageUrl} alt={title || ""} className="w-full h-full object-cover" />
        ) : (
          <div
            className="w-full h-full"
            aria-hidden="true"
            style={{
              backgroundImage:
                "repeating-linear-gradient(135deg, hsl(var(--foreground)) 0 2px, transparent 2px 10px)",
            }}
          />
        )}
      </div>
      {title && (
        <p className="mt-3 text-center font-mono text-sm truncate">{title}</p>
      )}
    </div>
  );
};

export default PolaroidCard;
