import { Trophy } from "lucide-react";

interface WinnerBadgeProps {
  /** Classe CSS supplémentaire */
  className?: string;
}

/**
 * Badge "photo gagnante" à afficher sur les polaroids gagnants.
 * Utilise l'icône Trophy de Lucide React pour la cohérence.
 * 
 * @example
 * <WinnerBadge /> → Affiche "photo gagnante" avec une icône de trophée
 */
export default function WinnerBadge({ className = "" }: WinnerBadgeProps) {
  return (
    <div
      className={`bg-pastel-mint brutal-border px-2 py-1 ${className}`}
      role="status"
      aria-labelledby="winner-text"
    >
      <span className="flex items-center gap-1 font-mono text-xs">
        <Trophy size={12} className="shrink-0" />
        <span id="winner-text">photo gagnante</span>
      </span>
    </div>
  );
}
