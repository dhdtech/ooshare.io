import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Lock,
  Clock,
  CheckCircle2,
  Plus,
  ArrowRight,
  Terminal,
} from "lucide-react";
import { Link } from "react-router-dom";
import { generateKey, exportKey, encrypt, encodePayload } from "../lib/crypto";
import { createSecret } from "../lib/api";
import posthog from "../lib/posthog";
import { trackSecretCreated, trackSecretFailed } from "../lib/metaPixel";
import useSEO from "../lib/useSEO";
import {
  PageHeader,
  Card,
  TextareaField,
  SegmentedControl,
  FileDropzone,
  Button,
  TrustBadges,
  ShareButtons,
  ErrorBanner,
  SectionHeader,
  CtaBlock,
  isPdf,
  isArchive,
} from "../components/ui";

const TTL_OPTIONS = [
  { value: 1, label: "1h" },
  { value: 4, label: "4h" },
  { value: 12, label: "12h" },
  { value: 24, label: "24h" },
  { value: 48, label: "48h" },
  { value: 72, label: "72h" },
];

export default function CreateSecret() {
  const { t, i18n } = useTranslation();

  useSEO({
    title: t("meta.title"),
    description: t("meta.description"),
    path: "/",
  });

  const [secret, setSecret] = useState("");
  const [ttlHours, setTtlHours] = useState(24);
  const [link, setLink] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [formKey, setFormKey] = useState(0);

  function handleFileChange(file: File | null) {
    setAttachedFile(file);
  }

  function whatsappUrl() {
    const text = t("create.whatsappMsg", { link });
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  }

  function mailtoUrl() {
    const subject = t("create.emailSubject");
    const body = t("create.emailBody", { link });
    return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!secret.trim() && !attachedFile) return;

    setLoading(true);
    setError("");
    setLink("");

    try {
      let fileAttachment: { mime: string; data: ArrayBuffer } | undefined;
      if (attachedFile) {
        fileAttachment = {
          mime: attachedFile.type,
          data: await attachedFile.arrayBuffer(),
        };
      }

      const id = "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
        (+c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (+c / 4)))).toString(16),
      );
      const key = await generateKey();
      const payload = encodePayload(secret, fileAttachment);
      const ciphertext = await encrypt(payload, key, id);
      const result = await createSecret(ciphertext, ttlHours, id);
      const keyStr = await exportKey(key);
      const pathId = result.alias ?? result.id;
      setLink(`${window.location.origin}/s/${pathId}?lng=${i18n.language}#${keyStr}`);
      posthog.capture("secret_created", {
        ttl_hours: ttlHours,
        has_attachment: !!attachedFile,
        attachment_type: attachedFile ? (isPdf(attachedFile) ? "pdf" : isArchive(attachedFile) ? "archive" : "image") : null,
      });
      trackSecretCreated({
        ttl_hours: ttlHours,
        has_attachment: !!attachedFile,
        attachment_type: attachedFile ? (isPdf(attachedFile) ? "pdf" : isArchive(attachedFile) ? "archive" : "image") : null,
      });
      setSecret("");
      setFormKey((k) => k + 1); // reset dropzone + attached file
      setAttachedFile(null);
    } catch (err) {
      posthog.capture("secret_create_failed");
      trackSecretFailed();
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setLink("");
    setFormKey((k) => k + 1);
    setAttachedFile(null);
  }

  return (
    <div className="create-flow">
      <PageHeader title={t("hero.title")} subtitle={t("hero.subtitle")} />

      <p className="hero-badges">{t("hero.badges")}</p>

      <div className="create-wrap">
        <Card>
          {!link ? (
            <form className="form" onSubmit={handleSubmit}>
              <TextareaField
                id="secret-input"
                label={t("create.label")}
                icon={<Lock size={14} />}
                charCount={t("create.charCount", { count: secret.length })}
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                placeholder={t("create.placeholder")}
                rows={5}
                maxLength={50000}
              />

              <FileDropzone
                key={formKey}
                labels={{
                  label: t("create.dropzone.label"),
                  hint: t("create.dropzone.hint"),
                  limit: t("create.dropzone.sizeLimit"),
                  activeLabel: t("create.dropzone.dragActive"),
                  invalidType: t("create.file.invalidType"),
                  tooLarge: t("create.file.tooLarge"),
                  removeLabel: t("create.file.remove"),
                  previewAlt: t("create.file.preview"),
                }}
                onChange={handleFileChange}
              />

              <div className="ttl-group">
                <span className="form-label">
                  <Clock size={14} />
                  {t("create.expiresIn")}
                </span>
                <SegmentedControl
                  options={TTL_OPTIONS}
                  value={ttlHours}
                  onChange={setTtlHours}
                  aria-label={t("create.expiresIn")}
                />
              </div>

              {error ? <ErrorBanner>{error}</ErrorBanner> : null}

              <Button
                type="submit"
                variant="primary"
                full
                loading={loading}
                disabled={loading || (!secret.trim() && !attachedFile)}
                icon={!loading ? <Lock size={16} /> : null}
              >
                {loading ? t("create.encrypting") : t("create.submit")}
              </Button>
            </form>
          ) : (
            <div className="result">
              <div className="result-header">
                <CheckCircle2 size={18} aria-hidden="true" />
                <span>{t("create.linkCreated")}</span>
              </div>

              <p className="result-info">{t("create.linkInfo")}</p>

              <div className="link-box">
                <div className="link-display">{link}</div>
              </div>

              <p className="share-label">{t("create.shareVia")}</p>
              <ShareButtons
                link={link}
                copyLabel={t("create.copy")}
                copiedLabel={t("create.copied")}
                copyToast={t("create.copiedToast")}
                whatsappLabel={t("create.whatsapp")}
                whatsappHref={whatsappUrl()}
                emailLabel={t("create.email")}
                emailHref={mailtoUrl()}
                onCopy={() => posthog.capture("secret_link_copied")}
              />

              <Button variant="secondary" full icon={<Plus size={16} />} onClick={handleReset}>
                {t("create.createAnother")}
              </Button>

              <div className="cli-callout">
                <p className="cli-callout-text">{t("create.cliCallout.text")}</p>
                <Link className="cli-callout-link" to="/cli">
                  <Terminal size={14} aria-hidden="true" />
                  {t("create.cliCallout.link")}
                </Link>
              </div>
            </div>
          )}
        </Card>

        <TrustBadges
          items={[
            t("footer.encryption"),
            t("footer.zeroKnowledge"),
            t("footer.autoDelete"),
          ]}
        />
        <p className="security-line">{t("hero.securityLine")}</p>
      </div>

      <section className="cli-section" aria-label={t("create.cliSection.header")}>
        <SectionHeader title={t("create.cliSection.header")} sub={t("create.cliSection.body")} />
        <CtaBlock>
          <Button to="/cli" icon={<Terminal size={16} />}>
            {t("create.cliSection.cta")}
          </Button>
        </CtaBlock>
      </section>

      <div className="why-cta-banner">
        <Link to="/why" className="why-cta-link">
          <span>{t("whySection.ctaBanner")}</span>
          <ArrowRight size={16} aria-hidden="true" />
        </Link>
        <p className="why-cta-sub">{t("whySection.ctaSub")}</p>
      </div>
    </div>
  );
}
