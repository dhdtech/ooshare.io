/**
 * Join class names, filtering falsy values. A tiny clsx-equivalent to keep
 * conditional classes readable without pulling in a dependency.
 */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}
