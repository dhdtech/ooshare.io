import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../test/render";
import ArticleHeader from "./ArticleHeader";
import BlogTag from "./BlogTag";

describe("ArticleHeader", () => {
  it("renders the h1 title and an optional lead", () => {
    renderWithProviders(<ArticleHeader title="Blog" lead="Practical guides." />);
    expect(screen.getByRole("heading", { level: 1, name: "Blog" })).toBeInTheDocument();
    expect(screen.getByText("Practical guides.")).toBeInTheDocument();
  });

  it("renders tags above the title and meta below it", () => {
    renderWithProviders(
      <ArticleHeader
        title="A Post"
        tags={<BlogTag>security</BlogTag>}
        meta={<span>2024</span>}
      />,
    );
    const header = document.querySelector(".ui-article-header")!;
    const title = header.querySelector(".ui-article-title")!;
    expect(screen.getByText("security")).toBeInTheDocument();
    expect(header.contains(header.querySelector(".ui-blog-tags"))).toBe(true);
    // tags appear before the title
    const nodes = Array.from(header.children);
    expect(nodes.indexOf(header.querySelector(".ui-blog-tags")!)).toBeLessThan(
      nodes.indexOf(title as HTMLElement),
    );
    expect(screen.getByText("2024")).toBeInTheDocument();
  });

  it("applies the post variant class", () => {
    renderWithProviders(<ArticleHeader title="A Post" variant="post" />);
    expect(document.querySelector(".ui-article-header--post")).toBeInTheDocument();
  });
});
