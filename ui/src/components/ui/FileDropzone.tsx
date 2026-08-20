import { useEffect, useRef, useState } from "react";
import { Image as ImageIcon, FileText, Archive, X, AlertCircle } from "lucide-react";
import { cn } from "../../lib/cn";

export const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
  "application/zip",
  "application/x-zip-compressed",
  "application/vnd.rar",
  "application/x-rar-compressed",
  "application/x-7z-compressed",
  "application/gzip",
  "application/x-tar",
];

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export const ACCEPT_ATTR =
  "image/jpeg,image/png,image/gif,image/webp,application/pdf,application/zip,application/x-zip-compressed," +
  "application/vnd.rar,application/x-rar-compressed,application/x-7z-compressed,application/gzip," +
  "application/x-tar,.zip,.rar,.7z,.tar.gz,.tgz";

export interface FileDropzoneLabels {
  label: string;
  hint: string;
  limit: string;
  activeLabel: string;
  invalidType: string;
  tooLarge: string;
  removeLabel: string;
  previewAlt: string;
}

interface FileDropzoneProps {
  labels: FileDropzoneLabels;
  /** Called whenever the attached file changes (null when removed). */
  onChange: (file: File | null) => void;
  className?: string;
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function isPdf(file: File | null): boolean {
  return file?.type === "application/pdf";
}

export function isArchive(file: File | null): boolean {
  if (!file) return false;
  return (
    file.type.includes("zip") ||
    file.type.includes("rar") ||
    file.type.includes("7z") ||
    file.type.includes("gzip") ||
    file.type.includes("tar")
  );
}

/**
 * Drag & drop file input supporting image previews (thumb) and icon-only
 * previews for PDF/archive types. Fully keyboard-accessible: the whole zone
 * is focusable and activates the hidden file input on Enter/Space/click.
 */
export default function FileDropzone({ labels, onChange, className }: FileDropzoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string>("");
  const [fileError, setFileError] = useState("");
  const [dragActive, setDragActive] = useState(false);

  // Revoke the object URL on unmount / replacement to avoid leaks.
  useEffect(() => {
    return () => {
      if (filePreview) URL.revokeObjectURL(filePreview);
    };
  }, [filePreview]);

  function handleFile(nextFile: File) {
    setFileError("");
    if (!ACCEPTED_TYPES.includes(nextFile.type)) {
      setFileError(labels.invalidType);
      onChange(null);
      return;
    }
    if (nextFile.size > MAX_FILE_SIZE) {
      setFileError(labels.tooLarge);
      onChange(null);
      return;
    }
    // Revoke any previous preview before replacing it.
    if (filePreview) URL.revokeObjectURL(filePreview);
    setFile(nextFile);
    onChange(nextFile);
    if (isPdf(nextFile) || isArchive(nextFile)) {
      setFilePreview("");
    } else {
      setFilePreview(URL.createObjectURL(nextFile));
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) handleFile(dropped);
  }

  function handleDragEnter(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(true);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const picked = e.target.files?.[0];
    if (picked) handleFile(picked);
    e.target.value = "";
  }

  function removeFile() {
    if (filePreview) URL.revokeObjectURL(filePreview);
    setFile(null);
    setFilePreview("");
    setFileError("");
    onChange(null);
  }

  function openPicker() {
    if (!file) fileInputRef.current?.click();
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openPicker();
    }
  }

  const showPreview = file !== null;

  return (
    <div className={cn("ui-dropzone-wrap", className)}>
      <div
        className={cn(
          "dropzone",
          dragActive ? "dropzone--active" : null,
          showPreview ? "dropzone--has-file" : null,
        )}
        role="button"
        tabIndex={0}
        aria-label={
          showPreview
            ? `${labels.removeLabel} ${file?.name ?? ""}`
            : `${labels.label} ${labels.limit}`
        }
        onDrop={handleDrop}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={openPicker}
        onKeyDown={onKeyDown}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPT_ATTR}
          onChange={handleFileInput}
          style={{ display: "none" }}
          tabIndex={-1}
          onClick={(e) => e.stopPropagation()}
        />

        {showPreview ? (
          <>
            {isPdf(file) || isArchive(file) ? (
              <span className="file-preview-pdf" aria-hidden="true">
                {isArchive(file) ? <Archive size={32} /> : <FileText size={32} />}
              </span>
            ) : (
              <img
                src={filePreview}
                alt={labels.previewAlt}
                className="file-preview-thumb"
              />
            )}
            <span className="file-preview-info">
              <span className="file-preview-name">{file?.name}</span>
              <span className="file-preview-size">
                {file ? formatFileSize(file.size) : ""}
              </span>
            </span>
            <button
              type="button"
              className="ui-icon-btn"
              style={{ alignSelf: "center" }}
              aria-label={labels.removeLabel}
              onClick={(e) => {
                e.stopPropagation();
                removeFile();
              }}
            >
              <span aria-hidden="true" style={{ display: "flex" }}>
                <X size={14} />
              </span>
            </button>
          </>
        ) : (
          <span className="dropzone-icon" aria-hidden="true">
            <ImageIcon size={17} />
          </span>
        )}

        {!showPreview ? (
          <span className="dropzone-text">
            <span className="dropzone-label">
              {dragActive ? labels.activeLabel : labels.label}
            </span>
            {!dragActive ? (
              <>
                <span className="dropzone-hint">{labels.hint}</span>
                <span className="dropzone-limit">{labels.limit}</span>
              </>
            ) : null}
          </span>
        ) : null}
      </div>

      {fileError ? (
        <span className="dropzone-error" role="alert">
          <AlertCircle size={14} aria-hidden="true" />
          {fileError}
        </span>
      ) : null}
    </div>
  );
}
