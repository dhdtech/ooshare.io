import { describe, it, expect, vi } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../test/render";
import ShareButtons, { WhatsAppIcon } from "./ShareButtons";

const base = {
  link: "https://ooshare.io/s/Ab3x#key",
  copyLabel: "Copy",
  copiedLabel: "Copied",
  copyToast: "Link copied to clipboard",
  whatsappLabel: "WhatsApp",
  whatsappHref: "https://wa.me/?text=hi",
  emailLabel: "Email",
  emailHref: "mailto:?subject=secret",
};

describe("ShareButtons", () => {
  it("renders copy, whatsapp and email actions", () => {
    renderWithProviders(<ShareButtons {...base} />);
    expect(screen.getByLabelText("Copy")).toBeInTheDocument();
    expect(screen.getByLabelText("WhatsApp")).toHaveAttribute("href", "https://wa.me/?text=hi");
    expect(screen.getByLabelText("Email")).toHaveAttribute("href", "mailto:?subject=secret");
    expect(screen.getByText("WhatsApp")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
  });

  it("copies the link and shows a toast on copy click", async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator.clipboard, { writeText });
    renderWithProviders(<ShareButtons {...base} />);
    await user.click(screen.getByLabelText("Copy"));
    await waitFor(() => expect(writeText).toHaveBeenCalledWith(base.link));
    expect(screen.getByText("Copied")).toBeInTheDocument();
    expect(screen.getByText("Link copied to clipboard")).toBeInTheDocument();
  });

  it("fires onCopy when provided", async () => {
    const user = userEvent.setup();
    const onCopy = vi.fn();
    renderWithProviders(<ShareButtons {...base} onCopy={onCopy} />);
    await user.click(screen.getByLabelText("Copy"));
    await waitFor(() => expect(onCopy).toHaveBeenCalledTimes(1));
  });
});

describe("WhatsAppIcon", () => {
  it("renders an accessible-hidden svg", () => {
    const { container } = renderWithProviders(<WhatsAppIcon size={20} />);
    const svg = container.querySelector("svg")!;
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).toHaveAttribute("width", "20");
  });
});
