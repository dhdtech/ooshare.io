import { useState } from "react";
import Card from "@ui/components/ui/Card";
import Button from "@ui/components/ui/Button";
import ErrorBanner from "@ui/components/ui/ErrorBanner";
import { LoadingState } from "@ui/components/ui/State";
import { revealShare } from "../../src/lib/secret-service";

export default function RevealTab() {
  const [url, setUrl] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleReveal() {
    if (!url.trim() || loading) return;
    setLoading(true);
    setError("");
    setResult("");
    try {
      const res = await revealShare(url.trim());
      setResult(res.text);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reveal");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <textarea
        className="ui-field-control"
        rows={4}
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="Paste an ooshare share URL…"
      />
      <Button variant="primary" full loading={loading} disabled={!url.trim()} onClick={handleReveal}>
        Reveal secret
      </Button>
      {loading && <LoadingState label="Decrypting…" />}
      {result && <div className="secret-content" style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{result}</div>}
      {error ? <ErrorBanner>{error}</ErrorBanner> : null}
    </Card>
  );
}
