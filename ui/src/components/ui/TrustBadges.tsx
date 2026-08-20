interface TrustBadgesProps {
  items: string[];
}

/** The quiet mono trust strip (AES-256-GCM · Zero-knowledge · One-time self-destruct). */
export default function TrustBadges({ items }: TrustBadgesProps) {
  return (
    <ul className="ui-trust-strip" aria-label="Security credentials">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
