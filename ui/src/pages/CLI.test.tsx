import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../test/render";
import CLI from "./CLI";

const RELEASES_URL = "https://github.com/dhdtech/ooshare.io/releases";
const GHA_MARKETPLACE_URL = "https://github.com/marketplace/actions/ooshare-action";

const GHA_SNIPPET = [
  "- uses: dhdtech/ooshare-action@v1",
  "  id: share",
  "  with:",
  "    command: create",
  "    text: ${{ secrets.MY_SECRET }}   # always a GitHub secret, never a literal",
  "# → steps.share.outputs.url  (one-time link, TTL 24h, self-destructs on reveal)",
].join("\n");

describe("CLI page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the hero title and subtitle", () => {
    renderWithProviders(<CLI />);
    expect(screen.getByRole("heading", { level: 1, name: "ooshare CLI" })).toBeInTheDocument();
    expect(
      screen.getByText(/Create and reveal one-time secrets from the terminal/i),
    ).toBeInTheDocument();
  });

  it("renders all 6 OS install tabs", () => {
    renderWithProviders(<CLI />);
    for (const name of [
      "Install: macOS — Homebrew",
      "Install: Linux — apt (Debian/Ubuntu)",
      "Install: Linux — dnf (RHEL/Fedora)",
      "Install: Windows — winget",
      "Install: Windows — Scoop",
      "Install: Direct download",
    ]) {
      expect(screen.getByRole("button", { name })).toBeInTheDocument();
    }
  });

  it("shows the macOS command by default and marks it active", () => {
    renderWithProviders(<CLI />);
    expect(
      screen.getByText("brew tap dhdtech/ooshare && brew trust dhdtech/ooshare && brew install ooshare"),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Install: macOS — Homebrew" }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("shows the winget command when the Windows tab is selected", async () => {
    const user = userEvent.setup();
    renderWithProviders(<CLI />);
    await user.click(screen.getByRole("button", { name: "Install: Windows — winget" }));
    expect(screen.getByText("winget install dhdtech.ooshare")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Install: Windows — winget" }),
    ).toHaveAttribute("aria-pressed", "true");
  });

  it("shows the apt multi-line command for the Debian/Ubuntu tab", async () => {
    const user = userEvent.setup();
    renderWithProviders(<CLI />);
    await user.click(screen.getByRole("button", { name: "Install: Linux — apt (Debian/Ubuntu)" }));
    expect(
      screen.getByText(/sudo apt update && sudo apt install ooshare/),
    ).toBeInTheDocument();
  });

  it("shows the download link for the Direct download tab", async () => {
    const user = userEvent.setup();
    renderWithProviders(<CLI />);
    await user.click(screen.getByRole("button", { name: "Install: Direct download" }));
    const downloadLink = screen.getByRole("link", { name: "or download the binary" });
    expect(downloadLink).toHaveAttribute("href", RELEASES_URL);
    expect(downloadLink).toHaveAttribute("target", "_blank");
  });

  it("copies the selected command to the clipboard", async () => {
    const user = userEvent.setup();
    renderWithProviders(<CLI />);
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator.clipboard, { writeText });

    // The first copy button is the install card's; copy the default macOS command.
    await user.click(screen.getAllByRole("button", { name: "Copy" })[0]);

    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith(
        "brew tap dhdtech/ooshare && brew trust dhdtech/ooshare && brew install ooshare",
      );
      expect(screen.getByText("Copied")).toBeInTheDocument();
    });
  });

  it("renders the security reassurance bullets", () => {
    renderWithProviders(<CLI />);
    expect(screen.getByText(/Same encryption — AES-256-GCM/)).toBeInTheDocument();
    expect(screen.getByText(/Zero-knowledge — the master key/)).toBeInTheDocument();
    expect(screen.getByText(/One-time — secrets are atomically deleted/)).toBeInTheDocument();
  });

  it("links the security reassurance to /security", () => {
    renderWithProviders(<CLI />);
    expect(
      screen.getByRole("link", { name: "Learn more about our security" }),
    ).toHaveAttribute("href", "/security");
  });

  it("renders the GitHub Actions promo section", () => {
    renderWithProviders(<CLI />);
    expect(
      screen.getByRole("heading", { name: "GitHub Actions" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Create one-time secrets straight from your workflows/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Drop this into any workflow/i)).toBeInTheDocument();
  });

  it("renders the GitHub Actions workflow snippet verbatim", () => {
    renderWithProviders(<CLI />);
    expect(screen.getAllByText(/dhdtech\/ooshare-action@v1/).length).toBeGreaterThan(0);
    expect(screen.getByText(/secrets\.MY_SECRET/)).toBeInTheDocument();
    expect(screen.getByText(/steps\.share\.outputs\.url/)).toBeInTheDocument();
  });

  it("links the promo button to the GitHub Marketplace", () => {
    renderWithProviders(<CLI />);
    const link = screen.getByRole("link", {
      name: "View on GitHub Marketplace",
    });
    expect(link).toHaveAttribute("href", GHA_MARKETPLACE_URL);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("copies the GitHub Actions snippet to the clipboard", async () => {
    const user = userEvent.setup();
    renderWithProviders(<CLI />);
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator.clipboard, { writeText });

    const section = screen.getByText("GitHub Actions").closest("section")!;
    const copyButton = within(section).getByRole("button", { name: "Copy" });

    await user.click(copyButton);

    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith(GHA_SNIPPET);
      expect(screen.getByText("Copied")).toBeInTheDocument();
    });
  });

  it("renders the final CTA linked to /", () => {
    renderWithProviders(<CLI />);
    expect(screen.getByText("Start sharing from your terminal")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Create a secret on the web" }),
    ).toHaveAttribute("href", "/");
  });

  it("registers the SoftwareApplication JSON-LD schema", () => {
    renderWithProviders(<CLI />);
    const script = document.querySelector("script[data-cli-schema]");
    expect(script).not.toBeNull();
    const schema = JSON.parse(script!.textContent ?? "{}");
    expect(schema["@type"]).toBe("SoftwareApplication");
    expect(schema.name).toBe("ooshare CLI");
    expect(schema.downloadUrl).toBe(RELEASES_URL);
    expect(schema.operatingSystem).toBe("macOS, Linux, Windows");
  });
});
