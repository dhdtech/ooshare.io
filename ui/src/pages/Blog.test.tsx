import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../test/render";
import Blog from "./Blog";

describe("Blog", () => {
  it("renders the blog title and a list of posts", () => {
    renderWithProviders(<Blog />);
    expect(screen.getByRole("heading", { level: 1, name: "Blog" })).toBeInTheDocument();
    expect(
      screen.getByText(/Security, encryption, and secret sharing/i),
    ).toBeInTheDocument();
  });

  it("renders at least one post card", () => {
    renderWithProviders(<Blog />);
    expect(
      screen.getAllByText(/why email is not safe|zero-knowledge|password securely/i).length,
    ).toBeGreaterThan(0);
  });

  it("renders cards as links to their post detail pages and topic tags", () => {
    renderWithProviders(<Blog />);
    const slug = "why-email-is-not-safe-for-passwords";
    const card = screen.getByRole("link", { name: /Why Email Is Not Safe/i });
    expect(card).toHaveAttribute("href", `/blog/${slug}`);
    expect(screen.getAllByText(/security|passwords|encryption/i).length).toBeGreaterThan(0);
  });

  it("renders the back link to home", () => {
    renderWithProviders(<Blog />);
    expect(screen.getByRole("link", { name: /Back to home/ })).toHaveAttribute("href", "/");
  });
});
