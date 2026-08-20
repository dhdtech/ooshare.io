import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../test/render";
import ProseSection from "./ProseSection";

describe("ProseSection", () => {
  it("renders an h2 title and prose children", () => {
    renderWithProviders(
      <ProseSection title="Mission">
        <p>First paragraph.</p>
        <p>Second paragraph.</p>
      </ProseSection>,
    );
    expect(screen.getByRole("heading", { level: 2, name: "Mission" })).toBeInTheDocument();
    expect(screen.getByText("First paragraph.")).toBeInTheDocument();
    expect(screen.getByText("Second paragraph.")).toBeInTheDocument();
  });

  it("renders as a section with body wrapper", () => {
    const { container } = renderWithProviders(<ProseSection title="Why">Body</ProseSection>);
    expect(container.querySelector("section.ui-prose-section")).not.toBeNull();
    expect(container.querySelector(".ui-prose-section-body")).not.toBeNull();
  });
});
