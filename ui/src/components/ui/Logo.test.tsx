import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../test/render";
import Logo from "./Logo";

describe("Logo", () => {
  it("renders the wordmark", () => {
    renderWithProviders(<Logo />);
    expect(screen.getByText("ooshare")).toBeInTheDocument();
  });

  it("renders the shield SVG with the fixed indigo stroke", () => {
    renderWithProviders(<Logo size={30} />);
    const svg = document.querySelector(".ui-logo svg")!;
    expect(svg).toHaveAttribute("stroke", "#6366f1");
    expect(svg).toHaveAttribute("width", "30");
    expect(svg).toHaveAttribute("height", "30");
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });

  it("renders as a link to home when to=true", () => {
    renderWithProviders(<Logo />);
    expect(screen.getByRole("link", { name: "ooshare" })).toHaveAttribute("href", "/");
  });

  it("renders as a non-link span when to=false", () => {
    renderWithProviders(<Logo to={false} />);
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    expect(screen.getByText("ooshare")).toBeInTheDocument();
  });
});
