import { Link } from "react-router-dom";

interface LogoProps {
  /** Rendered size in pixels (both width & height). Header ~30, footer ~24. */
  size?: number;
  /** Renders as a React Router <Link> to "/", or a plain <span> if false. */
  to?: boolean;
}

/**
 * ooshare brand mark: the fixed-indigo shield (stroke #6366f1) + "ooshare" wordmark.
 * The shield path is the lucide-shield glyph, stroke color never changes.
 * The Link/span exposes "ooshare" as its accessible name via visible text.
 */
export default function Logo({ size = 24, to = true }: LogoProps) {
  const shield = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="#6366f1"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" />
    </svg>
  );

  const brand = <span className="ui-logo-wordmark">ooshare</span>;

  if (to) {
    return (
      <Link to="/" className="ui-logo">
        {shield}
        {brand}
      </Link>
    );
  }

  return (
    <span className="ui-logo">
      {shield}
      {brand}
    </span>
  );
}
