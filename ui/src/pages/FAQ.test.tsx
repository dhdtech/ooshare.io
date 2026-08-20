import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../test/render";
import FAQ from "./FAQ";

describe("FAQ", () => {
  it("renders the FAQ title and lead", () => {
    renderWithProviders(<FAQ />);
    expect(
      screen.getByRole("heading", { level: 1, name: "Frequently Asked Questions" }),
    ).toBeInTheDocument();
  });

  it("renders all 12 FAQ items as details elements", () => {
    renderWithProviders(<FAQ />);
    const details = document.querySelectorAll("details.ui-accordion");
    expect(details.length).toBe(12);
  });

  it("renders the first FAQ open and links to GitHub", () => {
    renderWithProviders(<FAQ />);
    expect(document.querySelector("details.ui-accordion")).toHaveAttribute("open");
    expect(screen.getByRole("link", { name: "Ask on GitHub" })).toBeInTheDocument();
  });
});
