import { type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "../../lib/cn";

interface TextFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label?: ReactNode;
  icon?: ReactNode;
  error?: string;
  className?: string;
}

/**
 * Text input with optional icon, label and validation error.
 * The control receives a stable `id` so the visible label is associated via
 * `htmlFor`, keeping the field labeled for screen readers.
 */
export default function TextField({
  id,
  label,
  icon,
  error,
  className,
  ...rest
}: TextFieldProps) {
  const errorId = error ? `${id}-error` : undefined;
  return (
    <div className={cn("ui-field", error ? "ui-field--error" : null, className)}>
      {label ? (
        <label className="ui-field-label" htmlFor={id}>
          <span className="ui-field-label-main">
            {icon ? <span aria-hidden="true">{icon}</span> : null}
            {label}
          </span>
        </label>
      ) : null}
      <input
        id={id}
        className="ui-field-control"
        aria-invalid={error ? true : undefined}
        aria-describedby={errorId}
        {...rest}
      />
      {error && errorId ? (
        <span id={errorId} className="ui-field-error" role="alert">
          {error}
        </span>
      ) : null}
    </div>
  );
}
