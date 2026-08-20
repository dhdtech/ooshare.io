import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Card from "@ui/components/ui/Card";
import CopyButton from "@ui/components/ui/CopyButton";
import Button from "@ui/components/ui/Button";
import { LoadingState, ErrorState } from "@ui/components/ui/State";
import { isPdf, isArchive } from "@ui/components/ui/FileDropzone";
import type { ContentMessage, RevealPayload } from "../../src/lib/messages";
import { bytesToBlob } from "../../src/lib/blob";

type OverlayState =
  | { phase: "loading" }
  | { phase: "revealed"; payload: RevealPayload }
  | { phase: "created"; url: string }
  | { phase: "error"; title: string; message: string; fallbackUrl?: string };

export default function RevealView() {
  const { t } = useTranslation();
  const [state, setState] = useState<OverlayState>({ phase: "loading" });

  useEffect(() => {
    function onMessage(ev: MessageEvent) {
      if (ev.source !== window.parent || ev.origin !== location.origin) return;
      const msg = ev.data as ContentMessage;
      if (msg.type === "ooshare:reveal") setState({ phase: "revealed", payload: msg.payload });
      else if (msg.type === "ooshare:created") setState({ phase: "created", url: msg.url });
      else if (msg.type === "ooshare:error") setState({ phase: "error", ...msg });
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <div className="view-container" style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ maxWidth: 560, width: "100%", margin: 16 }}>
        <Card>
        {state.phase === "loading" && <LoadingState label={t("extension.revealLoading")} />}
        {state.phase === "created" && <CreatedResult url={state.url} />}
        {state.phase === "error" && (
          <ErrorState
            title={state.title}
            message={state.message}
            actions={
              state.fallbackUrl ? (
                <Button href={state.fallbackUrl} target="_blank" rel="noopener noreferrer" variant="secondary">
                  {t("extension.openInSite")}
                </Button>
              ) : undefined
            }
          />
        )}
        {state.phase === "revealed" && <RevealedResult payload={state.payload} />}
        </Card>
      </div>
    </div>
  );
}

function RevealedResult({ payload }: { payload: RevealPayload }) {
  const { t } = useTranslation();
  const { text, attachment } = payload;
  const [imageUrl, setImageUrl] = useState("");
  const [archive, setArchive] = useState<{ url: string; mime: string } | null>(null);
  const [pdfUrl, setPdfUrl] = useState("");

  useEffect(() => {
    if (!attachment) return;
    const blob = bytesToBlob(attachment.data, attachment.mime);
    const url = URL.createObjectURL(blob);
    if (isPdf({ type: attachment.mime } as File)) setPdfUrl(url);
    else if (isArchive({ type: attachment.mime } as File)) setArchive({ url, mime: attachment.mime });
    else setImageUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [attachment]);

  return (
    <>
      <p className="result-header" style={{ marginBottom: 12 }}>Only Once Share</p>
      {text && (
        <>
          <div className="secret-content" style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{text}</div>
          <CopyButton text={text} copyLabel={t("extension.copy")} copiedLabel={t("extension.copied")} toastMessage={t("extension.toastCopied")} variant="secondary" className="ui-btn--full" />
        </>
      )}
      {imageUrl && <img src={imageUrl} alt="" style={{ maxWidth: "100%", borderRadius: "var(--radius-sm)" }} />}
      {pdfUrl && (
        <Button href={pdfUrl} download="secret.pdf" variant="secondary" className="ui-btn--full">
          {t("extension.download")} PDF
        </Button>
      )}
      {archive && (
        <Button href={archive.url} download="secret.bin" variant="secondary" className="ui-btn--full">
          {t("extension.download")} {t("extension.createLabel")}
        </Button>
      )}
    </>
  );
}

function CreatedResult({ url }: { url: string }) {
  const { t } = useTranslation();
  return (
    <div className="result">
      <p className="result-info" style={{ marginBottom: 12 }}>{t("extension.createCreated")}:</p>
      <div className="link-box" style={{ marginBottom: 12 }}>
        <div className="link-display" style={{ wordBreak: "break-all" }}>{url}</div>
      </div>
      <CopyButton text={url} copyLabel={t("extension.copy")} copiedLabel={t("extension.copied")} toastMessage={t("extension.toastCopied")} className="ui-btn--full" />
    </div>
  );
}
