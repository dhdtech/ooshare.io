import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../test/render";
import TextField from "./TextField";

describe("TextField", () => {
  it("associates the label with the input via htmlFor/id", () => {
    renderWithProviders(<TextField id="field" label="Email" />);
    expect(screen.getByLabelText("Email")).toHaveAttribute("id", "field");
  });

  it("passes through input props", () => {
    renderWithProviders(<TextField id="field" label="Email" placeholder="you@example.com" type="email" />);
    const input = screen.getByPlaceholderText("you@example.com");
    expect(input).toHaveAttribute("type", "email");
  });

  it("renders an error with role=alert and aria-invalid", () => {
    renderWithProviders(<TextField id="field" label="Email" error="Invalid email" />);
    const input = screen.getByLabelText("Email");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("alert")).toHaveTextContent("Invalid email");
  });

  it("is usable via user typing", async () => {
    const user = userEvent.setup();
    renderWithProviders(<TextField id="field" label="Email" />);
    const input = screen.getByLabelText("Email");
    await user.type(input, "hello");
    expect(input).toHaveValue("hello");
  });
});
