import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../test/render";
import WhyOOShare from "./WhyOOShare";

describe("WhyOOShare", () => {
  it("renders the title and lead", () => {
    renderWithProviders(<WhyOOShare />);
    expect(screen.getByRole("heading", { level: 1, name: "Why Only Once Share?" })).toBeInTheDocument();
  });

  it("renders the comparison table and CTA", () => {
    renderWithProviders(<WhyOOShare />);
    expect(document.querySelector(".ui-compare-table")).toBeInTheDocument();
    expect(screen.getByText("Feature")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Create a Secret/ })).toBeInTheDocument();
  });
});
