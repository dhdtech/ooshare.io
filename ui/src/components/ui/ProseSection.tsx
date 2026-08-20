import type { ReactNode } from "react";

interface ProseSectionProps {
  /** Left-aligned h2 heading for the section. */
  title: ReactNode;
  /** Prose content (paragraphs, lists, nested headers, tables…). */
  children: ReactNode;
  /** Optional class appended to the section wrapper. */
  className?: string;
}

/**
 * Left-aligned content section for article pages: an h2 (matching the design
 * system section-title look) above arbitrary prose children. Replaces the
 * legacy `.article-section` markup used by Security / About / WhyOOShare.
 */
export default function ProseSection({ title, children }: ProseSectionProps) {
  return (
    <section className="ui-prose-section">
      <h2 className="ui-prose-section-title">{title}</h2>
      <div className="ui-prose-section-body">{children}</div>
    </section>
  );
}
