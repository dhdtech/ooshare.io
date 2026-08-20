import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Lock, CheckCircle2, Plus, Clock } from "lucide-react";
import Card from "@ui/components/ui/Card";
import TextareaField from "@ui/components/ui/TextareaField";
import SegmentedControl from "@ui/components/ui/SegmentedControl";
import FileDropzone from "@ui/components/ui/FileDropzone";
import Button from "@ui/components/ui/Button";
import ErrorBanner from "@ui/components/ui/ErrorBanner";
import CopyButton from "@ui/components/ui/CopyButton";
import { createShare } from "../../src/lib/secret-service";

const TTL_OPTIONS = [
  { value: 1, label: "1h" },
  { value: 4, label: "4h" },
  { value: 12, label: "12h" },
  { value: 24, label: "24h" },
  { value: 48, label: "48h" },
  { value: 72, label: "72h" },
];

export default function CreateTab() {
  const { t } = useTranslation();
  const [secret, setSecret] = useState("");
  const [ttlHours, setTtlHours] = useState(24);
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [formKey, setFormKey] = useState(0);

  const canSubmit = !loading && (!!secret.trim() || !!file);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    setError("");
    try {
      const attachment = file
        ? { mime: file.type, data: await file.arrayBuffer() }
        : undefined;
      const res = await createShare({ text: secret, attachment, ttlHours });
      setLink(res.url);
      setSecret("");
      setFormKey((k) => k + 1);
      setFile(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (link) {
    return (
      <Card className="result">
        <p className="result-header"><CheckCircle2 size={16} /> {t("extension.createCreated")}</p>
        <p className="result-info">Anyone with this link can read the secret once.</p>
        <div className="link-box"><div className="link-display">{link}</div></div>
        <CopyButton text={link} copyLabel={t("extension.copy")} copiedLabel={t("extension.copied")} toastMessage={t("extension.toastCopied")} className="ui-btn--full" />
        <Button variant="secondary" full icon={<Plus size={16} />} onClick={() => { setLink(""); setFormKey((k) => k + 1); }}>
          {t("extension.createAnother")}
        </Button>
      </Card>
    );
  }

  return (
    <Card>
      <form onSubmit={handleSubmit}>
        <TextareaField
          id="secret-input"
          label={t("extension.createLabel")}
          icon={<Lock size={14} />}
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          placeholder={t("extension.createPlaceholder")}
          rows={5}
          maxLength={50000}
        />
        <FileDropzone
          key={formKey}
          labels={{
            label: "Attach a file",
            hint: "Image, PDF, or archive",
            limit: "up to 25 MB",
            activeLabel: "Drop to attach",
            invalidType: "Unsupported file type",
            tooLarge: "File exceeds 25 MB",
            removeLabel: "Remove",
            previewAlt: "Preview",
          }}
          onChange={setFile}
        />
        <div className="ttl-group">
          <span className="form-label"><Clock size={14} /> {t("extension.createExpires")}</span>
          <SegmentedControl options={TTL_OPTIONS} value={ttlHours} onChange={setTtlHours} aria-label={t("extension.createExpires")} />
        </div>
        {error ? <ErrorBanner>{error}</ErrorBanner> : null}
        <Button type="submit" variant="primary" full loading={loading} disabled={!canSubmit} icon={!loading ? <Lock size={16} /> : null}>
          {loading ? t("extension.createEncrypting") : t("extension.createSubmit")}
        </Button>
      </form>
    </Card>
  );
}
