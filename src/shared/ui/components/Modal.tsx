import { ReactNode, useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  /** Taille : "md" (défaut) ou "lg" pour les vues photo (grandit avec le viewport) */
  size?: "md" | "lg";
  /** Contenu affiché dans la barre de titre, entre le titre et le bouton fermer (ex. navigation) */
  headerActions?: ReactNode;
}

const sizeClass = {
  md: "max-w-md max-h-[90dvh] overflow-y-auto",
  // Hauteur fixe (pas de max-height) : la modale occupe toujours le même
  // espace, indépendamment de la taille de la photo ou du contenu.
  lg: "max-w-[min(95vw,1600px)] h-[95dvh] overflow-hidden",
} as const;

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

const Modal = ({
  open,
  onClose,
  title,
  children,
  size = "md",
  headerActions,
}: ModalProps) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  // useId : identifiant stable serveur/client
  const titleId = `modal-title${useId().replace(/:/g, "-")}`;

  useEffect(() => {
    if (!open) return;

    previouslyFocused.current = document.activeElement as HTMLElement;
    document.body.style.overflow = "hidden";

    const node = dialogRef.current;
    const focusables = node?.querySelectorAll<HTMLElement>(FOCUSABLE);
    focusables?.[0]?.focus();

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onClose();
        return;
      }
      if (e.key === "Tab" && node) {
        const items = Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE));
        if (items.length === 0) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (!first || !last) return;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
      previouslyFocused.current?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/40"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`brutal-border brutal-shadow-lg bg-background w-full flex flex-col ${sizeClass[size]}`}
      >
        <div className="flex items-center justify-between gap-3 brutal-border border-x-0 border-t-0 p-4 bg-pastel-butter shrink-0">
          <h2 id={titleId} className="font-mono text-lg font-bold truncate">
            {title}
          </h2>
          <div className="flex items-center gap-3 shrink-0">
            {headerActions}
            <button
              type="button"
              onClick={onClose}
              aria-label="Fermer"
              className="font-mono text-2xl leading-none w-8 h-8 flex items-center justify-center brutal-border bg-background hover:bg-pastel-pink"
            >
              ×
            </button>
          </div>
        </div>
        <div
          className={
            size === "lg" ? "flex-1 min-h-0 overflow-y-auto p-6" : "p-6"
          }
        >
          {children}
        </div>
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
