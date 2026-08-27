import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Lock, Eye, Trash2 } from "lucide-react";
import { useLocation } from "react-router-dom";
import SecurityModal from "./SecurityModal";
import LanguageSelector from "./LanguageSelector";
import {
  Logo,
  NavLink,
  ToastProvider,
  FooterBadges,
  FooterNav,
  FooterLegal,
  CompanyBar,
} from "./ui";

const GLOBAL_SCHEMA = JSON.stringify([
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Only Once Share",
    url: "https://ooshare.io",
    description:
      "Password protected photo, document, archive, and secret sharing with one-time self-destructing links. Share passwords, images, PDFs, ZIP archives, and sensitive information securely. End-to-end AES-256 encryption with zero-knowledge architecture. Free and open source.",
    applicationCategory: "SecurityApplication",
    operatingSystem: "Any",
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    creator: {
      "@type": "Organization",
      name: "DHD Tech",
      url: "https://dhdtech.com",
    },
    featureList: [
      "End-to-end AES-256-GCM encryption",
      "Zero-knowledge architecture",
      "Password protected photo sharing (JPEG, PNG, GIF, WebP up to 25 MB)",
      "Encrypted PDF and document sharing (up to 25 MB)",
      "Encrypted archive sharing (ZIP, RAR, 7Z, TAR.GZ up to 25 MB)",
      "Single-use self-destructing links",
      "Text, image, PDF, and archive secrets in one link",
      "No account required",
      "Open source",
      "6-language support",
      "Self-hosting with Docker",
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "DHD Tech",
    url: "https://dhdtech.com",
    logo: "https://ooshare.io/favicon.svg",
    sameAs: ["https://github.com/dhdtech"],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Only Once Share",
    url: "https://ooshare.io",
    description:
      "Free, open-source, end-to-end encrypted secret, image, document, and archive sharing tool. Password protected photo and file sharing.",
    publisher: { "@type": "Organization", name: "DHD Tech" },
  },
]);

function LayoutContent({ children }: { children: React.ReactNode }) {
  const { t, i18n } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="layout">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: GLOBAL_SCHEMA }}
      />
      <header className="layout-header">
        <div className="ui-header-inner">
          <Logo size={30} />
          <div className="ui-header-actions">
            <nav className="ui-header-nav" aria-label="Primary">
              <NavLink to="/cli">{t("nav.cli")}</NavLink>
              <NavLink to="/security">{t("nav.security")}</NavLink>
              <NavLink to="/blog">{t("nav.blog")}</NavLink>
              <NavLink to="/faq">{t("nav.faq")}</NavLink>
            </nav>
            <LanguageSelector />
            <SecurityModal />
          </div>
        </div>
      </header>

      <main className="layout-main">
        <div className="layout-content">{children}</div>
      </main>

      <footer className="layout-footer">
        <div className="ui-footer-inner">
          <FooterBadges
            badges={[
              { label: t("footer.encryption"), icon: <Lock size={12} /> },
              { label: t("footer.zeroKnowledge"), icon: <Eye size={12} /> },
              { label: t("footer.autoDelete"), icon: <Trash2 size={12} /> },
            ]}
          />
          <FooterNav
            links={[
              { to: "/security", label: t("nav.security") },
              { to: "/cli", label: t("footer.cli") },
              { to: "/blog", label: t("nav.blog") },
              { to: "/faq", label: t("nav.faq") },
              { to: "/about", label: t("nav.about") },
              { to: "/why", label: t("nav.why") },
            ]}
          />
          <FooterLegal
            openSourceLabel={t("footer.openSource")}
            openSourceHref="https://github.com/dhdtech/oos"
          />
        </div>
      </footer>
      <CompanyBar />
    </div>
  );
}

/**
 * App shell: header logo + nav + language + security modal, main content,
 * footer. Wraps children in a ToastProvider so shared copy toasts surface
 * anywhere in the tree.
 */
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <LayoutContent>{children}</LayoutContent>
    </ToastProvider>
  );
}
