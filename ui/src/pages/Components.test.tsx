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

  it("renders a sticky table of contents with anchor chips", () => {
    renderWithProviders(<Components />);
    // TOC chips link to each doc-group section's anchor
    expect(screen.getByRole("link", { name: "Actions" })).toHaveAttribute("href", "#actions");
    // the chip's target section (anchor id) exists
    expect(document.getElementById("actions")).not.toBeNull();
  });

  it("renders a mono props signature note for a component", () => {
    renderWithProviders(<Components />);
    // Button's props signature is shown in a mono note
    expect(
      screen.getAllByText(/variant: primary \| secondary \| success/).length,
    ).toBeGreaterThan(0);
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

  it("fires the error and info toast variants from the showcase", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Components />);
    await user.click(screen.getByRole("button", { name: "Error toast" }));
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Info toast" }));
    expect(screen.getByText("Heads up")).toBeInTheDocument();
  });

  it("toggles the loading state of a Button", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Components />);
    const btn = () => screen.getByRole("button", { name: "Toggle loading" });
    expect(btn()).not.toBeDisabled();
    await user.click(btn());
    expect(btn()).toBeDisabled();
    // the demo reverts after 800ms; wait for it to clear (also avoids a pending timer on unmount)
    await waitFor(() => expect(btn()).not.toBeDisabled(), { timeout: 1500 });
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
    await user.click(screen.getByText("12h"));
    expect(screen.getByText("Selected: 12h")).toBeInTheDocument();
  });

  it("renders the top-level shell components (LanguageSelector, SecurityModal, Layout pieces)", () => {
    renderWithProviders(<Components />);
    // SecurityModal trigger
    expect(screen.getByRole("button", { name: "How It Works" })).toBeInTheDocument();
    // LanguageSelector trigger renders a flag code
    expect(screen.getByLabelText("Select language")).toBeInTheDocument();
  });
});
