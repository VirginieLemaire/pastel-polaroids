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
}

export default function CoverImage({
  src,
  alt,
  priority = false,
  aspectRatio,
  className = '',
  ...props
}: ICoverImageProps) {
  // dynamic classes
  // We add object-cover by default
  const baseClasses = "brutal-border w-full object-cover block";
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
      className={`${baseClasses} ${aspectClass} ${className}`}
      {...props}
    />
  );
};