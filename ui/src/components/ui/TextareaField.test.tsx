import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../test/render";
import TextareaField from "./TextareaField";

describe("TextareaField", () => {
  it("associates label with textarea via htmlFor/id", () => {
    renderWithProviders(<TextareaField id="sec" label="Secret content" />);
    expect(screen.getByLabelText("Secret content")).toHaveAttribute("id", "sec");
  });

  it("renders a mono char count", () => {
    renderWithProviders(<TextareaField id="sec" label="Secret content" charCount="42 / 50,000" />);
    const count = screen.getByText("42 / 50,000");
    expect(count.className).toContain("ui-char-count");
  });

  it("parses values passed through props and supports typing", async () => {
    const user = userEvent.setup();
    renderWithProviders(<TextareaField id="sec" label="Secret content" charCount="0 / 50,000" />);
    const ta = screen.getByLabelText("Secret content");
    await user.type(ta, "hello");
    expect(ta).toHaveValue("hello");
  });

  it("renders an error with aria-invalid", () => {
    renderWithProviders(<TextareaField id="sec" label="Secret content" error="Too long" />);
    expect(screen.getByLabelText("Secret content")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("alert")).toHaveTextContent("Too long");
  });
});
