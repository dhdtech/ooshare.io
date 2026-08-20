import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../test/render";
import CtaBlock from "./CtaBlock";
import Button from "./Button";

describe("CtaBlock", () => {
  it("renders an optional text line and its children", () => {
    renderWithProviders(
      <CtaBlock text="Have questions?">
        <Button to="/">Contact us</Button>
      </CtaBlock>,
    );
    expect(screen.getByText("Have questions?")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Contact us" })).toBeInTheDocument();
  });

  it("renders fine without a text line", () => {
    renderWithProviders(
      <CtaBlock>
        <Button href="https://github.com" target="_blank" rel="noopener noreferrer">
          GitHub
        </Button>
      </CtaBlock>,
    );
    expect(screen.getByRole("link", { name: "GitHub" })).toHaveAttribute(
      "href",
      "https://github.com",
    );
  });
});
