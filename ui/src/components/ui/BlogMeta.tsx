import { Calendar, Clock } from "lucide-react";
import { cn } from "../../lib/cn";

export type BlogMetaSize = "sm" | "lg";

interface BlogMetaProps {
  /** ISO date string, formatted with the given locale. */
  date: string;
  /** BCP-47 locale used to format the date (e.g. "en", "zh-CN"). */
  locale: string;
  readingTime: number;
  /** Already-localised "min read" label (pages.blog.minRead). */
  minReadLabel: string;
  /** Optional author line rendered after the reading time (e.g. "By DHD Tech"). */
  author?: string;
  /** "By" label used only when `author` is present (pages.blog.by). */
  byLabel?: string;
  /** sm = listing cards, lg = post header (larger icons + font). */
  size?: BlogMetaSize;
  className?: string;
}

/**
 * Date + reading-time meta row (Calendar and Clock glyphs), optionally with an
 * author line. Used in the blog listing (sm) and the post header (lg).
 */
export default function BlogMeta({
  date,
  locale,
  readingTime,
  minReadLabel,
  author,
  byLabel,
  size = "sm",
  className,
}: BlogMetaProps) {
  const iconSize = size === "lg" ? 14 : 13;
  const formattedDate = new Date(date).toLocaleDateString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className={cn("ui-blog-meta", `ui-blog-meta--${size}`, className)}>
      <span>
        <Calendar size={iconSize} aria-hidden="true" />
        {formattedDate}
      </span>
      <span>
        <Clock size={iconSize} aria-hidden="true" />
        {readingTime} {minReadLabel}
      </span>
      {author ? (
        <span>
          {byLabel} {author}
        </span>
      ) : null}
    </div>
  );
}
