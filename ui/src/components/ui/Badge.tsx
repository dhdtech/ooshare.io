import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

export type BadgeVariant = "quiet" | "accent" | "tag";

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  icon?: ReactNode;
  className?: string;
}

/**
 * Mono chip used for technical/data labels.
 *  - quiet: trust-strip / footer badges (pill, muted on chip-bg)
 *  - accent: mono tag on cards (chip-text on chip-bg)
 *  - tag:    small labeled tag on security cards
 */
export default function Badge({ children, variant = "quiet", icon, className }: BadgeProps) {
  return (
    <span className={cn("ui-badge", `ui-badge--${variant}`, className)}>
      {icon ? <span aria-hidden="true">{icon}</span> : null}
      {children}
    </span>
  );
}
