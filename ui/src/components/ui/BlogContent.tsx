interface BlogContentProps {
  /** Raw HTML prose rendered verbatim (blog body). */
  html: string;
}

/**
 * Prose wrapper around `dangerouslySetInnerHTML`. The HTML is trusted blog
 * content generated in-repo (see src/content/blog-posts.ts) — it is never
 * user-supplied, so it is rendered directly without sanitisation. All element
 * styles (headings, lists, links, code/pre, table, blockquote) live under
 * `.ui-blog-content` in ui.css.
 */
export default function BlogContent({ html }: BlogContentProps) {
  return <div className="ui-blog-content" dangerouslySetInnerHTML={{ __html: html }} />;
}
