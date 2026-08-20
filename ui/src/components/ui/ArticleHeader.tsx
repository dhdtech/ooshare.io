import type { ReactNode } from "react";
import { cn } from "../../lib/cn";

export type ArticleHeaderVariant = "listing" | "post";

interface ArticleHeaderProps {
  title: ReactNode;
  /** Optional lead line rendered after the title. */
  lead?: ReactNode;
  /** Optional tag chips row rendered above the title. */
  tags?: ReactNode;
  /** Optional meta row (BlogMeta) rendered after the title/lead. */
  meta?: ReactNode;
  /**
   * "listing" (default) = 2rem bottom margin; "post" = 2.5rem (matches the
   * pre-extraction `.blog-article .article-header` spacing).
   */
  variant?: ArticleHeaderVariant;
  className?: string;
}

/**
 * Article page header (h1 + optional lead/tags/meta), matching the shared
 * `.article-header` visual. Used by the blog listing (lead) and the blog post
 * (tags + meta). The generic `.article-header`/`.article-lead` classes in
 * pages.css remain for the non-blog content pages.
 */
export default function ArticleHeader({
  title,
  lead,
  tags,
  meta,
  variant = "listing",
  className,
}: ArticleHeaderProps) {
  return (
    <header
      className={cn(
        "ui-article-header",
        variant === "post" ? "ui-article-header--post" : null,
        className,
      )}
    >
      {tags ? <div className="ui-blog-tags">{tags}</div> : null}
      <h1 className="ui-article-title">{title}</h1>
      {lead ? <p className="ui-article-lead">{lead}</p> : null}
      {meta ? <div className="ui-article-meta">{meta}</div> : null}
    </header>
  );
}
