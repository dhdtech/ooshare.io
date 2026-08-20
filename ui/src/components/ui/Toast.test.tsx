import { describe, it, expect, vi, afterEach } from "vitest";
import { screen, fireEvent, render, waitFor } from "@testing-library/react";
import { renderWithProviders } from "../../test/render";
import { ToastProvider, useToast } from "./Toast";
import { Button } from "./index";

function ToastTrigger({ msg = "hello", variant }: { msg?: string; variant?: "success" | "info" | "error" }) {
  const { showToast } = useToast();
  return (
    <Button type="button" variant="secondary" onClick={() => showToast(msg, variant)}>
      Show toast
    </Button>
  );
}

describe("Toast", () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders a toast when showToast is called", () => {
    renderWithProviders(
      <ToastProvider>
        <ToastTrigger msg="Toasted!" variant="success" />
      </ToastProvider>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Show toast" }));
    expect(screen.getByText("Toasted!")).toBeInTheDocument();
    expect(document.querySelector(".ui-toast--success .ui-toast__icon svg")).toBeInTheDocument();
  });

  it("renders the live region as polite", () => {
    renderWithProviders(
      <ToastProvider>
        <ToastTrigger msg="hi" />
      </ToastProvider>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Show toast" }));
    const viewport = document.querySelector(".ui-toast-viewport")!;
    expect(viewport).toHaveAttribute("aria-live", "polite");
  });

  it("auto-dismisses after the timeout", async () => {
    renderWithProviders(
      <ToastProvider>
        <ToastTrigger msg="gone" />
      </ToastProvider>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Show toast" }));
    expect(screen.getByText("gone")).toBeInTheDocument();
    // Real timers are required here: the plan-005 exit runs through motion's
    // requestAnimationFrame loop, which vitest's fake-timer rAF cannot drive
    // to completion. Await the full auto-dismiss (4000ms) plus the exit.
    await waitFor(() => expect(screen.queryByText("gone")).not.toBeInTheDocument(), {
      timeout: 6000,
    });
  });

  it("dismisses a toast manually via its close button", async () => {
    renderWithProviders(
      <ToastProvider>
        <ToastTrigger msg="dismiss-me" />
      </ToastProvider>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Show toast" }));
    expect(screen.getByText("dismiss-me")).toBeInTheDocument();
    fireEvent.click(screen.getByLabelText("Dismiss notification"));
    // The toast animates out (plan 005 exit) before unmounting.
    await waitFor(() => expect(screen.queryByText("dismiss-me")).not.toBeInTheDocument());
  });

  it("caps the visible toast queue to the most recent three", async () => {
    function MultiFire() {
      const { showToast } = useToast();
      const fire = (msg: string) => showToast(msg, "info");
      return (
        <>
          <Button type="button" variant="secondary" onClick={() => fire("toast-1")}>f1</Button>
          <Button type="button" variant="secondary" onClick={() => fire("toast-2")}>f2</Button>
          <Button type="button" variant="secondary" onClick={() => fire("toast-3")}>f3</Button>
          <Button type="button" variant="secondary" onClick={() => fire("toast-4")}>f4</Button>
        </>
      );
    }
    renderWithProviders(<ToastProvider><MultiFire /></ToastProvider>);
    fireEvent.click(screen.getByRole("button", { name: "f1" }));
    fireEvent.click(screen.getByRole("button", { name: "f2" }));
    fireEvent.click(screen.getByRole("button", { name: "f3" }));
    fireEvent.click(screen.getByRole("button", { name: "f4" }));
    // oldest (toast-1) is trimmed; it animates out (plan 005 exit) before unmounting.
    await waitFor(() => expect(screen.queryByText("toast-1")).not.toBeInTheDocument());
    expect(screen.getByText("toast-4")).toBeInTheDocument();
  });

  it("throws when useToast is used outside a provider", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    function Bad() {
      useToast();
      return null;
    }
    // Use plain render (no ToastProvider) so the hook throws.
    expect(() => render(<Bad />)).toThrow(/ToastProvider/);
    (console.error as ReturnType<typeof vi.fn>).mockRestore();
  });
});
