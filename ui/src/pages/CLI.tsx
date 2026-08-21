import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Download, Github, ShieldCheck } from "lucide-react";
import useSEO from "../lib/useSEO";
import {
  PageHeader,
  TrustBadges,
  SegmentedControl,
  Card,
  CopyButton,
  SectionHeader,
  CtaBlock,
  Button,
} from "../components/ui";

const RELEASES_URL = "https://github.com/dhdtech/ooshare.io/releases";

/** Install commands are language-neutral — do NOT put them behind i18n keys. */
const INSTALL_COMMANDS: Record<string, string> = {
  macos: "brew tap dhdtech/ooshare && brew trust dhdtech/ooshare && brew install ooshare",
  apt: [
    "# 1. install the signing key",
    "sudo install -Dm644 <(curl -Ls https://dhdtech.github.io/packages-ooshare/apt/ooshare.gpg) /usr/share/keyrings/ooshare.gpg",
    "# 2. add the repo, then install",
    'echo "deb [signed-by=/usr/share/keyrings/ooshare.gpg] https://dhdtech.github.io/packages-ooshare/apt stable main" | sudo tee /etc/apt/sources.list.d/ooshare.list',
    "sudo apt update && sudo apt install ooshare",
  ].join("\n"),
  dnf: [
    "sudo tee /etc/yum.repos.d/ooshare.repo <<'EOF'",
    "[ooshare]",
    "name=ooshare",
    "baseurl=https://dhdtech.github.io/packages-ooshare/rpm",
    "enabled=1",
    "gpgcheck=1",
    "gpgkey=https://dhdtech.github.io/packages-ooshare/rpm/ooshare.gpg",
    "EOF",
    "sudo dnf install ooshare",
  ].join("\n"),
  winget: "winget install dhdtech.ooshare",
  scoop: [
    "scoop bucket add ooshare https://github.com/dhdtech/scoop-ooshare",
    "scoop install ooshare",
  ].join("\n"),
  binary: "sha256sum -c SHA256SUMS",
};

/** Try-it one-liners — language-neutral commands. */
const EXAMPLES = [
  'ooshare create --text "hello"',
  'ooshare view "https://ooshare.io/s/…"',
  'ooshare create --json --text "$SECRET" | jq -r .url',
];

/** GitHub Actions workflow snippet — language-neutral code, not i18n copy. */
const GHA_SNIPPET = [
  "- uses: dhdtech/ooshare-action@v1",
  "  id: share",
  "  with:",
  "    command: create",
  "    text: ${{ secrets.MY_SECRET }}   # always a GitHub secret, never a literal",
  "# → steps.share.outputs.url  (one-time link, TTL 24h, self-destructs on reveal)",
].join("\n");

const GHA_MARKETPLACE_URL = "https://github.com/marketplace/actions/ooshare-action";

const OS_TAB_VALUES = ["macos", "apt", "dnf", "winget", "scoop", "binary"] as const;
type OsTab = (typeof OS_TAB_VALUES)[number];

const CLI_SCHEMA = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "ooshare CLI",
  operatingSystem: "macOS, Linux, Windows",
  applicationCategory: "SecurityApplication",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  downloadUrl: RELEASES_URL,
});

export default function CLI() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<OsTab>("macos");

  useSEO({
    title: t("cliPage.metaTitle"),
    description: t("cliPage.metaDesc"),
    path: "/cli",
  });

  useEffect(() => {
    let script = document.querySelector("script[data-cli-schema]");
    if (!script) {
      script = document.createElement("script");
      script.setAttribute("type", "application/ld+json");
      script.setAttribute("data-cli-schema", "true");
      document.head.appendChild(script);
    }
    script.textContent = CLI_SCHEMA;
    return () => {
      script?.remove();
    };
  }, []);

  const osOptions = OS_TAB_VALUES.map((value) => ({
    value,
    label: t(`cliPage.install.tabs.${value}`),
  }));

  const exampleLabels = [
    t("cliPage.examples.create.label"),
    t("cliPage.examples.view.label"),
    t("cliPage.examples.ci.label"),
  ];

  return (
    <div className="cli-page">
      <PageHeader title={t("cliPage.hero.title")} subtitle={t("cliPage.hero.subtitle")} />

      <TrustBadges
        items={[
          t("cliPage.trust.encryption"),
          t("cliPage.trust.free"),
          t("cliPage.trust.platforms"),
        ]}
      />

      <section className="cli-section cli-install">
        <SectionHeader title={t("cliPage.install.title")} sub={t("cliPage.install.subtitle")} />

        <SegmentedControl
          options={osOptions}
          value={activeTab}
          onChange={setActiveTab}
          aria-label={t("cliPage.install.title")}
        />

        <Card className="cli-code-card">
          <pre className="cli-code">
            <code>{INSTALL_COMMANDS[activeTab]}</code>
          </pre>
          <div className="cli-code-footer">
            <CopyButton
              text={INSTALL_COMMANDS[activeTab]}
              copyLabel={t("create.copy")}
              copiedLabel={t("create.copied")}
              toastMessage={t("pages.components.toastCopied")}
            />
            {activeTab === "binary" ? (
              <a
                className="cli-download-link"
                href={RELEASES_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download size={14} aria-hidden="true" />
                {t("cliPage.install.downloadLink")}
              </a>
            ) : null}
          </div>
          <p className="cli-verify">
            {t("cliPage.install.verifyLabel")}{" "}
            <code>{t("cliPage.install.verifyCmd")}</code>
          </p>
        </Card>
      </section>

      <section className="cli-section cli-examples">
        <SectionHeader title={t("cliPage.examples.title")} sub={t("cliPage.examples.subtitle")} />

        <div className="cli-examples-list">
          {EXAMPLES.map((command, i) => (
            <Card key={command} className="cli-code-card">
              <p className="cli-label">{exampleLabels[i]}</p>
              <div className="cli-code-inline">
                <pre className="cli-code">
                  <code>{command}</code>
                </pre>
                <CopyButton
                  text={command}
                  copyLabel={t("create.copy")}
                  copiedLabel={t("create.copied")}
                  toastMessage={t("pages.components.toastCopied")}
                  variant="secondary"
                />
              </div>
            </Card>
          ))}
        </div>
      </section>

      <section className="cli-section cli-security">
        <SectionHeader title={t("cliPage.security.title")} />
        <Card className="cli-security-card">
          <ul className="cli-security-bullets">
            <li>{t("cliPage.security.1")}</li>
            <li>{t("cliPage.security.2")}</li>
            <li>{t("cliPage.security.3")}</li>
          </ul>
          <Button to="/security" variant="secondary" icon={<ShieldCheck size={16} />}>
            {t("cliPage.security.link")}
          </Button>
        </Card>
      </section>

      <section className="cli-section cli-gha">
        <SectionHeader title={t("cliPage.gha.title")} sub={t("cliPage.gha.subtitle")} />

        <Card className="cli-code-card">
          <p className="cli-label">{t("cliPage.gha.codeLabel")}</p>
          <pre className="cli-code">
            <code>{GHA_SNIPPET}</code>
          </pre>
          <div className="cli-code-footer">
            <CopyButton
              text={GHA_SNIPPET}
              copyLabel={t("create.copy")}
              copiedLabel={t("create.copied")}
              toastMessage={t("pages.components.toastCopied")}
              variant="secondary"
            />
            <Button
              href={GHA_MARKETPLACE_URL}
              target="_blank"
              rel="noopener noreferrer"
              variant="secondary"
              icon={<Github size={16} />}
            >
              {t("cliPage.gha.button")}
            </Button>
          </div>
        </Card>
      </section>

      <section className="cli-section">
        <CtaBlock text={t("cliPage.cta.title")}>
          <Button to="/">{t("cliPage.cta.button")}</Button>
        </CtaBlock>
      </section>
    </div>
  );
}
