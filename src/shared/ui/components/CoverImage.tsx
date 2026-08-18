import { forwardRef } from "react";

interface ICoverImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  /** 
   * If true, loading="eager" and decoding="async" (for LCP - Largest Contentful Paint).
   * If false (défaut), loading="lazy" (for images below the fold).
   */
  priority?: boolean;
  /** 
   * Tailwind aspect ratio(ex: "4/3", "16/9", "square"). 
   * If undefined, fit parent rules.
   */
  aspectRatio?: string;
  /**
   * Comportement de redimensionnement dans la boîte de l'image.
   * "cover" (défaut) : rogne pour remplir la boîte.
   * "contain" : affiche l'image en entier, ratio préservé, sans rognage.
   */
  objectFit?: "cover" | "contain";
  /**
   * Si true, n'applique pas les attributs width/height de secours (800x600) :
   * la boîte de l'image se dimensionne selon le ratio réel de l'image chargée
   * (contrainte par les classes CSS du consommateur), au prix d'un espace non
   * réservé avant chargement (CLS possible). À utiliser quand le ratio réel
   * varie fortement d'une image à l'autre et qu'un placeholder 800x600 fausse
   * le rendu (ex. galerie mêlant photos portrait et paysage).
   */
  intrinsicSize?: boolean;
}

const objectFitClass = {
  cover: "object-cover",
  contain: "object-contain",
} as const;

const CoverImage = forwardRef<HTMLImageElement, ICoverImageProps>(
  (
    {
      src,
      alt,
      priority = false,
      aspectRatio,
      objectFit = "cover",
      intrinsicSize = false,
      className = '',
      ...props
    },
    ref,
  ) => {
    // Pas de largeur forcée par défaut : sans aspectRatio, la boîte de l'image
    // (et sa bordure) s'ajuste à la taille réellement rendue par le consommateur.
    const baseClasses = "brutal-border block";
    const aspectClass = aspectRatio ? `aspect-[${aspectRatio}] w-full` : "";

    // Smart loaoding handle (eco-conception & Perf)
    const loadingStrategy = priority ? "eager" : "lazy";
    const decodingStrategy = priority ? "async" : "auto";

    // Placeholder 800x600 pour réserver l'espace (CLS) tant que le ratio réel
    // n'est pas connu ; désactivable via intrinsicSize quand ce ratio générique
    // fausserait le rendu (voir doc de la prop).
    const sizeProps = intrinsicSize ? {} : { width: 800, height: 600 };

    return (
      <img
        ref={ref}
        src={src}
        alt={alt}
        {...sizeProps}
        loading={loadingStrategy}
        decoding={decodingStrategy}
        className={`${baseClasses} ${objectFitClass[objectFit]} ${aspectClass} ${className}`}
        {...props}
      />
    );
  },
);

CoverImage.displayName = "CoverImage";

export default CoverImage;
