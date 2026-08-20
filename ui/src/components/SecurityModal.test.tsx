import { describe, it, expect } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../test/render";
import SecurityModal from "./SecurityModal";

describe("SecurityModal", () => {
  it("renders trigger button", () => {
    renderWithProviders(<SecurityModal />);
    expect(screen.getByLabelText("How It Works")).toBeInTheDocument();
  });

  it("opens modal on click", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SecurityModal />);

    await user.click(screen.getByLabelText("How It Works"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("shows all 7 security items", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SecurityModal />);
    await user.click(screen.getByLabelText("How It Works"));

    expect(screen.getByText("End-to-End Encryption")).toBeInTheDocument();
    expect(screen.getByText("HKDF Key Derivation")).toBeInTheDocument();
    expect(screen.getByText("Authenticated Data Binding")).toBeInTheDocument();
    expect(screen.getByText("Zero Knowledge")).toBeInTheDocument();
    expect(screen.getByText("Key Never Leaves the Browser")).toBeInTheDocument();
    expect(screen.getByText("One-Time Viewing")).toBeInTheDocument();
    expect(screen.getByText("Auto-Expiration")).toBeInTheDocument();
  });

  it("closes on X button", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SecurityModal />);

    await user.click(screen.getByLabelText("How It Works"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.click(screen.getByLabelText("Close"));
    // The modal animates out (plan 004 exit) before unmounting.
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("closes on overlay click", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SecurityModal />);

    await user.click(screen.getByLabelText("How It Works"));
    const overlay = document.querySelector(".modal-overlay")!;
    await user.click(overlay);
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("does not close when clicking inside modal", async () => {
    const user = userEvent.setup();
    renderWithProviders(<SecurityModal />);

    await user.click(screen.getByLabelText("How It Works"));
    const modal = screen.getByRole("dialog");
    await user.click(modal);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });
});
