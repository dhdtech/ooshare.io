import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Shield, ImagePlus, Infinity, Github, Lock } from "lucide-react";
import {
  ArticleHeader,
  InfoCard,
  ProseSection,
  CompareTable,
  CtaBlock,
  Button,
  BackLink,
} from "../components/ui";
import useSEO from "../lib/useSEO";

const PRODUCT_COLUMNS = ["OOShare", "OneTimeSecret", "Privnote", "Scrt.link", "Password.link"];

export default function WhyOOShare() {
  const { t } = useTranslation();

  useSEO({
    title: t("pages.why.metaTitle"),
    description: t("pages.why.metaDesc"),
    path: "/why",
  });

  const rows = [
    {
      label: t("pages.why.e2e"),
      values: ["Yes", "No", "No", "Yes", "Yes"],
    },
    {
      label: t("pages.why.imageSharing"),
      values: ["Yes", "No", "No", "No", "No"],
    },
    {
      label: t("pages.why.free"),
      values: [
        { value: "Yes", tone: "yes" as const },
        { value: "Limited", tone: "partial" as const },
        { value: "Yes", tone: "yes" as const },
        { value: "Limited", tone: "partial" as const },
        { value: "Limited", tone: "partial" as const },
      ],
    },
    {
      label: t("pages.why.openSource"),
      values: [
        { value: "Yes", tone: "yes" as const },
        { value: "Yes", tone: "yes" as const },
        "No",
        "No",
        "No",
      ],
    },
    {
      label: t("pages.why.noAccount"),
      values: [
        { value: "Yes", tone: "yes" as const },
        { value: "Optional", tone: "partial" as const },
        { value: "Yes", tone: "yes" as const },
        { value: "Yes", tone: "yes" as const },
        { value: "Yes", tone: "yes" as const },
      ],
    },
    {
      label: t("pages.why.selfHost"),
      values: [
        { value: "Yes", tone: "yes" as const },
        { value: "Yes", tone: "yes" as const },
        "No",
        "No",
        "No",
      ],
    },
    {
      label: t("pages.why.zeroKnowledge"),
      values: ["Yes", "No", "No", "Yes", "Yes"],
    },
    {
      label: t("pages.why.autoExpiry"),
      values: [
        { value: "Yes", tone: "yes" as const },
        { value: "Yes", tone: "yes" as const },
        { value: "Yes", tone: "yes" as const },
        { value: "Yes", tone: "yes" as const },
        { value: "Yes", tone: "yes" as const },
      ],
    },
  ];

  return (
    <div className="content-page">
      <article className="article">
        <ArticleHeader title={t("pages.why.title")} lead={t("pages.why.lead")} />

        <section className="ui-info-grid" aria-label={t("pages.why.title")}>
          <InfoCard icon={<Shield size={20} />} title={t("pages.why.benefit1Title")}>
            {t("pages.why.benefit1Desc")}
          </InfoCard>
          <InfoCard icon={<ImagePlus size={20} />} title={t("pages.why.benefit2Title")}>
            {t("pages.why.benefit2Desc")}
          </InfoCard>
          <InfoCard icon={<Infinity size={20} />} title={t("pages.why.benefit3Title")}>
            {t("pages.why.benefit3Desc")}
          </InfoCard>
          <InfoCard icon={<Github size={20} />} title={t("pages.why.benefit4Title")}>
            {t("pages.why.benefit4Desc")}
          </InfoCard>
        </section>

        <ProseSection title={t("pages.why.tableTitle")}>
          <CompareTable
            headers={[t("pages.why.feature"), ...PRODUCT_COLUMNS]}
            rows={rows}
            highlightCol={1}
          />
        </ProseSection>

        <ProseSection title={t("pages.why.detailTitle")}>
          <h3>{t("pages.why.detail1Title")}</h3>
          <p>{t("pages.why.detail1Desc")}</p>
          <h3>{t("pages.why.detail2Title")}</h3>
          <p>{t("pages.why.detail2Desc")}</p>
          <h3>{t("pages.why.detail3Title")}</h3>
          <p>{t("pages.why.detail3Desc")}</p>
          <h3>
            <Link to="/cli">{t("why.cli.title")}</Link>
          </h3>
          <p>{t("why.cli.body")}</p>
        </ProseSection>

        <CtaBlock text={t("pages.why.ctaText")}>
          <Button to="/" icon={<Lock size={16} />}>
            {t("pages.why.ctaButton")}
          </Button>
        </CtaBlock>

        <BackLink to="/">{t("nav.backHome")}</BackLink>
      </article>
    </div>
  );
}
