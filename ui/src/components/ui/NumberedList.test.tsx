import { describe, it, expect } from "vitest";
import { renderWithProviders } from "../../test/render";
import NumberedList from "./NumberedList";

describe("NumberedList", () => {
  const items = ["<strong>Encrypt</strong> locally", "Share the key", "Self-destructs"];

  it("renders an ordered list with the given items", () => {
    const { container } = renderWithProviders(<NumberedList items={items} />);
    const ol = container.querySelector("ol.ui-numbered-list");
    expect(ol).not.toBeNull();
    expect(ol!.querySelectorAll("li").length).toBe(3);
  });

  it("renders each item's HTML content", () => {
    renderWithProviders(<NumberedList items={items} />);
    expect(document.querySelector("strong")).toHaveTextContent("Encrypt");
  });

  it("renders an empty list when given no items", () => {
    const { container } = renderWithProviders(<NumberedList items={[]} />);
    expect(container.querySelectorAll("li").length).toBe(0);
  });
});
