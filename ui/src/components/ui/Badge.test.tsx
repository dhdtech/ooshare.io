import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { Trash } from "lucide-react";
import { renderWithProviders } from "../../test/render";
import Badge from "./Badge";

describe("Badge", () => {
  it("renders quiet variant by default", () => {
    renderWithProviders(<Badge>Auto-delete</Badge>);
    const badge = screen.getByText("Auto-delete");
    expect(badge.className).toContain("ui-badge--quiet");
  });

  it("applies accent variant", () => {
    renderWithProviders(<Badge variant="accent">AES-256-GCM</Badge>);
    expect(screen.getByText("AES-256-GCM").className).toContain("ui-badge--accent");
  });

  it("applies tag variant and renders an icon", () => {
    renderWithProviders(<Badge variant="tag" icon={<Trash size={12} />}>Atomic</Badge>);
    const badge = screen.getByText("Atomic");
    expect(badge.className).toContain("ui-badge--tag");
    expect(badge.querySelector("svg")).toBeInTheDocument();
  });
});
