import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

interface CardProps {
  children: ReactNode;
  className?: string;
}

/** Surface card wrapper using the approved surface token, radius 16, subtle shadow. */
export default function Card({ children, className }: CardProps) {
  return <div className={cn("ui-card", className)}>{children}</div>;
}
