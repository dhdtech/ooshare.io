import type { ReactNode } from "react";
import { AlertCircle } from "lucide-react";

interface StateCardProps {
  icon: ReactNode;
  iconClass: string;
  title: ReactNode;
  message?: ReactNode;
  actions?: ReactNode;
}

function StateCard({ icon, iconClass, title, message, actions }: StateCardProps) {
  return (
    <div className="ui-state-card">
      <span className={`ui-state-icon ${iconClass}`} aria-hidden="true">
        {icon}
      </span>
      <h2 className="ui-state-title">{title}</h2>
      {message ? <p className="ui-state-msg">{message}</p> : null}
      {actions}
    </div>
  );
}

interface ErrorStateProps {
  title: ReactNode;
  message?: ReactNode;
  actions?: ReactNode;
}

/** Centered error card state (port of `.error-card`). */
export function ErrorState({ title, message, actions }: ErrorStateProps) {
  return (
    <StateCard
      icon={<AlertCircle size={22} />}
      iconClass="ui-state-icon--error"
      title={title}
      message={message}
      actions={actions}
    />
  );
}

interface LoadingStateProps {
  label: ReactNode;
}

/** Centered spinner + label loading card state. */
export function LoadingState({ label }: LoadingStateProps) {
  return (
    <div className="ui-state-card">
      <div className="ui-loading-spinner" aria-hidden="true" />
      <p>{label}</p>
    </div>
  );
}
