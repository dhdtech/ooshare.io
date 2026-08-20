import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../test/render";
import CreateSecret from "./CreateSecret";

vi.mock("../lib/crypto", () => ({
  generateKey: vi.fn().mockResolvedValue("mock-key"),
  exportKey: vi.fn().mockResolvedValue("mock-exported-key"),
  encrypt: vi.fn().mockResolvedValue("mock-ciphertext"),
  encodePayload: vi.fn().mockReturnValue(new Uint8Array([0])),
}));

vi.mock("../lib/api", () => ({
  createSecret: vi
    .fn()
    .mockResolvedValue({ id: "mock-uuid", alias: "AbCd1234" }),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("CreateSecret", () => {
  it("renders the form", () => {
    renderWithProviders(<CreateSecret />);
    expect(screen.getByText("Share secrets securely")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/paste your password/i),
    ).toBeInTheDocument();
    expect(screen.getByText("Create Secret Link")).toBeInTheDocument();
  });

  it("shows character count", async () => {
    const user = userEvent.setup();
    renderWithProviders(<CreateSecret />);

    const textarea = screen.getByPlaceholderText(/paste your password/i);
    await user.type(textarea, "hello");
    expect(screen.getByText("5 / 50,000")).toBeInTheDocument();
  });

  it("renders all TTL options", () => {
    renderWithProviders(<CreateSecret />);
    for (const label of ["1h", "4h", "12h", "24h", "48h", "72h"]) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
  });

  it("24h TTL is selected by default", () => {
    renderWithProviders(<CreateSecret />);
    // The segment label now lives in an inner span; aria-pressed is on the button.
    const btn = screen.getByRole("button", { name: "Expires in: 24h" });
    expect(btn).toHaveAttribute("aria-pressed", "true");
  });

  it("changes TTL selection", async () => {
    const user = userEvent.setup();
    renderWithProviders(<CreateSecret />);

    await user.click(screen.getByRole("button", { name: "Expires in: 1h" }));
    expect(screen.getByRole("button", { name: "Expires in: 1h" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Expires in: 24h" })).toHaveAttribute("aria-pressed", "false");
  });

  it("submit is disabled when neither text nor image is present", () => {
    renderWithProviders(<CreateSecret />);
    expect(screen.getByText("Create Secret Link").closest("button")).toBeDisabled();
  });

  it("submits and shows link result", async () => {
    const user = userEvent.setup();
    renderWithProviders(<CreateSecret />);

    await user.type(
      screen.getByPlaceholderText(/paste your password/i),
      "my secret",
    );
    await user.click(screen.getByText("Create Secret Link"));

    await waitFor(() => {
      expect(screen.getByText("Secret link created")).toBeInTheDocument();
    });

    // Link should use alias
    expect(screen.getByText(/AbCd1234/)).toBeInTheDocument();
  });

  it("shows share buttons after creation", async () => {
    const user = userEvent.setup();
    renderWithProviders(<CreateSecret />);

    await user.type(
      screen.getByPlaceholderText(/paste your password/i),
      "test",
    );
    await user.click(screen.getByText("Create Secret Link"));

    await waitFor(() => {
      expect(screen.getByText("Copy")).toBeInTheDocument();
      expect(screen.getByText("WhatsApp")).toBeInTheDocument();
      expect(screen.getByText("Email")).toBeInTheDocument();
    });
  });

  it("whatsapp link has correct href", async () => {
    const user = userEvent.setup();
    renderWithProviders(<CreateSecret />);

    await user.type(
      screen.getByPlaceholderText(/paste your password/i),
      "test",
    );
    await user.click(screen.getByText("Create Secret Link"));

    await waitFor(() => {
      const link = screen.getByLabelText("WhatsApp");
      expect(link).toHaveAttribute("href", expect.stringContaining("wa.me"));
    });
  });

  it("email link has correct href", async () => {
    const user = userEvent.setup();
    renderWithProviders(<CreateSecret />);

    await user.type(
      screen.getByPlaceholderText(/paste your password/i),
      "test",
    );
    await user.click(screen.getByText("Create Secret Link"));

    await waitFor(() => {
      const link = screen.getByLabelText("Email");
      expect(link).toHaveAttribute("href", expect.stringContaining("mailto:"));
    });
  });

  it("copy button copies link to clipboard", async () => {
    const user = userEvent.setup();
    renderWithProviders(<CreateSecret />);

    await user.type(
      screen.getByPlaceholderText(/paste your password/i),
      "test",
    );
    await user.click(screen.getByText("Create Secret Link"));

    await waitFor(() => screen.getByText("Copy"));

    // Spy on the clipboard mock from setup.ts right before clicking
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.assign(navigator.clipboard, { writeText });
    await user.click(screen.getByLabelText("Copy"));

    await waitFor(() => {
      expect(writeText).toHaveBeenCalled();
      expect(screen.getByText("Copied")).toBeInTheDocument();
    });
  });

  it("create another resets to form", async () => {
    const user = userEvent.setup();
    renderWithProviders(<CreateSecret />);

    await user.type(
      screen.getByPlaceholderText(/paste your password/i),
      "test",
    );
    await user.click(screen.getByText("Create Secret Link"));

    await waitFor(() => screen.getByText("Create Another"));
    await user.click(screen.getByText("Create Another"));

    expect(
      screen.getByPlaceholderText(/paste your password/i),
    ).toBeInTheDocument();
  });

  it("shows error on API failure", async () => {
    const { createSecret } = await import("../lib/api");
    vi.mocked(createSecret).mockRejectedValueOnce(new Error("Network error"));

    const user = userEvent.setup();
    renderWithProviders(<CreateSecret />);

    await user.type(
      screen.getByPlaceholderText(/paste your password/i),
      "test",
    );
    await user.click(screen.getByText("Create Secret Link"));

    await waitFor(() => {
      expect(screen.getByText("Network error")).toBeInTheDocument();
    });
  });

  it("shows generic error for non-Error throws", async () => {
    const { encrypt } = await import("../lib/crypto");
    vi.mocked(encrypt).mockRejectedValueOnce("string error");

    const user = userEvent.setup();
    renderWithProviders(<CreateSecret />);

    await user.type(
      screen.getByPlaceholderText(/paste your password/i),
      "test",
    );
    await user.click(screen.getByText("Create Secret Link"));

    await waitFor(() => {
      expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    });
  });

  it("renders drop zone", () => {
    renderWithProviders(<CreateSecret />);
    expect(screen.getByText("Drag & drop a file here")).toBeInTheDocument();
    expect(screen.getByText("or click to browse")).toBeInTheDocument();
    expect(screen.getByText(/Max 25 MB/)).toBeInTheDocument();
  });

  it("shows drag active state on dragenter", () => {
    renderWithProviders(<CreateSecret />);
    const dropzone = screen.getByText("Drag & drop a file here").closest(".dropzone")!;

    fireEvent.dragEnter(dropzone, { dataTransfer: { files: [] } });
    expect(screen.getByText("Drop your file here")).toBeInTheDocument();
  });

  it("shows drag active state on dragover and resets on dragleave", () => {
    renderWithProviders(<CreateSecret />);
    const dropzone = screen.getByText("Drag & drop a file here").closest(".dropzone")!;

    fireEvent.dragOver(dropzone, { dataTransfer: { files: [] } });
    expect(screen.getByText("Drop your file here")).toBeInTheDocument();

    fireEvent.dragLeave(dropzone, { dataTransfer: { files: [] } });
    expect(screen.getByText("Drag & drop a file here")).toBeInTheDocument();
  });

  it("rejects unsupported file types", async () => {
    renderWithProviders(<CreateSecret />);
    const dropzone = screen.getByText("Drag & drop a file here").closest(".dropzone")!;
    const file = new File(["content"], "test.txt", { type: "text/plain" });

    fireEvent.drop(dropzone, { dataTransfer: { files: [file] } });
    expect(screen.getByText("Only images (JPEG, PNG, GIF, WebP), PDFs, and archives (ZIP, RAR, 7Z, TAR.GZ) are allowed")).toBeInTheDocument();
  });

  it("accepts ZIP archive files", async () => {
    URL.createObjectURL = vi.fn().mockReturnValue("blob:mock-url") as typeof URL.createObjectURL;
    URL.revokeObjectURL = vi.fn() as typeof URL.revokeObjectURL;

    renderWithProviders(<CreateSecret />);
    const dropzone = screen.getByText("Drag & drop a file here").closest(".dropzone")!;
    const file = new File(["zip-data"], "archive.zip", { type: "application/zip" });
    Object.defineProperty(file, "size", { value: 5000 });

    fireEvent.drop(dropzone, { dataTransfer: { files: [file] } });
    expect(screen.getByText("archive.zip")).toBeInTheDocument();
    expect(screen.queryByText(/Only images/)).not.toBeInTheDocument();
  });

  it("accepts RAR archive files", async () => {
    URL.createObjectURL = vi.fn().mockReturnValue("blob:mock-url") as typeof URL.createObjectURL;
    URL.revokeObjectURL = vi.fn() as typeof URL.revokeObjectURL;

    renderWithProviders(<CreateSecret />);
    const dropzone = screen.getByText("Drag & drop a file here").closest(".dropzone")!;
    const file = new File(["rar-data"], "archive.rar", { type: "application/vnd.rar" });
    Object.defineProperty(file, "size", { value: 5000 });

    fireEvent.drop(dropzone, { dataTransfer: { files: [file] } });
    expect(screen.getByText("archive.rar")).toBeInTheDocument();
  });

  it("shows archive icon for ZIP files (no image preview)", async () => {
    URL.createObjectURL = vi.fn().mockReturnValue("blob:mock-url") as typeof URL.createObjectURL;
    URL.revokeObjectURL = vi.fn() as typeof URL.revokeObjectURL;

    renderWithProviders(<CreateSecret />);
    const dropzone = screen.getByText("Drag & drop a file here").closest(".dropzone")!;
    const file = new File(["zip-data"], "docs.zip", { type: "application/zip" });
    Object.defineProperty(file, "size", { value: 5000 });

    fireEvent.drop(dropzone, { dataTransfer: { files: [file] } });
    expect(screen.getByText("docs.zip")).toBeInTheDocument();
    // Should NOT show an img element (archives get icon, not thumbnail)
    expect(screen.queryByAltText("File preview")).not.toBeInTheDocument();
  });

  it("rejects files over MAX_FILE_SIZE", async () => {
    renderWithProviders(<CreateSecret />);
    const dropzone = screen.getByText("Drag & drop a file here").closest(".dropzone")!;
    const bigFile = new File([new ArrayBuffer(26 * 1024 * 1024)], "large.png", { type: "image/png" });

    fireEvent.drop(dropzone, { dataTransfer: { files: [bigFile] } });
    expect(screen.getByText("File must be under 25 MB")).toBeInTheDocument();
  });

  it("shows preview for valid image", async () => {
    URL.createObjectURL = vi.fn().mockReturnValue("blob:mock-url") as typeof URL.createObjectURL;
    URL.revokeObjectURL = vi.fn() as typeof URL.revokeObjectURL;

    renderWithProviders(<CreateSecret />);
    const dropzone = screen.getByText("Drag & drop a file here").closest(".dropzone")!;
    const file = new File(["image-data"], "photo.png", { type: "image/png" });
    Object.defineProperty(file, "size", { value: 5000 });

    fireEvent.drop(dropzone, { dataTransfer: { files: [file] } });
    expect(screen.getByText("photo.png")).toBeInTheDocument();
    expect(screen.getByAltText("File preview")).toBeInTheDocument();
  });

  it("removes image when X button is clicked", async () => {
    URL.createObjectURL = vi.fn().mockReturnValue("blob:mock-url") as typeof URL.createObjectURL;
    URL.revokeObjectURL = vi.fn() as typeof URL.revokeObjectURL;

    const user = userEvent.setup();
    renderWithProviders(<CreateSecret />);
    const dropzone = screen.getByText("Drag & drop a file here").closest(".dropzone")!;
    const file = new File(["image-data"], "photo.png", { type: "image/png" });

    fireEvent.drop(dropzone, { dataTransfer: { files: [file] } });
    expect(screen.getByText("photo.png")).toBeInTheDocument();

    await user.click(screen.getByLabelText("Remove file"));
    expect(screen.queryByText("photo.png")).not.toBeInTheDocument();
    expect(screen.getByText("Drag & drop a file here")).toBeInTheDocument();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:mock-url");
  });

  it("submits with image only (no text)", async () => {
    URL.createObjectURL = vi.fn().mockReturnValue("blob:mock-url") as typeof URL.createObjectURL;
    URL.revokeObjectURL = vi.fn() as typeof URL.revokeObjectURL;

    const user = userEvent.setup();
    renderWithProviders(<CreateSecret />);
    const dropzone = screen.getByText("Drag & drop a file here").closest(".dropzone")!;
    const file = new File(["image-data"], "photo.png", { type: "image/png" });

    fireEvent.drop(dropzone, { dataTransfer: { files: [file] } });

    // Button should be enabled now (image attached, no text needed)
    const submitBtn = screen.getByText("Create Secret Link").closest("button")!;
    expect(submitBtn).not.toBeDisabled();

    await user.click(submitBtn);

    await waitFor(() => {
      expect(screen.getByText("Secret link created")).toBeInTheDocument();
    });
  });

  it("submits with text and image", async () => {
    const { encodePayload } = await import("../lib/crypto");
    URL.createObjectURL = vi.fn().mockReturnValue("blob:mock-url") as typeof URL.createObjectURL;
    URL.revokeObjectURL = vi.fn() as typeof URL.revokeObjectURL;

    const user = userEvent.setup();
    renderWithProviders(<CreateSecret />);

    await user.type(screen.getByPlaceholderText(/paste your password/i), "my text");
    const dropzone = screen.getByText("Drag & drop a file here").closest(".dropzone")!;
    const file = new File(["image-data"], "photo.png", { type: "image/png" });
    fireEvent.drop(dropzone, { dataTransfer: { files: [file] } });

    await user.click(screen.getByText("Create Secret Link").closest("button")!);

    await waitFor(() => {
      expect(encodePayload).toHaveBeenCalledWith(
        "my text",
        expect.objectContaining({ mime: "image/png" }),
      );
      expect(screen.getByText("Secret link created")).toBeInTheDocument();
    });
  });
});
