import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../test/render";
import Button from "./Button";

describe("Button", () => {
  it("renders a <button> by default with primary class", () => {
    renderWithProviders(<Button>Go</Button>);
    const btn = screen.getByRole("button", { name: "Go" });
    expect(btn.tagName).toBe("BUTTON");
    expect(btn.className).toContain("ui-btn--primary");
  });

  it("defaults type to button when not a submit", () => {
    renderWithProviders(<Button>Go</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("type", "button");
  });

  it("preserves an explicit submit type", () => {
    renderWithProviders(<form><Button type="submit">Send</Button></form>);
    expect(screen.getByRole("button", { name: "Send" })).toHaveAttribute("type", "submit");
  });

  it("applies size, full and variant classes", () => {
    renderWithProviders(<Button size="sm" full variant="secondary">Small</Button>);
    const btn = screen.getByRole("button", { name: "Small" });
    expect(btn.className).toContain("ui-btn--sm");
    expect(btn.className).toContain("ui-btn--full");
    expect(btn.className).toContain("ui-btn--secondary");
  });

  it("disables and shows a spinner while loading", () => {
    renderWithProviders(<Button loading>Encrypting</Button>);
    const btn = screen.getByRole("button", { name: /Encrypting/ });
    expect(btn).toBeDisabled();
    expect(btn.querySelector(".ui-btn-spinner")).not.toBeNull();
  });

  it("renders as an anchor when given href", () => {
    renderWithProviders(
      <Button href="https://example.com" target="_blank" rel="noopener noreferrer">Link</Button>,
    );
    const link = screen.getByRole("link", { name: "Link" });
    expect(link).toHaveAttribute("href", "https://example.com");
    expect(link).toHaveAttribute("target", "_blank");
  });

  it("renders as a router Link when given to", async () => {
    renderWithProviders(<Button to="/security">Nav</Button>);
    expect(screen.getByRole("link", { name: "Nav" })).toHaveAttribute("href", "/security");
  });

  it("fires onClick", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    renderWithProviders(<Button onClick={onClick}>Click</Button>);
    await user.click(screen.getByRole("button", { name: "Click" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
