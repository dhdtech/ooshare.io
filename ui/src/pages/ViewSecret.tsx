import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ShieldOff,
  X,
  FileText,
  Download,
  ExternalLink,
  Archive,
} from "lucide-react";
import { importKey, decrypt, decodePayload } from "../lib/crypto";
import { getSecret } from "../lib/api";
import posthog from "../lib/posthog";
import {
  Card,
  Button,
  CopyButton,
  BackLink,
  LoadingState,
  ErrorState,
} from "../components/ui";

type Status = "loading" | "revealed" | "not-found" | "error";

export default function ViewSecret() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [status, setStatus] = useState<Status>("loading");
  const [plaintext, setPlaintext] = useState("");
  const [error, setError] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [archiveUrl, setArchiveUrl] = useState("");
  const [archiveMime, setArchiveMime] = useState("");
  const [showImageModal, setShowImageModal] = useState(false);

  const hasFetched = useRef(false);

  useEffect(() => {
    const keyStr = window.location.hash.slice(1);
    if (!keyStr || !id) {
      setError(t("view.invalidLink"));
      setStatus("error");
      return;
    }

    if (hasFetched.current) return;
    hasFetched.current = true;

    async function fetchAndDecrypt() {
      try {
        const result = await getSecret(id!);
        const key = await importKey(keyStr);
        const decryptedBytes = await decrypt(result.ciphertext, key, result.id);
        const decoded = decodePayload(decryptedBytes);
        setPlaintext(decoded.text);
        if (decoded.image) {
          const blob = new Blob([decoded.image.data as BlobPart], { type: decoded.image.mime });
          const url = URL.createObjectURL(blob);
          const mime = decoded.image.mime;
          if (mime === "application/pdf") {
            setPdfUrl(url);
          } else if (mime.includes("zip") || mime.includes("rar") || mime.includes("7z") || mime.includes("gzip") || mime.includes("tar")) {
            setArchiveUrl(url);
            setArchiveMime(mime);
          } else {
            setImageUrl(url);
          }
        }
        posthog.capture("secret_viewed");
        setStatus("revealed");
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to decrypt";
        if (msg.includes("not found") || msg.includes("already viewed")) {
          posthog.capture("secret_not_found");
          setStatus("not-found");
        } else {
          posthog.capture("secret_view_failed");
          setError(msg);
          setStatus("error");
        }
      }
    }

    fetchAndDecrypt();
  }, [id, t]);

  useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl);
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
      if (archiveUrl) URL.revokeObjectURL(archiveUrl);
    };
  }, [imageUrl, pdfUrl, archiveUrl]);

  return (
    <div className="view-container">
      {status === "loading" && (
        <Card>
          <LoadingState label={t("view.loading")} />
        </Card>
      )}

      {status === "revealed" && (
        <Card>
          <div className="revealed-card">
            <div className="destroyed-banner">
              <ShieldOff size={15} aria-hidden="true" />
              <span>{t("view.destroyed")}</span>
            </div>

            {plaintext && (
              <>
                <div className="secret-content">{plaintext}</div>
                <CopyButton
                  text={plaintext}
                  copyLabel={t("view.copySecret")}
                  copiedLabel={t("view.copiedClipboard")}
                  toastMessage={t("view.copiedToast")}
                  variant="secondary"
                  className="ui-btn--full"
                />
              </>
            )}

            {imageUrl && (
              <div className="secret-image-container">
                <img
                  src={imageUrl}
                  alt={t("view.clickToEnlarge")}
                  className="secret-image-thumb"
                  onClick={() => setShowImageModal(true)}
                />
                <div className="secret-image-hint">{t("view.clickToEnlarge")}</div>
              </div>
            )}

            {pdfUrl && (
              <div className="secret-pdf-container">
                <div className="pdf-preview">
                  <FileText size={48} aria-hidden="true" />
                  <p>{t("view.pdfAttached")}</p>
                </div>
                <div className="pdf-actions">
                  <Button href={pdfUrl} download="secret.pdf" variant="secondary">
                    <Download size={16} aria-hidden="true" />
                    {t("view.downloadPdf")}
                  </Button>
                  <Button href={pdfUrl} target="_blank" rel="noopener noreferrer" variant="secondary">
                    <ExternalLink size={16} aria-hidden="true" />
                    {t("view.viewPdf")}
                  </Button>
                </div>
              </div>
            )}

            {archiveUrl && (
              <div className="secret-pdf-container">
                <div className="pdf-preview">
                  <Archive size={48} aria-hidden="true" />
                  <p>{t("view.archiveAttached")}</p>
                </div>
                <div className="pdf-actions">
                  <Button
                    href={archiveUrl}
                    download={`secret${archiveMime.includes("rar") ? ".rar" : archiveMime.includes("7z") ? ".7z" : archiveMime.includes("gzip") ? ".tar.gz" : archiveMime.includes("tar") ? ".tar" : ".zip"}`}
                    variant="secondary"
                  >
                    <Download size={16} aria-hidden="true" />
                    {t("view.downloadArchive")}
                  </Button>
                </div>
              </div>
            )}

            <p className="destroyed-proof">{t("view.destroyedProof")}</p>
            <Button to="/" variant="primary" full>
              {t("view.sendYourOwn")}
            </Button>
          </div>
        </Card>
      )}

      {showImageModal && imageUrl && (
        <div
          className="image-modal-overlay"
          onClick={() => setShowImageModal(false)}
        >
          <div
            className="image-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="image-modal-close"
              onClick={() => setShowImageModal(false)}
              aria-label={t("view.imageModal.close")}
            >
              <X size={16} aria-hidden="true" />
            </button>
            <img src={imageUrl} alt={t("view.clickToEnlarge")} />
          </div>
        </div>
      )}

      {status === "not-found" && (
        <Card>
          <ErrorState
            title={t("view.notFoundTitle")}
            message={t("view.notFoundMsg")}
          />
        </Card>
      )}

      {status === "error" && (
        <Card>
          <ErrorState
            title={t("view.errorTitle")}
            message={error || t("view.errorMsg")}
          />
        </Card>
      )}

      {status !== "revealed" && (
        <BackLink to="/">{t("view.backHome")}</BackLink>
      )}
    </div>
  );
}
