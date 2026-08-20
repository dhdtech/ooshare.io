import type { ReactNode } from "react";

interface PageHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
}

/** Compact create-hero heading: h1 + optional subtitle, centered. */
export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <header className="ui-page-header">
      <h1 className="ui-page-header-title">{title}</h1>
      {subtitle ? <p className="ui-page-header-sub">{subtitle}</p> : null}
    </header>
  );
}
