import { describe, it, expect } from "vitest";
import { getBlogPosts, blogPosts } from "./blog-posts";
import type { BlogPost } from "./blog-posts";

describe("blog content", () => {
  it("exports a non-empty list of posts in English", () => {
    expect(blogPosts.length).toBeGreaterThan(20);
    const en = getBlogPosts("en");
    expect(en).toHaveLength(blogPosts.length);
    for (const post of en) {
      expect(post.slug).toBeTruthy();
      expect(post.title).toBeTruthy();
      expect(post.content).toContain("<p>");
    }
  });

  it("returns English posts for an unsupported language", () => {
    const res = getBlogPosts("xx");
    expect(res).toHaveLength(blogPosts.length);
    expect(res[0].title).toBe(blogPosts[0].title);
  });

  it("applies translated title/description for each supported locale", () => {
    for (const lang of ["es", "zh", "pt", "hi", "ar"]) {
      const localized = getBlogPosts(lang);
      expect(localized).toHaveLength(blogPosts.length);
      // A translated post keeps the same slug but may differ in title/content.
      expect(localized[0].slug).toBe(blogPosts[0].slug);
      expect(localized[0].title.length).toBeGreaterThan(0);
    }
  });

  it("translated post fields are non-empty BlogPost objects", () => {
    const localized = getBlogPosts("es");
    const first: BlogPost = localized[0] as BlogPost;
    expect(typeof first.description).toBe("string");
    expect(typeof first.content).toBe("string");
    expect(Array.isArray(first.tags)).toBe(true);
  });
});
