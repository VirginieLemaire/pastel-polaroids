import { useState } from "react";

interface PolaroidCardProps {
  imageUrl: string;
  title: string;
  author: string;
  date?: string;
  description?: string;
  rotation?: number;
}

const PolaroidCard = ({ imageUrl, title, author, date, description, rotation = 0 }: PolaroidCardProps) => {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className={`polaroid w-64 h-80 cursor-pointer select-none ${flipped ? "flipped" : ""}`}
      onClick={() => setFlipped(!flipped)}
      style={{ transform: `rotate(${rotation}deg)` }}
    >
      <div className="polaroid-inner">
        <div className="polaroid-front bg-card brutal-border brutal-shadow p-3 pb-12 flex flex-col">
          <div className="flex-1 brutal-border overflow-hidden bg-muted">
            <img src={imageUrl} alt={title} className="w-full h-full object-cover" />
          </div>
          <p className="mt-3 text-center font-mono text-sm truncate">{title}</p>
        </div>

        <div className="polaroid-back bg-pastel-butter brutal-border brutal-shadow p-5 flex flex-col justify-between">
          <div>
            <h3 className="font-mono text-lg font-bold mb-2 border-b-2 border-foreground pb-2">{title}</h3>
            <p className="text-sm mb-3">📸 {author}</p>
            {date && <p className="font-mono text-xs text-muted-foreground mb-3">{date}</p>}
            {description && <p className="text-sm leading-relaxed">{description}</p>}
          </div>
          <p className="font-mono text-xs text-muted-foreground text-center">↩ cliquer pour retourner</p>
        </div>
      </div>
    </div>
  );
};

export default PolaroidCard;
