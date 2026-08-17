import { useEffect, useRef, useState } from "react";
import { Share2 } from "lucide-react";
import BrutalButton from "./BrutalButton";
import type { PastelColor, Size } from "../types";

interface IShareButtonProps {
  title: string;
  text: string;
  url: string;
  imageSrc?: string;
  color?: PastelColor;
  size?: Size;
  className?: string;
}

const RESET_DELAY_MS = 2000;

export const toShareFile = async (src: string): Promise<File | null> => {
  try {
    const response = await fetch(src);
    const blob = await response.blob();
    return new File([blob], "concours.jpg", { type: blob.type });
  } catch {
    return null;
  }
};

const ShareButton = ({
  title,
  text,
  url,
  imageSrc,
  color = "lavender",
  size = "sm",
  className = "",
}: IShareButtonProps) => {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");
  const timeoutRef = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timeoutRef.current), []);

  const scheduleReset = () => {
    window.clearTimeout(timeoutRef.current);
    timeoutRef.current = window.setTimeout(() => setStatus("idle"), RESET_DELAY_MS);
  };

  const shareContest = async () => {
    const data: ShareData = { title, text, url };

    if (imageSrc) {
      const file = await toShareFile(imageSrc);
      if (file && navigator.canShare?.({ files: [file] })) {
        data.files = [file];
      }
    }

    if (typeof navigator.share === "function") {
      try {
        await navigator.share(data);
        return;
      } catch (error) {
        // Annulation volontaire du panneau natif : aucun message d'erreur.
        if (error instanceof DOMException && error.name === "AbortError") return;
      }
    }

    try {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      setStatus("copied");
    } catch {
      setStatus("error");
    }
    scheduleReset();
  };

  const label =
    status === "copied"
      ? "Lien copié !"
      : status === "error"
        ? "Partage indisponible"
        : "Partager";

  return (
    <>
      <BrutalButton
        type="button"
        color={color}
        size={size}
        className={className}
        icon={<Share2 size={14} aria-hidden="true" />}
        onClick={shareContest}
      >
        {label}
      </BrutalButton>
      <span aria-live="polite" className="sr-only">
        {status === "copied" ? "Lien copié dans le presse-papiers." : ""}
        {status === "error" ? "Le partage n'est pas disponible sur ce navigateur." : ""}
      </span>
    </>
  );
};

export default ShareButton;
