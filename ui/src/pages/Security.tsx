import { useTranslation } from "react-i18next";
import { Shield, Lock, Key, Eye, Trash2, Hash, Server, Terminal } from "lucide-react";
import {
  ArticleHeader,
  InfoCard,
  ProseSection,
  NumberedList,
  CtaBlock,
  Button,
  BackLink,
} from "../components/ui";
import useSEO from "../lib/useSEO";

export default function Security() {
  const { t } = useTranslation();

  useSEO({
    title: t("pages.security.metaTitle"),
    description: t("pages.security.metaDesc"),
    path: "/security",
  });

  return (
    <div className="content-page">
      <article className="article">
        <ArticleHeader title={t("pages.security.title")} lead={t("pages.security.lead")} />

        <section className="ui-info-grid" aria-label={t("pages.security.title")}>
          <InfoCard icon={<Lock size={20} />} title={t("pages.security.e2eTitle")} html={t("pages.security.e2eContent")} />
          <InfoCard icon={<Key size={20} />} title={t("pages.security.hkdfTitle")} html={t("pages.security.hkdfContent")} />
          <InfoCard icon={<Hash size={20} />} title={t("pages.security.aadTitle")} html={t("pages.security.aadContent")} />
          <InfoCard icon={<Eye size={20} />} title={t("pages.security.zkTitle")} html={t("pages.security.zkContent")} />
          <InfoCard icon={<Server size={20} />} title={t("pages.security.serverTitle")} html={t("pages.security.serverContent")} />
          <InfoCard icon={<Trash2 size={20} />} title={t("pages.security.oneTimeTitle")} html={t("pages.security.oneTimeContent")} />
          <InfoCard icon={<Shield size={20} />} title={t("pages.security.ossTitle")} html={t("pages.security.ossContent")} />
        </section>

        <ProseSection title={t("pages.security.flowTitle")}>
          <NumberedList
            items={[
              t("pages.security.step1"),
              t("pages.security.step2"),
              t("pages.security.step3"),
              t("pages.security.step4"),
              t("pages.security.step5"),
              t("pages.security.step6"),
              t("pages.security.step7"),
            ]}
          />
        </ProseSection>

        <ProseSection title={t("pages.security.whyTitle")}>
          <p dangerouslySetInnerHTML={{ __html: t("pages.security.whyP1") }} />
          <p dangerouslySetInnerHTML={{ __html: t("pages.security.whyP2") }} />
        </ProseSection>

        <ProseSection title={t("security.cliSection.title")}>
          <p>{t("security.cliSection.body")}</p>
          <Button to="/cli" icon={<Terminal size={16} />}>
            {t("security.cliSection.link")}
          </Button>
        </ProseSection>

        <CtaBlock>
          <Button to="/">{t("pages.security.cta")}</Button>
        </CtaBlock>

        <BackLink to="/">{t("nav.backHome")}</BackLink>
      </article>
    </div>
  );
}
