export default function ImagePlaceHolder({className}) {
  return (
    <div
      className={`w-full aspect-[4/3] brutal-border ${className}`}
      style={{
      backgroundImage:
        "repeating-linear-gradient(45deg, transparent 0 10px, hsl(var(--foreground) / 0.08) 10px 12px)",
      }}
      aria-hidden="true"
      role="presentation" // Explicitly pure decoration
    />
  );
}
