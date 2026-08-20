import type { ReactNode } from "react";

interface BlogTagProps {
  children: ReactNode;
}

/**
 * Uppercase pill chip for blog post topics.
 *
 * Deliberately NOT a `Badge` variant: every Badge variant is a mono chip in
 * `chip-text` on `chip-bg`, whereas the blog tag is a sans-serif pill in
 * indigo (`--primary`) on `--primary-glow`. Forcing these onto Badge would
 * require overriding family/color/background/case/radius — a worse fit than a
 * dedicated component. Shared by the listing cards and the post header.
 */
export default function BlogTag({ children }: BlogTagProps) {
  return <span className="ui-blog-tag">{children}</span>;
}
