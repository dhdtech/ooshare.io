import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../../lib/cn";

interface NavLinkProps {
  to: string;
  children: ReactNode;
  className?: string;
}

/**
 * Header navigation link with a visible keyboard focus ring and an active
 * (aria-current) style when it matches the current route.
 */
export default function NavLink({ to, children, className }: NavLinkProps) {
  const location = useLocation();
  const active = location.pathname === to;
  return (
    <Link
      to={to}
      className={cn("ui-nav-link", active ? "ui-nav-link--active" : null, className)}
      aria-current={active ? "page" : undefined}
    >
      {children}
    </Link>
  );
}
