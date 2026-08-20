import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../test/render";
import NotFound from "./NotFound";

describe("NotFound", () => {
  it("renders a 404 message and a home link", () => {
    renderWithProviders(<NotFound />);
    expect(screen.getByText(/404/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Back to home/ })).toHaveAttribute("href", "/");
  });

  it("sets robots meta to noindex on mount", () => {
    const meta = document.createElement("meta");
    meta.setAttribute("name", "robots");
    meta.setAttribute("content", "index, follow");
    document.head.appendChild(meta);
    renderWithProviders(<NotFound />);
    expect(meta).toHaveAttribute("content", "noindex");
    meta.remove();
  });
});
