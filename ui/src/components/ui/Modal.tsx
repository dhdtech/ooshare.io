import { useEffect, useId, useRef, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";
import IconButton from "./IconButton";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  icon?: ReactNode;
  children: ReactNode;
  /** Accessible name used for the dialog when a visible title is not desired. */
  "aria-label"?: string;
}

/**
 * Accessible overlay modal: Escape closes, backdrop click closes, focus is moved
 * into the dialog on open and returned to the trigger on close, and Tab is
 * trapped within the dialog. Assumes the invoking surface stays mounted.
 */
export default function Modal({
  open,
  onClose,
  title,
  icon,
  children,
  "aria-label": ariaLabel,
}: ModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);

  // Unique per-instance title id so multiple modals never share a labelledby id.
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    previousFocus.current = document.activeElement as HTMLElement | null;
    // Move focus to the dialog on open.
    requestAnimationFrame(() => {
      dialogRef.current?.focus();
    });
    return () => {
      previousFocus.current?.focus();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab") {
        // Simple focus trap: cycle between focusable elements in the dialog.
        const dialog = dialogRef.current;
        if (!dialog) return;
        const focusables = Array.from(
          dialog.querySelectorAll<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
          ),
        ).filter((el) => !el.hasAttribute("disabled"));
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement as HTMLElement | null;
        if (e.shiftKey && (active === first || !dialog.contains(active))) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && (active === last || !dialog.contains(active))) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const reduceMotion = useReducedMotion();

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="modal-overlay"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0.1 : 0.15, ease: [0.23, 1, 0.32, 1] }}
        >
          <motion.div
            ref={dialogRef}
            className="ui-modal"
            role="dialog"
            aria-modal="true"
            tabIndex={-1}
            aria-labelledby={ariaLabel ? undefined : titleId}
            aria-label={ariaLabel}
            onClick={(e) => e.stopPropagation()}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.97 }}
            animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: reduceMotion ? 0.1 : 0.24, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="ui-modal-header">
              <div className="ui-modal-header-left">
                {icon ? <span aria-hidden="true">{icon}</span> : null}
                <h2 id={titleId}>{title}</h2>
              </div>
              <IconButton icon={<X size={18} />} aria-label="Close" onClick={onClose} />
            </div>
            <div className="ui-modal-body">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
