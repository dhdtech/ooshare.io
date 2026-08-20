import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../test/render";
import TrustBadges from "./TrustBadges";

describe("TrustBadges", () => {
  it("renders all credential items as a labeled strip", () => {
    renderWithProviders(
      <TrustBadges items={["AES-256-GCM", "Zero-knowledge", "One-time self-destruct"]} />,
    );
    expect(screen.getByLabelText("Security credentials")).toBeInTheDocument();
    expect(screen.getByText("AES-256-GCM")).toBeInTheDocument();
    expect(screen.getByText("Zero-knowledge")).toBeInTheDocument();
    expect(screen.getByText("One-time self-destruct")).toBeInTheDocument();
  });
});
