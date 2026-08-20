import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../test/render";
import NavLink from "./NavLink";

describe("NavLink", () => {
  it("renders a router link with the label", () => {
    renderWithProviders(<NavLink to="/security">Security</NavLink>);
    expect(screen.getByRole("link", { name: "Security" })).toHaveAttribute("href", "/security");
  });

  it("sets aria-current=page when the path matches", () => {
    window.history.pushState({}, "", "/security");
    renderWithProviders(<NavLink to="/security">Security</NavLink>);
    expect(screen.getByRole("link", { name: "Security" })).toHaveAttribute("aria-current", "page");
  });

  it("does not set aria-current on a non-matching path", () => {
    window.history.pushState({}, "", "/faq");
    renderWithProviders(<NavLink to="/security">Security</NavLink>);
    expect(screen.getByRole("link", { name: "Security" })).not.toHaveAttribute("aria-current");
  });
});
