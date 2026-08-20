import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../test/render";
import BlogNav from "./BlogNav";

describe("BlogNav", () => {
  it("renders prev and next links with their labels and titles", () => {
    renderWithProviders(
      <BlogNav
        prev={{ slug: "older-post", title: "Older Post" }}
        next={{ slug: "newer-post", title: "Newer Post" }}
        prevLabel="Previous"
        nextLabel="Next"
      />,
    );
    expect(screen.getAllByRole("link")).toHaveLength(2);
    expect(screen.getByRole("link", { name: /Older Post/ })).toHaveAttribute("href", "/blog/older-post");
    expect(screen.getByRole("link", { name: /Newer Post/ })).toHaveAttribute("href", "/blog/newer-post");
    expect(screen.getByText("Previous")).toBeInTheDocument();
    expect(screen.getByText("Next")).toBeInTheDocument();
  });

  it("renders only the prev when next is absent", () => {
    renderWithProviders(
      <BlogNav prev={{ slug: "older-post", title: "Older Post" }} prevLabel="Previous" nextLabel="Next" />,
    );
    expect(screen.getAllByRole("link")).toHaveLength(1);
    expect(screen.getByText("Previous")).toBeInTheDocument();
    expect(screen.queryByText("Next")).not.toBeInTheDocument();
  });

  it("renders nothing when both sides are absent", () => {
    renderWithProviders(<BlogNav prevLabel="Previous" nextLabel="Next" />);
    expect(document.querySelector(".ui-blog-nav")).toBeInTheDocument();
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
