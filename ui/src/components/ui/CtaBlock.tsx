import type { ReactNode } from "react";

interface CtaBlockProps {
  /** Optional muted helper line shown above the CTA(s). */
  text?: ReactNode;
  /** The CTA element(s) — a Button, link, etc. */
  children: ReactNode;
}

/**
 * Centered call-to-action block (port of the `.article-cta` pattern). Renders
 * an optional muted text line followed by the primary action.
 */
export default function CtaBlock({ text, children }: CtaBlockProps) {
  return (
    <div className="ui-cta-block">
      {text ? <p className="ui-cta-block-text">{text}</p> : null}
      {children}
    </div>
  );
}
