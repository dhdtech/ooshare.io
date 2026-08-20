import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../test/render";
import BlogPost from "./BlogPost";

const mockUseParams = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useParams: () => mockUseParams() };
});

beforeEach(() => {
  vi.clearAllMocks();
  mockUseParams.mockReturnValue({ slug: "why-email-is-not-safe-for-passwords" });
});

describe("BlogPost", () => {
  it("renders the post title and content when found", () => {
    renderWithProviders(<BlogPost />);
    expect(screen.getByRole("heading", { level: 1, name: /Why Email Is Not Safe/i })).toBeInTheDocument();
    const content = document.querySelector(".ui-blog-content")!;
    expect(content.textContent!.length).toBeGreaterThan(200);
  });

  it("renders post metadata and previous/next navigation", () => {
    renderWithProviders(<BlogPost />);
    expect(screen.getByText(/min read/)).toBeInTheDocument();
    // prev/next exist because the slug is not the newest
    expect(screen.getAllByText("Next").length).toBeGreaterThan(0);
  });

  it("renders the CTA, topic tags, author and an all-posts back link", () => {
    renderWithProviders(<BlogPost />);
    const cta = screen.getByRole("link", { name: /Try Only Once Share/ });
    expect(cta).toHaveAttribute("href", "/");
    expect(screen.getAllByText(/security|passwords|email/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/By DHD Tech/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /All posts/ })).toHaveAttribute("href", "/blog");
  });

  it("points prev/next navigation to the correct neighbouring posts", () => {
    renderWithProviders(<BlogPost />);
    // Test slug "why-email-is-not-safe-for-passwords" is the oldest post, so
    // there is no Previous; Next points to the second-oldest post.
    expect(screen.queryByText("Previous")).not.toBeInTheDocument();
    expect(screen.getByText("Next")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /What Is Zero-Knowledge Encryption/ }),
    ).toHaveAttribute("href", "/blog/what-is-zero-knowledge-encryption");
  });

  it("falls back to NotFound for an unknown slug", () => {
    mockUseParams.mockReturnValue({ slug: "does-not-exist" });
    renderWithProviders(<BlogPost />);
    expect(screen.getByText(/404/)).toBeInTheDocument();
  });

  it("handles a missing slug param", () => {
    mockUseParams.mockReturnValue({});
    renderWithProviders(<BlogPost />);
    expect(screen.getByText(/404/)).toBeInTheDocument();
  });
});
