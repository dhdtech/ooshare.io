interface Option<T extends string | number> {
  value: T;
  label: string;
}

interface SegmentedControlProps<T extends string | number> {
  /** Options rendered as a pill. */
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Accessible name for the option group. */
  "aria-label": string;
  className?: string;
}

/**
 * Generic pill segmented control for mutually exclusive options. Each segment
 * carries `aria-pressed` so the selected state is announced to assistive tech,
 * and the group is named so segments are read with their context.
 */
import { useId } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "../../lib/cn";

export default function SegmentedControl<T extends string | number>({
  options,
  value,
  onChange,
  "aria-label": ariaLabel,
}: SegmentedControlProps<T>) {
  const thumbId = `ui-segment-thumb-${useId()}`;
  const reduceMotion = useReducedMotion();

  return (
    <div className="ui-segmented" role="group" aria-label={ariaLabel}>
      {options.map((opt) => {
        const active = value === opt.value;
        return (
          <button
            key={String(opt.value)}
            type="button"
            className={cn("ui-segment", active && "ui-segment--active")}
            aria-pressed={active}
            aria-label={`${ariaLabel}: ${opt.label}`}
            onClick={() => onChange(opt.value)}
          >
            {active ? (
              <motion.span
                layoutId={thumbId}
                className="ui-segment-thumb"
                transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 400, damping: 30 }}
              />
            ) : null}
            <span className="ui-segment-label">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}
