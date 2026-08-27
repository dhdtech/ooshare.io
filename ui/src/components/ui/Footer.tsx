import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { Lock, Eye, Trash2, Github } from "lucide-react";

interface FooterBadgeDef {
  label: string;
  icon: ReactNode;
}

interface FooterBadgesProps {
  badges: FooterBadgeDef[];
}

/** Mono credential chips: Lock=AE · Eye-off=Zero Knowledge · Trash=Auto-Delete. */
export function FooterBadges({ badges }: FooterBadgesProps) {
  return (
    <div className="ui-footer-badges">
      {badges.map((b) => (
        <span className="ui-badge ui-badge--quiet" key={b.label}>
          <span aria-hidden="true" style={{ display: "flex" }}>
            {b.icon}
          </span>
          {b.label}
        </span>
      ))}
    </div>
  );
}

interface FooterNavLink {
  to: string;
  label: string;
}

interface FooterNavProps {
  links: FooterNavLink[];
}

/** Centered footer link list (SPA routes via React Router Link). */
export function FooterNav({ links }: FooterNavProps) {
  return (
    <ul className="ui-footer-nav">
      {links.map((l) => (
        <li key={l.to}>
          <Link to={l.to}>{l.label}</Link>
        </li>
      ))}
    </ul>
  );
}

interface FooterLegalProps {
  openSourceLabel: string;
  openSourceHref: string;
}

/**
 * Bottom legal row: GitHub "Open Source" link. The "Powered by DHDTech.io"
 * credit lives only in the pinned CompanyBar.
 */
export function FooterLegal({
  openSourceLabel,
  openSourceHref,
}: FooterLegalProps) {
  return (
    <div className="ui-footer-bottom">
      <span className="ui-footer-legal">
        <a href={openSourceHref} target="_blank" rel="noopener noreferrer">
          <Github size={14} aria-hidden="true" />
          {openSourceLabel}
        </a>
      </span>
    </div>
  );
}

// Re-export icon helpers for convenient footer badge composition.
export const FooterBadgeIcons = { Lock, Eye, Trash2 };
