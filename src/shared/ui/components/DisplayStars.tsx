import { useId, useMemo } from "react";

/**
 * SVG path pour l'icône d'étoile (même que dans VoteStars)
 */
const STAR_PATH =
  "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z";

interface DisplayStarsProps {
  /** Note à afficher (entre 1 et 5, peut contenir des décimales) */
  rating: number;
  /** Taille des étoiles (par défaut : 5 = 20px) */
  size?: number;
  /** Classe CSS supplémentaire */
  className?: string;
  /** Afficher le texte de la note (ex: "4.7/5") */
  showRatingText?: boolean;
}

/**
 * Affiche une note sous forme d'étoiles avec un remplissage précis aux quarts.
 * Gère les notes décimales (ex: 4.72 → arrondi à 4.7, dernière étoile à 70%)
 * 
 * @example
 * <DisplayStars rating={4.7} showRatingText /> → "4.7/5" + 4⭐ + 1⬛⬛⬛
 */
export default function DisplayStars({
  rating,
  size = 5,
  className = "",
  showRatingText = true,
}: DisplayStarsProps) {
  // Arrondir à 1 décimale pour l'affichage
  const displayRating = useMemo(() => Math.round(rating * 10) / 10, [rating]);

  // Calculer les étoiles à afficher
  const stars = useMemo(() => {
    const result: { type: "full" | "partial" | "empty"; fillPercent: number }[] = [];
    const integerPart = Math.floor(displayRating);
    const decimalPart = displayRating - integerPart;

    // Étoiles pleines
    for (let i = 1; i <= integerPart; i++) {
      result.push({ type: "full", fillPercent: 100 });
    }

    // Étoile partiellement remplie (si décimale > 0)
    if (decimalPart > 0 && integerPart < 5) {
      // Arrondir à 25% près (0.25, 0.5, 0.75)
      const roundedDecimal = Math.round(decimalPart * 4) / 4;
      result.push({ type: "partial", fillPercent: roundedDecimal * 100 });
    }

    // Étoiles vides pour compléter jusqu'à 5
    while (result.length < 5) {
      result.push({ type: "empty", fillPercent: 0 });
    }

    return result;
  }, [displayRating]);

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <div className="flex gap-0.5" role="img" aria-label={`Note : ${displayRating}/5`}>
        {stars.map((star, index) => (
          <Star key={index} type={star.type} fillPercent={star.fillPercent} size={size} />
        ))}
      </div>
      {showRatingText && (
        <span className="font-mono text-xs text-muted-foreground">
          {displayRating}/5
        </span>
      )}
    </div>
  );
}

/**
 * Composant interne pour afficher une seule étoile avec un remplissage personnalisé.
 */
function Star({ type, fillPercent, size }: { type: string; fillPercent: number; size: number }) {
  // useId : identifiant stable entre le rendu serveur et le client (pas d'écart d'hydratation)
  const starId = `star${useId().replace(/:/g, "-")}`;
  const width = size * 4;
  const height = size * 4;
  const iconSize = width;

  // Couleur selon le type (pour l'accessibilité)
  const isFilled = type === "full" || fillPercent > 0;

  return (
    <svg
      width={iconSize}
      height={iconSize}
      viewBox="0 0 24 24"
      className={`shrink-0 ${isFilled ? "text-yellow-500" : "text-muted-foreground"}`}
    >
      {/* Définition du dégradé pour les étoiles partielles */}
      <defs>
        <linearGradient id={starId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset={`${fillPercent}%`} stopColor="currentColor" />
          <stop offset={`${fillPercent}%`} stopColor="transparent" />
        </linearGradient>
      </defs>

      {/* Étoile avec remplissage adapté */}
      <path
        d={STAR_PATH}
        fill={type === "full" ? "currentColor" : type === "partial" ? `url(#${starId})` : "none"}
        stroke="currentColor"
        strokeWidth={2}
      />
    </svg>
  );
}
