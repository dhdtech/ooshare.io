import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../test/render";
import BlogTag from "./BlogTag";

describe("BlogTag", () => {
  it("renders the tag text with the ui-blog-tag class", () => {
    renderWithProviders(<BlogTag>security</BlogTag>);
    const tag = screen.getByText("security");
    expect(tag.className).toContain("ui-blog-tag");
  });

  it("renders multiple distinct tags independently", () => {
    renderWithProviders(
      <>
        <BlogTag>security</BlogTag>
        <BlogTag>passwords</BlogTag>
      </>,
    );
    expect(screen.getByText("security")).toBeInTheDocument();
    expect(screen.getByText("passwords")).toBeInTheDocument();
  });
});
