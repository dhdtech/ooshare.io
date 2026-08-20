import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Bell } from "lucide-react";
import { renderWithProviders } from "../../test/render";
import IconButton from "./IconButton";

describe("IconButton", () => {
  it("renders a button with the required aria-label", () => {
    renderWithProviders(<IconButton icon={<Bell size={18} />} aria-label="Notify" />);
    expect(screen.getByRole("button", { name: "Notify" })).toBeInTheDocument();
  });

  it("renders the icon as decorative", () => {
    renderWithProviders(<IconButton icon={<Bell size={18} />} aria-label="Notify" />);
    expect(screen.getByRole("button", { name: "Notify" }).querySelector("svg")).toBeInTheDocument();
  });

  it("fires onClick", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    renderWithProviders(<IconButton icon={<Bell size={18} />} aria-label="Notify" onClick={onClick} />);
    await user.click(screen.getByRole("button", { name: "Notify" }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
