import { useEffect, useState } from "react";

const ShareModal = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const shareUrl = typeof window === "undefined" ? "" : window.location.href;
  const encodedUrl = encodeURIComponent(shareUrl);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=8&color=172554&bgcolor=ffffff&data=${encodedUrl}`;

  useEffect(() => {
    if (!isOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.prompt("Copy this link:", shareUrl);
    }
  };

  const shareInstagram = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "KICPAA Bio Link",
          text: "Explore KICPAA's bio link.",
          url: shareUrl,
        });
      } catch (error) {
        if (error.name !== "AbortError") console.error("Unable to share:", error);
      }
      return;
    }
    window.open("https://www.instagram.com/", "_blank", "noopener,noreferrer");
    copyLink();
  };

  const downloadQr = async () => {
    try {
      const response = await fetch(qrUrl);
      if (!response.ok) throw new Error("QR code download failed");

      const imageBlob = await response.blob();
      const downloadUrl = URL.createObjectURL(imageBlob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "kicpaa-bio-link-qr.png";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Unable to download QR code:", error);
      window.open(qrUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="share-backdrop" role="presentation" onMouseDown={onClose}>
      <section
        className="share-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="share-modal-header">
          <h2 id="share-title">Share this Bio Link</h2>
          <button type="button" className="share-close" onClick={onClose} aria-label="Close share dialog">×</button>
        </header>

        <div className="share-qr-wrap">
          <img className="share-qr" src={qrUrl} alt="QR code for this bio link" />
          <button type="button" className="share-download-qr" onClick={downloadQr}>
            Download QR code
          </button>
        </div>

        <div className="share-actions">
          <a className="share-action" href={`https://t.me/share/url?url=${encodedUrl}&text=KICPAA%20Bio%20Link`} target="_blank" rel="noopener noreferrer">
            <span className="share-action-icon share-telegram">➤</span><span>Share on Telegram</span><b>›</b>
          </a>
          <button type="button" className="share-action" onClick={shareInstagram}>
            <span className="share-action-icon share-instagram">◎</span><span>Share on Instagram</span><b>›</b>
          </button>
          <a className="share-action" href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`} target="_blank" rel="noopener noreferrer">
            <span className="share-action-icon share-facebook">f</span><span>Share on Facebook</span><b>›</b>
          </a>
        </div>

        <div className="share-copy-row">
          <span className="share-link-value">{shareUrl}</span>
          <button type="button" onClick={copyLink}>{copied ? "Copied!" : "Copy"}</button>
        </div>
      </section>
    </div>
  );
};

export default ShareModal;
