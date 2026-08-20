import { type ReactNode, type TextareaHTMLAttributes } from "react";
import { cn } from "../../lib/cn";

interface TextareaFieldProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  label?: ReactNode;
  icon?: ReactNode;
  /** E.g. "5 / 50,000". Rendered as mono count against the label row. */
  charCount?: string;
  error?: string;
  className?: string;
}

/**
 * Textarea with optional icon + label, mono character count, and error support.
 */
export default function TextareaField({
  id,
  label,
  icon,
  charCount,
  error,
  className,
  ...rest
}: TextareaFieldProps) {
  const errorId = error ? `${id}-error` : undefined;
  return (
    <div className={cn("ui-field", error ? "ui-field--error" : null, className)}>
      <div className="ui-field-label">
        {label ? (
          <label className="ui-field-label-main" htmlFor={id}>
            {icon ? <span aria-hidden="true">{icon}</span> : null}
            {label}
          </label>
        ) : (
          <span />
        )}
        {charCount ? <span className="ui-char-count">{charCount}</span> : null}
      </div>
      <textarea
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
