import { useTranslation } from "react-i18next";
import { getBlogPosts } from "../content/blog-posts";
import useSEO from "../lib/useSEO";
import { ArticleHeader, BlogCard, BackLink } from "../components/ui";

export default function Blog() {
  const { t, i18n } = useTranslation();

  useSEO({
    title: t("pages.blog.metaTitle"),
    description: t("pages.blog.metaDesc"),
    path: "/blog",
  });

  const posts = getBlogPosts(i18n.language);
  const sorted = [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const locale = i18n.language === "zh" ? "zh-CN" : i18n.language;

  return (
    <div className="content-page">
      <article className="article">
        <ArticleHeader title={t("pages.blog.title")} lead={t("pages.blog.lead")} />

        <div className="ui-blog-list">
          {sorted.map((post) => (
            <BlogCard
              key={post.slug}
              slug={post.slug}
              title={post.title}
              description={post.description}
              tags={post.tags}
              date={post.date}
              readingTime={post.readingTime}
              locale={locale}
              minReadLabel={t("pages.blog.minRead")}
            />
          ))}
        </div>

        <BackLink to="/">{t("nav.backHome")}</BackLink>
      </article>
    </div>
  );
}
