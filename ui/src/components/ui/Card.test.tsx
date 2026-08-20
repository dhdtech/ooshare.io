import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../test/render";
import Card from "./Card";

describe("Card", () => {
  it("renders children inside a surface card with the ui-card class", () => {
    renderWithProviders(<Card><p>content</p></Card>);
    const card = screen.getByText("content").parentElement!;
    expect(card.className).toContain("ui-card");
  });
});
