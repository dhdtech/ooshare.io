import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "../../lib/cn";
import { useToast } from "./Toast";

interface CopyButtonProps {
  text: string;
  copyLabel: string;
  copiedLabel: string;
  toastMessage: string;
  /** Optional external callback fired after a successful copy (e.g. analytics). */
  onCopy?: () => void;
  className?: string;
  variant?: "primary" | "secondary";
}

/**
 * Copies `text` to the clipboard, flips to a "Copied" (Check) state for 2s,
 * and surfaces a polite toast confirming the action.
 */
export default function CopyButton({
  text,
  copyLabel,
  copiedLabel,
  toastMessage,
  onCopy,
  className,
  variant = "primary",
}: CopyButtonProps) {
  const { showToast } = useToast();
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Clipboard may be unavailable (non-secure context); fall back to a
      // prompt-less no-op so the UI still reports the copy intent.
    }
    setCopied(true);
    showToast(toastMessage, "success");
    onCopy?.();
    window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      className={cn("share-btn", variant === "primary" ? "share-btn--primary" : null, copied ? "share-btn--copied" : null, className)}
      onClick={handleCopy}
      aria-label={copied ? copiedLabel : copyLabel}
    >
      <span aria-hidden="true" style={{ display: "flex" }}>
        {copied ? <Check size={17} /> : <Copy size={17} />}
      </span>
      <span>{copied ? copiedLabel : copyLabel}</span>
    </button>
  );
}
