import type { ReactNode } from "react";
import Button from "./Button";

interface BlogCtaBoxProps {
  title: ReactNode;
  description: ReactNode;
  /** Primary button label linking to "/". */
  buttonLabel: ReactNode;
}

/** Centered CTA banner (deep indigo glow) with a primary router-linking button. */
export default function BlogCtaBox({ title, description, buttonLabel }: BlogCtaBoxProps) {
  return (
    <div className="ui-blog-cta">
      <h3 className="ui-blog-cta-title">{title}</h3>
      <p className="ui-blog-cta-desc">{description}</p>
      <Button variant="primary" to="/">
        {buttonLabel}
      </Button>
    </div>
  );
}
