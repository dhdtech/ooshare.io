import type { ReactNode } from "react";

interface InfoCardProps {
  icon: ReactNode;
  title: ReactNode;
  /** Plain body content. Ignored when `html` is provided. */
  children?: ReactNode;
  /** Trusted HTML body string (i18n content) rendered via dangerouslySetInnerHTML. */
  html?: string;
  tag?: ReactNode;
}

/**
 * Icon tile + title + body + optional mono tag (Security / Why info cards).
 * Pass either `children` (plain) or `html` (trusted i18n string) for the body;
 * `html` takes precedence when both are given.
 */
export default function InfoCard({ icon, title, children, html, tag }: InfoCardProps) {
  return (
    <div className="ui-info-card">
      <span className="ui-info-card-icon" aria-hidden="true">
        {icon}
      </span>
      <h3 className="ui-info-card-title">{title}</h3>
      {html !== undefined ? (
        <p className="ui-info-card-body" dangerouslySetInnerHTML={{ __html: html }} />
      ) : children ? (
        <p className="ui-info-card-body">{children}</p>
      ) : null}
      {tag ? <span className="ui-info-card-tag">{tag}</span> : null}
    </div>
  );
}
