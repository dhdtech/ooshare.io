import { Plus } from "lucide-react";
import type { ReactNode } from "react";

interface AccordionProps {
  question: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
}

/**
 * Accessible disclosure made from a native <details>/<summary>: keyboard
 * open/close and screen-reader behavior are free. A plus chevron rotates to a
 * (visually) differently shaped glyph when open via the `[open]` CSS hook.
 */
export default function Accordion({ question, children, defaultOpen = false }: AccordionProps) {
  return (
    <details className="ui-accordion" open={defaultOpen}>
      <summary>
        {question}
        <Plus size={16} className="ui-accordion-chevron" aria-hidden="true" />
      </summary>
      <div className="ui-accordion-answer">
        <div className="ui-accordion-answer-inner">{children}</div>
      </div>
    </details>
  );
}

interface FaqItemProps {
  question: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
}

/** FAQ item alias of Accordion, kept for readability at call sites. */
export function FaqItem(props: FaqItemProps) {
  return <Accordion {...props} />;
}
