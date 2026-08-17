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
}

const objectFitClass = {
  cover: "object-cover",
  contain: "object-contain",
} as const;

export default function CoverImage({
  src,
  alt,
  priority = false,
  aspectRatio,
  objectFit = "cover",
  className = '',
  ...props
}: ICoverImageProps) {
  const baseClasses = "brutal-border w-full block";
  const aspectClass = aspectRatio ? `aspect-[${aspectRatio}]` : "";
  
  // Smart loaoding handle (eco-conception & Perf)
  const loadingStrategy = priority ? "eager" : "lazy";
  const decodingStrategy = priority ? "async" : "auto";

  return (
    <img
      src={src}
      alt={alt}
      width={800} // default to preserve space (CLS - Cumulative Layout Shift) if aspectRatio is missing
      height={600}
      loading={loadingStrategy}
      decoding={decodingStrategy}
      className={`${baseClasses} ${objectFitClass[objectFit]} ${aspectClass} ${className}`}
      {...props}
    />
  );
};