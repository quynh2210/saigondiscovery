import React from "react";
import { X, QrCode, Download, Share2 } from "lucide-react";
import { useLanguage } from "../hooks/useLanguage";

export default function QRCodeModal({ qrData, placeName, onClose }) {
  const { lang, t } = useLanguage();

  if (!qrData) return null;

  const currentQr = qrData[lang] || qrData.vi || qrData.en || qrData;
  const imageUrl = currentQr.imageUrl || "/assets/qr/sample-qr.svg";

  // Hiển thị tiêu đề chuẩn: "Quét mã để xem nguồn thông tin"
  let title = currentQr.title || t("qrTitle");
  if (typeof title === "string") {
    const lower = title.toLowerCase();
    if (
      lower.includes("nghe thuyết minh") ||
      lower.includes("audio guide") ||
      lower.includes("quét mã nghe") ||
      lower === "mã qr thông tin" ||
      lower === "qr code info"
    ) {
      title = lang === "vi" ? "Quét mã để xem nguồn thông tin" : "Scan to view information sources";
    }
  }

  return (
    <div className="qr-modal-backdrop" onClick={onClose}>
      <div className="qr-modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="qr-modal-header">
          <div className="qr-title-box">
            <QrCode size={22} className="qr-header-icon" />
            <h3 className="qr-modal-heading">{title}</h3>
          </div>
          <button type="button" className="qr-close-btn" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="qr-image-wrapper">
          <img src={imageUrl} alt={placeName || "QR Code"} className="qr-modal-img" />
        </div>

        <div className="qr-modal-body">
          <p className="qr-place-name">{placeName}</p>
          <p className="qr-instructions">{t("scanQR")}</p>
        </div>

        <div className="qr-modal-actions">
          <a
            href={imageUrl}
            download={`QR-${placeName || "HCMC-Tour"}.svg`}
            className="qr-action-btn primary"
          >
            <Download size={16} />
            <span>{lang === "vi" ? "Tải mã QR" : "Download QR"}</span>
          </a>
          <button type="button" className="qr-action-btn secondary" onClick={onClose}>
            {lang === "vi" ? "Đóng" : "Close"}
          </button>
        </div>
      </div>
    </div>
  );
}
