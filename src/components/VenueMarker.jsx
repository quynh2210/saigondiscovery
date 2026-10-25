import React from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { Navigation, Coffee, Utensils } from "lucide-react";
import { useLanguage } from "../hooks/useLanguage";
import { getDirectionsUrl } from "../utils/googleMapsLinks";

export default function VenueMarker({ venue, isSelected, onClick }) {
  const { lang, t } = useLanguage();

  if (!venue || !venue.coordinates || !venue.coordinates.lat || !venue.coordinates.lng) {
    return null;
  }

  const isDrink = venue.type === "drink";
  const pinBg = isDrink ? "#d97706" : "#ea580c";
  const symbol = isDrink ? "☕" : "🍜";

  const name = venue.name?.[lang] || venue.name?.vi || venue.name?.en || "Quán";
  const address = venue.address?.[lang] || venue.address?.vi || venue.address?.en;
  const description = venue.description?.[lang] || venue.description?.vi || venue.description?.en;
  const typeLabel = isDrink
    ? lang === "vi" ? "Quán nước / Cà phê" : "Cafe & Drinks"
    : lang === "vi" ? "Quán ăn ẩm thực" : "Restaurant & Food";

  const customIcon = L.divIcon({
    className: "custom-leaflet-marker venue-leaflet-marker",
    html: `
      <div class="marker-pin ${isSelected ? "selected-pin" : ""}" style="background-color: ${pinBg}; transform: scale(0.88);">
        <span class="marker-symbol">${symbol}</span>
      </div>
      <div class="marker-pulse ${isSelected ? "active-pulse" : ""}" style="border-color: ${pinBg};"></div>
    `,
    iconSize: [32, 40],
    iconAnchor: [16, 38],
    popupAnchor: [0, -34]
  });

  const mapsUrl = venue.googleMapsUrl || getDirectionsUrl(address || name);

  return (
    <Marker
      position={[venue.coordinates.lat, venue.coordinates.lng]}
      icon={customIcon}
      eventHandlers={{
        click: () => {
          if (onClick) onClick(venue);
        }
      }}
    >
      <Popup className="custom-popup" closeButton={true}>
        <div className="popup-card">
          {venue.coverImageUrl && (
            <img
              src={venue.coverImageUrl}
              alt={name}
              className="popup-thumb"
              loading="lazy"
            />
          )}
          <div className="popup-body">
            <div
              className="popup-category-badge"
              style={{ backgroundColor: `${pinBg}22`, color: pinBg }}
            >
              {typeLabel}
            </div>
            <h4 className="popup-title">{name}</h4>
            {address && <p className="popup-address">📍 {address}</p>}
            {description && (
              <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: "0.6rem", lineHeight: 1.35 }}>
                {description}
              </p>
            )}
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="popup-view-btn"
              style={{ background: pinBg, display: "flex", alignItems: "center", justifyContent: "center", gap: "0.35rem" }}
            >
              <Navigation size={13} />
              <span>{t("viewOnMap") || "Mở Google Maps"}</span>
            </a>
          </div>
        </div>
      </Popup>
    </Marker>
  );
}
