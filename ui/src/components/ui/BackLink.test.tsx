import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../test/render";
import BackLink from "./BackLink";

describe("BackLink", () => {
  it("renders a router link to the given path", () => {
    renderWithProviders(<BackLink to="/">Back to home</BackLink>);
    expect(screen.getByRole("link", { name: /Back to home/ })).toHaveAttribute("href", "/");
  });
});
