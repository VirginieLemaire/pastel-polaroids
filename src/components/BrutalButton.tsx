import { ButtonHTMLAttributes, ReactNode } from "react";

type PastelColor = "pink" | "lavender" | "mint" | "butter" | "sky" | "peach";

interface BrutalButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  color?: PastelColor;
  size?: "sm" | "md" | "lg";
  icon?: ReactNode;
  children?: ReactNode;
}

const colorClass: Record<PastelColor, string> = {
  pink: "bg-pastel-pink",
  lavender: "bg-pastel-lavender",
  mint: "bg-pastel-mint",
  butter: "bg-pastel-butter",
  sky: "bg-pastel-sky",
  peach: "bg-pastel-peach",
};

const sizeClass = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

const BrutalButton = ({
  color = "mint",
  size = "md",
  icon,
  children,
  className = "",
  ...rest
}: BrutalButtonProps) => {
  return (
    <button
      {...rest}
      className={`brutal-btn ${colorClass[color]} ${sizeClass[size]} inline-flex items-center justify-center gap-2 ${className}`}
    >
      {icon && <span aria-hidden="true">{icon}</span>}
      {children}
    </button>
  );
};

export default BrutalButton;
