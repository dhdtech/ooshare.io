import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { getBlogPosts } from "../content/blog-posts";
import NotFound from "./NotFound";
import useSEO from "../lib/useSEO";
import {
  ArticleHeader,
  BlogTag,
  BlogMeta,
  BlogContent,
  BlogCtaBox,
  BlogNav,
  BackLink,
} from "../components/ui";

export default function BlogPost() {
  const { t, i18n } = useTranslation();
  const { slug } = useParams<{ slug: string }>();
  const posts = getBlogPosts(i18n.language);
  const post = posts.find((p) => p.slug === slug);

  useSEO({
    title: post ? `${post.title} | Only Once Share Blog` : "Not Found | Only Once Share",
    description: post?.description ?? "",
    path: `/blog/${slug ?? ""}`,
  });

  useEffect(() => {
    if (post) {
      const schema = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "description": post.description,
        "datePublished": post.date,
        "dateModified": post.date,
        "author": { "@type": "Organization", "name": "DHD Tech", "url": "https://dhdtech.com" },
        "publisher": { "@type": "Organization", "name": "Only Once Share", "url": "https://ooshare.io" },
        "mainEntityOfPage": { "@type": "WebPage", "@id": `https://ooshare.io/blog/${post.slug}` },
        "keywords": post.tags.join(", ")
      };
      let script = document.querySelector('script[data-blog-schema]');
      if (!script) {
        script = document.createElement("script");
        script.setAttribute("type", "application/ld+json");
        script.setAttribute("data-blog-schema", "true");
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(schema);
      return () => { script?.remove(); };
    }
  }, [post]);

  if (!post) return <NotFound />;

  const sorted = [...posts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const idx = sorted.findIndex(p => p.slug === slug);
  const prev = idx < sorted.length - 1 ? sorted[idx + 1] : null;
  const next = idx > 0 ? sorted[idx - 1] : null;
  const locale = i18n.language === "zh" ? "zh-CN" : i18n.language;

  return (
    <div className="content-page">
      <article className="article">
        <ArticleHeader
          title={post.title}
          variant="post"
          tags={post.tags.map(tag => (
            <BlogTag key={tag}>{tag}</BlogTag>
          ))}
          meta={
            <BlogMeta
              date={post.date}
              locale={locale}
              readingTime={post.readingTime}
              minReadLabel={t("pages.blog.minRead")}
              author="DHD Tech"
              byLabel={t("pages.blog.by")}
              size="lg"
            />
          }
        />

        <BlogContent html={post.content} />

        <BlogCtaBox
          title={t("pages.blog.ctaTitle")}
          description={t("pages.blog.ctaDesc")}
          buttonLabel={t("pages.blog.ctaButton")}
        />

        <BlogNav
          prev={prev ? { slug: prev.slug, title: prev.title } : undefined}
          next={next ? { slug: next.slug, title: next.title } : undefined}
          prevLabel={t("pages.blog.previous")}
          nextLabel={t("pages.blog.next")}
        />

        <BackLink to="/blog">{t("nav.allPosts")}</BackLink>
      </article>
    </div>
  );
}
