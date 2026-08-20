import type { ReactNode } from "react";

export interface StepContent {
  title: ReactNode;
  body: ReactNode;
  /** Optional mono tag (e.g. "encrypted locally"). */
  tag?: ReactNode;
}

interface StepProps extends StepContent {
  index: number;
}

/** A single step card with a zero-padded mono number (01, 02, …). */
export function Step({ index, title, body, tag }: StepProps) {
  return (
    <li className="ui-step">
      <span className="ui-step-num">{String(index).padStart(2, "0")}</span>
      <h3 className="ui-step-title">{title}</h3>
      <p className="ui-step-body">{body}</p>
      {tag ? <span className="ui-step-tag">{tag}</span> : null}
    </li>
  );
}

interface StepsListProps {
  steps: StepContent[];
}

/** Ordered numbered list of steps, rendered as grid cards. */
export default function StepsList({ steps }: StepsListProps) {
  return (
    <ol className="ui-steps-list">
      {steps.map((step, i) => (
        <Step key={i} index={i + 1} {...step} />
      ))}
    </ol>
  );
}
