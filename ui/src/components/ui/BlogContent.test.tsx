import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../test/render";
import BlogContent from "./BlogContent";

describe("BlogContent", () => {
  it("renders the provided HTML inside the prose wrapper", () => {
    renderWithProviders(
      <BlogContent html="<h2>Title</h2><p>Body with <code>inline</code>.</p>" />,
    );
    expect(screen.getByRole("heading", { level: 2, name: "Title" })).toBeInTheDocument();
    const content = document.querySelector(".ui-blog-content")!;
    expect(content.textContent).toContain("Body with inline.");
  });

  it("renders markup via dangerouslySetInnerHTML inertly (script never executes)", () => {
    const html = `<p>safe</p><script>globalThis.__xss=1<\/script>`;
    renderWithProviders(<BlogContent html={html} />);
    expect(screen.getByText("safe")).toBeInTheDocument();
    // dangerouslySetInnerHTML may insert an inert <script> DOM node, but it
    // must never execute — the invariant that matters is on execution state.
    expect((globalThis as Record<string, unknown>).__xss).toBeUndefined();
  });
});
