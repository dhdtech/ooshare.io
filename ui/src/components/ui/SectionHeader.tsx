import type { ReactNode } from "react";

interface SectionHeaderProps {
  title: ReactNode;
  sub?: ReactNode;
}

/** Centered h2 section heading with an optional subtitle. */
export default function SectionHeader({ title, sub }: SectionHeaderProps) {
  return (
    <div className="ui-section-header">
      <h2 className="ui-section-header-title">{title}</h2>
      {sub ? <p className="ui-section-header-sub">{sub}</p> : null}
    </div>
  );
}
