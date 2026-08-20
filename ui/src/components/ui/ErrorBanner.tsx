import { AlertCircle } from "lucide-react";
import type { ReactNode } from "react";

interface ErrorBannerProps {
  children: ReactNode;
}

/** Inline form error (port of `.error-msg`), announced as an alert. */
export default function ErrorBanner({ children }: ErrorBannerProps) {
  return (
    <div className="error-msg" role="alert">
      <AlertCircle size={15} aria-hidden="true" />
      <span>{children}</span>
    </div>
  );
}
