import { Link } from "react-router-dom";
import BlogTag from "./BlogTag";
import BlogMeta from "./BlogMeta";

interface BlogCardProps {
  slug: string;
  title: string;
  description: string;
  tags: string[];
  date: string;
  readingTime: number;
  locale: string;
  /** Already-localised "min read" label. */
  minReadLabel: string;
}

/**
 * Clickable blog listing card: a router `Link` to `/blog/:slug` containing
 * up to 3 topic tags, the title, the excerpt, and the sm meta row.
 */
export default function BlogCard({
  slug,
  title,
  description,
  tags,
  date,
  readingTime,
  locale,
  minReadLabel,
}: BlogCardProps) {
  return (
    <Link to={`/blog/${slug}`} className="ui-blog-card">
      <div className="ui-blog-card-body">
        <div className="ui-blog-tags" aria-label="Topics">
          {tags.slice(0, 3).map((tag) => (
            <BlogTag key={tag}>{tag}</BlogTag>
          ))}
        </div>
        <h2 className="ui-blog-card-title">{title}</h2>
        <p className="ui-blog-card-excerpt">{description}</p>
        <BlogMeta
          date={date}
          locale={locale}
          readingTime={readingTime}
          minReadLabel={minReadLabel}
          size="sm"
          className="ui-blog-card-meta"
        />
      </div>
    </Link>
  );
}
