import { describe, it, expect, beforeEach, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../test/render";
import Modal from "./Modal";

describe("Modal", () => {
  const props = { open: true, onClose: vi.fn(), title: "Security" };

  beforeEach(() => {
    props.onClose.mockClear();
  });

  it("renders nothing when closed", () => {
    renderWithProviders(<Modal open={false} onClose={props.onClose} title="Security"><p>body</p></Modal>);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders a dialog with title and body when open", () => {
    renderWithProviders(<Modal {...props}><p>body text</p></Modal>);
    expect(screen.getByRole("dialog", { name: "Security" })).toBeInTheDocument();
    expect(screen.getByText("body text")).toBeInTheDocument();
  });

  it("closes via the X button", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Modal {...props}><p>body</p></Modal>);
    await user.click(screen.getByLabelText("Close"));
    expect(props.onClose).toHaveBeenCalledTimes(1);
  });

  it("closes on Escape key", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Modal {...props}><p>body</p></Modal>);
    await user.keyboard("{Escape}");
    expect(props.onClose).toHaveBeenCalledTimes(1);
  });

  it("closes on backdrop click but not on dialog click", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Modal {...props}><p>body</p></Modal>);
    // click inside dialog should not close
    await user.click(screen.getByText("body"));
    expect(props.onClose).not.toHaveBeenCalled();
    // click the overlay should close
    const overlay = document.querySelector(".modal-overlay")!;
    await user.click(overlay);
    expect(props.onClose).toHaveBeenCalledTimes(1);
  });

  it("uses aria-label for the dialog name when provided", () => {
    renderWithProviders(
      <Modal open onClose={props.onClose} title="Security" aria-label="Accessible name"><p>body</p></Modal>,
    );
    expect(screen.getByRole("dialog", { name: "Accessible name" })).toBeInTheDocument();
  });

  it("traps Tab focus within the dialog", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <Modal {...props}>
        <p>body</p>
        <a href="#one">one</a>
        <a href="#two">two</a>
      </Modal>,
    );
    const dialog = screen.getByRole("dialog", { name: "Security" });
    // Let the mount effect move focus into the dialog (requestAnimationFrame).
    await waitFor(() => expect(dialog).toHaveFocus());
    // Repeated Tab presses must never leave the dialog.
    for (let i = 0; i < 6; i++) {
      await user.tab({ shift: false });
      expect(dialog.contains(document.activeElement)).toBe(true);
    }
  });
});
