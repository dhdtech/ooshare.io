import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

interface BackLinkProps {
  to: string;
  children: ReactNode;
}

/** Inline "back" link with an arrow icon; centers itself in flexible parents. */
export default function BackLink({ to, children }: BackLinkProps) {
  return (
    <Link to={to} className="ui-back-link">
      <ArrowLeft size={15} aria-hidden="true" />
      {children}
    </Link>
  );
}
