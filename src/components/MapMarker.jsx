import React from "react";
import { Marker, Popup } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import { useLanguage } from "../hooks/useLanguage";
import AudioGuidePlayer from "./AudioGuidePlayer";

// Màu sắc và biểu tượng theo danh mục
const CATEGORY_COLORS = {
  historical: { bg: "#e11d48", labelVi: "Lịch sử", labelEn: "History", symbol: "🏛️" },
  architecture: { bg: "#2563eb", labelVi: "Kiến trúc", labelEn: "Architecture", symbol: "🏰" },
  culture: { bg: "#059669", labelVi: "Văn hóa", labelEn: "Culture", symbol: "🎭" },
  spiritual: { bg: "#d97706", labelVi: "Tâm linh", labelEn: "Spiritual", symbol: "☸️" },
  other: { bg: "#6b7280", labelVi: "Khác", labelEn: "Other", symbol: "📍" }
};

export default function MapMarker({ place, isSelected, onClick, onOpenDetail }) {
  const { lang, t } = useLanguage();
  const navigate = useNavigate();

  if (!place || !place.coordinates || !place.coordinates.lat || !place.coordinates.lng) {
    return null;
  }

  const categoryMeta = CATEGORY_COLORS[place.category] || {
    bg: "#6b7280",
    labelVi: "Khác",
    labelEn: "Other",
    symbol: "📍"
  };

  const name = place.name?.[lang] || place.name?.vi || place.name?.en || "Địa điểm";
  const address = place.address?.[lang] || place.address?.vi || place.address?.en;

  // Tạo Custom DivIcon cho Leaflet
  const customIcon = L.divIcon({
    className: "custom-leaflet-marker",
    html: `
      <div class="marker-pin ${isSelected ? "selected-pin" : ""}" style="background-color: ${categoryMeta.bg};">
        <span class="marker-symbol">${categoryMeta.symbol}</span>
      </div>
      <div class="marker-pulse ${isSelected ? "active-pulse" : ""}" style="border-color: ${categoryMeta.bg};"></div>
    `,
    iconSize: [36, 44],
    iconAnchor: [18, 42],
    popupAnchor: [0, -38]
  });

  const handleGoToDetail = () => {
    if (onOpenDetail) onOpenDetail(place);
    navigate(`/places/${place.id}`);
  };

  return (
    <Marker
      position={[place.coordinates.lat, place.coordinates.lng]}
      icon={customIcon}
      eventHandlers={{
        click: () => {
          if (onClick) onClick(place);
        }
      }}
    >
      <Popup className="custom-popup" closeButton={true}>
        <div className="popup-card">
          {place.coverImageUrl && (
            <img
              src={place.coverImageUrl}
              alt={name}
              className="popup-thumb"
              loading="lazy"
            />
          )}
          <div className="popup-body">
            <div className="popup-category-badge" style={{ backgroundColor: `${categoryMeta.bg}22`, color: categoryMeta.bg }}>
              {lang === "vi" ? categoryMeta.labelVi : categoryMeta.labelEn}
            </div>
            <h4 className="popup-title">{name}</h4>
            {address && <p className="popup-address">📍 {address}</p>}
            {place.audioGuide && (
              <div className="popup-audio-player-wrap" style={{ margin: "0.5rem 0" }}>
                <AudioGuidePlayer
                  audioData={place.audioGuide}
                  placeName={name}
                  compact={true}
                />
              </div>
            )}
            <button
              type="button"
              className="popup-view-btn"
              onClick={handleGoToDetail}
            >
              {t("viewDetails")} →
            </button>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}
