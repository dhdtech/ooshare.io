import type { ReactNode } from "react";

type CellTone = "yes" | "no" | "partial";

export interface CompareTableCell {
  /** The cell content. */
  value: ReactNode;
  /** Color tone: positive / negative / partial (rendered as data-tone). */
  tone?: CellTone;
}

export interface CompareTableRow {
  /** Feature/label in the first (sticky-leading) column. */
  label: ReactNode;
  /** One cell per header, aligned with `headers`. */
  values: Array<ReactNode | CompareTableCell>;
}

interface CompareTableProps {
  /** Column headers; the first is the feature/row-label column. */
  headers: ReactNode[];
  /** Body rows. */
  rows: CompareTableRow[];
  /** 0-based index of the column to highlight (e.g. the product column). */
  highlightCol?: number;
}

function isCell(v: ReactNode | CompareTableCell): v is CompareTableCell {
  // A React element is a valid ReactNode but always carries `$$typeof`; a cell
  // descriptor is a plain object with a `value` key (tone optional). Distinguish
  // the two so only descriptors get unwrapped.
  return (
    typeof v === "object" &&
    v !== null &&
    "value" in v &&
    !("$$typeof" in v)
  );
}

/**
 * Generalized comparison table (port of the WhyOOShare `.compare-table`).
 * Wraps in a horizontally-scrolling container so the table never breaks a
 * narrow layout; on mobile it scrolls inside its own box instead of widening
 * the page. Rows align with `headers`; a single column can be highlighted.
 */
export default function CompareTable({
  headers,
  rows,
  highlightCol,
}: CompareTableProps) {
  return (
    <div className="ui-compare-wrap">
      <table className="ui-compare-table">
        <thead>
          <tr>
            {headers.map((header, i) => (
              <th
                key={i}
                className={i === highlightCol ? "ui-compare--hl" : undefined}
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr key={ri}>
              <td className="ui-compare-label">{row.label}</td>
              {row.values.map((cell, ci) => {
                const colIndex = ci + 1; // +1 for the leading label column
                const tone = isCell(cell) ? cell.tone : undefined;
                const content = isCell(cell) ? cell.value : cell;
                return (
                  <td
                    key={ci}
                    data-tone={tone}
                    className={colIndex === highlightCol ? "ui-compare--hl" : undefined}
                  >
                    {content}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
