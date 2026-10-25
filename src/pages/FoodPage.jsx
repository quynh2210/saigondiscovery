import React, { useState, useEffect, useMemo } from "react";
import { Utensils, Coffee, Search, MapPin, Sparkles, Filter, Layers } from "lucide-react";
import { useLanguage } from "../hooks/useLanguage";
import { getPublishedVenues } from "../services/venueService";
import { getPublishedPlaces } from "../services/placeService";
import VenueCard from "../components/VenueCard";
import ChatbotWidget from "../components/ChatbotWidget";
import { removeVietnameseTones } from "../chatbot/chatbotIntents";

export default function FoodPage() {
  const { lang, t } = useLanguage();
  const [venues, setVenues] = useState([]);
  const [places, setPlaces] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("all"); // 'all' | 'restaurant' | 'drink'
  const [selectedPlaceId, setSelectedPlaceId] = useState("all");

  useEffect(() => {
    Promise.all([getPublishedVenues(), getPublishedPlaces()]).then(([venuesData, placesData]) => {
      setVenues(venuesData);
      setPlaces(placesData);
    });
  }, []);

  const filteredVenues = useMemo(() => {
    return venues.filter((venue) => {
      // 1. Lọc theo loại quán
      if (typeFilter !== "all" && venue.type !== typeFilter) {
        return false;
      }

      // 2. Lọc theo địa điểm tham quan liên kết
      if (selectedPlaceId !== "all") {
        if (!Array.isArray(venue.placeIds)) return false;
        const matchesDirect = venue.placeIds.includes(selectedPlaceId);
        const matchesLeQuyDon =
          (selectedPlaceId === "place-1792160140411" || selectedPlaceId === "thpt-le-quy-don") &&
          (venue.placeIds.includes("place-1792160140411") || venue.placeIds.includes("thpt-le-quy-don"));
        if (!matchesDirect && !matchesLeQuyDon) {
          return false;
        }
      }

      // 3. Tìm kiếm từ khóa
      if (searchQuery.trim()) {
        const qNorm = removeVietnameseTones(searchQuery);
        const nameViNorm = removeVietnameseTones(venue.name?.vi || "");
        const nameEnNorm = removeVietnameseTones(venue.name?.en || "");
        const addrViNorm = removeVietnameseTones(venue.address?.vi || "");
        const descViNorm = removeVietnameseTones(venue.description?.vi || "");

        const matches =
          nameViNorm.includes(qNorm) ||
          nameEnNorm.includes(qNorm) ||
          addrViNorm.includes(qNorm) ||
          descViNorm.includes(qNorm);

        if (!matches) return false;
      }

      return true;
    });
  }, [venues, typeFilter, selectedPlaceId, searchQuery]);

  // Tìm tên địa điểm tham chiếu để truyền vào chỉ đường
  const referencePlace = places.find((p) => p.id === selectedPlaceId);
  const referencePlaceName = referencePlace ? (referencePlace.name?.[lang] || referencePlace.name?.vi) : "";

  return (
    <div className="food-page-container">
      {/* Header Banner */}
      <section className="food-header-banner">
        <div className="section-container">
          <div className="food-badge">
            <Sparkles size={16} />
            <span>{lang === "vi" ? "Bản Đồ Ẩm Thực Sài Gòn" : "Saigon Culinary Map"}</span>
          </div>
          <h1 className="food-page-title">{t("allFoodHeading")}</h1>
          <p className="food-page-lead">{t("foodSubtitle")}</p>

          {/* Search Bar */}
          <div className="food-search-wrap">
            <Search size={20} className="search-icon" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === "vi" ? "Tìm món ngon, phở, bánh mì, cà phê, địa chỉ..." : "Search dishes, pho, banh mi, coffee, address..."}
              className="food-search-input"
            />
          </div>
        </div>
      </section>

      {/* Filter Toolbar */}
      <div className="food-toolbar-container section-container">
        <div className="food-filter-row">
          {/* Category Tabs */}
          <div className="food-type-pills">
            <button
              type="button"
              className={`food-pill ${typeFilter === "all" ? "active" : ""}`}
              onClick={() => setTypeFilter("all")}
            >
              <Layers size={16} />
              <span>{t("tabAllVenues")}</span>
            </button>
            <button
              type="button"
              className={`food-pill ${typeFilter === "restaurant" ? "active" : ""}`}
              onClick={() => setTypeFilter("restaurant")}
            >
              <Utensils size={16} />
              <span>{t("tabRestaurants")}</span>
            </button>
            <button
              type="button"
              className={`food-pill ${typeFilter === "drink" ? "active" : ""}`}
              onClick={() => setTypeFilter("drink")}
            >
              <Coffee size={16} />
              <span>{t("tabCafes")}</span>
            </button>
          </div>

          {/* Landmark Dropdown Filter */}
          <div className="landmark-filter-box">
            <MapPin size={16} className="landmark-icon" />
            <select
              value={selectedPlaceId}
              onChange={(e) => setSelectedPlaceId(e.target.value)}
              className="landmark-select"
            >
              <option value="all">
                {lang === "vi" ? "Tất cả địa điểm tham quan" : "All attractions"}
              </option>
              {places.map((place) => (
                <option key={place.id} value={place.id}>
                  {place.name?.[lang] || place.name?.vi} ({place.district})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Counter */}
        <div className="food-results-meta">
          <span>
            {lang === "vi"
              ? `Tìm thấy ${filteredVenues.length} quán ăn & thức uống uy tín`
              : `Found ${filteredVenues.length} curated food & drink spots`}
          </span>
        </div>
      </div>

      {/* Venues Grid */}
      <div className="section-container venues-list-section">
        {filteredVenues.length === 0 ? (
          <div className="empty-food-state-card">
            <p>{t("noVenuesFound")}</p>
          </div>
        ) : (
          <div className="food-cards-grid">
            {filteredVenues.map((venue) => (
              <VenueCard
                key={venue.id}
                venue={venue}
                referencePlaceName={referencePlaceName}
              />
            ))}
          </div>
        )}
      </div>

      <ChatbotWidget />
    </div>
  );
}
