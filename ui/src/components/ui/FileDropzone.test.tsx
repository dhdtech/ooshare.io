import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../test/render";
import FileDropzone, { formatFileSize, isPdf, isArchive, MAX_FILE_SIZE, ACCEPTED_TYPES } from "./FileDropzone";

const labels = {
  label: "Drag & drop a file here",
  hint: "or click to browse",
  limit: "Max 10 MB",
  activeLabel: "Drop your file here",
  invalidType: "Invalid type",
  tooLarge: "File too large",
  removeLabel: "Remove file",
  previewAlt: "File preview",
};

function makeFile(name: string, type: string, size = 5000): File {
  const f = new File(["data"], name, { type });
  Object.defineProperty(f, "size", { value: size });
  return f;
}

describe("FileDropzone", () => {
  beforeEach(() => {
    URL.createObjectURL = vi.fn().mockReturnValue("blob:mock-url") as typeof URL.createObjectURL;
    URL.revokeObjectURL = vi.fn() as typeof URL.revokeObjectURL;
  });

  it("renders label, hint and limit", () => {
    renderWithProviders(<FileDropzone labels={labels} onChange={() => {}} />);
    expect(screen.getByText("Drag & drop a file here")).toBeInTheDocument();
    expect(screen.getByText("or click to browse")).toBeInTheDocument();
    expect(screen.getByText("Max 10 MB")).toBeInTheDocument();
  });

  it("shows active label on drag enter and resets on drag leave", () => {
    renderWithProviders(<FileDropzone labels={labels} onChange={() => {}} />);
    const dropzone = screen.getByText("Drag & drop a file here").closest(".dropzone")!;
    fireEvent.dragEnter(dropzone, { dataTransfer: { files: [] } });
    expect(screen.getByText("Drop your file here")).toBeInTheDocument();
    fireEvent.dragLeave(dropzone, { dataTransfer: { files: [] } });
    expect(screen.getByText("Drag & drop a file here")).toBeInTheDocument();
  });

  it("rejects an invalid type and calls onChange(null)", () => {
    const onChange = vi.fn();
    renderWithProviders(<FileDropzone labels={labels} onChange={onChange} />);
    const dropzone = screen.getByText("Drag & drop a file here").closest(".dropzone")!;
    fireEvent.drop(dropzone, { dataTransfer: { files: [makeFile("bad.txt", "text/plain")] } });
    expect(screen.getByRole("alert")).toHaveTextContent("Invalid type");
    expect(onChange).toHaveBeenCalledWith(null);
  });

  it("rejects files over MAX_FILE_SIZE", () => {
    const onChange = vi.fn();
    renderWithProviders(<FileDropzone labels={labels} onChange={onChange} />);
    const dropzone = screen.getByText("Drag & drop a file here").closest(".dropzone")!;
    fireEvent.drop(dropzone, { dataTransfer: { files: [makeFile("big.png", "image/png", MAX_FILE_SIZE + 1)] } });
    expect(screen.getByRole("alert")).toHaveTextContent("File too large");
    expect(onChange).toHaveBeenCalledWith(null);
  });

  it("accepts a ZIP via drag and drop with archive icon", () => {
    const onChange = vi.fn();
    renderWithProviders(<FileDropzone labels={labels} onChange={onChange} />);
    const dropzone = screen.getByText("Drag & drop a file here").closest(".dropzone")!;
    fireEvent.drop(dropzone, { dataTransfer: { files: [makeFile("archive.zip", "application/zip")] } });
    expect(screen.getByText("archive.zip")).toBeInTheDocument();
    expect(screen.getByText("4.9 KB")).toBeInTheDocument();
    expect(screen.queryByAltText("File preview")).not.toBeInTheDocument();
    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ name: "archive.zip" }));
  });

  it("accepts an image and shows a thumbnail preview", () => {
    const onChange = vi.fn();
    renderWithProviders(<FileDropzone labels={labels} onChange={onChange} />);
    const dropzone = screen.getByText("Drag & drop a file here").closest(".dropzone")!;
    fireEvent.drop(dropzone, { dataTransfer: { files: [makeFile("photo.png", "image/png")] } });
    expect(screen.getByAltText("File preview")).toHaveAttribute("src", "blob:mock-url");
    expect(onChange).toHaveBeenCalled();
  });

  it("removes the file via the remove button and calls onChange(null)", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    renderWithProviders(<FileDropzone labels={labels} onChange={onChange} />);
    const dropzone = screen.getByText("Drag & drop a file here").closest(".dropzone")!;
    fireEvent.drop(dropzone, { dataTransfer: { files: [makeFile("photo.png", "image/png")] } });
    expect(screen.getByText("photo.png")).toBeInTheDocument();
    await user.click(screen.getByLabelText("Remove file"));
    expect(screen.queryByText("photo.png")).not.toBeInTheDocument();
    expect(screen.getByText("Drag & drop a file here")).toBeInTheDocument();
    expect(onChange).toHaveBeenCalledWith(null);
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:mock-url");
  });

  it("opens the file picker when the zone is clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(<FileDropzone labels={labels} onChange={() => {}} />);
    const dropzone = screen.getByText("Drag & drop a file here").closest(".dropzone")!;
    const input = dropzone.querySelector('input[type="file"]') as HTMLInputElement;
    const clickSpy = vi.spyOn(input, "click");
    await user.click(dropzone);
    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  it("accepts a file picked via the native file input", () => {
    const onChange = vi.fn();
    renderWithProviders(<FileDropzone labels={labels} onChange={onChange} />);
    const dropzone = screen.getByText("Drag & drop a file here").closest(".dropzone")!;
    const input = dropzone.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(input, { target: { files: [makeFile("picked.png", "image/png")] } });
    expect(screen.getByAltText("File preview")).toHaveAttribute("src", "blob:mock-url");
    expect(onChange).toHaveBeenCalled();
  });

  it("opens the picker on Enter key press", () => {
    renderWithProviders(<FileDropzone labels={labels} onChange={() => {}} />);
    const dropzone = screen.getByText("Drag & drop a file here").closest(".dropzone")!;
    const input = dropzone.querySelector('input[type="file"]') as HTMLInputElement;
    const clickSpy = vi.spyOn(input, "click");
    fireEvent.keyDown(dropzone, { key: "Enter" });
    expect(clickSpy).toHaveBeenCalledTimes(1);
  });
});

describe("FileDropzone helpers", () => {
  it("formats file sizes", () => {
    expect(formatFileSize(500)).toBe("500 B");
    expect(formatFileSize(2048)).toBe("2.0 KB");
    expect(formatFileSize(5 * 1024 * 1024)).toBe("5.0 MB");
  });

  it("classifies pdf and archive types", () => {
    expect(isPdf(makeFile("a.pdf", "application/pdf"))).toBe(true);
    expect(isPdf(null)).toBe(false);
    expect(isArchive(makeFile("a.zip", "application/zip"))).toBe(true);
    expect(isArchive(makeFile("a.rar", "application/vnd.rar"))).toBe(true);
    expect(isArchive(null)).toBe(false);
    expect(isArchive(makeFile("a.png", "image/png"))).toBe(false);
  });

  it("exports a max file size and accepted type list", () => {
    expect(MAX_FILE_SIZE).toBe(10 * 1024 * 1024);
    expect(ACCEPTED_TYPES).toContain("image/png");
    expect(ACCEPTED_TYPES).toContain("application/pdf");
  });
});
