import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { RotateCcw, Layers, Utensils } from "lucide-react";
import MapMarker from "./MapMarker";
import VenueMarker from "./VenueMarker";
import { useLanguage } from "../hooks/useLanguage";
import { useTheme } from "../hooks/useTheme";
import { getPublishedVenues } from "../services/venueService";

const DEFAULT_CENTER = [10.7769, 106.6953];
const DEFAULT_ZOOM = 14;

// Component điều khiển di chuyển tâm bản đồ mượt mà và sửa lỗi kích thước tile trên điện thoại
function MapViewController({ selectedPlace, resetTrigger }) {
  const map = useMap();

  useEffect(() => {
    map.invalidateSize();
    const t1 = setTimeout(() => map.invalidateSize(), 150);
    const t2 = setTimeout(() => map.invalidateSize(), 500);

    const handleResize = () => map.invalidateSize();
    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, [map]);

  useEffect(() => {
    if (selectedPlace && selectedPlace.coordinates) {
      map.flyTo(
        [selectedPlace.coordinates.lat, selectedPlace.coordinates.lng],
        16,
        { duration: 1.2 }
      );
    }
  }, [selectedPlace, map]);

  useEffect(() => {
    if (resetTrigger > 0) {
      map.flyTo(DEFAULT_CENTER, DEFAULT_ZOOM, { duration: 1 });
    }
  }, [resetTrigger, map]);

  return null;
}

export default function TouristMap({
  places = [],
  venues = [],
  selectedPlace,
  onSelectPlace,
  onOpenDetail
}) {
  const { lang, t } = useLanguage();
  const { isDark } = useTheme();
  const [resetCount, setResetCount] = useState(0);
  const [showLegend, setShowLegend] = useState(true);
  const [showVenues, setShowVenues] = useState(true);
  const [loadedVenues, setLoadedVenues] = useState(venues);

  useEffect(() => {
    if (venues && venues.length > 0) {
      setLoadedVenues(venues);
    } else {
      getPublishedVenues().then((v) => setLoadedVenues(v));
    }
  }, [venues]);

  const handleReset = () => {
    setResetCount((prev) => prev + 1);
  };

  const cartoApiKey = import.meta.env.VITE_CARTO_API_KEY;
  const customTileUrl = import.meta.env.VITE_MAP_TILES_URL;

  let tileUrl = "https://tile.openstreetmap.org/{z}/{x}/{y}.png";
  let attribution = '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors';

  if (customTileUrl) {
    tileUrl = customTileUrl;
  } else if (cartoApiKey) {
    tileUrl = `https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png?api_key=${cartoApiKey}`;
    attribution = '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions" target="_blank" rel="noopener noreferrer">CARTO</a>';
  }

  return (
    <div className="tourist-map-container">
      {/* Floating Controls Overlay */}
      <div className="map-floating-controls">
        <button
          type="button"
          className="map-control-btn reset-btn"
          onClick={handleReset}
          title={t("resetMap")}
        >
          <RotateCcw size={16} />
          <span>{t("resetMap")}</span>
        </button>

        {/* Nút Ẩn / Hiện Quán Ăn & Nước */}
        <button
          type="button"
          className={`map-control-btn venue-toggle-btn ${showVenues ? "active" : ""}`}
          onClick={() => setShowVenues(!showVenues)}
          title={
            showVenues
              ? lang === "vi"
                ? "Bấm để ẩn quán ăn & quán nước (chỉ xem địa điểm du lịch)"
                : "Click to hide venues (show landmarks only)"
              : lang === "vi"
              ? "Bấm để hiện các quán ăn & quán nước xung quanh"
              : "Click to show food & drink venues"
          }
        >
          <Utensils size={16} />
          <span>
            {showVenues
              ? lang === "vi"
                ? "Ẩn quán ăn/uống"
                : "Hide Venues"
              : lang === "vi"
              ? "Hiện quán ăn/uống"
              : "Show Venues"}
          </span>
        </button>

        <button
          type="button"
          className={`map-control-btn legend-toggle-btn ${showLegend ? "active" : ""}`}
          onClick={() => setShowLegend(!showLegend)}
          title={t("legend")}
        >
          <Layers size={16} />
          <span>{t("legend")}</span>
        </button>
      </div>

      {/* Map Legend */}
      {showLegend && (
        <div className="map-legend-card">
          <h5 className="legend-title">{t("legend")}</h5>
          <div className="legend-items">
            <div className="legend-item">
              <span className="legend-dot" style={{ backgroundColor: "#e11d48" }}></span>
              <span>{t("catHistorical")}</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot" style={{ backgroundColor: "#2563eb" }}></span>
              <span>{t("catArchitecture")}</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot" style={{ backgroundColor: "#059669" }}></span>
              <span>{t("catCulture")}</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot" style={{ backgroundColor: "#d97706" }}></span>
              <span>{t("catSpiritual")}</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot" style={{ backgroundColor: "#6b7280" }}></span>
              <span>{t("catOther")}</span>
            </div>
            {showVenues && (
              <>
                <div className="legend-item">
                  <span className="legend-dot" style={{ backgroundColor: "#ea580c" }}></span>
                  <span>{lang === "vi" ? "🍜 Quán ăn" : "🍜 Restaurants"}</span>
                </div>
                <div className="legend-item">
                  <span className="legend-dot" style={{ backgroundColor: "#d97706" }}></span>
                  <span>{lang === "vi" ? "☕ Quán nước / Cà phê" : "☕ Cafes & Drinks"}</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Leaflet Map */}
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        scrollWheelZoom={true}
        className="leaflet-map-canvas"
      >
        <TileLayer
          key={isDark ? "dark-tile" : "light-tile"}
          attribution={attribution}
          url={tileUrl}
          maxZoom={19}
        />

        <MapViewController selectedPlace={selectedPlace} resetTrigger={resetCount} />

        {/* Ghim Địa điểm du lịch */}
        {places.map((place) => (
          <MapMarker
            key={place.id}
            place={place}
            isSelected={selectedPlace && selectedPlace.id === place.id}
            onClick={onSelectPlace}
            onOpenDetail={onOpenDetail}
          />
        ))}

        {/* Ghim Quán ăn & Quán nước (khi được bật) */}
        {showVenues &&
          loadedVenues.map((venue) => (
            <VenueMarker
              key={venue.id}
              venue={venue}
              onClick={() => {}}
            />
          ))}
      </MapContainer>
    </div>
  );
}
