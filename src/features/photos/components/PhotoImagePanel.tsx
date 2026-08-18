import { forwardRef, useState } from "react";
import { RotateCw } from "lucide-react";
import CoverImage from "@/shared/ui/components/CoverImage";
import type { VisiblePhoto } from "../visibility";

interface PhotoImagePanelProps {
  photo: VisiblePhoto;
  /** id du conteneur focusable de l'image, ciblé par aria-controls des boutons de nav */
  imageId: string;
  /**
   * Si false, n'affiche jamais l'incitation à tourner l'appareil : utile
   * quand la mise en page s'est déjà adaptée au mode paysage.
   */
  showRotateHint?: boolean;
  /**
   * "default" (défaut) : hauteur plafonnée (dvh), pensée pour la grille
   * desktop/portrait mobile.
   * "fill" : occupe toute la hauteur/largeur disponible du conteneur parent
   * (mode paysage mobile, où l'espace gagné doit vraiment profiter à l'image).
   */
  variant?: "default" | "fill";
}

/**
 * Panneau image (2/3) du détail d'une photo.
 */
const PhotoImagePanel = forwardRef<HTMLImageElement, PhotoImagePanelProps>(
  ({ photo, imageId, showRotateHint = true, variant = "default" }, ref) => {
    const [isLandscape, setIsLandscape] = useState(false);
    const isFill = variant === "fill";

    return (
      <div
        className={
          isFill
            ? "flex h-full w-full min-h-0 flex-col items-center justify-center gap-2"
            : "flex flex-col items-center gap-2 place-self-center min-h-0"
        }
      >
        <CoverImage
          ref={ref}
          id={imageId}
          tabIndex={-1}
          aria-label={photo.title || "Photo sans titre"}
          src={photo.imageUrl}
          alt=""
          priority={true}
          objectFit="contain"
          intrinsicSize
          onLoad={(e) =>
            setIsLandscape(
              e.currentTarget.naturalWidth > e.currentTarget.naturalHeight,
            )
          }
          className={`min-h-0 outline-hidden focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 ${
            isFill ? "max-h-full max-w-full" : "max-h-[65dvh] md:max-h-[78dvh]"
          }`}
        />
        {showRotateHint && isLandscape && (
          <p className="md:hidden flex items-center gap-1.5 text-xs text-muted-foreground">
            <RotateCw size={14} aria-hidden="true" />
            Tournez votre appareil pour une meilleure vue
          </p>
        )}
      </div>
    );
  },
);

PhotoImagePanel.displayName = "PhotoImagePanel";

export default PhotoImagePanel;
