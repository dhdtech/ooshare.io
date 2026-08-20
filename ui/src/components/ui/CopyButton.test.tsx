import { describe, it, expect, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../test/render";
import CopyButton from "./CopyButton";

describe("CopyButton", () => {
  it("renders the copy label and appropriate aria-label", () => {
    renderWithProviders(
      <CopyButton
        text="secret"
        copyLabel="Copy"
        copiedLabel="Copied"
        toastMessage="Copied to clipboard"
      />,
    );
    expect(screen.getByLabelText("Copy")).toBeInTheDocument();
    expect(screen.getByText("Copy")).toBeInTheDocument();
  });

  it("copies the text, shows Copied state, and fires a toast", async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator.clipboard, { writeText });
    renderWithProviders(<CopyButton
        text="copy-me"
        copyLabel="Copy"
        copiedLabel="Copied"
        toastMessage="Copied to clipboard"
      />,
    );

    await user.click(screen.getByLabelText("Copy"));

    await waitFor(() => expect(writeText).toHaveBeenCalledWith("copy-me"));
    expect(screen.getByText("Copied")).toBeInTheDocument();
    // toast appears
    expect(screen.getByText("Copied to clipboard")).toBeInTheDocument();
  });

  it("calls onCopy after a successful copy", async () => {
    const user = userEvent.setup();
    const onCopy = vi.fn();
    renderWithProviders(
      <CopyButton
        text="x"
        copyLabel="Copy"
        copiedLabel="Copied"
        toastMessage="Done"
        onCopy={onCopy}
      />,
    );
    await user.click(screen.getByLabelText("Copy"));
    await waitFor(() => expect(onCopy).toHaveBeenCalledTimes(1));
  });
});
