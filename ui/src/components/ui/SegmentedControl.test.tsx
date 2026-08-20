import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../test/render";
import SegmentedControl from "./SegmentedControl";

const options = [
  { value: 1, label: "1h" },
  { value: 4, label: "4h" },
  { value: 24, label: "24h" },
];

describe("SegmentedControl", () => {
  it("renders a named option group with all labels", () => {
    renderWithProviders(
      <SegmentedControl options={options} value={24} onChange={() => {}} aria-label="Expires in" />,
    );
    expect(screen.getByRole("group", { name: "Expires in" })).toBeInTheDocument();
    expect(screen.getByText("1h")).toBeInTheDocument();
    expect(screen.getByText("4h")).toBeInTheDocument();
    expect(screen.getByText("24h")).toBeInTheDocument();
  });

  it("marks the active option aria-pressed", () => {
    renderWithProviders(
      <SegmentedControl options={options} value={24} onChange={() => {}} aria-label="Expires in" />,
    );
    expect(screen.getByRole("button", { name: "Expires in: 24h" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Expires in: 1h" })).toHaveAttribute("aria-pressed", "false");
  });

  it("calls onChange with the selected value", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderWithProviders(<SegmentedControl options={options} value={24} onChange={onChange} aria-label="Expires in" />);
    await user.click(screen.getByText("1h"));
    expect(onChange).toHaveBeenCalledWith(1);
  });
});
