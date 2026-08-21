import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  ArticleHeader,
  FaqItem,
  CtaBlock,
  Button,
  BackLink,
} from "../components/ui";
import useSEO from "../lib/useSEO";

const FAQ_COUNT = 12;

export default function FAQ() {
  const { t } = useTranslation();

  const faqs = Array.from({ length: FAQ_COUNT }, (_, i) => ({
    q: t(`pages.faq.q${i + 1}`),
    a: t(`pages.faq.a${i + 1}`),
  }));

  useSEO({
    title: t("pages.faq.metaTitle"),
    description: t("pages.faq.metaDesc"),
    path: "/faq",
  });

  useEffect(() => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.q,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.a
        }
      }))
    };
    let script = document.querySelector('script[data-faq-schema]');
    if (!script) {
      script = document.createElement("script");
      script.setAttribute("type", "application/ld+json");
      script.setAttribute("data-faq-schema", "true");
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(schema);

    return () => { script?.remove(); };
  }, [t, faqs]);

  return (
    <div className="content-page">
      <article className="article">
        <ArticleHeader title={t("pages.faq.title")} lead={t("pages.faq.lead")} />

        <div className="faq-list">
          {faqs.map((faq, i) => (
            <FaqItem key={i} question={faq.q} defaultOpen={i === 0}>
              <p>{faq.a}</p>
            </FaqItem>
          ))}
          <FaqItem question={t("faq.cli.q")}>
            <p>{t("faq.cli.a")}</p>
          </FaqItem>
        </div>

        <CtaBlock text={t("pages.faq.moreQuestions")}>
          <Button
            variant="secondary"
            href="https://github.com/dhdtech/oos/issues"
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("pages.faq.askGithub")}
          </Button>
        </CtaBlock>

        <BackLink to="/">{t("nav.backHome")}</BackLink>
      </article>
    </div>
  );
}
