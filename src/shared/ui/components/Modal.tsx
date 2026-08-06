import { ReactNode, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  /** Largeur maximale : "md" (défaut) ou "lg" pour les vues photo */
  size?: "md" | "lg";
}

const sizeClass = {
  md: "max-w-md",
  lg: "max-w-md md:max-w-3xl",
} as const;

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

const Modal = ({ open, onClose, title, children }: ModalProps) => {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);
  const titleId = useRef(`modal-title-${Math.random().toString(36).slice(2, 9)}`);

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
        aria-labelledby={titleId.current}
        className="brutal-border brutal-shadow-lg bg-background w-full max-w-md max-h-[90vh] overflow-auto"
      >
        <div className="flex items-center justify-between brutal-border border-x-0 border-t-0 p-4 bg-pastel-butter">
          <h2 id={titleId.current} className="font-mono text-lg font-bold">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="font-mono text-2xl leading-none w-8 h-8 flex items-center justify-center brutal-border bg-background hover:bg-pastel-pink"
          >
            ×
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
