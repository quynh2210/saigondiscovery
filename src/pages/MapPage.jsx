import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Map as MapIcon, List, ArrowLeft } from "lucide-react";
import { useLanguage } from "../hooks/useLanguage";
import { getPublishedPlaces } from "../services/placeService";
import { getPublishedVenues } from "../services/venueService";
import TouristMap from "../components/TouristMap";
import PlaceList from "../components/PlaceList";
import PlaceDetail from "../components/PlaceDetail";
import ChatbotWidget from "../components/ChatbotWidget";

export default function MapPage() {
  const { lang, t } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const [places, setPlaces] = useState([]);
  const [venues, setVenues] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [mobileViewTab, setMobileViewTab] = useState("map"); // 'map' | 'list'

  useEffect(() => {
    Promise.all([getPublishedPlaces(), getPublishedVenues()]).then(([placesData, venuesData]) => {
      setPlaces(placesData);
      setVenues(venuesData);

      // Kiểm tra tham số URL ?placeId=...
      const paramPlaceId = searchParams.get("placeId");
      if (paramPlaceId) {
        const found = placesData.find((p) => p.id === paramPlaceId || p.slug === paramPlaceId);
        if (found) {
          setSelectedPlace(found);
          setDetailOpen(true);
        }
      }
    });
  }, [searchParams]);

  // Xử lý khi chọn địa điểm từ bản đồ hoặc danh sách
  const handleSelectPlace = (place) => {
    setSelectedPlace(place);
    setDetailOpen(true);
    setSearchParams({ placeId: place.id });
  };

  // Mở chi tiết đầy đủ
  const handleOpenDetail = (place) => {
    setSelectedPlace(place);
    setDetailOpen(true);
    setSearchParams({ placeId: place.id });
    if (window.innerWidth < 768) {
      setMobileViewTab("list");
    }
  };

  // Quay lại danh sách
  const handleBackToList = () => {
    setDetailOpen(false);
    setSearchParams({});
  };

  // Chatbot chọn địa điểm và di chuyển bản đồ
  const handleChatbotSelectPlace = (placeId) => {
    const found = places.find((p) => p.id === placeId);
    if (found) {
      handleSelectPlace(found);
      setMobileViewTab("map");
    }
  };

  return (
    <div className="map-page-layout">
      {/* Mobile Tab Switcher */}
      <div className="mobile-map-tabs-bar">
        <button
          type="button"
          className={`mobile-tab-btn ${mobileViewTab === "map" ? "active" : ""}`}
          onClick={() => setMobileViewTab("map")}
        >
          <MapIcon size={18} />
          <span>{t("navMap")}</span>
        </button>
        <button
          type="button"
          className={`mobile-tab-btn ${mobileViewTab === "list" ? "active" : ""}`}
          onClick={() => setMobileViewTab("list")}
        >
          <List size={18} />
          <span>{detailOpen ? t("viewDetails") : t("placesCount")}</span>
        </button>
      </div>

      {/* Main Split Layout */}
      <div className="map-split-container">
        {/* Left Sidebar Panel (List or Detail) */}
        <aside className={`map-sidebar-panel ${mobileViewTab === "map" ? "mobile-hidden" : ""}`}>
          {detailOpen && selectedPlace ? (
            <PlaceDetail place={selectedPlace} onBack={handleBackToList} />
          ) : (
            <PlaceList
              places={places}
              selectedPlace={selectedPlace}
              onSelectPlace={handleSelectPlace}
              onOpenDetail={handleOpenDetail}
            />
          )}
        </aside>

        {/* Right Map Canvas Panel */}
        <main className={`map-canvas-panel ${mobileViewTab === "list" ? "mobile-hidden" : ""}`}>
          <TouristMap
            places={places}
            venues={venues}
            selectedPlace={selectedPlace}
            onSelectPlace={handleSelectPlace}
            onOpenDetail={handleOpenDetail}
          />
        </main>
      </div>

      {/* Interactive Tour Guide Chatbot Widget */}
      <ChatbotWidget
        currentWebPlace={selectedPlace}
        onSelectPlaceOnMap={handleChatbotSelectPlace}
      />
    </div>
  );
}
