import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Lock,
  Plus,
  Bell,
  Shield,
  Trash,
  Eye,
  KeyRound,
} from "lucide-react";
import useSEO from "../lib/useSEO";
import {
  Logo,
  Button,
  IconButton,
  TextareaField,
  TextField,
  SegmentedControl,
  FileDropzone,
  Badge,
  PageHeader,
  SectionHeader,
  StepsList,
  InfoCard,
  TrustBadges,
  CopyButton,
  Modal,
  Accordion,
  ErrorBanner,
  ErrorState,
  LoadingState,
  NavLink,
  BackLink,
  ArticleHeader,
  ProseSection,
  NumberedList,
  CompareTable,
  CtaBlock,
  BlogTag,
  BlogMeta,
  BlogCard,
  BlogContent,
  BlogCtaBox,
  BlogNav,
  FooterBadges,
  FooterNav,
  FooterLegal,
  ShareButtons,
  useToast,
} from "../components/ui";

const TTL = [
  { value: 1, label: "1h" },
  { value: 4, label: "4h" },
  { value: 12, label: "12h" },
  { value: 24, label: "24h" },
  { value: 48, label: "48h" },
  { value: 72, label: "72h" },
];

function Section({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <section className="comp-section" aria-labelledby={title}>
      <SectionHeader
        title={<span id={title}>{title}</span>}
        sub={sub}
      />
      <div className="comp-grid">{children}</div>
    </section>
  );
}

export default function Components() {
  const { t } = useTranslation();
  const { showToast } = useToast();

  useSEO({
    title: t("pages.components.metaTitle"),
    description: t("pages.components.metaDesc"),
    path: "/components",
    noindex: true,
  });

  const [ttl, setTtl] = useState<number>(24);
  const [files, setFiles] = useState<File | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="content-page comp-page">
      <PageHeader
        title={t("pages.components.title")}
        subtitle={t("pages.components.subtitle")}
      />

      <TrustBadges
        items={[
          t("footer.encryption"),
          t("footer.zeroKnowledge"),
          t("footer.autoDelete"),
        ]}
      />

      <Section title="comp-brand" sub="Logo — header 30, footer 24">
        <div className="comp-row">
          <Logo size={30} />
          <Logo size={24} />
        </div>
      </Section>

      <Section title="comp-buttons" sub={t("pages.components.sectionButtons")}>
        <div className="comp-row comp-wrap">
          <Button variant="primary" icon={<Lock size={16} />}>{t("create.submit")}</Button>
          <Button variant="secondary" icon={<Plus size={16} />}>Secondary</Button>
          <Button variant="success">Success</Button>
          <Button variant="primary" loading>Encrypting…</Button>
          <Button variant="secondary" size="sm">Small</Button>
          <Button variant="primary" to="/security">As router link</Button>
          <Button variant="primary" href="https://ooshare.io" target="_blank" rel="noopener noreferrer">As external link</Button>
          <IconButton icon={<Bell size={18} />} aria-label="Notifications" />
        </div>
      </Section>

      <Section title="comp-inputs" sub={t("pages.components.sectionInputs")}>
        <div className="comp-col">
          <TextareaField
            id="comp-char"
            label={<>{t("create.label")}</>}
            icon={<Lock size={14} />}
            placeholder={t("create.placeholder")}
            charCount={t("create.charCount", { count: 42 })}
            rows={3}
          />
          <TextField
            id="comp-text"
            label="Email (optional icon)"
            icon={<KeyRound size={14} />}
            placeholder="you@example.com"
          />
        </div>
      </Section>

      <Section title="comp-segmented" sub={t("pages.components.sectionSegmented")}>
        <SegmentedControl
          options={TTL}
          value={ttl}
          onChange={setTtl}
          aria-label={t("create.expiresIn")}
        />
        <p className="comp-caption">Selected: {ttl}h</p>
      </Section>

      <Section title="comp-file" sub={t("pages.components.sectionFile")}>
        <FileDropzone
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
          onChange={setFiles}
        />
        <p className="comp-caption">
          {files ? `Attached: ${files.name} (${files.size} bytes)` : "No file attached"}
        </p>
      </Section>

      <Section title="comp-badges" sub={t("pages.components.sectionBadges")}>
        <div className="comp-row comp-wrap">
          <Badge variant="quiet" icon={<Trash size={12} />}>Auto-Delete</Badge>
          <Badge variant="accent">AES-256-GCM</Badge>
          <Badge variant="tag">atomic GETDEL</Badge>
        </div>
      </Section>

      <Section title="comp-blog" sub="Blog listing & post primitives">
        <div className="comp-col">
          <div className="comp-row comp-wrap">
            <BlogTag>Security</BlogTag>
            <BlogTag>Encryption</BlogTag>
            <BlogTag>Zero-Knowledge</BlogTag>
          </div>
          <BlogMeta
            date="2025-06-05"
            locale="en"
            readingTime={5}
            minReadLabel="min read"
            author="DHD Tech"
            byLabel="By"
            size="lg"
          />
        </div>
        <BlogCard
          slug="why-email-is-not-safe-for-passwords"
          title="Why Email Is Not Safe for Sharing Passwords"
          description="Email was never designed for secure data transfer. Learn what to use instead."
          tags={["security", "passwords", "email"]}
          date="2024-11-15"
          readingTime={6}
          locale="en"
          minReadLabel="min read"
        />
        <BlogContent html={'<h2>Prose wrapper</h2><p>Headings, <strong>bold</strong>, <code>code</code> and <a href="/">links</a> styled via <code>.ui-blog-content</code>.</p>'} />
        <BlogCtaBox
          title="Share secrets securely — for free"
          description="AES-256-GCM encryption with zero-knowledge architecture."
          buttonLabel="Try Only Once Share"
        />
        <BlogNav
          prev={{ slug: "older-post", title: "Older Post" }}
          next={{ slug: "newer-post", title: "Newer Post" }}
          prevLabel="Previous"
          nextLabel="Next"
        />
        <ArticleHeader title="Article header" lead="An optional lead line below the title." tags={<><BlogTag>Tag1</BlogTag><BlogTag>Tag2</BlogTag></>} />
      </Section>

      <Section title="comp-copy" sub={t("pages.components.sectionCopy")}>
        <div className="comp-col">
          <CopyButton
            text={t("pages.components.copySample")}
            copyLabel="Copy sample"
            copiedLabel="Copied"
            toastMessage={t("pages.components.toastCopied")}
          />
          <Button variant="secondary" onClick={() => showToast(t("pages.components.toastDemo"), "success")}>
            Fire a toast
          </Button>
        </div>
      </Section>

      <Section title="comp-modal" sub={t("pages.components.sectionModal")}>
        <Button variant="secondary" onClick={() => setModalOpen(true)}>
          Open modal
        </Button>
      </Section>

      <Section title="comp-accordion" sub={t("pages.components.sectionAccordion")}>
        <Accordion question="What happens after one view?">
          <p>The secret is atomically deleted on first retrieval (GETDEL). It cannot be read again.</p>
        </Accordion>
        <Accordion question="Is the key ever sent to the server?" defaultOpen>
          <p>No. The decryption key lives only in the URL fragment, which browsers never send to servers.</p>
        </Accordion>
      </Section>

      <Section title="comp-steps" sub={t("pages.components.sectionSteps")}>
        <StepsList
          steps={[
            { title: "Write", body: "Encrypted locally with AES-256-GCM.", tag: "encrypted locally" },
            { title: "Share", body: "The key lives only in the URL fragment.", tag: "key in fragment" },
            { title: "Gone", body: "Opens once, then self-destructs.", tag: "atomic GETDEL" },
          ]}
        />
      </Section>

      <Section title="comp-prose" sub="Left-aligned article section (Security/About/Why).">
        <ProseSection title="Mission">
          <p>Runs before your secret ever leaves the device. Only encrypted bytes reach the server.</p>
          <p>Keys live in the <strong>URL fragment</strong>, which browsers never send.</p>
        </ProseSection>
      </Section>

      <Section title="comp-numbered" sub="Ordered list of bare HTML steps (Security flow).">
        <NumberedList
          items={[
            "Open a link and <strong>enter a key</strong> locally.",
            "The secret is <code>decrypted</code> in your browser.",
            "It is <strong>deleted</strong> after one view.",
          ]}
        />
      </Section>

      <Section title="comp-compare" sub="Generalized comparison table (WhyOOShare).">
        <CompareTable
          headers={["Feature", "OOShare", "Other"]}
          highlightCol={1}
          rows={[
            { label: "Encryption", values: [{ value: "Yes", tone: "yes" }, { value: "Yes", tone: "yes" }] },
            { label: "Open source", values: [{ value: "Yes", tone: "yes" }, { value: "No", tone: "no" }] },
            { label: "Account needed", values: [{ value: "No", tone: "yes" }, { value: "Optional", tone: "partial" }] },
          ]}
        />
      </Section>

      <Section title="comp-cta" sub="Centered call-to-action block.">
        <CtaBlock text="Have questions?">
          <Button href="https://github.com" target="_blank" rel="noopener noreferrer">
            Ask on GitHub
          </Button>
        </CtaBlock>
      </Section>

      <Section title="comp-security" sub={t("pages.components.sectionSecurity")}>
        <div className="comp-grid-2">
          <InfoCard icon={<Lock size={19} />} title="Encrypted in your browser" tag="AES-256-GCM">
            Runs before your secret ever leaves the device.
          </InfoCard>
          <InfoCard
            icon={<Eye size={19} />}
            title="Zero knowledge"
            tag="server never sees it"
            html="Only <strong>encrypted bytes</strong> reach the server."
          >
            Plain children are ignored when html is set.
          </InfoCard>
        </div>
      </Section>

      <Section title="comp-states" sub={t("pages.components.sectionStates")}>
        <ErrorBanner>Something went wrong creating your secret.</ErrorBanner>
        <ErrorState title="Outage" message="The service is temporarily unavailable." />
        <LoadingState label={t("view.loading")} />
      </Section>

      <Section title="comp-nav" sub={t("pages.components.sectionNav")}>
        <div className="comp-col">
          <div className="comp-row">
            <NavLink to="/security">Security</NavLink>
            <NavLink to="/faq">FAQ</NavLink>
          </div>
          <BackLink to="/">Back to home</BackLink>
        </div>
      </Section>

      <Section title="comp-footer" sub={t("pages.components.sectionFooter")}>
        <div className="comp-col">
          <FooterBadges
            badges={[
              { label: t("footer.encryption"), icon: <Lock size={12} /> },
              { label: t("footer.zeroKnowledge"), icon: <Eye size={12} /> },
              { label: t("footer.autoDelete"), icon: <Trash size={12} /> },
            ]}
          />
          <FooterNav
            links={[
              { to: "/security", label: "Security" },
              { to: "/about", label: "About" },
              { to: "/why", label: "Why OOShare?" },
            ]}
          />
          <FooterLegal
            openSourceLabel="Open Source"
            openSourceHref="https://github.com/dhdtech/oos"
            poweredByLabel="Powered by"
            poweredByHref="https://dhdtech.io"
            poweredByBrand="DHDTech.io"
          />
        </div>
      </Section>

      <Section title="comp-share" sub={t("pages.components.sectionShare")}>
        <ShareButtons
          link="https://ooshare.io/s/Ab3xYz9Qk1?lng=en#mockkey"
          copyLabel={t("create.copy")}
          copiedLabel={t("create.copied")}
          copyToast={t("pages.components.toastCopied")}
          whatsappLabel={t("create.whatsapp")}
          whatsappHref="https://wa.me/?text=Hi"
          emailLabel={t("create.email")}
          emailHref="mailto:?subject=secret"
        />
      </Section>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={t("pages.components.title")}
        icon={<Shield size={18} />}
      >
        <p>This shared Modal component is used by SecurityModal and surfaces in the showcase.</p>
      </Modal>
    </div>
  );
}
