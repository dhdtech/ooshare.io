import { Link } from "react-router-dom";

export interface BlogNavItem {
  slug: string;
  title: string;
}

interface BlogNavProps {
  prev?: BlogNavItem;
  next?: BlogNavItem;
  /** Already-localised "Previous" label. */
  prevLabel: string;
  /** Already-localised "Next" label. */
  nextLabel: string;
}

/**
 * Prev/next post navigation grid. `prev` is the older post (column 1), `next`
 * the newer post (column 2), matching the pre-extraction layout. Renders only
 * the sides that exist.
 */
export default function BlogNav({ prev, next, prevLabel, nextLabel }: BlogNavProps) {
  return (
    <nav className="ui-blog-nav" aria-label="Blog navigation">
      {prev ? (
        <Link to={`/blog/${prev.slug}`} className="ui-blog-nav-link ui-blog-nav-prev">
          <small>{prevLabel}</small>
          <span>{prev.title}</span>
        </Link>
      ) : null}
      {next ? (
        <Link to={`/blog/${next.slug}`} className="ui-blog-nav-link ui-blog-nav-next">
          <small>{nextLabel}</small>
          <span>{next.title}</span>
        </Link>
      ) : null}
    </nav>
  );
}
