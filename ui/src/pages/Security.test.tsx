import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../test/render";
import Security from "./Security";

describe("Security", () => {
  it("renders the security title and lead", () => {
    renderWithProviders(<Security />);
    expect(screen.getByRole("heading", { level: 1 })).toBeInTheDocument();
    expect(screen.getByText("End-to-End Encryption")).toBeInTheDocument();
  });

  it("renders the encryption flow steps", () => {
    renderWithProviders(<Security />);
    expect(document.querySelectorAll(".ui-numbered-list li").length).toBe(7);
  });
});
