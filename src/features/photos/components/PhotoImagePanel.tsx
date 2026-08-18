import { forwardRef } from "react";
import CoverImage from "@/shared/ui/components/CoverImage";
import type { VisiblePhoto } from "../visibility";

interface PhotoImagePanelProps {
  photo: VisiblePhoto;
  /** id du conteneur focusable de l'image, ciblé par aria-controls des boutons de nav */
  imageId: string;
}

/**
 * Panneau image (2/3) du détail d'une photo.
 */
const PhotoImagePanel = forwardRef<HTMLDivElement, PhotoImagePanelProps>(
  ({ photo, imageId }, ref) => {
    return (
      <div
        ref={ref}
        id={imageId}
        tabIndex={-1}
        aria-label={photo.title || "Photo sans titre"}
        className="flex items-center justify-center outline-hidden focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 md:h-full"
      >
        <CoverImage
          src={photo.imageUrl}
          alt=""
          priority={true}
          className="max-w-full max-h-[65dvh] md:max-h-[78dvh]"
        />
      </div>
    );
  },
);

PhotoImagePanel.displayName = "PhotoImagePanel";

export default PhotoImagePanel;
