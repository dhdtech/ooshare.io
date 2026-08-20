import { parseShareUrl } from "./shareurl";

/** Matches a link whose href is a valid ooshare share URL (has a master key). */
export function findShareLinks(root: ParentNode): HTMLAnchorElement[] {
  const out: HTMLAnchorElement[] = [];
  for (const a of Array.from(root.querySelectorAll("a[href]"))) {
    try {
      parseShareUrl(a.href);
      out.push(a as HTMLAnchorElement);
    } catch {
      /* not an ooshare share link */
    }
  }
  return out;
}
