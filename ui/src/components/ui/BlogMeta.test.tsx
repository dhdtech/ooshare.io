import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../test/render";
import BlogMeta from "./BlogMeta";

describe("BlogMeta", () => {
  it("renders date, reading time and min-read label (sm)", () => {
    renderWithProviders(
      <BlogMeta date="2024-11-15" locale="en" readingTime={6} minReadLabel="min read" />,
    );
    expect(screen.getByText(/min read/)).toBeInTheDocument();
    // Calendar + Clock glyphs present
    expect(document.querySelectorAll(".ui-blog-meta--sm svg").length).toBe(2);
    expect(screen.getByText(/2024/)).toBeInTheDocument();
  });

  it("renders the optional author line", () => {
    renderWithProviders(
      <BlogMeta
        date="2024-11-15"
        locale="en"
        readingTime={6}
        minReadLabel="min read"
        author="DHD Tech"
        byLabel="By"
      />,
    );
    expect(screen.getByText(/By DHD Tech/)).toBeInTheDocument();
  });

  it("switches to the lg size class", () => {
    renderWithProviders(
      <BlogMeta date="2024-11-15" locale="en" readingTime={6} minReadLabel="min read" size="lg" />,
    );
    expect(document.querySelector(".ui-blog-meta--lg")).toBeInTheDocument();
  });
});
