import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../test/render";
import BlogCtaBox from "./BlogCtaBox";

describe("BlogCtaBox", () => {
  it("renders title, description and a primary button to '/'", () => {
    renderWithProviders(
      <BlogCtaBox
        title="Share secrets securely"
        description="Zero-knowledge AES-256-GCM."
        buttonLabel="Try Only Once Share"
      />,
    );
    expect(screen.getByRole("heading", { level: 3, name: "Share secrets securely" })).toBeInTheDocument();
    expect(screen.getByText("Zero-knowledge AES-256-GCM.")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Try Only Once Share" })).toHaveAttribute("href", "/");
  });
});
