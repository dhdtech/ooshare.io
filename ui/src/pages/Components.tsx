import { useState } from "react";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import {
  Lock,
  Eye,
  Plus,
  Trash,
  Shield,
  KeyRound,
  Bell,
} from "lucide-react";
import useSEO from "../lib/useSEO";
import LanguageSelector from "../components/LanguageSelector";
import SecurityModal from "../components/SecurityModal";
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
  Card,
  useToast,
} from "../components/ui";

/** A single showcase section: anchor id, English title + note, mono props note, demo body. */
function ComponentDemo({
  id,
  title,
  note,
  props,
  children,
}: {
  id: string;
  title: string;
  note: string;
  props?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="comp-demo" aria-labelledby={`${id}-title`}>
      <h2 id={`${id}-title`} className="comp-name">{title}</h2>
      <p className="comp-note">{note}</p>
      <div className="comp-demo-body">{children}</div>
      {props ? <p className="props-note">{props}</p> : null}
    </section>
  );
}

/* TTL options for the SegmentedControl demo — must match CreateSecret's TTL values (1..72h). */
const TTL = [
  { value: 1, label: "1h" },
  { value: 4, label: "4h" },
  { value: 12, label: "12h" },
  { value: 24, label: "24h" },
  { value: 48, label: "48h" },
  { value: 72, label: "72h" },
];

/* TOC drives the sticky anchor chips. Every component in the inventory is listed. */
const TOC = [
  { id: "brand", label: "Brand" },
  { id: "actions", label: "Actions" },
  { id: "inputs", label: "Inputs" },
  { id: "feedback", label: "Feedback" },
  { id: "content", label: "Content" },
  { id: "blog", label: "Blog" },
  { id: "nav", label: "Nav & Footer" },
  { id: "shell", label: "Layout & Shell" },
];

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
  const [btnLoading, setBtnLoading] = useState(false);

  return (
    <div className="content-page comp-page">
      <PageHeader
        title={t("pages.components.title")}
        subtitle={t("pages.components.subtitle")}
      />

      <nav className="comp-toc" aria-label="Component list">
        {TOC.map((c) => (
          <a key={c.id} className="comp-toc-chip" href={`#${c.id}`}>
            {c.label}
          </a>
        ))}
      </nav>

      <div className="comp-page-list">
        {/* ── Brand ── */}
        <ComponentDemo
          id="brand"
          title="Logo · TrustBadges"
          note="Monochrome wordmark (size in px). TrustBadges is the mono chip strip: AES-256-GCM · Zero Knowledge · Auto-Delete."
          props="Logo: size · TrustBadges: items: { label, icon }[]"
        >
          <div className="comp-col">
            <div className="comp-row">
              <Logo size={30} />
              <Logo size={24} />
            </div>
            <TrustBadges
              items={[
                t("footer.encryption"),
                t("footer.zeroKnowledge"),
                t("footer.autoDelete"),
              ]}
            />
          </div>
        </ComponentDemo>

        {/* ── Actions ── */}
        <ComponentDemo
          id="actions"
          title="Button · IconButton · CopyButton"
          note="Button is the primary action. loading shows an inline spinner; to → router Link, href → external anchor. CopyButton writes to the clipboard and fires a toast."
          props="Button: variant: primary | secondary | success · size: default | sm · loading · disabled · icon · to | href · fullWidth · buttonClassName (export) · IconButton: icon · aria-label (required) · CopyButton: text · copyLabel · copiedLabel · toastMessage"
        >
          <div className="comp-row comp-wrap">
            <Button variant="primary" icon={<Lock size={16} />}>{t("create.submit")}</Button>
            <Button variant="secondary" icon={<Plus size={16} />}>Secondary</Button>
            <Button variant="success">Success</Button>
            <Button variant="primary" loading={btnLoading} onClick={() => { setBtnLoading(true); setTimeout(() => setBtnLoading(false), 800); }}>
              Toggle loading
            </Button>
            <Button variant="secondary" size="sm">Small</Button>
            <Button variant="primary" to="/security">Router link</Button>
            <Button variant="primary" href="https://ooshare.io" target="_blank" rel="noopener noreferrer">External link</Button>
            <IconButton icon={<Bell size={18} />} aria-label="Notifications" />
            <CopyButton
              text="https://ooshare.io/s/sample#key"
              copyLabel="Copy sample"
              copiedLabel="Copied"
              toastMessage={t("pages.components.toastCopied")}
            />
          </div>
        </ComponentDemo>

        {/* ── Inputs ── */}
        <ComponentDemo
          id="inputs"
          title="TextField · TextareaField · SegmentedControl · FileDropzone · Badge"
          note="Labeled fields (icon slot, charCount on the textarea), a single-select segmented control (TTL picker), and a drag-and-drop FileDropzone (clients validate type/size; 25 MB). Badge is a mono chip — color never alone."
          props="TextField: id · label · icon · placeholder · TextareaField: id · label · icon · placeholder · charCount · rows · SegmentedControl: options · value · onChange · aria-label · FileDropzone: labels · onChange · formatFileSize · ACCEPTED_TYPES · MAX_FILE_SIZE · isPdf · isArchive (exports) · Badge: variant: quiet | accent | tag · icon"
        >
          <div className="comp-col">
            <TextareaField
              id="comp-char"
              label={t("create.label")}
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
            <SegmentedControl
              options={TTL}
              value={ttl}
              onChange={setTtl}
              aria-label={t("create.expiresIn")}
            />
            <p className="comp-caption">Selected: {ttl}h</p>
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
            <div className="comp-row comp-wrap">
              <Badge variant="quiet" icon={<Trash size={12} />}>Auto-Delete</Badge>
              <Badge variant="accent">AES-256-GCM</Badge>
              <Badge variant="tag">atomic GETDEL</Badge>
            </div>
          </div>
        </ComponentDemo>

        {/* ── Feedback ── */}
        <ComponentDemo
          id="feedback"
          title="Toast · ErrorBanner · ErrorState · LoadingState · Modal · Accordion"
          note="Feedback surfaces. useToast().showToast(message, variant). Modal is a controlled dialog; Accordion is a FAQ item (defaultOpen controls expansion)."
          props="useToast: showToast(message: string, variant?: success | info | error) · ErrorBanner: children · ErrorState: title · message · actions · LoadingState: label · Modal: open · onClose · title · icon · Accordion: question · defaultOpen · children · FaqItem (export)"
        >
          <div className="comp-col">
            <div className="comp-row comp-wrap">
              <Button variant="secondary" onClick={() => showToast(t("pages.components.toastDemo"), "success")}>
                Fire a toast
              </Button>
              <Button variant="secondary" onClick={() => showToast("Something went wrong", "error")}>
                Error toast
              </Button>
              <Button variant="secondary" onClick={() => showToast("Heads up", "info")}>
                Info toast
              </Button>
            </div>
            <ErrorBanner>Something went wrong creating your secret.</ErrorBanner>
            <ErrorState title="Outage" message="The service is temporarily unavailable." />
            <LoadingState label={t("view.loading")} />
            <Button variant="secondary" onClick={() => setModalOpen(true)}>Open modal</Button>
            <Accordion question="What happens after one view?">
              <p>The secret is atomically deleted on first retrieval (GETDEL). It cannot be read again.</p>
            </Accordion>
            <Accordion question="Is the key ever sent to the server?" defaultOpen>
              <p>No. The decryption key lives only in the URL fragment, which browsers never send.</p>
            </Accordion>
          </div>
        </ComponentDemo>

        {/* ── Content ── */}
        <ComponentDemo
          id="content"
          title="Card · PageHeader · SectionHeader · StepsList · InfoCard · ProseSection · NumberedList · CompareTable · CtaBlock · ArticleHeader"
          note="Content building blocks: Card surface (radius 16, subtle shadow), centered PageHeader / SectionHeader, StepsList (How it works), InfoCard (Security), ProseSection / NumberedList for articles, CompareTable (Why OOShare), CtaBlock with an action. ArticleHeader is used above blog posts."
          props="Card: children · className · PageHeader: title · subtitle · SectionHeader: title · sub · StepsList: steps: { title, body, tag }[] + Step (export) · InfoCard: icon · title · tag · children | html · ProseSection: title · children · NumberedList: items: string[] (may contain HTML) · CompareTable: headers · highlightCol · rows · CtaBlock: text · children · ArticleHeader: title · lead · tags"
        >
          <div className="comp-grid">
            <Card><p className="comp-caption"><strong>Card</strong> — surface wrapper using the approved token (radius 16).</p></Card>
            <SectionHeader title="SectionHeader" sub="Centered h2 with an optional subtitle." />
            <StepsList
              steps={[
                { title: "Write", body: "Encrypted locally with AES-256-GCM.", tag: "encrypted locally" },
                { title: "Share", body: "The key lives only in the URL fragment.", tag: "key in fragment" },
                { title: "Gone", body: "Opens once, then self-destructs.", tag: "atomic GETDEL" },
              ]}
            />
            <div className="comp-grid-2">
              <InfoCard icon={<Lock size={19} />} title="Encrypted in your browser" tag="AES-256-GCM">
                Runs before your secret ever leaves the device.
              </InfoCard>
              <InfoCard icon={<Eye size={19} />} title="Zero knowledge" tag="server never sees it">
                Only encrypted bytes reach the server.
              </InfoCard>
            </div>
            <ProseSection title="Mission">
              <p>Runs before your secret ever leaves the device. Only encrypted bytes reach the server.</p>
              <p>Keys live in the <strong>URL fragment</strong>, which browsers never send.</p>
            </ProseSection>
            <NumberedList
              items={[
                "Open a link and <strong>enter a key</strong> locally.",
                "The secret is <code>decrypted</code> in your browser.",
                "It is <strong>deleted</strong> after one view.",
              ]}
            />
            <CompareTable
              headers={["Feature", "OOShare", "Other"]}
              highlightCol={1}
              rows={[
                { label: "Encryption", values: [{ value: "Yes", tone: "yes" }, { value: "Yes", tone: "yes" }] },
                { label: "Open source", values: [{ value: "Yes", tone: "yes" }, { value: "No", tone: "no" }] },
              ]}
            />
            <CtaBlock text="Have questions?">
              <Button href="https://github.com" target="_blank" rel="noopener noreferrer">
                Ask on GitHub
              </Button>
            </CtaBlock>
            <ArticleHeader title="Article header" lead="An optional lead line below the title." tags={<><BlogTag>Tag1</BlogTag><BlogTag>Tag2</BlogTag></>} />
          </div>
        </ComponentDemo>

        {/* ── Blog ── */}
        <ComponentDemo
          id="blog"
          title="BlogTag · BlogMeta · BlogCard · BlogContent · BlogCtaBox · BlogNav"
          note="Blog listing and post primitives. BlogCard drives the /blog grid; BlogContent is the prose wrapper for post bodies; BlogNav links prev/next."
          props="BlogTag: children · BlogMeta: date · locale · readingTime · minReadLabel · author · byLabel · size · BlogCard: slug · title · description · tags · date · readingTime · locale · minReadLabel · BlogContent: html · BlogCtaBox: title · description · buttonLabel · BlogNav: prev · next · prevLabel · nextLabel"
        >
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
            <BlogContent html={'<h2>Prose wrapper</h2><p><strong>bold</strong>, <code>code</code> and <a href="/">links</a> styled via <code>.ui-blog-content</code>.</p>'} />
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
          </div>
        </ComponentDemo>

        {/* ── Nav & Footer ── */}
        <ComponentDemo
          id="nav"
          title="NavLink · BackLink · FooterBadges · FooterNav · FooterLegal · ShareButtons"
          note="Navigation primitives and the footer. ShareButtons (with WhatsAppIcon export) is the sharing row on the created link. FooterBadgeIcons (export) is the Lock/Eye/Trash2 icon set."
          props="NavLink: to · children · BackLink: to · FooterBadges: badges: { label, icon }[] · FooterNav: links: { to, label }[] · FooterLegal: openSourceLabel · openSourceHref · poweredByLabel · poweredByHref · poweredByBrand · FooterBadgeIcons (export) · ShareButtons: link · copyLabel · copiedLabel · copyToast · whatsappLabel · whatsappHref · emailLabel · emailHref · WhatsAppIcon (export)"
        >
          <div className="comp-col">
            <div className="comp-row">
              <NavLink to="/security">Security</NavLink>
              <NavLink to="/faq">FAQ</NavLink>
            </div>
            <BackLink to="/">Back to home</BackLink>
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
          </div>
        </ComponentDemo>

        {/* ── Layout & Shell ── */}
        <ComponentDemo
          id="shell"
          title="Layout · LanguageSelector · SecurityModal"
          note="The top-level shell. Layout wraps every route (header nav + footer) and mounts the ToastProvider. LanguageSelector is the flag/code dropdown; SecurityModal is the 'How It Works' trigger that opens the security dialog."
          props="Layout: children (app shell — not rendered whole here to avoid recursion) · LanguageSelector: no props (self-contained) · SecurityModal: no props (self-contained)"
        >
          <div className="comp-col">
            <div className="ui-header-inner">
              <Logo size={30} />
              <div className="ui-header-actions">
                <nav className="ui-header-nav" aria-label="Primary">
                  <NavLink to="/cli">CLI</NavLink>
                  <NavLink to="/security">Security</NavLink>
                </nav>
                <LanguageSelector />
                <SecurityModal />
              </div>
            </div>
            <p className="comp-caption">Shell composition — LanguageSelector (globe code) + SecurityModal (help icon) render live above.</p>
          </div>
        </ComponentDemo>
      </div>

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
