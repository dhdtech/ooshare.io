import { useTranslation } from "react-i18next";
import { Shield, Github, Globe } from "lucide-react";
import {
  ArticleHeader,
  ProseSection,
  InfoCard,
  CtaBlock,
  Button,
  BackLink,
} from "../components/ui";
import useSEO from "../lib/useSEO";

export default function About() {
  const { t } = useTranslation();

  useSEO({
    title: t("pages.about.metaTitle"),
    description: t("pages.about.metaDesc"),
    path: "/about",
  });

  return (
    <div className="content-page">
      <article className="article">
        <ArticleHeader title={t("pages.about.title")} lead={t("pages.about.lead")} />

        <ProseSection title={t("pages.about.missionTitle")}>
          <p>{t("pages.about.missionP1")}</p>
          <p>{t("pages.about.missionP2")}</p>
        </ProseSection>

        <ProseSection title={t("pages.about.whyOssTitle")}>
          <p>{t("pages.about.whyOssP1")}</p>
          <p>{t("pages.about.whyOssP2")}</p>
        </ProseSection>

        <ProseSection title={t("pages.about.builtByTitle")}>
          <p dangerouslySetInnerHTML={{ __html: t("pages.about.builtByP1") }} />
        </ProseSection>

        <ProseSection title={t("pages.about.differentTitle")}>
          <section className="ui-info-grid" aria-label={t("pages.about.differentTitle")}>
            <InfoCard icon={<Shield size={20} />} title={t("pages.about.feature1Title")}>
              {t("pages.about.feature1Desc")}
            </InfoCard>
            <InfoCard icon={<Globe size={20} />} title={t("pages.about.feature2Title")}>
              {t("pages.about.feature2Desc")}
            </InfoCard>
            <InfoCard icon={<Github size={20} />} title={t("pages.about.feature3Title")}>
              {t("pages.about.feature3Desc")}
            </InfoCard>
            <InfoCard icon={<Globe size={20} />} title={t("pages.about.feature4Title")}>
              {t("pages.about.feature4Desc")}
            </InfoCard>
          </section>
        </ProseSection>

        <ProseSection title={t("pages.about.involvedTitle")}>
          <p>{t("pages.about.involvedP1")}</p>
          <CtaBlock>
            <Button
              href="https://github.com/dhdtech/only-once-share"
              target="_blank"
              rel="noopener noreferrer"
              icon={<Github size={16} />}
            >
              {t("pages.about.viewOnGithub")}
            </Button>
          </CtaBlock>
        </ProseSection>

        <BackLink to="/">{t("nav.backHome")}</BackLink>
      </article>
    </div>
  );
}
