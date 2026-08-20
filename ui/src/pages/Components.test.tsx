import { describe, it, expect, beforeEach, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../test/render";
import Components from "./Components";

describe("Components showcase", () => {
  beforeEach(() => {
    URL.createObjectURL = vi.fn().mockReturnValue("blob:mock-url") as typeof URL.createObjectURL;
    URL.revokeObjectURL = vi.fn() as typeof URL.revokeObjectURL;
  });

  it("renders the page title and trust strip", () => {
    renderWithProviders(<Components />);
    expect(screen.getAllByText("Component Library").length).toBeGreaterThan(0);
    // AES-256-GCM appears in the trust strip AND a badge chip on the page
    expect(screen.getAllByText("AES-256-GCM").length).toBeGreaterThanOrEqual(2);
  });

  it("renders the primary create button", () => {
    renderWithProviders(<Components />);
    expect(screen.getByRole("button", { name: /Create Secret Link/ })).toBeInTheDocument();
  });

  it("fires a toast from the showcase button", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Components />);
    await user.click(screen.getByRole("button", { name: "Fire a toast" }));
    expect(screen.getByText("Toast demo fired")).toBeInTheDocument();
  });

  it("opens and closes the modal via the showcase", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Components />);
    await user.click(screen.getByRole("button", { name: "Open modal" }));
    expect(screen.getByRole("dialog", { name: "Component Library" })).toBeInTheDocument();
    await user.click(screen.getByLabelText("Close"));
    // The modal animates out (plan 004 exit) before unmounting.
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("switches the segmented control value", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Components />);
    // Segmented control shows options; 24h is selected in the showcase by default
    await user.click(screen.getByText("12h"));
    expect(screen.getByText("Selected: 12h")).toBeInTheDocument();
  });
});
