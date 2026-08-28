import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../test/render";
import ViewSecret from "./ViewSecret";
import * as api from "../lib/api";
import * as cryptoLib from "../lib/crypto";

// Mock react-router-dom's useParams
const mockUseParams = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useParams: () => mockUseParams() };
});

vi.mock("../lib/api");
vi.mock("../lib/crypto");

beforeEach(() => {
  vi.clearAllMocks();
  mockUseParams.mockReturnValue({ id: "test-alias" });

  vi.mocked(cryptoLib.importKey).mockResolvedValue("mock-key" as unknown as CryptoKey);
  vi.mocked(cryptoLib.decrypt).mockResolvedValue(new Uint8Array([0]));
  vi.mocked(cryptoLib.decodePayload).mockReturnValue({ text: "decrypted secret" });

  Object.defineProperty(window, "location", {
    writable: true,
    value: { ...window.location, hash: "#mock-key-string" },
  });
});

describe("ViewSecret", () => {
  it("shows loading state initially", () => {
    vi.mocked(api.getSecret).mockReturnValue(new Promise(() => {}));
    renderWithProviders(<ViewSecret />);
    expect(
      screen.getByText("Retrieving and decrypting secret..."),
    ).toBeInTheDocument();
  });

  it("shows decrypted secret on success", async () => {
    vi.mocked(api.getSecret).mockResolvedValue({
      ciphertext: "encrypted",
      id: "real-uuid",
    });

    renderWithProviders(<ViewSecret />);

    await waitFor(() => {
      expect(screen.getByText("decrypted secret")).toBeInTheDocument();
    });
    expect(screen.getByText(/permanently destroyed/i)).toBeInTheDocument();
  });

  it("shows not-found when secret already viewed", async () => {
    vi.mocked(api.getSecret).mockRejectedValue(
      new Error("Secret not found or already viewed"),
    );

    renderWithProviders(<ViewSecret />);

    await waitFor(() => {
      expect(screen.getByText("Secret Not Available")).toBeInTheDocument();
    });
  });

  it("shows error state on decrypt failure", async () => {
    vi.mocked(api.getSecret).mockResolvedValue({
      ciphertext: "ct",
      id: "uuid",
    });
    vi.mocked(cryptoLib.decrypt).mockRejectedValue(
      new Error("Decryption failed"),
    );

    renderWithProviders(<ViewSecret />);

    await waitFor(() => {
      expect(screen.getByText("Something Went Wrong")).toBeInTheDocument();
      expect(screen.getByText("Decryption failed")).toBeInTheDocument();
    });
  });

  it("shows error for non-Error exceptions", async () => {
    vi.mocked(api.getSecret).mockRejectedValue("string error");

    renderWithProviders(<ViewSecret />);

    await waitFor(() => {
      expect(screen.getByText("Something Went Wrong")).toBeInTheDocument();
    });
  });

  it("shows error when hash is missing", async () => {
    Object.defineProperty(window, "location", {
      writable: true,
      value: { ...window.location, hash: "" },
    });

    renderWithProviders(<ViewSecret />);

    await waitFor(() => {
      expect(screen.getByText("Something Went Wrong")).toBeInTheDocument();
    });
  });

  it("shows error when id is missing", async () => {
    mockUseParams.mockReturnValue({ id: undefined });

    renderWithProviders(<ViewSecret />);

    await waitFor(() => {
      expect(screen.getByText("Something Went Wrong")).toBeInTheDocument();
    });
  });

  it("copy button copies decrypted secret", async () => {
    vi.mocked(api.getSecret).mockResolvedValue({
      ciphertext: "ct",
      id: "uuid",
    });

    const user = userEvent.setup();
    renderWithProviders(<ViewSecret />);

    await waitFor(() => screen.getByText("decrypted secret"));

    // Spy on the clipboard mock from setup.ts right before clicking
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator.clipboard, { writeText });
    await user.click(screen.getByLabelText("Copy secret"));

    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith("decrypted secret");
      expect(screen.getByText("Copied to clipboard")).toBeInTheDocument();
    });
  });

  it("shows 'Send your own secure secret' CTA when revealed", async () => {
    vi.mocked(api.getSecret).mockResolvedValue({
      ciphertext: "ct",
      id: "uuid",
    });

    renderWithProviders(<ViewSecret />);

    await waitFor(() => {
      expect(screen.getByText("Send your own secure secret")).toBeInTheDocument();
    });
  });

  it("shows 'Back to home' link on error", async () => {
    vi.mocked(api.getSecret).mockRejectedValue(
      new Error("Secret not found"),
    );

    renderWithProviders(<ViewSecret />);

    await waitFor(() => {
      expect(screen.getByText("Back to home")).toBeInTheDocument();
    });
  });

  describe("image display", () => {
    beforeEach(() => {
      URL.createObjectURL = vi.fn().mockReturnValue("blob:mock-url") as typeof URL.createObjectURL;
      URL.revokeObjectURL = vi.fn() as typeof URL.revokeObjectURL;
    });

    it("renders image when payload contains an image", async () => {
      vi.mocked(cryptoLib.decodePayload).mockReturnValue({
        text: "",
        image: { mime: "image/png", data: new Uint8Array([1, 2, 3]) },
      });
      vi.mocked(api.getSecret).mockResolvedValue({ ciphertext: "ct", id: "uuid" });

      renderWithProviders(<ViewSecret />);
      await waitFor(() => {
        expect(screen.getByRole("img")).toBeInTheDocument();
      });
      expect(screen.getByText(/click image to enlarge/i)).toBeInTheDocument();
    });

    it("renders both text and image", async () => {
      vi.mocked(cryptoLib.decodePayload).mockReturnValue({
        text: "secret text",
        image: { mime: "image/jpeg", data: new Uint8Array([1]) },
      });
      vi.mocked(api.getSecret).mockResolvedValue({ ciphertext: "ct", id: "uuid" });

      renderWithProviders(<ViewSecret />);
      await waitFor(() => {
        expect(screen.getByText("secret text")).toBeInTheDocument();
        expect(screen.getByRole("img")).toBeInTheDocument();
      });
    });

    it("opens modal when image is clicked", async () => {
      vi.mocked(cryptoLib.decodePayload).mockReturnValue({
        text: "",
        image: { mime: "image/png", data: new Uint8Array([1]) },
      });
      vi.mocked(api.getSecret).mockResolvedValue({ ciphertext: "ct", id: "uuid" });

      renderWithProviders(<ViewSecret />);
      await waitFor(() => {
        expect(screen.getByRole("img")).toBeInTheDocument();
      });

      await userEvent.click(screen.getByRole("img"));
      expect(screen.getByLabelText(/close image/i)).toBeInTheDocument();
    });

    it("closes modal when X button is clicked", async () => {
      vi.mocked(cryptoLib.decodePayload).mockReturnValue({
        text: "",
        image: { mime: "image/png", data: new Uint8Array([1]) },
      });
      vi.mocked(api.getSecret).mockResolvedValue({ ciphertext: "ct", id: "uuid" });

      renderWithProviders(<ViewSecret />);
      await waitFor(() => {
        expect(screen.getByRole("img")).toBeInTheDocument();
      });

      await userEvent.click(screen.getByRole("img"));
      await userEvent.click(screen.getByLabelText(/close image/i));
      expect(screen.queryByLabelText(/close image/i)).not.toBeInTheDocument();
    });

    it("closes modal when overlay is clicked", async () => {
      vi.mocked(cryptoLib.decodePayload).mockReturnValue({
        text: "",
        image: { mime: "image/png", data: new Uint8Array([1]) },
      });
      vi.mocked(api.getSecret).mockResolvedValue({ ciphertext: "ct", id: "uuid" });

      renderWithProviders(<ViewSecret />);
      await waitFor(() => {
        expect(screen.getByRole("img")).toBeInTheDocument();
      });

      await userEvent.click(screen.getByRole("img"));
      // Click the overlay (modal-overlay element)
      const overlay = document.querySelector(".image-modal-overlay") as HTMLElement;
      await userEvent.click(overlay);
      expect(screen.queryByLabelText(/close image/i)).not.toBeInTheDocument();
    });

    it("revokes blob URL on unmount", async () => {
      vi.mocked(cryptoLib.decodePayload).mockReturnValue({
        text: "",
        image: { mime: "image/png", data: new Uint8Array([1]) },
      });
      vi.mocked(api.getSecret).mockResolvedValue({ ciphertext: "ct", id: "uuid" });

      const { unmount } = renderWithProviders(<ViewSecret />);
      await waitFor(() => {
        expect(screen.getByRole("img")).toBeInTheDocument();
      });

      unmount();
      expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:mock-url");
    });

    it("renders download UI for ZIP archive", async () => {
      vi.mocked(cryptoLib.decodePayload).mockReturnValue({
        text: "",
        image: { mime: "application/zip", data: new Uint8Array([1, 2, 3]) },
      });
      vi.mocked(api.getSecret).mockResolvedValue({ ciphertext: "ct", id: "uuid" });

      renderWithProviders(<ViewSecret />);
      await waitFor(() => {
        expect(screen.getByText("An archive file is attached to this secret")).toBeInTheDocument();
        expect(screen.getByText("Download Archive")).toBeInTheDocument();
      });
    });

    it("renders download UI for RAR archive", async () => {
      vi.mocked(cryptoLib.decodePayload).mockReturnValue({
        text: "",
        image: { mime: "application/vnd.rar", data: new Uint8Array([1]) },
      });
      vi.mocked(api.getSecret).mockResolvedValue({ ciphertext: "ct", id: "uuid" });

      renderWithProviders(<ViewSecret />);
      await waitFor(() => {
        expect(screen.getByText("An archive file is attached to this secret")).toBeInTheDocument();
      });
    });

    it("sets correct file extension for archive download", async () => {
      vi.mocked(cryptoLib.decodePayload).mockReturnValue({
        text: "",
        image: { mime: "application/zip", data: new Uint8Array([1]) },
      });
      vi.mocked(api.getSecret).mockResolvedValue({ ciphertext: "ct", id: "uuid" });

      renderWithProviders(<ViewSecret />);
      await waitFor(() => {
        const link = screen.getByText("Download Archive").closest("a");
        expect(link).toHaveAttribute("download", "secret.zip");
      });
    });

    it("revokes archive blob URL on unmount", async () => {
      vi.mocked(cryptoLib.decodePayload).mockReturnValue({
        text: "",
        image: { mime: "application/zip", data: new Uint8Array([1]) },
      });
      vi.mocked(api.getSecret).mockResolvedValue({ ciphertext: "ct", id: "uuid" });

      const { unmount } = renderWithProviders(<ViewSecret />);
      await waitFor(() => {
        expect(screen.getByText("An archive file is attached to this secret")).toBeInTheDocument();
      });

      unmount();
      expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:mock-url");
    });
  });
});
