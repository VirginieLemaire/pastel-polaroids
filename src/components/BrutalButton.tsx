import { ButtonHTMLAttributes, ReactNode } from "react";
import { PastelColor, Shape, Size } from "./types";



interface BrutalButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  color?: PastelColor;
  size?: Size;
  shape?: Shape;
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

const rectSize: Record<Size, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

const roundSize: Record<Size, string> = {
  sm: "w-9 h-9 text-base",
  md: "w-12 h-12 text-xl",
  lg: "w-16 h-16 text-3xl",
};

const BrutalButton = ({
  color = "mint",
  size = "md",
  shape = "rect",
  icon,
  children,
  className = "",
  ...rest
}: BrutalButtonProps) => {
  const isRound = shape === "round";
  const sizing = isRound ? roundSize[size] : rectSize[size];
  const shapeClass = isRound ? "rounded-full p-0" : "";

  return (
    <button
      {...rest}
      className={`brutal-btn ${colorClass[color]} ${sizing} ${shapeClass} inline-flex items-center justify-center gap-2 ${className}`}
    >
      {icon && <span aria-hidden="true">{icon}</span>}
      {children}
    </button>
  );
};

export default BrutalButton;
