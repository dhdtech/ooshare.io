interface NumberedListProps {
  /** Bare HTML step strings (trusted i18n content) rendered inside each li. */
  items: string[];
}

/**
 * Ordered list of HTML steps using the mono `ui-step-num` aesthetics (01, 02,
 * …) as list markers. Used by the Security flow. Items are trusted i18n
 * strings rendered via dangerouslySetInnerHTML; do NOT pass raw user input.
 */
export default function NumberedList({ items }: NumberedListProps) {
  return (
    <ol className="ui-numbered-list">
      {items.map((item, i) => (
        <li
          key={i}
          className="ui-numbered-list-item"
          dangerouslySetInnerHTML={{ __html: item }}
        />
      ))}
    </ol>
  );
}
