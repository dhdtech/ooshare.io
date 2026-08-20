import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Info, CheckCircle2, AlertCircle, X } from "lucide-react";
import { cn } from "../../lib/cn";

export type ToastVariant = "success" | "info" | "error";

interface ToastItem {
  id: number;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  showToast: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const AUTO_DISMISS_MS = 4000;

function ToastIcon({ variant }: { variant: ToastVariant }) {
  switch (variant) {
    case "success":
      return <CheckCircle2 size={16} />;
    case "error":
      return <AlertCircle size={16} />;
    default:
      return <Info size={16} />;
  }
}

/**
 * Provider for the app's toast system. Renders a polite live region so screen
 * readers announce each toast, and auto-dismisses after a short delay. Motion
 * is gated by `prefers-reduced-motion` in CSS.
 */
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const nextId = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, variant: ToastVariant = "info") => {
      const id = nextId.current++;
      setToasts((prev) => [...prev.slice(-2), { id, message, variant }]);
    },
    [],
  );

  // Auto-dismiss each toast after AUTO_DISMISS_MS.
  useEffect(() => {
    if (toasts.length === 0) return;
    const timers = toasts.map((toast) =>
      window.setTimeout(() => dismiss(toast.id), AUTO_DISMISS_MS),
    );
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [toasts, dismiss]);

  const reduceMotion = useReducedMotion();

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="ui-toast-viewport" aria-live="polite" aria-atomic="false">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              className={cn("ui-toast", `ui-toast--${toast.variant}`)}
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
              animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 }}
              transition={{ duration: reduceMotion ? 0.1 : 0.24, ease: [0.23, 1, 0.32, 1] }}
            >
              <span className="ui-toast__icon" aria-hidden="true">
                <ToastIcon variant={toast.variant} />
              </span>
              <span className="ui-toast__msg">{toast.message}</span>
              <button
                type="button"
                className="ui-icon-btn"
                style={{ width: 28, height: 28, flex: "none", alignSelf: "center" }}
                aria-label="Dismiss notification"
                onClick={() => dismiss(toast.id)}
              >
                <span aria-hidden="true" style={{ display: "flex" }}>
                  <X size={14} />
                </span>
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within a <ToastProvider>");
  }
  return ctx;
}
