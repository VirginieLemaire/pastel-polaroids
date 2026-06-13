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
      className={`absolute -top-2 -right-2 bg-pastel-mint brutal-border px-2 py-1 ${className}`}
      aria-label="photo gagnante"
    >
      <span className="flex items-center gap-1 font-mono text-xs">
        <Trophy size={12} className="text-yellow-600 shrink-0" />
        <span>photo gagnante</span>
      </span>
    </div>
  );
}
