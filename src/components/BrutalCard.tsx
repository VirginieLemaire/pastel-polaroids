import { HTMLAttributes, ReactNode } from "react";

type PastelColor = "pink" | "lavender" | "mint" | "butter" | "sky" | "peach" | "card";

interface BrutalCardProps extends HTMLAttributes<HTMLDivElement> {
  color?: PastelColor;
  large?: boolean;
  children?: ReactNode;
}

const colorClass: Record<PastelColor, string> = {
  pink: "bg-pastel-pink",
  lavender: "bg-pastel-lavender",
  mint: "bg-pastel-mint",
  butter: "bg-pastel-butter",
  sky: "bg-pastel-sky",
  peach: "bg-pastel-peach",
  card: "bg-background",
};

const BrutalCard = ({
  color = "card",
  large = false,
  children,
  className = "",
  ...rest
}: BrutalCardProps) => {
  return (
    <div
      {...rest}
      className={`brutal-border ${large ? "brutal-shadow-lg" : "brutal-shadow"} ${colorClass[color]} p-5 ${className}`}
    >
      {children}
    </div>
  );
};

export default BrutalCard;
