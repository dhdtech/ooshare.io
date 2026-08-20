import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../test/render";
import BlogCard from "./BlogCard";

const card = {
  slug: "why-email-is-not-safe-for-passwords",
  title: "Why Email Is Not Safe for Sharing Passwords",
  description: "Email was never designed for secure data transfer.",
  tags: ["security", "passwords", "email"],
  date: "2024-11-15",
  readingTime: 6,
  locale: "en",
  minReadLabel: "min read",
};

describe("BlogCard", () => {
  it("links to the post detail page and renders title + excerpt", () => {
    renderWithProviders(<BlogCard {...card} />);
    expect(screen.getByRole("link", { name: /Why Email Is Not Safe/ })).toHaveAttribute(
      "href",
      "/blog/why-email-is-not-safe-for-passwords",
    );
    expect(screen.getByText("Email was never designed for secure data transfer.")).toBeInTheDocument();
  });

  it("renders up to three tags and the meta row", () => {
    renderWithProviders(<BlogCard {...card} />);
    expect(screen.getAllByText("security")).toHaveLength(1);
    expect(screen.getAllByText("passwords")).toHaveLength(1);
    expect(screen.getAllByText("email")).toHaveLength(1);
    expect(screen.getByText(/min read/)).toBeInTheDocument();
  });

  it("renders only the first three tags when more are provided", () => {
    renderWithProviders(
      <BlogCard {...card} tags={["one", "two", "three", "four"]} />,
    );
    expect(screen.queryByText("four")).not.toBeInTheDocument();
    expect(screen.getAllByText(/one|two|three/)).toHaveLength(3);
  });
});
