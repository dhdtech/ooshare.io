import { type ButtonHTMLAttributes, type ReactElement } from "react";
import { cn } from "../../lib/cn";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Required: names the icon-only control for assistive tech. */
  "aria-label": string;
  icon: ReactElement;
  className?: string;
}

/**
 * Icon-only circular/pill button. `aria-label` is required — a bare SVG-only
 * button would be announced as just "button".
 */
export default function IconButton({
  "aria-label": ariaLabel,
  icon,
  className,
  type = "button",
  ...rest
}: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={ariaLabel}
      className={cn("ui-icon-btn", className)}
      {...rest}
    >
      <span aria-hidden="true" style={{ display: "flex" }}>
        {icon}
      </span>
    </button>
  );
}
