import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  PanelRightClose,
  PanelRightOpen,
  Trophy,
  X,
} from "lucide-react";
import BrutalButton from "@/shared/ui/components/BrutalButton";
import type { Contest } from "@/features/contests";
import type { VisiblePhoto } from "../visibility";
import PhotoInfoPanel from "./PhotoInfoPanel";

interface PhotoDetailLandscapeRailProps {
  photo: VisiblePhoto;
  contest: Contest;
  authorName?: string;
  averageRating?: number;
  isWinner?: boolean;
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  positionLabel?: string;
  /** id du conteneur focusable de l'image, ciblé par aria-controls des boutons de nav */
  imageId: string;
}

/**
 * Remplace la barre de titre en mode paysage mobile : rail vertical fixé à
 * droite (fermeture, ouverture du tiroir "Infos", navigation, badge gagnant)
 * et tiroir en overlay affichant PhotoInfoPanel une fois ouvert.
 */
const PhotoDetailLandscapeRail = ({
  photo,
  contest,
  authorName,
  averageRating,
  isWinner = false,
  onClose,
  onPrev,
  onNext,
  positionLabel,
  imageId,
}: PhotoDetailLandscapeRailProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasNavigation = Boolean(onPrev || onNext);

  return (
    <div className="relative h-full shrink-0">
      <div className="flex flex-col items-center h-full w-14 shrink-0 brutal-border border-y-0 border-r-0 bg-pastel-butter py-3 gap-4 overflow-y-auto">
        <BrutalButton
          type="button"
          color="sky"
          size="sm"
          shape="round"
          icon={<X size={16} aria-hidden="true" />}
          onClick={onClose}
          aria-label="Fermer"
        />

        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="flex flex-col items-center gap-2 font-mono"
          aria-expanded={isOpen}
          aria-label="Afficher les informations de la photo"
        >
          <span className="[writing-mode:vertical-rl] text-sm font-bold tracking-wide">
            Infos
          </span>
          <PanelRightOpen size={18} aria-hidden="true" />
        </button>

        {hasNavigation && (
          <nav
            aria-label="Navigation entre les photos"
            className="flex flex-col items-center gap-3"
          >
            <BrutalButton
              type="button"
              color="sky"
              size="sm"
              shape="round"
              icon={
                <ChevronLeft
                  size={16}
                  className="rotate-90"
                  aria-hidden="true"
                />
              }
              onClick={onPrev}
              disabled={!onPrev}
              aria-disabled={!onPrev}
              aria-label="Photo précédente"
              aria-controls={imageId}
            />
            {positionLabel && (
              <p
                className="[writing-mode:vertical-rl] font-mono text-xs text-muted-foreground whitespace-nowrap"
                aria-live="polite"
              >
                {positionLabel}
              </p>
            )}
            <BrutalButton
              type="button"
              color="sky"
              size="sm"
              shape="round"
              icon={
                <ChevronRight
                  size={16}
                  className="rotate-90"
                  aria-hidden="true"
                />
              }
              onClick={onNext}
              disabled={!onNext}
              aria-disabled={!onNext}
              aria-label="Photo suivante"
              aria-controls={imageId}
            />
          </nav>
        )}

        <div className="flex-1" />

        {isWinner && (
          <Trophy
            size={28}
            className="shrink-0 text-foreground"
            role="img"
            aria-label="Photo gagnante"
          />
        )}
      </div>

      {isOpen && (
        <div className="absolute inset-y-0 right-0 z-10 flex w-72 max-w-[75vw] flex-col gap-4 overflow-y-auto brutal-border bg-background p-4">
          <div className="flex items-center justify-between gap-2 shrink-0">
            <h3 className="font-mono text-sm font-bold">Informations</h3>
            <BrutalButton
              type="button"
              color="sky"
              size="sm"
              shape="round"
              icon={<PanelRightClose size={16} aria-hidden="true" />}
              onClick={() => setIsOpen(false)}
              aria-label="Masquer les informations"
            />
          </div>
          <PhotoInfoPanel
            photo={photo}
            contest={contest}
            authorName={authorName}
            averageRating={averageRating}
            isWinner={isWinner}
          />
        </div>
      )}
    </div>
  );
};

export default PhotoDetailLandscapeRail;
